from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security for admin
security = HTTPBasic()

# Admin credentials - store securely in production
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'flareonix_admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'Ignite@2026!')


def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin credentials"""
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# Community Signup Model
class CommunitySignup(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: str
    phone: Optional[str] = None
    occupation: str
    interest: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommunitySignupCreate(BaseModel):
    full_name: str = Field(..., min_length=2)
    email: str
    phone: Optional[str] = None
    occupation: str = Field(..., min_length=2)
    interest: str = Field(..., min_length=2)


# Review Model
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # References community signup id
    user_name: str
    user_email: str
    rating: int = Field(..., ge=1, le=5)
    title: str
    content: str
    status: str = "pending"  # pending, approved, rejected
    admin_reply: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

class ReviewCreate(BaseModel):
    user_email: str
    rating: int = Field(..., ge=1, le=5)
    title: str = Field(..., min_length=3, max_length=100)
    content: str = Field(..., min_length=10, max_length=1000)

class ReviewUpdate(BaseModel):
    status: Optional[str] = None
    admin_reply: Optional[str] = None


# Analytics Models
class PageView(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page: str
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    ip_hash: Optional[str] = None  # Hashed for privacy
    session_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PageViewCreate(BaseModel):
    page: str
    referrer: Optional[str] = None
    session_id: Optional[str] = None

class ButtonClick(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    button_id: str
    button_name: str
    page: str
    session_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ButtonClickCreate(BaseModel):
    button_id: str
    button_name: str
    page: str
    session_id: Optional[str] = None


# ==================== BASIC ENDPOINTS ====================

@api_router.get("/")
async def root():
    return {"message": "Flareonix API - Rise. Ignite. Conquer."}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ==================== COMMUNITY ENDPOINTS ====================

@api_router.post("/community/signup", response_model=CommunitySignup)
async def community_signup(input: CommunitySignupCreate):
    """Register a new community member and store their info"""
    existing = await db.community_signups.find_one({"email": input.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="This email is already registered in our community!")
    
    signup_dict = input.model_dump()
    signup_obj = CommunitySignup(**signup_dict)
    
    doc = signup_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.community_signups.insert_one(doc)
    
    return signup_obj


@api_router.get("/community/signups", response_model=List[CommunitySignup])
async def get_community_signups():
    """Get all community signups (admin endpoint)"""
    signups = await db.community_signups.find({}, {"_id": 0}).to_list(1000)
    
    for signup in signups:
        if isinstance(signup['created_at'], str):
            signup['created_at'] = datetime.fromisoformat(signup['created_at'])
    
    return signups


@api_router.get("/community/count")
async def get_community_count():
    """Get total community member count"""
    count = await db.community_signups.count_documents({})
    return {"count": count}


@api_router.get("/community/verify/{email}")
async def verify_community_member(email: str):
    """Verify if email is registered in community"""
    member = await db.community_signups.find_one({"email": email}, {"_id": 0})
    if member:
        return {"verified": True, "user_id": member.get("id"), "full_name": member.get("full_name")}
    return {"verified": False}


# ==================== REVIEW ENDPOINTS ====================

@api_router.post("/reviews", response_model=Review)
async def create_review(input: ReviewCreate):
    """Create a new review (requires registered email)"""
    # Verify user is registered
    member = await db.community_signups.find_one({"email": input.user_email}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=403, detail="Only registered community members can post reviews. Please sign up first!")
    
    # Check if user already has a pending or approved review
    existing_review = await db.reviews.find_one({
        "user_email": input.user_email,
        "status": {"$in": ["pending", "approved"]}
    }, {"_id": 0})
    if existing_review:
        raise HTTPException(status_code=400, detail="You already have an active review. Please wait for admin approval or contact us to update it.")
    
    review_obj = Review(
        user_id=member.get("id"),
        user_name=member.get("full_name"),
        user_email=input.user_email,
        rating=input.rating,
        title=input.title,
        content=input.content
    )
    
    doc = review_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc['updated_at']:
        doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.reviews.insert_one(doc)
    
    return review_obj


@api_router.get("/reviews/approved")
async def get_approved_reviews():
    """Get all approved reviews (public)"""
    reviews = await db.reviews.find({"status": "approved"}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for review in reviews:
        if isinstance(review['created_at'], str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
        if review.get('updated_at') and isinstance(review['updated_at'], str):
            review['updated_at'] = datetime.fromisoformat(review['updated_at'])
    
    return reviews


@api_router.get("/reviews/all")
async def get_all_reviews(admin: str = Depends(verify_admin)):
    """Get all reviews (admin only)"""
    reviews = await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for review in reviews:
        if isinstance(review['created_at'], str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
        if review.get('updated_at') and isinstance(review['updated_at'], str):
            review['updated_at'] = datetime.fromisoformat(review['updated_at'])
    
    return reviews


@api_router.put("/reviews/{review_id}")
async def update_review(review_id: str, input: ReviewUpdate, admin: str = Depends(verify_admin)):
    """Update review status or add admin reply (admin only)"""
    update_data = {}
    if input.status:
        update_data["status"] = input.status
    if input.admin_reply is not None:
        update_data["admin_reply"] = input.admin_reply
    
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        result = await db.reviews.update_one(
            {"id": review_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")
    
    updated = await db.reviews.find_one({"id": review_id}, {"_id": 0})
    return updated


@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, admin: str = Depends(verify_admin)):
    """Delete a review (admin only)"""
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"success": True, "message": "Review deleted"}


# ==================== ANALYTICS ENDPOINTS ====================

@api_router.post("/analytics/pageview")
async def track_pageview(input: PageViewCreate, request: Request):
    """Track a page view"""
    # Hash IP for privacy
    client_ip = request.client.host if request.client else None
    ip_hash = secrets.token_hex(8) if client_ip else None  # Simple privacy measure
    
    pageview = PageView(
        page=input.page,
        referrer=input.referrer,
        user_agent=request.headers.get("user-agent"),
        ip_hash=ip_hash,
        session_id=input.session_id
    )
    
    doc = pageview.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.analytics_pageviews.insert_one(doc)
    
    return {"success": True}


@api_router.post("/analytics/click")
async def track_click(input: ButtonClickCreate):
    """Track a button click"""
    click = ButtonClick(**input.model_dump())
    
    doc = click.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.analytics_clicks.insert_one(doc)
    
    return {"success": True}


@api_router.get("/analytics/summary")
async def get_analytics_summary(admin: str = Depends(verify_admin)):
    """Get analytics summary (admin only)"""
    # Total page views
    total_pageviews = await db.analytics_pageviews.count_documents({})
    
    # Total clicks
    total_clicks = await db.analytics_clicks.count_documents({})
    
    # Total signups
    total_signups = await db.community_signups.count_documents({})
    
    # Total reviews
    total_reviews = await db.reviews.count_documents({})
    pending_reviews = await db.reviews.count_documents({"status": "pending"})
    
    # Page views by page
    pageviews_pipeline = [
        {"$group": {"_id": "$page", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    pageviews_by_page = await db.analytics_pageviews.aggregate(pageviews_pipeline).to_list(100)
    
    # Clicks by button
    clicks_pipeline = [
        {"$group": {"_id": "$button_name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    clicks_by_button = await db.analytics_clicks.aggregate(clicks_pipeline).to_list(100)
    
    # Signups by occupation
    occupation_pipeline = [
        {"$group": {"_id": "$occupation", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    signups_by_occupation = await db.community_signups.aggregate(occupation_pipeline).to_list(100)
    
    # Signups by interest
    interest_pipeline = [
        {"$group": {"_id": "$interest", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    signups_by_interest = await db.community_signups.aggregate(interest_pipeline).to_list(100)
    
    # Recent signups (last 7 days count by day)
    from datetime import timedelta
    seven_days_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    
    return {
        "overview": {
            "total_pageviews": total_pageviews,
            "total_clicks": total_clicks,
            "total_signups": total_signups,
            "total_reviews": total_reviews,
            "pending_reviews": pending_reviews,
            "conversion_rate": round((total_signups / total_pageviews * 100), 2) if total_pageviews > 0 else 0
        },
        "pageviews_by_page": [{"page": p["_id"], "count": p["count"]} for p in pageviews_by_page],
        "clicks_by_button": [{"button": c["_id"], "count": c["count"]} for c in clicks_by_button],
        "signups_by_occupation": [{"occupation": o["_id"], "count": o["count"]} for o in signups_by_occupation],
        "signups_by_interest": [{"interest": i["_id"], "count": i["count"]} for i in signups_by_interest]
    }


@api_router.get("/analytics/pageviews")
async def get_pageviews(admin: str = Depends(verify_admin), limit: int = 100):
    """Get recent page views (admin only)"""
    pageviews = await db.analytics_pageviews.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    return pageviews


@api_router.get("/analytics/clicks")
async def get_clicks(admin: str = Depends(verify_admin), limit: int = 100):
    """Get recent clicks (admin only)"""
    clicks = await db.analytics_clicks.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    return clicks


# ==================== ADMIN ENDPOINTS ====================

@api_router.get("/admin/verify")
async def verify_admin_access(admin: str = Depends(verify_admin)):
    """Verify admin credentials"""
    return {"success": True, "admin": admin}


@api_router.get("/admin/dashboard")
async def get_admin_dashboard(admin: str = Depends(verify_admin)):
    """Get admin dashboard data"""
    # Get counts
    signups_count = await db.community_signups.count_documents({})
    reviews_count = await db.reviews.count_documents({})
    pending_reviews = await db.reviews.count_documents({"status": "pending"})
    pageviews_count = await db.analytics_pageviews.count_documents({})
    clicks_count = await db.analytics_clicks.count_documents({})
    
    # Get recent signups
    recent_signups = await db.community_signups.find({}, {"_id": 0}).sort("created_at", -1).to_list(10)
    
    # Get pending reviews
    pending_reviews_list = await db.reviews.find({"status": "pending"}, {"_id": 0}).sort("created_at", -1).to_list(10)
    
    return {
        "stats": {
            "total_signups": signups_count,
            "total_reviews": reviews_count,
            "pending_reviews": pending_reviews,
            "total_pageviews": pageviews_count,
            "total_clicks": clicks_count
        },
        "recent_signups": recent_signups,
        "pending_reviews": pending_reviews_list
    }


@api_router.delete("/admin/signup/{signup_id}")
async def delete_signup(signup_id: str, admin: str = Depends(verify_admin)):
    """Delete a community signup (admin only)"""
    result = await db.community_signups.delete_one({"id": signup_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Signup not found")
    return {"success": True, "message": "Signup deleted"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

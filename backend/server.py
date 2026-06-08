from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta


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

# Admin credentials
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'connectflareonix@gmail.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'Flareonix@admin02')

# Session duration
SESSION_DURATION_DAYS = 7


def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin credentials"""
    correct_username = secrets.compare_digest(credentials.username, ADMIN_EMAIL)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


async def get_current_user(request: Request):
    """Get current user from session token"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


# ==================== MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "user"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    user_email: str
    rating: int = Field(..., ge=1, le=5)
    title: str
    content: str
    status: str = "pending"
    admin_reply: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    title: str = Field(..., min_length=3, max_length=100)
    content: str = Field(..., min_length=10, max_length=1000)

class ReviewUpdate(BaseModel):
    status: Optional[str] = None
    admin_reply: Optional[str] = None

class CaseStudy(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    client_name: str
    industry: str
    challenge: str
    solution: str
    results: str
    metrics: Optional[dict] = None
    image_url: Optional[str] = None
    status: str = "ongoing"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

class CaseStudyCreate(BaseModel):
    title: str = Field(..., min_length=3)
    client_name: str = Field(..., min_length=2)
    industry: str
    challenge: str
    solution: str
    results: str
    metrics: Optional[dict] = None
    image_url: Optional[str] = None
    status: str = "ongoing"

class CaseStudyUpdate(BaseModel):
    title: Optional[str] = None
    client_name: Optional[str] = None
    industry: Optional[str] = None
    challenge: Optional[str] = None
    solution: Optional[str] = None
    results: Optional[str] = None
    metrics: Optional[dict] = None
    image_url: Optional[str] = None
    status: Optional[str] = None

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    status: str = "unread"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: str
    subject: str = Field(..., min_length=3)
    message: str = Field(..., min_length=10)

class PageView(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page: str
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    session_id: Optional[str] = None
    user_id: Optional[str] = None
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
    user_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ButtonClickCreate(BaseModel):
    button_id: str
    button_name: str
    page: str
    session_id: Optional[str] = None


# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    """Exchange session_id for session_token (Emergent Auth)"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth to get user data
    async with httpx.AsyncClient() as client:
        auth_response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session_id")
        
        auth_data = auth_response.json()
    
    email = auth_data.get("email")
    name = auth_data.get("name")
    picture = auth_data.get("picture")
    session_token = auth_data.get("session_token")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        # Update user data if needed
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture}}
        )
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "role": "admin" if email == ADMIN_EMAIL else "user",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_doc)
    
    # Create session
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_DURATION_DAYS)
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Remove old sessions for this user
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=SESSION_DURATION_DAYS * 24 * 60 * 60
    )
    
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user


@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    """Get current authenticated user"""
    return user


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"success": True}


# ==================== USER ENDPOINTS ====================

@api_router.get("/users/me/dashboard")
async def get_user_dashboard(user: dict = Depends(get_current_user)):
    """Get user dashboard data"""
    user_id = user["user_id"]
    
    # Get user's reviews
    reviews = await db.reviews.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    
    return {
        "user": user,
        "reviews": reviews,
        "stats": {
            "total_reviews": len(reviews),
            "approved_reviews": len([r for r in reviews if r.get("status") == "approved"]),
            "pending_reviews": len([r for r in reviews if r.get("status") == "pending"])
        }
    }


# ==================== COMMUNITY ENDPOINTS ====================

@api_router.post("/community/signup", response_model=CommunitySignup)
async def community_signup(input: CommunitySignupCreate):
    """Register a new community member"""
    existing = await db.community_signups.find_one({"email": input.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="This email is already registered!")
    
    signup_obj = CommunitySignup(**input.model_dump())
    doc = signup_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.community_signups.insert_one(doc)
    return signup_obj


@api_router.get("/community/count")
async def get_community_count():
    """Get total community member count"""
    count = await db.community_signups.count_documents({})
    return {"count": count}


# ==================== REVIEW ENDPOINTS ====================

@api_router.post("/reviews", response_model=Review)
async def create_review(input: ReviewCreate, user: dict = Depends(get_current_user)):
    """Create a new review (requires login)"""
    existing = await db.reviews.find_one({
        "user_id": user["user_id"],
        "status": {"$in": ["pending", "approved"]}
    }, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="You already have an active review.")
    
    review_obj = Review(
        user_id=user["user_id"],
        user_name=user["name"],
        user_email=user["email"],
        **input.model_dump()
    )
    
    doc = review_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc['updated_at']:
        doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.reviews.insert_one(doc)
    return review_obj


@api_router.get("/reviews/approved")
async def get_approved_reviews():
    """Get all approved reviews"""
    reviews = await db.reviews.find({"status": "approved"}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return reviews


@api_router.get("/reviews/all")
async def get_all_reviews(admin: str = Depends(verify_admin)):
    """Get all reviews (admin only)"""
    reviews = await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return reviews


@api_router.put("/reviews/{review_id}")
async def update_review(review_id: str, input: ReviewUpdate, admin: str = Depends(verify_admin)):
    """Update review (admin only)"""
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.reviews.update_one({"id": review_id}, {"$set": update_data})
    
    updated = await db.reviews.find_one({"id": review_id}, {"_id": 0})
    return updated


@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, admin: str = Depends(verify_admin)):
    """Delete a review (admin only)"""
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"success": True}


# ==================== CASE STUDY ENDPOINTS ====================

@api_router.post("/case-studies", response_model=CaseStudy)
async def create_case_study(input: CaseStudyCreate, admin: str = Depends(verify_admin)):
    """Create a new case study (admin only)"""
    case_study = CaseStudy(**input.model_dump())
    doc = case_study.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc['updated_at']:
        doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.case_studies.insert_one(doc)
    return case_study


@api_router.get("/case-studies")
async def get_case_studies():
    """Get all case studies"""
    case_studies = await db.case_studies.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return case_studies


@api_router.get("/case-studies/{case_study_id}")
async def get_case_study(case_study_id: str):
    """Get a specific case study"""
    case_study = await db.case_studies.find_one({"id": case_study_id}, {"_id": 0})
    if not case_study:
        raise HTTPException(status_code=404, detail="Case study not found")
    return case_study


@api_router.put("/case-studies/{case_study_id}")
async def update_case_study(case_study_id: str, input: CaseStudyUpdate, admin: str = Depends(verify_admin)):
    """Update a case study (admin only)"""
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.case_studies.update_one({"id": case_study_id}, {"$set": update_data})
    
    updated = await db.case_studies.find_one({"id": case_study_id}, {"_id": 0})
    return updated


@api_router.delete("/case-studies/{case_study_id}")
async def delete_case_study(case_study_id: str, admin: str = Depends(verify_admin)):
    """Delete a case study (admin only)"""
    result = await db.case_studies.delete_one({"id": case_study_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Case study not found")
    return {"success": True}


# ==================== CONTACT ENDPOINTS ====================

@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(input: ContactMessageCreate):
    """Submit a contact message"""
    message = ContactMessage(**input.model_dump())
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_messages.insert_one(doc)
    return message


@api_router.get("/contact/messages")
async def get_contact_messages(admin: str = Depends(verify_admin)):
    """Get all contact messages (admin only)"""
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return messages


@api_router.put("/contact/messages/{message_id}/status")
async def update_message_status(message_id: str, status: str, admin: str = Depends(verify_admin)):
    """Update message status (admin only)"""
    await db.contact_messages.update_one({"id": message_id}, {"$set": {"status": status}})
    return {"success": True}


# ==================== ANALYTICS ENDPOINTS ====================

@api_router.post("/analytics/pageview")
async def track_pageview(input: PageViewCreate, request: Request):
    """Track a page view"""
    user_id = None
    try:
        user = await get_current_user(request)
        user_id = user.get("user_id")
    except:
        pass
    
    pageview = PageView(
        page=input.page,
        referrer=input.referrer,
        user_agent=request.headers.get("user-agent"),
        session_id=input.session_id,
        user_id=user_id
    )
    
    doc = pageview.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.analytics_pageviews.insert_one(doc)
    return {"success": True}


@api_router.post("/analytics/click")
async def track_click(input: ButtonClickCreate, request: Request):
    """Track a button click"""
    user_id = None
    try:
        user = await get_current_user(request)
        user_id = user.get("user_id")
    except:
        pass
    
    click = ButtonClick(**input.model_dump(), user_id=user_id)
    doc = click.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.analytics_clicks.insert_one(doc)
    return {"success": True}


@api_router.get("/analytics/summary")
async def get_analytics_summary(admin: str = Depends(verify_admin)):
    """Get analytics summary (admin only)"""
    total_pageviews = await db.analytics_pageviews.count_documents({})
    total_clicks = await db.analytics_clicks.count_documents({})
    total_users = await db.users.count_documents({})
    total_signups = await db.community_signups.count_documents({})
    total_reviews = await db.reviews.count_documents({})
    pending_reviews = await db.reviews.count_documents({"status": "pending"})
    total_messages = await db.contact_messages.count_documents({})
    unread_messages = await db.contact_messages.count_documents({"status": "unread"})
    
    # Page views by page
    pageviews_pipeline = [
        {"$group": {"_id": "$page", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    pageviews_by_page = await db.analytics_pageviews.aggregate(pageviews_pipeline).to_list(10)
    
    # Clicks by button
    clicks_pipeline = [
        {"$group": {"_id": "$button_name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    clicks_by_button = await db.analytics_clicks.aggregate(clicks_pipeline).to_list(10)
    
    return {
        "overview": {
            "total_pageviews": total_pageviews,
            "total_clicks": total_clicks,
            "total_users": total_users,
            "total_signups": total_signups,
            "total_reviews": total_reviews,
            "pending_reviews": pending_reviews,
            "total_messages": total_messages,
            "unread_messages": unread_messages,
            "conversion_rate": round((total_signups / total_pageviews * 100), 2) if total_pageviews > 0 else 0
        },
        "pageviews_by_page": [{"page": p["_id"], "count": p["count"]} for p in pageviews_by_page],
        "clicks_by_button": [{"button": c["_id"], "count": c["count"]} for c in clicks_by_button]
    }


# ==================== ADMIN ENDPOINTS ====================

@api_router.get("/admin/verify")
async def verify_admin_access(admin: str = Depends(verify_admin)):
    """Verify admin credentials"""
    return {"success": True, "admin": admin}


@api_router.get("/admin/dashboard")
async def get_admin_dashboard(admin: str = Depends(verify_admin)):
    """Get admin dashboard data"""
    stats = {
        "total_users": await db.users.count_documents({}),
        "total_signups": await db.community_signups.count_documents({}),
        "total_reviews": await db.reviews.count_documents({}),
        "pending_reviews": await db.reviews.count_documents({"status": "pending"}),
        "total_case_studies": await db.case_studies.count_documents({}),
        "total_messages": await db.contact_messages.count_documents({}),
        "unread_messages": await db.contact_messages.count_documents({"status": "unread"}),
        "total_pageviews": await db.analytics_pageviews.count_documents({}),
        "total_clicks": await db.analytics_clicks.count_documents({})
    }
    
    recent_users = await db.users.find({}, {"_id": 0}).sort("created_at", -1).to_list(10)
    recent_signups = await db.community_signups.find({}, {"_id": 0}).sort("created_at", -1).to_list(10)
    pending_reviews = await db.reviews.find({"status": "pending"}, {"_id": 0}).sort("created_at", -1).to_list(10)
    recent_messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(10)
    
    return {
        "stats": stats,
        "recent_users": recent_users,
        "recent_signups": recent_signups,
        "pending_reviews": pending_reviews,
        "recent_messages": recent_messages
    }


@api_router.get("/admin/users")
async def get_all_users(admin: str = Depends(verify_admin)):
    """Get all users (admin only)"""
    users = await db.users.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return users


@api_router.get("/admin/signups")
async def get_all_signups(admin: str = Depends(verify_admin)):
    """Get all community signups (admin only)"""
    signups = await db.community_signups.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return signups


@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, admin: str = Depends(verify_admin)):
    """Delete a user (admin only)"""
    await db.users.delete_one({"user_id": user_id})
    await db.user_sessions.delete_many({"user_id": user_id})
    return {"success": True}


@api_router.delete("/admin/signups/{signup_id}")
async def delete_signup(signup_id: str, admin: str = Depends(verify_admin)):
    """Delete a signup (admin only)"""
    result = await db.community_signups.delete_one({"id": signup_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Signup not found")
    return {"success": True}


@api_router.get("/admin/export/{data_type}")
async def export_data(data_type: str, admin: str = Depends(verify_admin)):
    """Export data as JSON (admin only)"""
    if data_type == "users":
        data = await db.users.find({}, {"_id": 0}).to_list(10000)
    elif data_type == "signups":
        data = await db.community_signups.find({}, {"_id": 0}).to_list(10000)
    elif data_type == "reviews":
        data = await db.reviews.find({}, {"_id": 0}).to_list(10000)
    elif data_type == "messages":
        data = await db.contact_messages.find({}, {"_id": 0}).to_list(10000)
    elif data_type == "analytics":
        pageviews = await db.analytics_pageviews.find({}, {"_id": 0}).to_list(10000)
        clicks = await db.analytics_clicks.find({}, {"_id": 0}).to_list(10000)
        data = {"pageviews": pageviews, "clicks": clicks}
    else:
        raise HTTPException(status_code=400, detail="Invalid data type")
    
    return {"data": data, "count": len(data) if isinstance(data, list) else "N/A"}


# ==================== BASIC ENDPOINTS ====================

@api_router.get("/")
async def root():
    return {"message": "Flareonix API - Rise. Ignite. Conquer."}


# Include the router in the main app
app.include_router(api_router)

# AI Tools router (Claude Sonnet 4.5 via Emergent LLM Key)

# Content / Admin extended router

# DB init on startup
from db_init import init_db


@app.on_event("startup")
async def _startup_init():
    try:
        await init_db(db)
        logging.info("DB initialised")
    except Exception as e:
        logging.error(f"DB init failed: {e}")

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

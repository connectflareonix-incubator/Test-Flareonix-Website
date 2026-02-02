from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
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


# Contact Form Model (for tracking submissions)
class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactSubmissionCreate(BaseModel):
    email: str


# Add your routes to the router instead of directly to app
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


# Community Signup Endpoints
@api_router.post("/community/signup", response_model=CommunitySignup)
async def community_signup(input: CommunitySignupCreate):
    """Register a new community member and store their info"""
    # Check if email already exists
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


# Contact tracking endpoint
@api_router.post("/contact/track")
async def track_contact(input: ContactSubmissionCreate):
    """Track when someone clicks through to contact form"""
    submission = ContactSubmission(**input.model_dump())
    doc = submission.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_submissions.insert_one(doc)
    return {"success": True, "message": "Contact tracked"}


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

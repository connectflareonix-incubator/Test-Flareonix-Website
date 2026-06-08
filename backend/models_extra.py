"""Backend models for blog, team, projects, collaborations, contact submissions,
testimonials/case studies, announcements, site settings, webhooks.
Kept small to stay readable."""
from datetime import datetime, timezone
from typing import Optional, List, Any
import uuid
from pydantic import BaseModel, Field, ConfigDict


def _now():
    return datetime.now(timezone.utc)


# ---------- Blog ----------
class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = ""
    featured_image_url: Optional[str] = None
    category: str = "Updates"  # Opportunities|Updates|Announcements|Events|Founders_Note
    tags: List[str] = []
    status: str = "draft"  # draft|published
    author_id: Optional[str] = None
    author_name: Optional[str] = None
    views: int = 0
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class BlogPostCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    content: str
    excerpt: Optional[str] = ""
    featured_image_url: Optional[str] = None
    category: str = "Updates"
    tags: List[str] = []
    status: str = "draft"


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    featured_image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None


class BlogComment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    post_id: str
    user_id: str
    user_name: str
    user_email: str
    content: str
    is_read_by_admin: bool = False
    admin_reply: Optional[str] = None
    reply_sent_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=_now)


class BlogCommentCreate(BaseModel):
    content: str = Field(..., min_length=2, max_length=2000)


# ---------- Team ----------
class TeamMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    bio: Optional[str] = ""
    photo_url: Optional[str] = None  # base64 data URL or external
    linkedin_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=_now)


class TeamMemberInput(BaseModel):
    name: str
    role: str
    bio: Optional[str] = ""
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


# ---------- Projects ----------
class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    status: str = "Ongoing"  # Ongoing|Completed
    timeline_start: Optional[str] = None
    timeline_end: Optional[str] = None
    outcomes: Optional[str] = ""
    client_partner_name: Optional[str] = ""
    testimonial_quote: Optional[str] = ""
    photos: List[str] = []
    tags: List[str] = []
    display_order: int = 0
    created_at: datetime = Field(default_factory=_now)


class ProjectInput(BaseModel):
    title: str
    description: str
    status: str = "Ongoing"
    timeline_start: Optional[str] = None
    timeline_end: Optional[str] = None
    outcomes: Optional[str] = ""
    client_partner_name: Optional[str] = ""
    testimonial_quote: Optional[str] = ""
    photos: List[str] = []
    tags: List[str] = []
    display_order: int = 0


# ---------- Collaborations ----------
class Collaboration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    org_name: str
    logo_url: Optional[str] = None
    collab_type: str = "Other"
    year: int = 2026
    link: Optional[str] = None
    display_order: int = 0


class CollaborationInput(BaseModel):
    org_name: str
    logo_url: Optional[str] = None
    collab_type: str = "Other"
    year: int = 2026
    link: Optional[str] = None
    display_order: int = 0


# ---------- Contact submissions ----------
class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    whatsapp: Optional[str] = None
    inquiry_type: str = "General"
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=_now)


class ContactSubmissionInput(BaseModel):
    name: str = Field(..., min_length=2)
    email: str
    whatsapp: Optional[str] = None
    inquiry_type: str = "General"
    message: str = Field(..., min_length=10)


# ---------- Testimonials ----------
class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    client_role: Optional[str] = ""
    client_org: Optional[str] = ""
    quote: str
    project_id: Optional[str] = None
    is_approved: bool = False
    created_at: datetime = Field(default_factory=_now)


class TestimonialInput(BaseModel):
    client_name: str
    client_role: Optional[str] = ""
    client_org: Optional[str] = ""
    quote: str
    project_id: Optional[str] = None
    is_approved: bool = False


# ---------- Announcements ----------
class Announcement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    message: str
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    is_active: bool = False
    is_dismissible: bool = True
    created_at: datetime = Field(default_factory=_now)


class AnnouncementInput(BaseModel):
    message: str
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    is_active: bool = False
    is_dismissible: bool = True


# ---------- Settings ----------
class SettingUpdate(BaseModel):
    value: Any


# ---------- Webhook ----------
class WebhookUpdate(BaseModel):
    url: Optional[str] = None
    is_active: Optional[bool] = None

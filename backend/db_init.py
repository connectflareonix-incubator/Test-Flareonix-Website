"""Database initialiser: creates indexes and seeds default site_settings,
team members, projects, and webhook placeholder. Idempotent."""
from datetime import datetime, timezone


def _now():
    return datetime.now(timezone.utc).isoformat()


DEFAULT_SETTINGS = {
    # Contact & Social
    "contact_email": "connectflareonix@gmail.com",
    "contact_phone": "+91 9119014378",
    "contact_whatsapp": "https://wa.me/919119014378",
    "contact_address": "Kashipur, U.S. Nagar, Uttarakhand – 244713",
    "social_instagram": "https://www.instagram.com/flare.onix",
    "social_linkedin": "https://www.linkedin.com/company/flareonix-incubator",
    "whatsapp_community": "https://whatsapp.com/channel/0029VbBvp58F6sn3qA6mK501",
    "calendly_link": "https://calendly.com/connectflareonix",
    # Content
    "tagline": "Rise. Ignite. Conquer.",
    "mission": (
        "Flareonix is India's youth-powered startup incubator and growth ecosystem — "
        "built to discover raw talent, ignite bold ideas, and scale the next generation "
        "of founders from Tier 2 and Tier 3 cities into nationally influential businesses."
    ),
    "stat_founders": 250,
    "stat_businesses": 40,
    "stat_projects": 75,
}


async def init_db(db):
    # Indexes
    await db.users.create_index("email", unique=True, sparse=True)
    await db.user_sessions.create_index("session_token", unique=True)
    await db.blog_posts.create_index("slug", unique=True)
    await db.blog_posts.create_index("status")
    await db.blog_posts.create_index("category")
    await db.blog_posts.create_index("created_at")
    await db.blog_comments.create_index("post_id")
    await db.blog_comments.create_index("is_read_by_admin")
    await db.contact_submissions.create_index("is_read")
    await db.contact_submissions.create_index("created_at")
    await db.team_members.create_index("display_order")
    await db.projects.create_index("display_order")
    await db.collaborations.create_index("display_order")
    await db.announcements.create_index("is_active")
    await db.site_settings.create_index("key", unique=True)
    await db.webhook_endpoints.create_index("name", unique=True)
    await db.ai_generations.create_index("user_id")
    await db.ai_generations.create_index("created_at")

    # Seed site settings (upsert defaults — won't overwrite existing values)
    for k, v in DEFAULT_SETTINGS.items():
        existing = await db.site_settings.find_one({"key": k})
        if not existing:
            await db.site_settings.insert_one(
                {"key": k, "value": v, "updated_at": _now(), "updated_by": "system"}
            )

    # Seed webhook placeholder
    if not await db.webhook_endpoints.find_one({"name": "Google Sheets Sync"}):
        import uuid
        await db.webhook_endpoints.insert_one({
            "id": str(uuid.uuid4()),
            "name": "Google Sheets Sync",
            "url": "PLACEHOLDER_REPLACE_WITH_ZAPIER_URL",
            "event_type": "all_submissions",
            "is_active": False,
        })

    # Seed founder team member
    if not await db.team_members.find_one({"name": "Aayush Manjhariya"}):
        import uuid
        await db.team_members.insert_one({
            "id": str(uuid.uuid4()),
            "name": "Aayush Manjhariya",
            "role": "Founder & CEO",
            "bio": "Vision-driven builder and ecosystem architect. Leads strategy, partnerships, and growth at Flareonix.",
            "photo_url": None,
            "linkedin_url": "",
            "display_order": 1,
            "is_active": True,
            "created_at": _now(),
        })

    # Seed 3 projects
    seed_projects = [
        {
            "title": "Website Project — Mohd Jaan Interiors",
            "description": "Designed and delivered a professional website for interior designer Mr. Mohd Jaan.",
            "status": "Completed",
            "client_partner_name": "Mohd Jaan Interiors",
            "display_order": 1,
        },
        {
            "title": "The Indian Youth Summit 2026, Varanasi",
            "description": "National MUN / Youth Parliament event. Flareonix served as Strategic Growth Partner, managing outreach, sponsorships, and on-ground execution.",
            "status": "Completed",
            "client_partner_name": "TIYS 2026 Organising Committee",
            "display_order": 2,
        },
        {
            "title": "The Voiz 2.0 — National Youth Convention, Varanasi",
            "description": "Strategic growth partnership for India's upcoming national youth convention.",
            "status": "Ongoing",
            "client_partner_name": "",
            "display_order": 3,
        },
    ]
    import uuid
    for p in seed_projects:
        if not await db.projects.find_one({"title": p["title"]}):
            await db.projects.insert_one({
                "id": str(uuid.uuid4()),
                **p,
                "timeline_start": None,
                "timeline_end": None,
                "outcomes": "",
                "testimonial_quote": "",
                "photos": [],
                "tags": [],
                "created_at": _now(),
            })

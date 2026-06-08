"""Admin & content endpoints: blog (+ comments), team, projects, collaborations,
contacts, testimonials, announcements, settings, webhook, dashboard analytics.
All admin-protected routes use the same verify_admin dep injected from server.py.
Public read endpoints are separate."""
from fastapi import APIRouter, HTTPException, Depends, Request
from datetime import datetime, timezone, timedelta
from typing import Optional
import re
from models_extra import (
    BlogPost, BlogPostCreate, BlogPostUpdate, BlogComment, BlogCommentCreate,
    TeamMember, TeamMemberInput,
    Project, ProjectInput,
    Collaboration, CollaborationInput,
    ContactSubmission, ContactSubmissionInput,
    Testimonial, TestimonialInput,
    Announcement, AnnouncementInput,
    SettingUpdate, WebhookUpdate,
)


def _now():
    return datetime.now(timezone.utc)


def _iso(d):
    return d.isoformat() if isinstance(d, datetime) else d


def _slugify(s: str) -> str:
    s = (s or "").lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s)
    return s.strip("-") or "untitled"


def _serialize_doc(d: dict) -> dict:
    """Convert datetime fields to ISO strings and strip MongoDB _id for response serialization."""
    if not d:
        return d
    out = dict(d)
    out.pop("_id", None)
    for k, v in list(out.items()):
        if isinstance(v, datetime):
            out[k] = v.isoformat()
    return out


def build_content_router(db, verify_admin, get_current_user):
    router = APIRouter(prefix="/api", tags=["content-admin"])

    # ============ BLOG (admin CRUD + public list) ============

    @router.get("/blog/posts")
    async def list_published_blog():
        items = await db.blog_posts.find(
            {"status": "published"}, {"_id": 0}
        ).sort("created_at", -1).to_list(200)
        return items

    @router.get("/blog/posts/{slug}")
    async def get_post_by_slug(slug: str):
        post = await db.blog_posts.find_one({"slug": slug, "status": "published"}, {"_id": 0})
        if not post:
            raise HTTPException(404, "Post not found")
        await db.blog_posts.update_one({"id": post["id"]}, {"$inc": {"views": 1}})
        comments = await db.blog_comments.find(
            {"post_id": post["id"]}, {"_id": 0}
        ).sort("created_at", -1).to_list(200)
        post["comments"] = comments
        return post

    @router.post("/blog/posts/{post_id}/comments")
    async def add_comment(post_id: str, inp: BlogCommentCreate,
                          user: dict = Depends(get_current_user)):
        post = await db.blog_posts.find_one({"id": post_id, "status": "published"}, {"_id": 0})
        if not post:
            raise HTTPException(404, "Post not found")
        c = BlogComment(
            post_id=post_id, user_id=user["user_id"],
            user_name=user["name"], user_email=user["email"],
            content=inp.content,
        ).model_dump()
        c["created_at"] = c["created_at"].isoformat()
        await db.blog_comments.insert_one(c)
        return _serialize_doc(c)

    @router.get("/admin/blog/posts")
    async def admin_list_posts(_: str = Depends(verify_admin)):
        return await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

    @router.post("/admin/blog/posts")
    async def admin_create_post(inp: BlogPostCreate, _: str = Depends(verify_admin)):
        slug = inp.slug or _slugify(inp.title)
        if await db.blog_posts.find_one({"slug": slug}):
            slug = f"{slug}-{int(_now().timestamp())}"
        post = BlogPost(**{**inp.model_dump(), "slug": slug, "author_name": "Flareonix Team"})
        doc = post.model_dump()
        doc["created_at"] = doc["created_at"].isoformat()
        doc["updated_at"] = doc["updated_at"].isoformat()
        await db.blog_posts.insert_one(doc)
        return _serialize_doc(doc)

    @router.put("/admin/blog/posts/{post_id}")
    async def admin_update_post(post_id: str, inp: BlogPostUpdate,
                                _: str = Depends(verify_admin)):
        update = {k: v for k, v in inp.model_dump().items() if v is not None}
        if "slug" in update:
            update["slug"] = _slugify(update["slug"])
        update["updated_at"] = _now().isoformat()
        await db.blog_posts.update_one({"id": post_id}, {"$set": update})
        return await db.blog_posts.find_one({"id": post_id}, {"_id": 0})

    @router.delete("/admin/blog/posts/{post_id}")
    async def admin_delete_post(post_id: str, _: str = Depends(verify_admin)):
        await db.blog_posts.delete_one({"id": post_id})
        await db.blog_comments.delete_many({"post_id": post_id})
        return {"success": True}

    @router.get("/admin/blog/comments")
    async def admin_list_comments(filter: Optional[str] = None,
                                  _: str = Depends(verify_admin)):
        q = {}
        if filter == "unread":
            q["is_read_by_admin"] = False
        elif filter == "replied":
            q["admin_reply"] = {"$ne": None, "$exists": True}
        elif filter == "unreplied":
            q["$or"] = [{"admin_reply": None}, {"admin_reply": {"$exists": False}}]
        items = await db.blog_comments.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)
        return items

    @router.put("/admin/blog/comments/{cid}")
    async def admin_update_comment(cid: str, body: dict,
                                   _: str = Depends(verify_admin)):
        update = {}
        if "is_read_by_admin" in body:
            update["is_read_by_admin"] = bool(body["is_read_by_admin"])
        if body.get("admin_reply") is not None:
            update["admin_reply"] = body["admin_reply"]
            update["reply_sent_at"] = _now().isoformat()
            update["is_read_by_admin"] = True
        if update:
            await db.blog_comments.update_one({"id": cid}, {"$set": update})
        return await db.blog_comments.find_one({"id": cid}, {"_id": 0})

    @router.delete("/admin/blog/comments/{cid}")
    async def admin_delete_comment(cid: str, _: str = Depends(verify_admin)):
        await db.blog_comments.delete_one({"id": cid})
        return {"success": True}

    # ============ TEAM ============

    @router.get("/team")
    async def list_team():
        return await db.team_members.find(
            {"is_active": True}, {"_id": 0}
        ).sort("display_order", 1).to_list(200)

    @router.get("/admin/team")
    async def admin_list_team(_: str = Depends(verify_admin)):
        return await db.team_members.find({}, {"_id": 0}).sort("display_order", 1).to_list(500)

    @router.post("/admin/team")
    async def admin_create_team(inp: TeamMemberInput, _: str = Depends(verify_admin)):
        m = TeamMember(**inp.model_dump()).model_dump()
        m["created_at"] = m["created_at"].isoformat()
        await db.team_members.insert_one(m)
        return _serialize_doc(m)

    @router.put("/admin/team/{mid}")
    async def admin_update_team(mid: str, inp: TeamMemberInput,
                                _: str = Depends(verify_admin)):
        await db.team_members.update_one({"id": mid}, {"$set": inp.model_dump()})
        return await db.team_members.find_one({"id": mid}, {"_id": 0})

    @router.delete("/admin/team/{mid}")
    async def admin_delete_team(mid: str, _: str = Depends(verify_admin)):
        await db.team_members.delete_one({"id": mid})
        return {"success": True}

    # ============ PROJECTS ============

    @router.get("/projects")
    async def list_projects():
        return await db.projects.find({}, {"_id": 0}).sort("display_order", 1).to_list(500)

    @router.post("/admin/projects")
    async def admin_create_project(inp: ProjectInput, _: str = Depends(verify_admin)):
        p = Project(**inp.model_dump()).model_dump()
        p["created_at"] = p["created_at"].isoformat()
        await db.projects.insert_one(p)
        return _serialize_doc(p)

    @router.put("/admin/projects/{pid}")
    async def admin_update_project(pid: str, inp: ProjectInput,
                                   _: str = Depends(verify_admin)):
        await db.projects.update_one({"id": pid}, {"$set": inp.model_dump()})
        return await db.projects.find_one({"id": pid}, {"_id": 0})

    @router.delete("/admin/projects/{pid}")
    async def admin_delete_project(pid: str, _: str = Depends(verify_admin)):
        await db.projects.delete_one({"id": pid})
        return {"success": True}

    # ============ COLLABORATIONS ============

    @router.get("/collaborations")
    async def list_collabs():
        return await db.collaborations.find({}, {"_id": 0}).sort("display_order", 1).to_list(500)

    @router.post("/admin/collaborations")
    async def admin_create_collab(inp: CollaborationInput, _: str = Depends(verify_admin)):
        c = Collaboration(**inp.model_dump()).model_dump()
        await db.collaborations.insert_one(c)
        return _serialize_doc(c)

    @router.put("/admin/collaborations/{cid}")
    async def admin_update_collab(cid: str, inp: CollaborationInput,
                                  _: str = Depends(verify_admin)):
        await db.collaborations.update_one({"id": cid}, {"$set": inp.model_dump()})
        return await db.collaborations.find_one({"id": cid}, {"_id": 0})

    @router.delete("/admin/collaborations/{cid}")
    async def admin_delete_collab(cid: str, _: str = Depends(verify_admin)):
        await db.collaborations.delete_one({"id": cid})
        return {"success": True}

    # ============ CONTACT SUBMISSIONS ============

    @router.post("/contact/submit")
    async def submit_contact(inp: ContactSubmissionInput):
        s = ContactSubmission(**inp.model_dump()).model_dump()
        s["created_at"] = s["created_at"].isoformat()
        await db.contact_submissions.insert_one(s)
        # Fire webhook (non-blocking best-effort)
        await _fire_webhook(db, "contact", s)
        return _serialize_doc(s)

    @router.get("/admin/contact-submissions")
    async def admin_list_contacts(_: str = Depends(verify_admin)):
        return await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

    @router.put("/admin/contact-submissions/{sid}")
    async def admin_update_contact(sid: str, body: dict, _: str = Depends(verify_admin)):
        update = {k: body[k] for k in ("is_read",) if k in body}
        if update:
            await db.contact_submissions.update_one({"id": sid}, {"$set": update})
        return await db.contact_submissions.find_one({"id": sid}, {"_id": 0})

    @router.delete("/admin/contact-submissions/{sid}")
    async def admin_delete_contact(sid: str, _: str = Depends(verify_admin)):
        await db.contact_submissions.delete_one({"id": sid})
        return {"success": True}

    # ============ TESTIMONIALS ============

    @router.get("/testimonials")
    async def list_approved():
        return await db.testimonials.find({"is_approved": True}, {"_id": 0}).sort("created_at", -1).to_list(200)

    @router.get("/admin/testimonials")
    async def admin_list_testimonials(_: str = Depends(verify_admin)):
        return await db.testimonials.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

    @router.post("/admin/testimonials")
    async def admin_create_testimonial(inp: TestimonialInput, _: str = Depends(verify_admin)):
        t = Testimonial(**inp.model_dump()).model_dump()
        t["created_at"] = t["created_at"].isoformat()
        await db.testimonials.insert_one(t)
        return _serialize_doc(t)

    @router.put("/admin/testimonials/{tid}")
    async def admin_update_testimonial(tid: str, inp: TestimonialInput,
                                       _: str = Depends(verify_admin)):
        await db.testimonials.update_one({"id": tid}, {"$set": inp.model_dump()})
        return await db.testimonials.find_one({"id": tid}, {"_id": 0})

    @router.delete("/admin/testimonials/{tid}")
    async def admin_delete_testimonial(tid: str, _: str = Depends(verify_admin)):
        await db.testimonials.delete_one({"id": tid})
        return {"success": True}

    # ============ ANNOUNCEMENTS ============

    @router.get("/announcements/active")
    async def get_active_announcement():
        a = await db.announcements.find_one({"is_active": True}, {"_id": 0})
        return a or {}

    @router.get("/admin/announcements")
    async def admin_list_announcements(_: str = Depends(verify_admin)):
        return await db.announcements.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)

    @router.post("/admin/announcements")
    async def admin_create_announcement(inp: AnnouncementInput, _: str = Depends(verify_admin)):
        if inp.is_active:
            await db.announcements.update_many({}, {"$set": {"is_active": False}})
        a = Announcement(**inp.model_dump()).model_dump()
        a["created_at"] = a["created_at"].isoformat()
        await db.announcements.insert_one(a)
        return _serialize_doc(a)

    @router.put("/admin/announcements/{aid}")
    async def admin_update_announcement(aid: str, inp: AnnouncementInput,
                                        _: str = Depends(verify_admin)):
        if inp.is_active:
            await db.announcements.update_many({"id": {"$ne": aid}}, {"$set": {"is_active": False}})
        await db.announcements.update_one({"id": aid}, {"$set": inp.model_dump()})
        return await db.announcements.find_one({"id": aid}, {"_id": 0})

    @router.delete("/admin/announcements/{aid}")
    async def admin_delete_announcement(aid: str, _: str = Depends(verify_admin)):
        await db.announcements.delete_one({"id": aid})
        return {"success": True}

    # ============ SETTINGS ============

    @router.get("/settings")
    async def public_settings():
        items = await db.site_settings.find({}, {"_id": 0}).to_list(200)
        return {it["key"]: it["value"] for it in items}

    @router.put("/admin/settings/{key}")
    async def admin_update_setting(key: str, inp: SettingUpdate,
                                   _: str = Depends(verify_admin)):
        await db.site_settings.update_one(
            {"key": key},
            {"$set": {"value": inp.value, "updated_at": _now().isoformat()}},
            upsert=True,
        )
        return {"key": key, "value": inp.value}

    # ============ WEBHOOK ============

    @router.get("/admin/webhooks")
    async def admin_list_webhooks(_: str = Depends(verify_admin)):
        return await db.webhook_endpoints.find({}, {"_id": 0}).to_list(50)

    @router.put("/admin/webhooks/{wid}")
    async def admin_update_webhook(wid: str, inp: WebhookUpdate,
                                   _: str = Depends(verify_admin)):
        update = {k: v for k, v in inp.model_dump().items() if v is not None}
        await db.webhook_endpoints.update_one({"id": wid}, {"$set": update})
        return await db.webhook_endpoints.find_one({"id": wid}, {"_id": 0})

    @router.post("/admin/webhooks/{wid}/test")
    async def admin_test_webhook(wid: str, _: str = Depends(verify_admin)):
        wh = await db.webhook_endpoints.find_one({"id": wid}, {"_id": 0})
        if not wh or not wh.get("url") or wh["url"].startswith("PLACEHOLDER"):
            raise HTTPException(400, "Webhook URL not set")
        import httpx
        try:
            async with httpx.AsyncClient(timeout=10) as c:
                r = await c.post(wh["url"], json={"event": "test", "from": "Flareonix Admin"})
            return {"status_code": r.status_code, "ok": r.status_code < 400}
        except Exception as e:
            raise HTTPException(502, f"Webhook test failed: {str(e)[:200]}")

    # ============ USER MGMT ============

    @router.get("/admin/users")
    async def admin_list_users(_: str = Depends(verify_admin)):
        users = await db.users.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
        return users

    @router.put("/admin/users/{uid}")
    async def admin_update_user(uid: str, body: dict, _: str = Depends(verify_admin)):
        update = {}
        for key in ("role", "is_banned"):
            if key in body:
                update[key] = body[key]
        if update:
            await db.users.update_one({"user_id": uid}, {"$set": update})
            if update.get("is_banned"):
                await db.user_sessions.delete_many({"user_id": uid})
        return await db.users.find_one({"user_id": uid}, {"_id": 0})

    # ============ DASHBOARD METRICS ============

    @router.get("/admin/metrics/overview")
    async def admin_overview(_: str = Depends(verify_admin)):
        now = _now()
        today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
        week_start = today_start - timedelta(days=7)
        month_start = today_start - timedelta(days=30)

        # Strings because we store ISO
        def gte(d):
            return {"$gte": d.isoformat()}

        return {
            "total_users": await db.users.count_documents({}),
            "new_users_today": await db.users.count_documents({"created_at": gte(today_start)}),
            "new_users_week": await db.users.count_documents({"created_at": gte(week_start)}),
            "new_users_month": await db.users.count_documents({"created_at": gte(month_start)}),
            "blog_published": await db.blog_posts.count_documents({"status": "published"}),
            "blog_drafts": await db.blog_posts.count_documents({"status": "draft"}),
            "pending_comments": await db.blog_comments.count_documents({"is_read_by_admin": False}),
            "unread_contact_subs": await db.contact_submissions.count_documents({"is_read": False}),
            "pending_testimonials": await db.testimonials.count_documents({"is_approved": False}),
            "pending_reviews": await db.reviews.count_documents({"status": "pending"}),
        }

    @router.get("/admin/metrics/timeseries")
    async def admin_timeseries(days: int = 30, _: str = Depends(verify_admin)):
        now = _now()
        start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc) - timedelta(days=days - 1)

        async def bucket(coll, date_field="created_at"):
            cursor = coll.find({date_field: {"$gte": start.isoformat()}}, {"_id": 0, date_field: 1})
            buckets = {(start + timedelta(days=i)).strftime("%Y-%m-%d"): 0 for i in range(days)}
            async for d in cursor:
                ts = d.get(date_field)
                if isinstance(ts, str):
                    key = ts[:10]
                elif isinstance(ts, datetime):
                    key = ts.strftime("%Y-%m-%d")
                else:
                    continue
                if key in buckets:
                    buckets[key] += 1
            return [{"date": k, "count": v} for k, v in buckets.items()]

        signups = await bucket(db.users)
        pageviews = await bucket(db.analytics_pageviews, "timestamp")
        contacts = await bucket(db.contact_submissions)

        # Inquiry type breakdown (last `days`)
        pipeline = [
            {"$match": {"created_at": {"$gte": start.isoformat()}}},
            {"$group": {"_id": "$inquiry_type", "count": {"$sum": 1}}},
        ]
        by_type = await db.contact_submissions.aggregate(pipeline).to_list(20)
        inquiry_types = [{"type": x["_id"] or "Unknown", "count": x["count"]} for x in by_type]

        return {
            "signups": signups,
            "pageviews": pageviews,
            "contacts": contacts,
            "inquiry_types": inquiry_types,
        }

    return router


async def _fire_webhook(db, event_type: str, payload: dict):
    """Best-effort POST to active webhook. Never raises."""
    try:
        wh = await db.webhook_endpoints.find_one(
            {"is_active": True}, {"_id": 0}
        )
        if not wh or not wh.get("url") or wh["url"].startswith("PLACEHOLDER"):
            return
        import httpx
        async with httpx.AsyncClient(timeout=5) as c:
            await c.post(wh["url"], json={"event": event_type, "data": payload})
    except Exception:
        pass

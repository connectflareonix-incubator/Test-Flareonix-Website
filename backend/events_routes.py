"""Events endpoints: public list/detail + comments, and admin CRUD + comment
moderation. Follows the same build-router pattern as content_routes.py."""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
from models_extra import (
    Event, EventInput, EventComment, EventCommentCreate,
    WaitlistEntry, WaitlistEntryCreate,
)


def _now():
    return datetime.now(timezone.utc)


def _serialize(d: dict) -> dict:
    if not d:
        return d
    out = dict(d)
    out.pop("_id", None)
    for k, v in list(out.items()):
        if isinstance(v, datetime):
            out[k] = v.isoformat()
    return out


def build_events_router(db, verify_admin, get_current_user):
    router = APIRouter(prefix="/api", tags=["events"])

    # ============ PUBLIC ============

    @router.get("/events")
    async def list_events():
        items = await db.events.find({}, {"_id": 0}).sort("display_order", 1).to_list(500)
        # Attach comment counts
        for ev in items:
            ev["comment_count"] = await db.event_comments.count_documents({"event_id": ev["id"]})
        return items

    @router.get("/events/{event_id}")
    async def get_event(event_id: str):
        ev = await db.events.find_one({"id": event_id}, {"_id": 0})
        if not ev:
            raise HTTPException(404, "Event not found")
        return ev

    @router.get("/events/{event_id}/comments")
    async def list_comments(event_id: str):
        return await db.event_comments.find(
            {"event_id": event_id}, {"_id": 0}
        ).sort("created_at", -1).to_list(500)

    @router.post("/events/{event_id}/comments")
    async def add_comment(event_id: str, inp: EventCommentCreate,
                          user: dict = Depends(get_current_user)):
        ev = await db.events.find_one({"id": event_id}, {"_id": 0})
        if not ev:
            raise HTTPException(404, "Event not found")
        # If replying, validate the parent exists for this event
        if inp.parent_id:
            parent = await db.event_comments.find_one(
                {"id": inp.parent_id, "event_id": event_id}, {"_id": 0}
            )
            if not parent:
                raise HTTPException(404, "Parent comment not found")
        c = EventComment(
            event_id=event_id,
            parent_id=inp.parent_id,
            user_id=user["user_id"],
            user_name=user["name"],
            user_email=user["email"],
            user_picture=user.get("picture"),
            content=inp.content,
        ).model_dump()
        c["created_at"] = c["created_at"].isoformat()
        await db.event_comments.insert_one(c)
        return _serialize(c)

    @router.post("/events/{event_id}/interest")
    async def register_interest(event_id: str):
        """Public: bump the 'spots filled' counter when someone taps Register.
        Best-effort, capped at capacity so it never exceeds the total seats."""
        ev = await db.events.find_one({"id": event_id}, {"_id": 0})
        if not ev:
            raise HTTPException(404, "Event not found")
        capacity = ev.get("capacity", 0) or 0
        filled = ev.get("spots_filled", 0) or 0
        if capacity and filled < capacity:
            filled += 1
            await db.events.update_one({"id": event_id}, {"$set": {"spots_filled": filled}})
        return {"spots_filled": filled, "capacity": capacity}

    # ============ WAITLIST ============

    @router.get("/events/{event_id}/waitlist-count")
    async def waitlist_count(event_id: str):
        count = await db.event_waitlist.count_documents({"event_id": event_id})
        return {"waitlist_count": count}

    @router.post("/events/{event_id}/waitlist")
    async def join_waitlist(event_id: str, inp: WaitlistEntryCreate):
        """Public: capture an email for an event's waitlist (e.g. when full)."""
        ev = await db.events.find_one({"id": event_id}, {"_id": 0})
        if not ev:
            raise HTTPException(404, "Event not found")
        email = (inp.email or "").strip().lower()
        if "@" not in email or "." not in email:
            raise HTTPException(400, "Please enter a valid email address")
        existing = await db.event_waitlist.find_one(
            {"event_id": event_id, "email": email}, {"_id": 0}
        )
        if existing:
            count = await db.event_waitlist.count_documents({"event_id": event_id})
            return {"success": True, "already": True, "waitlist_count": count}
        entry = WaitlistEntry(
            event_id=event_id, name=(inp.name or "").strip(), email=email
        ).model_dump()
        entry["created_at"] = entry["created_at"].isoformat()
        await db.event_waitlist.insert_one(entry)
        count = await db.event_waitlist.count_documents({"event_id": event_id})
        return {"success": True, "already": False, "waitlist_count": count}

    # ============ ADMIN ============

    @router.get("/admin/events")
    async def admin_list_events(_: str = Depends(verify_admin)):
        return await db.events.find({}, {"_id": 0}).sort("display_order", 1).to_list(1000)

    @router.post("/admin/events")
    async def admin_create_event(inp: EventInput, _: str = Depends(verify_admin)):
        ev = Event(**inp.model_dump()).model_dump()
        ev["created_at"] = ev["created_at"].isoformat()
        await db.events.insert_one(ev)
        return _serialize(ev)

    @router.put("/admin/events/{event_id}")
    async def admin_update_event(event_id: str, inp: EventInput,
                                 _: str = Depends(verify_admin)):
        await db.events.update_one({"id": event_id}, {"$set": inp.model_dump()})
        return await db.events.find_one({"id": event_id}, {"_id": 0})

    @router.delete("/admin/events/{event_id}")
    async def admin_delete_event(event_id: str, _: str = Depends(verify_admin)):
        await db.events.delete_one({"id": event_id})
        await db.event_comments.delete_many({"event_id": event_id})
        await db.event_waitlist.delete_many({"event_id": event_id})
        return {"success": True}

    @router.get("/admin/events/{event_id}/comments")
    async def admin_list_event_comments(event_id: str, _: str = Depends(verify_admin)):
        return await db.event_comments.find(
            {"event_id": event_id}, {"_id": 0}
        ).sort("created_at", -1).to_list(1000)

    @router.delete("/admin/events/comments/{comment_id}")
    async def admin_delete_event_comment(comment_id: str, _: str = Depends(verify_admin)):
        # Cascade delete any replies to this comment as well
        await db.event_comments.delete_one({"id": comment_id})
        await db.event_comments.delete_many({"parent_id": comment_id})
        return {"success": True}

    @router.get("/admin/events/{event_id}/waitlist")
    async def admin_list_waitlist(event_id: str, _: str = Depends(verify_admin)):
        return await db.event_waitlist.find(
            {"event_id": event_id}, {"_id": 0}
        ).sort("created_at", -1).to_list(5000)

    @router.delete("/admin/events/waitlist/{entry_id}")
    async def admin_delete_waitlist(entry_id: str, _: str = Depends(verify_admin)):
        await db.event_waitlist.delete_one({"id": entry_id})
        return {"success": True}

    return router

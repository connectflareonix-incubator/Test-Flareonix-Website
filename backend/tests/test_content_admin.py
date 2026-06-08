"""Backend tests for Flareonix content + admin endpoints (iteration 3).
Covers: settings, team, projects, collaborations, blog (+comments), contacts,
testimonials, announcements, users (ban), webhooks, admin metrics + regression.
"""
import os
import uuid
import time
import pytest
import requests
from requests.auth import HTTPBasicAuth
from pymongo import MongoClient
from datetime import datetime, timezone, timedelta

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://flareonix-rise.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "connectflareonix@gmail.com"
ADMIN_PASSWORD = "Flareonix@admin02"
AUTH = HTTPBasicAuth(ADMIN_EMAIL, ADMIN_PASSWORD)

# Direct DB connection for user/session seeding + cleanup
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")
_db = MongoClient(MONGO_URL)[DB_NAME]

CREATED = {
    "blog_post_ids": [],
    "blog_comment_ids": [],
    "team_ids": [],
    "project_ids": [],
    "collab_ids": [],
    "contact_ids": [],
    "testimonial_ids": [],
    "announcement_ids": [],
    "user_ids": [],
    "session_tokens": [],
}


@pytest.fixture(scope="session")
def seeded_user():
    uid = "user_test_" + uuid.uuid4().hex[:8]
    tok = "tok_" + uuid.uuid4().hex
    _db.users.insert_one({
        "user_id": uid,
        "email": f"{uid}@flareonix.test",
        "name": "Test User",
        "picture": None,
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    _db.user_sessions.insert_one({
        "user_id": uid,
        "session_token": tok,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    CREATED["user_ids"].append(uid)
    CREATED["session_tokens"].append(tok)
    yield {"user_id": uid, "token": tok}


# ---------- PUBLIC SMOKE ----------
class TestPublicEndpoints:
    def test_root(self):
        r = requests.get(f"{API}/")
        assert r.status_code == 200
        assert "Flareonix" in r.json().get("message", "")

    def test_settings_returns_defaults(self):
        r = requests.get(f"{API}/settings")
        assert r.status_code == 200
        d = r.json()
        for k in ["contact_email", "contact_phone", "contact_address",
                  "social_instagram", "social_linkedin", "calendly_link",
                  "tagline", "mission", "stat_founders", "stat_businesses",
                  "stat_projects"]:
            assert k in d, f"Missing setting {k}"
        assert d["contact_email"] == "connectflareonix@gmail.com"

    def test_team_seeded(self):
        r = requests.get(f"{API}/team")
        assert r.status_code == 200
        names = [m["name"] for m in r.json()]
        assert "Aayush Manjhariya" in names

    def test_projects_seeded(self):
        r = requests.get(f"{API}/projects")
        assert r.status_code == 200
        titles = [p["title"] for p in r.json()]
        assert any("Mohd Jaan" in t for t in titles)
        assert any("Indian Youth Summit" in t for t in titles)
        assert any("Voiz" in t for t in titles)

    def test_collabs_list(self):
        r = requests.get(f"{API}/collaborations")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_blog_public_list(self):
        r = requests.get(f"{API}/blog/posts")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_announcement_empty_or_obj(self):
        r = requests.get(f"{API}/announcements/active")
        assert r.status_code == 200
        assert isinstance(r.json(), dict)

    def test_testimonials_approved_only(self):
        r = requests.get(f"{API}/testimonials")
        assert r.status_code == 200
        for t in r.json():
            assert t.get("is_approved") is True

    def test_community_count(self):
        r = requests.get(f"{API}/community/count")
        assert r.status_code == 200
        assert "count" in r.json()

    def test_reviews_approved(self):
        r = requests.get(f"{API}/reviews/approved")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_case_studies(self):
        r = requests.get(f"{API}/case-studies")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ---------- ADMIN AUTH ----------
class TestAdminAuth:
    def test_admin_endpoint_requires_auth(self):
        r = requests.get(f"{API}/admin/metrics/overview")
        assert r.status_code == 401

    def test_admin_metrics_overview(self):
        r = requests.get(f"{API}/admin/metrics/overview", auth=AUTH)
        assert r.status_code == 200
        d = r.json()
        for k in ["total_users", "new_users_today", "new_users_week", "new_users_month",
                  "blog_published", "blog_drafts", "pending_comments",
                  "unread_contact_subs", "pending_testimonials"]:
            assert k in d, f"missing {k}"

    def test_admin_metrics_timeseries(self):
        r = requests.get(f"{API}/admin/metrics/timeseries?days=30", auth=AUTH)
        assert r.status_code == 200
        d = r.json()
        for k in ["signups", "pageviews", "contacts", "inquiry_types"]:
            assert isinstance(d.get(k), list), f"{k} not list"


# ---------- BLOG CRUD + COMMENTS ----------
class TestBlogFlow:
    def test_create_publish_get_comment_flow(self, seeded_user):
        # Create published post
        payload = {
            "title": f"TEST Flareonix Rise {uuid.uuid4().hex[:6]}",
            "content": "<p>Phoenix rises.</p>",
            "status": "published",
            "category": "Updates",
        }
        r = requests.post(f"{API}/admin/blog/posts", json=payload, auth=AUTH)
        assert r.status_code == 200, r.text
        post = r.json()
        pid = post["id"]
        slug = post["slug"]
        CREATED["blog_post_ids"].append(pid)
        assert post["status"] == "published"

        # Public list
        r = requests.get(f"{API}/blog/posts")
        assert any(p["id"] == pid for p in r.json())

        # Get by slug + views increments
        r1 = requests.get(f"{API}/blog/posts/{slug}")
        assert r1.status_code == 200
        v1 = r1.json()["views"]
        r2 = requests.get(f"{API}/blog/posts/{slug}")
        assert r2.json()["views"] >= v1 + 1
        assert isinstance(r2.json().get("comments"), list)

        # Add comment with bearer token
        h = {"Authorization": f"Bearer {seeded_user['token']}"}
        r = requests.post(f"{API}/blog/posts/{pid}/comments",
                          json={"content": "First!"}, headers=h)
        assert r.status_code == 200, r.text
        cid = r.json()["id"]
        CREATED["blog_comment_ids"].append(cid)

        # Admin list comments
        r = requests.get(f"{API}/admin/blog/comments", auth=AUTH)
        assert r.status_code == 200
        assert any(c["id"] == cid for c in r.json())

        # Admin reply
        r = requests.put(f"{API}/admin/blog/comments/{cid}",
                         json={"admin_reply": "Thanks!"}, auth=AUTH)
        assert r.status_code == 200
        assert r.json()["admin_reply"] == "Thanks!"

        # Delete comment
        r = requests.delete(f"{API}/admin/blog/comments/{cid}", auth=AUTH)
        assert r.status_code == 200


# ---------- TEAM ----------
class TestTeamFlow:
    def test_team_crud(self):
        payload = {"name": "TEST Member", "role": "Test Role", "display_order": 99}
        r = requests.post(f"{API}/admin/team", json=payload, auth=AUTH)
        assert r.status_code == 200
        mid = r.json()["id"]
        CREATED["team_ids"].append(mid)
        # update
        r = requests.put(f"{API}/admin/team/{mid}",
                         json={**payload, "role": "Updated Role"}, auth=AUTH)
        assert r.status_code == 200
        assert r.json()["role"] == "Updated Role"
        # delete
        r = requests.delete(f"{API}/admin/team/{mid}", auth=AUTH)
        assert r.status_code == 200


# ---------- PROJECTS ----------
class TestProjectFlow:
    def test_project_crud(self):
        payload = {"title": "TEST Project", "description": "desc", "status": "Ongoing"}
        r = requests.post(f"{API}/admin/projects", json=payload, auth=AUTH)
        assert r.status_code == 200
        pid = r.json()["id"]
        CREATED["project_ids"].append(pid)
        r = requests.put(f"{API}/admin/projects/{pid}",
                         json={**payload, "status": "Completed"}, auth=AUTH)
        assert r.status_code == 200
        assert r.json()["status"] == "Completed"
        r = requests.delete(f"{API}/admin/projects/{pid}", auth=AUTH)
        assert r.status_code == 200


# ---------- COLLABORATIONS ----------
class TestCollabFlow:
    def test_collab_crud(self):
        payload = {"org_name": "TEST Org", "collab_type": "Sponsor", "year": 2026}
        r = requests.post(f"{API}/admin/collaborations", json=payload, auth=AUTH)
        assert r.status_code == 200
        cid = r.json()["id"]
        CREATED["collab_ids"].append(cid)
        r = requests.put(f"{API}/admin/collaborations/{cid}",
                         json={**payload, "year": 2027}, auth=AUTH)
        assert r.status_code == 200
        assert r.json()["year"] == 2027
        r = requests.delete(f"{API}/admin/collaborations/{cid}", auth=AUTH)
        assert r.status_code == 200


# ---------- CONTACT ----------
class TestContactFlow:
    def test_contact_submit_public_and_admin_manage(self):
        payload = {"name": "TEST User", "email": "test@example.com",
                   "inquiry_type": "General",
                   "message": "Hello there phoenix!"}
        # Public submit
        r = requests.post(f"{API}/contact/submit", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "id" in d and d.get("is_read") is False
        sid = d["id"]
        CREATED["contact_ids"].append(sid)

        # Admin list
        r = requests.get(f"{API}/admin/contact-submissions", auth=AUTH)
        assert r.status_code == 200
        assert any(s["id"] == sid for s in r.json())

        # Mark read
        r = requests.put(f"{API}/admin/contact-submissions/{sid}",
                         json={"is_read": True}, auth=AUTH)
        assert r.status_code == 200
        assert r.json()["is_read"] is True

        # Delete
        r = requests.delete(f"{API}/admin/contact-submissions/{sid}", auth=AUTH)
        assert r.status_code == 200


# ---------- TESTIMONIALS ----------
class TestTestimonialFlow:
    def test_testimonial_approval_visibility(self):
        payload = {"client_name": "TEST Client", "quote": "Great work!", "is_approved": True}
        r = requests.post(f"{API}/admin/testimonials", json=payload, auth=AUTH)
        assert r.status_code == 200
        tid = r.json()["id"]
        CREATED["testimonial_ids"].append(tid)

        r = requests.get(f"{API}/testimonials")
        assert any(t["id"] == tid for t in r.json())

        # Toggle off
        r = requests.put(f"{API}/admin/testimonials/{tid}",
                         json={**payload, "is_approved": False}, auth=AUTH)
        assert r.status_code == 200
        assert r.json()["is_approved"] is False
        r = requests.get(f"{API}/testimonials")
        assert not any(t["id"] == tid for t in r.json())

        requests.delete(f"{API}/admin/testimonials/{tid}", auth=AUTH)


# ---------- ANNOUNCEMENTS (single active enforcement) ----------
class TestAnnouncementFlow:
    def test_single_active(self):
        a1 = requests.post(f"{API}/admin/announcements",
                           json={"message": "TEST A1", "is_active": True}, auth=AUTH)
        assert a1.status_code == 200
        id1 = a1.json()["id"]
        CREATED["announcement_ids"].append(id1)

        # First should be active
        r = requests.get(f"{API}/announcements/active")
        assert r.json().get("id") == id1

        # Create second active -> deactivates first
        a2 = requests.post(f"{API}/admin/announcements",
                           json={"message": "TEST A2", "is_active": True}, auth=AUTH)
        assert a2.status_code == 200
        id2 = a2.json()["id"]
        CREATED["announcement_ids"].append(id2)

        r = requests.get(f"{API}/announcements/active")
        assert r.json().get("id") == id2

        for aid in (id1, id2):
            requests.delete(f"{API}/admin/announcements/{aid}", auth=AUTH)


# ---------- USERS BAN ----------
class TestUserBan:
    def test_ban_clears_session(self):
        uid = "user_ban_test_" + uuid.uuid4().hex[:8]
        tok = "tok_ban_" + uuid.uuid4().hex
        _db.users.insert_one({
            "user_id": uid, "email": f"{uid}@test.com", "name": "Ban Me",
            "role": "user", "created_at": datetime.now(timezone.utc).isoformat(),
        })
        _db.user_sessions.insert_one({
            "user_id": uid, "session_token": tok,
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        CREATED["user_ids"].append(uid)

        r = requests.get(f"{API}/admin/users", auth=AUTH)
        assert r.status_code == 200
        assert any(u["user_id"] == uid for u in r.json())

        r = requests.put(f"{API}/admin/users/{uid}",
                         json={"is_banned": True}, auth=AUTH)
        assert r.status_code == 200
        assert r.json().get("is_banned") is True

        # Session should be wiped
        sess = _db.user_sessions.find_one({"session_token": tok})
        assert sess is None


# ---------- SETTINGS UPDATE ----------
class TestSettingsUpdate:
    def test_update_tagline_persists(self):
        original = requests.get(f"{API}/settings").json().get("tagline")
        new_val = f"TEST_TAG_{uuid.uuid4().hex[:4]}"
        r = requests.put(f"{API}/admin/settings/tagline",
                         json={"value": new_val}, auth=AUTH)
        assert r.status_code == 200
        d = requests.get(f"{API}/settings").json()
        assert d["tagline"] == new_val
        # restore
        requests.put(f"{API}/admin/settings/tagline",
                     json={"value": original}, auth=AUTH)


# ---------- WEBHOOKS ----------
class TestWebhooks:
    def test_webhooks_seeded_and_update(self):
        r = requests.get(f"{API}/admin/webhooks", auth=AUTH)
        assert r.status_code == 200
        whs = r.json()
        assert any(w.get("name") == "Google Sheets Sync" for w in whs)
        wh = next(w for w in whs if w["name"] == "Google Sheets Sync")
        original_url = wh.get("url")
        original_active = wh.get("is_active", False)

        r = requests.put(f"{API}/admin/webhooks/{wh['id']}",
                         json={"url": "https://example.com/test", "is_active": False},
                         auth=AUTH)
        assert r.status_code == 200
        assert r.json()["url"] == "https://example.com/test"
        # Restore
        requests.put(f"{API}/admin/webhooks/{wh['id']}",
                     json={"url": original_url, "is_active": original_active},
                     auth=AUTH)


# ---------- AI TOOLS regression ----------
class TestAITools:
    def test_ai_tools_list(self):
        r = requests.get(f"{API}/ai/tools")
        assert r.status_code == 200
        assert len(r.json()) == 6


# ---------- CLEANUP ----------
def test_zz_cleanup():
    """Final cleanup of any leftover test data."""
    for pid in CREATED["blog_post_ids"]:
        requests.delete(f"{API}/admin/blog/posts/{pid}", auth=AUTH)
    for tid in CREATED["team_ids"]:
        requests.delete(f"{API}/admin/team/{tid}", auth=AUTH)
    for pid in CREATED["project_ids"]:
        requests.delete(f"{API}/admin/projects/{pid}", auth=AUTH)
    for cid in CREATED["collab_ids"]:
        requests.delete(f"{API}/admin/collaborations/{cid}", auth=AUTH)
    for sid in CREATED["contact_ids"]:
        requests.delete(f"{API}/admin/contact-submissions/{sid}", auth=AUTH)
    for tid in CREATED["testimonial_ids"]:
        requests.delete(f"{API}/admin/testimonials/{tid}", auth=AUTH)
    for aid in CREATED["announcement_ids"]:
        requests.delete(f"{API}/admin/announcements/{aid}", auth=AUTH)
    for uid in CREATED["user_ids"]:
        _db.users.delete_many({"user_id": uid})
        _db.user_sessions.delete_many({"user_id": uid})

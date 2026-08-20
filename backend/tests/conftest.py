"""Shared fixtures for Flareonix backend tests"""
import os
import uuid
import asyncio
from datetime import datetime, timezone, timedelta

import pytest
import requests
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv("/app/backend/.env")

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://gatherings-1.preview.emergentagent.com").rstrip("/")
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
def seeded_user(event_loop):
    """Seed a test user + session token directly in mongo. Returns dict with token, user_id, email."""
    async def _seed():
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        uid = "user_test_" + uuid.uuid4().hex[:8]
        email = f"{uid}@flareonix.test"
        await db.users.insert_one({
            "user_id": uid,
            "email": email,
            "name": "Test User",
            "picture": None,
            "role": "user",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        tok = "tok_" + uuid.uuid4().hex
        await db.user_sessions.insert_one({
            "user_id": uid,
            "session_token": tok,
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        client.close()
        return {"user_id": uid, "email": email, "token": tok}

    info = event_loop.run_until_complete(_seed())
    yield info

    # teardown: remove user, sessions, generations
    async def _cleanup():
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        await db.users.delete_many({"user_id": info["user_id"]})
        await db.user_sessions.delete_many({"user_id": info["user_id"]})
        await db.ai_generations.delete_many({"user_id": info["user_id"]})
        client.close()

    event_loop.run_until_complete(_cleanup())


@pytest.fixture(scope="session")
def auth_headers(seeded_user):
    return {
        "Authorization": f"Bearer {seeded_user['token']}",
        "Content-Type": "application/json",
    }

# Flareonix Test Credentials

## Admin Panel (HTTP Basic Auth)
- URL: `/admin`
- Email: `connectflareonix@gmail.com`
- Password: `Flareonix@admin02`

## User Authentication
- Strategy: Emergent Google OAuth
- Login URL: `/login` (redirects to Emergent auth)
- Callback URL: handled by `/components/AuthCallback.jsx`
- Session: `session_token` cookie OR `Authorization: Bearer <token>` header (7 day expiry)

## Test User Seeding (for backend testing)
The testing agent can seed a user + session via direct MongoDB insert. Example:
```python
import uuid, os
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

db = AsyncIOMotorClient(os.environ['MONGO_URL'])[os.environ['DB_NAME']]
uid = 'user_test_' + uuid.uuid4().hex[:8]
await db.users.insert_one({
    'user_id': uid, 'email': f'{uid}@flareonix.test', 'name': 'Test User',
    'picture': None, 'role': 'user',
    'created_at': datetime.now(timezone.utc).isoformat()
})
tok = 'tok_' + uuid.uuid4().hex
await db.user_sessions.insert_one({
    'user_id': uid, 'session_token': tok,
    'expires_at': (datetime.now(timezone.utc)+timedelta(days=1)).isoformat(),
    'created_at': datetime.now(timezone.utc).isoformat()
})
# use header: Authorization: Bearer <tok>
```

## Backend env
- `EMERGENT_LLM_KEY`: present in `/app/backend/.env` (universal key for Claude Sonnet 4.5)

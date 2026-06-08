"""Backend test suite for Flareonix - AI tools + regression smoke."""
import requests


# ============ Regression smoke ============

def test_root(api_client, base_url):
    r = api_client.get(f"{base_url}/api/")
    assert r.status_code == 200
    assert "Flareonix" in r.json().get("message", "")


def test_community_count(api_client, base_url):
    r = api_client.get(f"{base_url}/api/community/count")
    assert r.status_code == 200
    data = r.json()
    assert "count" in data
    assert isinstance(data["count"], int)


def test_reviews_approved(api_client, base_url):
    r = api_client.get(f"{base_url}/api/reviews/approved")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_case_studies(api_client, base_url):
    r = api_client.get(f"{base_url}/api/case-studies")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ============ AI tools - public ============

def test_ai_tools_list_public(api_client, base_url):
    r = api_client.get(f"{base_url}/api/ai/tools")
    assert r.status_code == 200
    tools = r.json()
    assert isinstance(tools, list)
    assert len(tools) == 6
    slugs = {t["slug"] for t in tools}
    assert slugs == {"caption", "ad-copy", "business-idea", "content-calendar", "email-writer", "pitch-deck"}
    for t in tools:
        assert t.get("name")


# ============ AI generate - auth required ============

def test_generate_without_auth_returns_401(api_client, base_url):
    r = api_client.post(
        f"{base_url}/api/ai/generate",
        json={"tool": "email-writer", "prompt": "test prompt for auth"},
    )
    assert r.status_code == 401


def test_generate_invalid_tool_returns_400(api_client, base_url, auth_headers):
    r = requests.post(
        f"{base_url}/api/ai/generate",
        json={"tool": "nonexistent-tool", "prompt": "say hi please"},
        headers=auth_headers,
        timeout=30,
    )
    assert r.status_code == 400


# ============ AI generate - 2 short tools ============

def test_generate_email_writer(api_client, base_url, auth_headers):
    r = requests.post(
        f"{base_url}/api/ai/generate",
        json={"tool": "email-writer", "prompt": "Pitch coffee to a busy founder. Keep it 1 line only."},
        headers=auth_headers,
        timeout=120,
    )
    assert r.status_code == 200, f"Got {r.status_code}: {r.text[:300]}"
    data = r.json()
    assert data.get("tool") == "email-writer"
    assert data.get("tool_name") == "Email Writer"
    assert isinstance(data.get("response"), str)
    assert len(data["response"]) > 10
    assert "id" in data


def test_generate_caption(api_client, base_url, auth_headers):
    r = requests.post(
        f"{base_url}/api/ai/generate",
        json={"tool": "caption", "prompt": "Brand: Flareonix. One line caption only please."},
        headers=auth_headers,
        timeout=120,
    )
    assert r.status_code == 200, f"Got {r.status_code}: {r.text[:300]}"
    data = r.json()
    assert data["tool"] == "caption"
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 10


# ============ AI history ============

def test_history_lists_generations(api_client, base_url, auth_headers):
    r = requests.get(f"{base_url}/api/ai/history", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    # We expect at least the 2 generated above
    assert len(items) >= 2
    tools_in_history = {item["tool"] for item in items}
    assert "email-writer" in tools_in_history
    assert "caption" in tools_in_history
    # ensure no _id leaks
    for it in items:
        assert "_id" not in it
        assert "id" in it
        assert it.get("user_email", "").endswith("@flareonix.test")


def test_history_requires_auth(api_client, base_url):
    r = api_client.get(f"{base_url}/api/ai/history")
    assert r.status_code == 401


def test_delete_history_item(api_client, base_url, auth_headers):
    # fetch first item
    r = requests.get(f"{base_url}/api/ai/history", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1
    target_id = items[0]["id"]

    d = requests.delete(f"{base_url}/api/ai/history/{target_id}", headers=auth_headers, timeout=30)
    assert d.status_code == 200
    assert d.json().get("success") is True

    # verify it's gone
    r2 = requests.get(f"{base_url}/api/ai/history", headers=auth_headers, timeout=30)
    new_ids = {it["id"] for it in r2.json()}
    assert target_id not in new_ids


def test_delete_nonexistent_returns_404(api_client, base_url, auth_headers):
    r = requests.delete(
        f"{base_url}/api/ai/history/does-not-exist-xyz",
        headers=auth_headers,
        timeout=30,
    )
    assert r.status_code == 404

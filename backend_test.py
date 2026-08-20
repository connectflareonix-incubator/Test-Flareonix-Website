#!/usr/bin/env python3
"""
Comprehensive backend test for Flareonix Events Waitlist feature.
Tests all waitlist endpoints: public join, count, admin management, and cascade delete.
"""
import requests
import json
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://47159116-ed5f-40ff-a106-7dd055e9ff85.preview.emergentagent.com/api"
ADMIN_EMAIL = "connectflareonix@gmail.com"
ADMIN_PASSWORD = "Flareonix@admin02"

# Test results tracking
test_results = []
test_count = 0
passed_count = 0
failed_count = 0


def log_test(name: str, passed: bool, details: str = ""):
    """Log test result"""
    global test_count, passed_count, failed_count
    test_count += 1
    if passed:
        passed_count += 1
        status = "✅ PASS"
    else:
        failed_count += 1
        status = "❌ FAIL"
    
    result = f"{status} - {name}"
    if details:
        result += f"\n    {details}"
    test_results.append(result)
    print(result)


def make_request(method: str, endpoint: str, auth: Optional[tuple] = None, 
                 json_data: Optional[Dict] = None, expect_status: int = 200) -> tuple:
    """Make HTTP request and return (success, response, data)"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            resp = requests.get(url, auth=auth, timeout=10)
        elif method == "POST":
            resp = requests.post(url, auth=auth, json=json_data, timeout=10)
        elif method == "DELETE":
            resp = requests.delete(url, auth=auth, timeout=10)
        elif method == "PUT":
            resp = requests.put(url, auth=auth, json=json_data, timeout=10)
        else:
            return False, None, f"Unknown method: {method}"
        
        success = resp.status_code == expect_status
        try:
            data = resp.json()
        except:
            data = resp.text
        
        return success, resp, data
    except Exception as e:
        return False, None, str(e)


def test_waitlist_endpoints():
    """Test all waitlist endpoints according to review request"""
    print("\n" + "="*80)
    print("FLAREONIX EVENTS WAITLIST BACKEND TESTING")
    print("="*80 + "\n")
    
    # Step 1: Get FFT #001 event ID
    print("STEP 1: Fetch FFT #001 event ID")
    print("-" * 80)
    success, resp, data = make_request("GET", "/events")
    if success and isinstance(data, list) and len(data) > 0:
        fft_event = next((e for e in data if "FFT #001" in e.get("title", "")), None)
        if fft_event:
            fft_event_id = fft_event["id"]
            log_test("Fetch FFT #001 event", True, f"Found FFT #001 with ID: {fft_event_id}")
        else:
            log_test("Fetch FFT #001 event", False, "FFT #001 event not found in events list")
            return
    else:
        log_test("Fetch FFT #001 event", False, f"Failed to fetch events: {data}")
        return
    
    # Step 2: Create temporary test event (capacity=1, spots_filled=1, status=upcoming)
    print("\nSTEP 2: Create temporary test event for waitlist testing")
    print("-" * 80)
    test_event_data = {
        "title": "Waitlist QA",
        "date": "To be announced",
        "venue": "Test Venue",
        "theme": "Test Theme",
        "description": "Test event for waitlist QA",
        "capacity": 1,
        "spots_filled": 1,
        "status": "upcoming"
    }
    success, resp, data = make_request("POST", "/admin/events", 
                                      auth=(ADMIN_EMAIL, ADMIN_PASSWORD),
                                      json_data=test_event_data)
    if success and isinstance(data, dict) and "id" in data:
        test_event_id = data["id"]
        log_test("Create test event 'Waitlist QA'", True, 
                f"Created with ID: {test_event_id}, capacity=1, spots_filled=1")
    else:
        log_test("Create test event 'Waitlist QA'", False, f"Failed: {data}")
        return
    
    # Step 3: PUBLIC WAITLIST JOIN - Test various scenarios
    print("\nSTEP 3: PUBLIC WAITLIST JOIN - POST /api/events/{id}/waitlist")
    print("-" * 80)
    
    # 3a: Join waitlist with first email (Alice)
    alice_data = {"name": "Alice", "email": "alice@example.com"}
    success, resp, data = make_request("POST", f"/events/{test_event_id}/waitlist",
                                      json_data=alice_data)
    if success and data.get("success") and not data.get("already") and data.get("waitlist_count") == 1:
        log_test("Join waitlist - Alice (first entry)", True,
                f"Response: {data}")
    else:
        log_test("Join waitlist - Alice (first entry)", False,
                f"Expected {{success:true, already:false, waitlist_count:1}}, got: {data}")
    
    # 3b: Join again with SAME email (case-insensitive test)
    alice_upper_data = {"name": "Alice Upper", "email": "ALICE@example.com"}
    success, resp, data = make_request("POST", f"/events/{test_event_id}/waitlist",
                                      json_data=alice_upper_data)
    if success and data.get("success") and data.get("already") and data.get("waitlist_count") == 1:
        log_test("Join waitlist - Alice duplicate (case-insensitive)", True,
                f"Response: {data} - No duplicate created")
    else:
        log_test("Join waitlist - Alice duplicate (case-insensitive)", False,
                f"Expected {{success:true, already:true, waitlist_count:1}}, got: {data}")
    
    # 3c: Join with second email (Bob)
    bob_data = {"name": "Bob", "email": "bob@example.com"}
    success, resp, data = make_request("POST", f"/events/{test_event_id}/waitlist",
                                      json_data=bob_data)
    if success and data.get("success") and not data.get("already") and data.get("waitlist_count") == 2:
        log_test("Join waitlist - Bob (second entry)", True,
                f"Response: {data}")
    else:
        log_test("Join waitlist - Bob (second entry)", False,
                f"Expected {{success:true, already:false, waitlist_count:2}}, got: {data}")
    
    # 3d: Join with invalid email
    invalid_data = {"name": "Invalid", "email": "notanemail"}
    success, resp, data = make_request("POST", f"/events/{test_event_id}/waitlist",
                                      json_data=invalid_data, expect_status=400)
    if success:
        log_test("Join waitlist - Invalid email (expect 400)", True,
                f"Correctly rejected with 400: {data}")
    else:
        log_test("Join waitlist - Invalid email (expect 400)", False,
                f"Expected 400 status, got {resp.status_code if resp else 'no response'}: {data}")
    
    # 3e: Join with nonexistent event ID
    success, resp, data = make_request("POST", "/events/nonexistent-id/waitlist",
                                      json_data={"email": "test@example.com"},
                                      expect_status=404)
    if success:
        log_test("Join waitlist - Nonexistent event (expect 404)", True,
                f"Correctly returned 404: {data}")
    else:
        log_test("Join waitlist - Nonexistent event (expect 404)", False,
                f"Expected 404 status, got {resp.status_code if resp else 'no response'}: {data}")
    
    # Step 4: WAITLIST COUNT
    print("\nSTEP 4: WAITLIST COUNT - GET /api/events/{id}/waitlist-count")
    print("-" * 80)
    success, resp, data = make_request("GET", f"/events/{test_event_id}/waitlist-count")
    if success and data.get("waitlist_count") == 2:
        log_test("Get waitlist count", True, f"Response: {data}")
    else:
        log_test("Get waitlist count", False,
                f"Expected {{waitlist_count:2}}, got: {data}")
    
    # Step 5: ADMIN WAITLIST MANAGEMENT
    print("\nSTEP 5: ADMIN WAITLIST MANAGEMENT (HTTP Basic Auth)")
    print("-" * 80)
    
    # 5a: GET without auth (expect 401)
    success, resp, data = make_request("GET", f"/admin/events/{test_event_id}/waitlist",
                                      expect_status=401)
    if success:
        log_test("Admin GET waitlist - No auth (expect 401)", True,
                f"Correctly returned 401")
    else:
        log_test("Admin GET waitlist - No auth (expect 401)", False,
                f"Expected 401 status, got {resp.status_code if resp else 'no response'}")
    
    # 5b: GET with auth (expect array of 2 entries)
    success, resp, data = make_request("GET", f"/admin/events/{test_event_id}/waitlist",
                                      auth=(ADMIN_EMAIL, ADMIN_PASSWORD))
    if success and isinstance(data, list) and len(data) == 2:
        # Verify each entry has required fields
        entry_valid = all(
            "id" in e and "event_id" in e and "name" in e and "email" in e and "created_at" in e
            for e in data
        )
        if entry_valid:
            log_test("Admin GET waitlist - With auth", True,
                    f"Retrieved {len(data)} entries with all required fields (id, event_id, name, email, created_at)")
            # Store first entry ID for deletion test
            first_entry_id = data[0]["id"]
        else:
            log_test("Admin GET waitlist - With auth", False,
                    f"Entries missing required fields: {data}")
            first_entry_id = None
    else:
        log_test("Admin GET waitlist - With auth", False,
                f"Expected array of 2 entries, got: {data}")
        first_entry_id = None
    
    # 5c: DELETE one waitlist entry
    if first_entry_id:
        success, resp, data = make_request("DELETE", f"/admin/events/waitlist/{first_entry_id}",
                                          auth=(ADMIN_EMAIL, ADMIN_PASSWORD))
        if success and data.get("success"):
            log_test("Admin DELETE waitlist entry", True,
                    f"Deleted entry {first_entry_id}")
            
            # Verify only 1 entry remains
            success, resp, data = make_request("GET", f"/admin/events/{test_event_id}/waitlist",
                                              auth=(ADMIN_EMAIL, ADMIN_PASSWORD))
            if success and isinstance(data, list) and len(data) == 1:
                log_test("Verify waitlist after delete", True,
                        f"Only 1 entry remains after deletion")
            else:
                log_test("Verify waitlist after delete", False,
                        f"Expected 1 entry, got: {len(data) if isinstance(data, list) else data}")
        else:
            log_test("Admin DELETE waitlist entry", False,
                    f"Failed to delete: {data}")
    else:
        log_test("Admin DELETE waitlist entry", False,
                "Skipped - no entry ID available")
    
    # Step 6: CASCADE ON EVENT DELETE
    print("\nSTEP 6: CASCADE ON EVENT DELETE")
    print("-" * 80)
    
    # Delete the test event
    success, resp, data = make_request("DELETE", f"/admin/events/{test_event_id}",
                                      auth=(ADMIN_EMAIL, ADMIN_PASSWORD))
    if success and data.get("success"):
        log_test("Delete test event 'Waitlist QA'", True,
                f"Event {test_event_id} deleted")
        
        # Verify waitlist entries cascade-deleted (should return empty array)
        success, resp, data = make_request("GET", f"/admin/events/{test_event_id}/waitlist",
                                          auth=(ADMIN_EMAIL, ADMIN_PASSWORD))
        if success and isinstance(data, list) and len(data) == 0:
            log_test("Verify waitlist cascade delete", True,
                    "Waitlist entries cascade-deleted with event (empty array)")
        else:
            log_test("Verify waitlist cascade delete", False,
                    f"Expected empty array, got: {data}")
    else:
        log_test("Delete test event 'Waitlist QA'", False,
                f"Failed to delete event: {data}")
    
    # Step 7: Verify FFT #001 still intact and has empty waitlist
    print("\nSTEP 7: VERIFY FFT #001 INTEGRITY")
    print("-" * 80)
    
    # Check FFT #001 still exists
    success, resp, data = make_request("GET", f"/events/{fft_event_id}")
    if success and data.get("id") == fft_event_id and "FFT #001" in data.get("title", ""):
        log_test("FFT #001 still exists", True,
                f"Event intact with title: {data.get('title')}")
    else:
        log_test("FFT #001 still exists", False,
                f"FFT #001 not found or corrupted: {data}")
    
    # Check FFT #001 has empty waitlist
    success, resp, data = make_request("GET", f"/admin/events/{fft_event_id}/waitlist",
                                      auth=(ADMIN_EMAIL, ADMIN_PASSWORD))
    if success and isinstance(data, list) and len(data) == 0:
        log_test("FFT #001 has empty waitlist", True,
                "No leftover test waitlist entries")
    else:
        log_test("FFT #001 has empty waitlist", False,
                f"FFT #001 has {len(data) if isinstance(data, list) else 'unknown'} waitlist entries: {data}")
        # Clean up any leftover entries
        if isinstance(data, list) and len(data) > 0:
            print("\n⚠️  Cleaning up leftover waitlist entries from FFT #001...")
            for entry in data:
                entry_id = entry.get("id")
                if entry_id:
                    make_request("DELETE", f"/admin/events/waitlist/{entry_id}",
                               auth=(ADMIN_EMAIL, ADMIN_PASSWORD))
                    print(f"    Deleted entry: {entry_id}")
    
    # Print summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Total tests: {test_count}")
    print(f"Passed: {passed_count} ✅")
    print(f"Failed: {failed_count} ❌")
    print(f"Success rate: {(passed_count/test_count*100):.1f}%")
    print("\nDETAILED RESULTS:")
    for result in test_results:
        print(result)
    print("="*80 + "\n")
    
    return passed_count, failed_count


if __name__ == "__main__":
    try:
        passed, failed = test_waitlist_endpoints()
        exit(0 if failed == 0 else 1)
    except Exception as e:
        print(f"\n❌ CRITICAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

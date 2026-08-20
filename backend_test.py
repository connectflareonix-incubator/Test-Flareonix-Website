import requests
import sys
import json
from datetime import datetime

class FlareonixAPITester:
    def __init__(self, base_url="https://47159116-ed5f-40ff-a106-7dd055e9ff85.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_event_id = None  # Store created event ID for cleanup

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'No message')}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_community_count(self):
        """Test community count endpoint"""
        try:
            response = requests.get(f"{self.api_url}/community/count", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                count = data.get('count', 'No count')
                details += f", Count: {count}"
            self.log_test("Community Count Endpoint", success, details)
            return success, response.json() if success else {}
        except Exception as e:
            self.log_test("Community Count Endpoint", False, str(e))
            return False, {}

    def test_community_signup_validation(self):
        """Test community signup with missing fields"""
        try:
            # Test with missing required fields
            invalid_data = {
                "full_name": "",
                "email": "test@example.com"
                # Missing occupation and interest
            }
            response = requests.post(f"{self.api_url}/community/signup", json=invalid_data, timeout=10)
            success = response.status_code == 422  # Validation error expected
            details = f"Status: {response.status_code} (Expected 422 for validation error)"
            self.log_test("Community Signup Validation", success, details)
            return success
        except Exception as e:
            self.log_test("Community Signup Validation", False, str(e))
            return False

    def test_community_signup_success(self):
        """Test successful community signup"""
        try:
            # Create unique test data
            timestamp = datetime.now().strftime("%H%M%S")
            test_data = {
                "full_name": f"Test User {timestamp}",
                "email": f"test{timestamp}@example.com",
                "phone": "+91 9876543210",
                "occupation": "student",
                "interest": "startup_building"
            }
            
            response = requests.post(f"{self.api_url}/community/signup", json=test_data, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", User ID: {data.get('id', 'No ID')}"
            self.log_test("Community Signup Success", success, details)
            return success, test_data["email"]
        except Exception as e:
            self.log_test("Community Signup Success", False, str(e))
            return False, None

    def test_duplicate_email_signup(self, email):
        """Test duplicate email signup"""
        if not email:
            self.log_test("Duplicate Email Signup", False, "No email from previous test")
            return False
            
        try:
            duplicate_data = {
                "full_name": "Another User",
                "email": email,  # Same email as previous test
                "occupation": "freelancer",
                "interest": "ai_tools"
            }
            
            response = requests.post(f"{self.api_url}/community/signup", json=duplicate_data, timeout=10)
            success = response.status_code == 400  # Duplicate error expected
            details = f"Status: {response.status_code} (Expected 400 for duplicate email)"
            if response.status_code == 400:
                try:
                    error_data = response.json()
                    details += f", Error: {error_data.get('detail', 'No error message')}"
                except:
                    pass
            self.log_test("Duplicate Email Signup", success, details)
            return success
        except Exception as e:
            self.log_test("Duplicate Email Signup", False, str(e))
            return False

    def test_admin_verify(self):
        """Test admin verification with Basic Auth"""
        try:
            # Test with correct credentials
            auth = ('connectflareonix@gmail.com', 'Flareonix@admin02')
            response = requests.get(f"{self.api_url}/admin/verify", auth=auth, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Success: {data.get('success', False)}"
            self.log_test("Admin Verify (Valid Credentials)", success, details)
            return success, auth
        except Exception as e:
            self.log_test("Admin Verify (Valid Credentials)", False, str(e))
            return False, None

    def test_admin_verify_invalid(self):
        """Test admin verification with invalid credentials"""
        try:
            # Test with wrong credentials
            auth = ('wrong@email.com', 'wrongpassword')
            response = requests.get(f"{self.api_url}/admin/verify", auth=auth, timeout=10)
            success = response.status_code == 401  # Unauthorized expected
            details = f"Status: {response.status_code} (Expected 401 for invalid credentials)"
            self.log_test("Admin Verify (Invalid Credentials)", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Verify (Invalid Credentials)", False, str(e))
            return False

    def test_contact_form(self):
        """Test contact form submission"""
        try:
            timestamp = datetime.now().strftime("%H%M%S")
            contact_data = {
                "name": f"Test User {timestamp}",
                "email": f"test{timestamp}@example.com",
                "subject": "Test Subject",
                "message": "This is a test message from automated testing."
            }
            
            response = requests.post(f"{self.api_url}/contact", json=contact_data, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message ID: {data.get('id', 'No ID')}"
            self.log_test("Contact Form Submission", success, details)
            return success
        except Exception as e:
            self.log_test("Contact Form Submission", False, str(e))
            return False

    def test_reviews_approved(self):
        """Test get approved reviews endpoint"""
        try:
            response = requests.get(f"{self.api_url}/reviews/approved", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Reviews count: {len(data)}"
            self.log_test("Get Approved Reviews", success, details)
            return success
        except Exception as e:
            self.log_test("Get Approved Reviews", False, str(e))
            return False

    def test_analytics_pageview(self):
        """Test analytics pageview tracking"""
        try:
            analytics_data = {
                "page": "/test-page",
                "referrer": "https://google.com",
                "session_id": f"test_session_{datetime.now().strftime('%H%M%S')}"
            }
            
            response = requests.post(f"{self.api_url}/analytics/pageview", json=analytics_data, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Success: {data.get('success', False)}"
            self.log_test("Analytics Pageview Tracking", success, details)
            return success
        except Exception as e:
            self.log_test("Analytics Pageview Tracking", False, str(e))
            return False

    def test_case_studies(self):
        """Test case studies endpoint"""
        try:
            response = requests.get(f"{self.api_url}/case-studies", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Case studies count: {len(data)}"
            self.log_test("Get Case Studies", success, details)
            return success
        except Exception as e:
            self.log_test("Get Case Studies", False, str(e))
            return False

    # ==================== EVENTS API TESTS ====================

    def test_events_list(self):
        """Test GET /api/events - public events list"""
        try:
            response = requests.get(f"{self.api_url}/events", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Events count: {len(data)}"
                
                # Check if seeded FFT #001 event exists
                fft_event = None
                for event in data:
                    if "FFT #001" in event.get("title", ""):
                        fft_event = event
                        break
                
                if fft_event:
                    details += ", FFT #001 found"
                    # Verify required fields
                    required_fields = ["id", "title", "date", "venue", "theme", "description", 
                                     "highlights", "registration_link", "status", "comment_count"]
                    missing_fields = [f for f in required_fields if f not in fft_event]
                    
                    if missing_fields:
                        success = False
                        details += f", Missing fields: {missing_fields}"
                    else:
                        # Verify specific values for FFT #001
                        if fft_event.get("status") != "upcoming":
                            details += f", Warning: status is '{fft_event.get('status')}' (expected 'upcoming')"
                        if fft_event.get("venue") != "Delhi NCR":
                            details += f", Warning: venue is '{fft_event.get('venue')}' (expected 'Delhi NCR')"
                        if fft_event.get("theme") != "Pay Your Own Bill":
                            details += f", Warning: theme is '{fft_event.get('theme')}' (expected 'Pay Your Own Bill')"
                        if fft_event.get("registration_link") != "https://nvl5h9qum1.zite.so":
                            details += f", Warning: registration_link mismatch"
                        
                        # Store event ID for later tests
                        self.fft_event_id = fft_event.get("id")
                        details += f", Event ID: {self.fft_event_id}"
                else:
                    success = False
                    details += ", FFT #001 NOT FOUND"
            
            self.log_test("GET /api/events (list)", success, details)
            return success, getattr(self, 'fft_event_id', None)
        except Exception as e:
            self.log_test("GET /api/events (list)", False, str(e))
            return False, None

    def test_events_detail(self, event_id):
        """Test GET /api/events/{id} - event detail"""
        if not event_id:
            self.log_test("GET /api/events/{id} (detail)", False, "No event ID from previous test")
            return False
        
        try:
            response = requests.get(f"{self.api_url}/events/{event_id}", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                event = response.json()
                details += f", Title: {event.get('title', 'N/A')}"
                
                # Verify all required fields are present
                required_fields = ["id", "title", "date", "venue", "theme", "description", 
                                 "highlights", "registration_link", "status"]
                missing_fields = [f for f in required_fields if f not in event]
                
                if missing_fields:
                    success = False
                    details += f", Missing fields: {missing_fields}"
            
            self.log_test("GET /api/events/{id} (detail)", success, details)
            return success
        except Exception as e:
            self.log_test("GET /api/events/{id} (detail)", False, str(e))
            return False

    def test_events_detail_404(self):
        """Test GET /api/events/{id} with nonexistent ID - should return 404"""
        try:
            response = requests.get(f"{self.api_url}/events/nonexistent-id-12345", timeout=10)
            success = response.status_code == 404
            details = f"Status: {response.status_code} (Expected 404)"
            
            self.log_test("GET /api/events/nonexistent-id (404)", success, details)
            return success
        except Exception as e:
            self.log_test("GET /api/events/nonexistent-id (404)", False, str(e))
            return False

    def test_events_comments_list(self, event_id):
        """Test GET /api/events/{id}/comments - public, should return array"""
        if not event_id:
            self.log_test("GET /api/events/{id}/comments", False, "No event ID from previous test")
            return False
        
        try:
            response = requests.get(f"{self.api_url}/events/{event_id}/comments", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                comments = response.json()
                if isinstance(comments, list):
                    details += f", Comments count: {len(comments)}"
                else:
                    success = False
                    details += ", Response is not an array"
            
            self.log_test("GET /api/events/{id}/comments", success, details)
            return success
        except Exception as e:
            self.log_test("GET /api/events/{id}/comments", False, str(e))
            return False

    def test_events_comments_post_unauthorized(self, event_id):
        """Test POST /api/events/{id}/comments without auth - should return 401"""
        if not event_id:
            self.log_test("POST /api/events/{id}/comments (401)", False, "No event ID from previous test")
            return False
        
        try:
            comment_data = {
                "content": "This is a test comment without authentication"
            }
            response = requests.post(f"{self.api_url}/events/{event_id}/comments", 
                                   json=comment_data, timeout=10)
            success = response.status_code == 401
            details = f"Status: {response.status_code} (Expected 401 for unauthenticated request)"
            
            self.log_test("POST /api/events/{id}/comments (401 without auth)", success, details)
            return success
        except Exception as e:
            self.log_test("POST /api/events/{id}/comments (401 without auth)", False, str(e))
            return False

    def test_admin_events_list(self, auth):
        """Test GET /api/admin/events - requires auth"""
        if not auth:
            self.log_test("GET /api/admin/events", False, "No auth credentials")
            return False
        
        try:
            response = requests.get(f"{self.api_url}/admin/events", auth=auth, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                events = response.json()
                details += f", Events count: {len(events)}"
            
            self.log_test("GET /api/admin/events (with auth)", success, details)
            return success
        except Exception as e:
            self.log_test("GET /api/admin/events (with auth)", False, str(e))
            return False

    def test_admin_events_list_unauthorized(self):
        """Test GET /api/admin/events without auth - should return 401"""
        try:
            response = requests.get(f"{self.api_url}/admin/events", timeout=10)
            success = response.status_code == 401
            details = f"Status: {response.status_code} (Expected 401)"
            
            self.log_test("GET /api/admin/events (401 without auth)", success, details)
            return success
        except Exception as e:
            self.log_test("GET /api/admin/events (401 without auth)", False, str(e))
            return False

    def test_admin_events_create(self, auth):
        """Test POST /api/admin/events - create new event"""
        if not auth:
            self.log_test("POST /api/admin/events", False, "No auth credentials")
            return False, None
        
        try:
            timestamp = datetime.now().strftime("%H%M%S")
            event_data = {
                "title": f"Test Event QA {timestamp}",
                "date": "Sept 2025",
                "venue": "Test City",
                "theme": "Testing",
                "description": "A test event created by automated testing",
                "highlights": ["h1", "h2"],
                "guests": ["Speaker A"],
                "registration_link": "https://example.com",
                "registration_button_text": "Register",
                "status": "upcoming",
                "display_order": 5
            }
            
            response = requests.post(f"{self.api_url}/admin/events", 
                                   json=event_data, auth=auth, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            event_id = None
            if success:
                event = response.json()
                event_id = event.get("id")
                if event_id:
                    details += f", Created event ID: {event_id}"
                    self.created_event_id = event_id
                else:
                    success = False
                    details += ", No ID in response"
            
            self.log_test("POST /api/admin/events (create)", success, details)
            return success, event_id
        except Exception as e:
            self.log_test("POST /api/admin/events (create)", False, str(e))
            return False, None

    def test_admin_events_update(self, auth, event_id):
        """Test PUT /api/admin/events/{id} - update event"""
        if not auth:
            self.log_test("PUT /api/admin/events/{id}", False, "No auth credentials")
            return False
        
        if not event_id:
            self.log_test("PUT /api/admin/events/{id}", False, "No event ID from previous test")
            return False
        
        try:
            update_data = {
                "title": "Test Event QA (Updated)",
                "date": "Sept 2025",
                "venue": "Test City",
                "theme": "Testing",
                "description": "Updated test event",
                "highlights": ["h1", "h2"],
                "guests": ["Speaker A"],
                "registration_link": "https://example.com",
                "registration_button_text": "Register",
                "status": "ongoing",  # Changed from upcoming to ongoing
                "display_order": 5
            }
            
            response = requests.put(f"{self.api_url}/admin/events/{event_id}", 
                                  json=update_data, auth=auth, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                event = response.json()
                if event.get("status") == "ongoing":
                    details += ", Status updated to 'ongoing'"
                else:
                    success = False
                    details += f", Status not updated (got '{event.get('status')}')"
            
            self.log_test("PUT /api/admin/events/{id} (update)", success, details)
            return success
        except Exception as e:
            self.log_test("PUT /api/admin/events/{id} (update)", False, str(e))
            return False

    def test_admin_events_comments_list(self, auth, event_id):
        """Test GET /api/admin/events/{id}/comments"""
        if not auth:
            self.log_test("GET /api/admin/events/{id}/comments", False, "No auth credentials")
            return False
        
        if not event_id:
            self.log_test("GET /api/admin/events/{id}/comments", False, "No event ID")
            return False
        
        try:
            response = requests.get(f"{self.api_url}/admin/events/{event_id}/comments", 
                                  auth=auth, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                comments = response.json()
                if isinstance(comments, list):
                    details += f", Comments count: {len(comments)}"
                else:
                    success = False
                    details += ", Response is not an array"
            
            self.log_test("GET /api/admin/events/{id}/comments", success, details)
            return success
        except Exception as e:
            self.log_test("GET /api/admin/events/{id}/comments", False, str(e))
            return False

    def test_admin_events_comment_delete(self, auth):
        """Test DELETE /api/admin/events/comments/{cid}"""
        if not auth:
            self.log_test("DELETE /api/admin/events/comments/{cid}", False, "No auth credentials")
            return False
        
        try:
            # Test with fake comment ID (should return success:true without error)
            fake_comment_id = "fake-comment-id-12345"
            response = requests.delete(f"{self.api_url}/admin/events/comments/{fake_comment_id}", 
                                     auth=auth, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                result = response.json()
                if result.get("success") == True:
                    details += ", Returned success:true"
                else:
                    details += f", Unexpected response: {result}"
            
            self.log_test("DELETE /api/admin/events/comments/{cid}", success, details)
            return success
        except Exception as e:
            self.log_test("DELETE /api/admin/events/comments/{cid}", False, str(e))
            return False

    def test_admin_events_delete(self, auth, event_id):
        """Test DELETE /api/admin/events/{id} - delete test event"""
        if not auth:
            self.log_test("DELETE /api/admin/events/{id}", False, "No auth credentials")
            return False
        
        if not event_id:
            self.log_test("DELETE /api/admin/events/{id}", False, "No event ID from previous test")
            return False
        
        try:
            response = requests.delete(f"{self.api_url}/admin/events/{event_id}", 
                                     auth=auth, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                result = response.json()
                if result.get("success") == True:
                    details += ", Event deleted successfully"
                    
                    # Verify event no longer appears in public list
                    verify_response = requests.get(f"{self.api_url}/events", timeout=10)
                    if verify_response.status_code == 200:
                        events = verify_response.json()
                        event_still_exists = any(e.get("id") == event_id for e in events)
                        if event_still_exists:
                            success = False
                            details += ", ERROR: Event still appears in list"
                        else:
                            details += ", Verified: Event removed from list"
                else:
                    success = False
                    details += f", Unexpected response: {result}"
            
            self.log_test("DELETE /api/admin/events/{id} (delete)", success, details)
            return success
        except Exception as e:
            self.log_test("DELETE /api/admin/events/{id} (delete)", False, str(e))
            return False

    def test_fft_event_still_exists(self, fft_event_id):
        """Verify FFT #001 event still exists after all tests"""
        if not fft_event_id:
            self.log_test("Verify FFT #001 still exists", False, "No FFT event ID")
            return False
        
        try:
            response = requests.get(f"{self.api_url}/events/{fft_event_id}", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                event = response.json()
                if "FFT #001" in event.get("title", ""):
                    details += ", FFT #001 intact"
                else:
                    success = False
                    details += ", FFT #001 title changed or missing"
            else:
                details += ", FFT #001 NOT FOUND"
            
            self.log_test("Verify FFT #001 still exists", success, details)
            return success
        except Exception as e:
            self.log_test("Verify FFT #001 still exists", False, str(e))
            return False

    def test_admin_dashboard(self, auth):
        """Test admin dashboard endpoint"""
        if not auth:
            self.log_test("Admin Dashboard", False, "No auth credentials from previous test")
            return False
            
        try:
            response = requests.get(f"{self.api_url}/admin/dashboard", auth=auth, timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                stats = data.get('stats', {})
                details += f", Total users: {stats.get('total_users', 0)}"
            self.log_test("Admin Dashboard", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Dashboard", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Flareonix Backend API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 50)

        # Test API availability
        if not self.test_api_root():
            print("❌ API is not accessible. Stopping tests.")
            return self.get_summary()

        # Test community endpoints
        self.test_community_count()
        self.test_community_signup_validation()
        success, test_email = self.test_community_signup_success()
        if success and test_email:
            self.test_duplicate_email_signup(test_email)

        # Test admin endpoints
        admin_success, admin_auth = self.test_admin_verify()
        self.test_admin_verify_invalid()
        if admin_success and admin_auth:
            self.test_admin_dashboard(admin_auth)

        # Test other endpoints
        self.test_contact_form()
        self.test_reviews_approved()
        self.test_analytics_pageview()
        self.test_case_studies()

        # ==================== EVENTS API TESTS ====================
        print("\n" + "=" * 50)
        print("🎉 Testing Events API Endpoints")
        print("=" * 50)
        
        # Public events endpoints
        events_success, fft_event_id = self.test_events_list()
        if fft_event_id:
            self.test_events_detail(fft_event_id)
            self.test_events_comments_list(fft_event_id)
            self.test_events_comments_post_unauthorized(fft_event_id)
        
        self.test_events_detail_404()
        
        # Admin events endpoints
        if admin_success and admin_auth:
            self.test_admin_events_list_unauthorized()
            self.test_admin_events_list(admin_auth)
            
            # Create, update, and delete test event
            create_success, test_event_id = self.test_admin_events_create(admin_auth)
            if create_success and test_event_id:
                self.test_admin_events_update(admin_auth, test_event_id)
                self.test_admin_events_comments_list(admin_auth, test_event_id)
                self.test_admin_events_delete(admin_auth, test_event_id)
            
            self.test_admin_events_comment_delete(admin_auth)
        
        # Verify FFT #001 still exists
        if fft_event_id:
            self.test_fft_event_still_exists(fft_event_id)

        return self.get_summary()

    def get_summary(self):
        """Get test summary"""
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
        else:
            print("⚠️  Some tests failed. Check the details above.")
        
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "success_rate": (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0,
            "results": self.test_results
        }

def main():
    tester = FlareonixAPITester()
    summary = tester.run_all_tests()
    
    # Save results to file
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    return 0 if summary["passed_tests"] == summary["total_tests"] else 1

if __name__ == "__main__":
    sys.exit(main())
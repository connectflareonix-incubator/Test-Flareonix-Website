import requests
import sys
import json
from datetime import datetime

class FlareonixAPITester:
    def __init__(self, base_url="https://flareonix-rise.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

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
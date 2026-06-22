"""3Tattava backend API regression tests."""
import os
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "https://website-remake-5.preview.emergentagent.com").rstrip("/")
API = f"{BASE}/api"
ADMIN_TOKEN = "3tattava-admin-2026"


@pytest.fixture(scope="session")
def s():
    return requests.Session()


# ---------- Products ----------
class TestProducts:
    def test_list_products(self, s):
        r = s.get(f"{API}/products", timeout=30)
        assert r.status_code == 200
        data = r.json()
        slugs = {p["slug"] for p in data}
        assert {"rockresin", "shahjeet-sticks", "starter-kit", "shahjeet-subscription"}.issubset(slugs)
        assert len(data) >= 4

    def test_get_rockresin(self, s):
        r = s.get(f"{API}/products/rockresin", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["slug"] == "rockresin"
        assert d["name"] == "RockResin"
        assert len(d["benefits"]) >= 5
        assert len(d["faqs"]) >= 3

    def test_get_shahjeet(self, s):
        r = s.get(f"{API}/products/shahjeet-sticks", timeout=30)
        assert r.status_code == 200
        assert r.json()["slug"] == "shahjeet-sticks"

    def test_get_unknown_product_404(self, s):
        r = s.get(f"{API}/products/no-such-product", timeout=30)
        assert r.status_code == 404


# ---------- Doctors ----------
class TestDoctors:
    def test_list_doctors(self, s):
        r = s.get(f"{API}/doctors", timeout=30)
        assert r.status_code == 200
        slugs = {d["slug"] for d in r.json()}
        assert {"dr-kashish-gupta", "dr-falguni-chauhan"}.issubset(slugs)

    def test_book_doctor(self, s):
        payload = {
            "name": "TEST_Booker",
            "email": "test_booker@example.com",
            "phone": "+919999999999",
            "doctor_slug": "dr-kashish-gupta",
            "preferred_date": "2026-02-01",
            "concern": "Energy and recovery",
        }
        r = s.post(f"{API}/doctors/book", json=payload, timeout=30)
        assert r.status_code == 200
        body = r.json()
        assert body["ok"] is True
        assert "booking_id" in body


# ---------- Knowledge ----------
class TestKnowledge:
    def test_list_articles(self, s):
        r = s.get(f"{API}/knowledge", timeout=30)
        assert r.status_code == 200
        assert len(r.json()) >= 6

    def test_article_detail(self, s):
        r = s.get(f"{API}/knowledge/what-is-performance-ayurveda", timeout=30)
        assert r.status_code == 200
        assert r.json()["slug"] == "what-is-performance-ayurveda"


# ---------- Locations ----------
class TestLocations:
    def test_list_locations(self, s):
        r = s.get(f"{API}/locations", timeout=30)
        assert r.status_code == 200
        assert len(r.json()) >= 29


# ---------- Newsletter ----------
class TestNewsletter:
    def test_newsletter_signup(self, s):
        email = f"test_news_{os.urandom(4).hex()}@example.com"
        r = s.post(f"{API}/newsletter", json={"email": email}, timeout=30)
        assert r.status_code == 200
        assert r.json().get("ok") is True
        # dupe
        r2 = s.post(f"{API}/newsletter", json={"email": email}, timeout=30)
        assert r2.status_code == 200
        assert r2.json().get("duplicate") is True


# ---------- Assessment ----------
class TestAssessment:
    def test_submit_assessment(self, s):
        payload = {
            "name": "TEST_Assess",
            "email": "test_assess@example.com",
            "answers": {"energy": 4, "sleep": 4, "recovery": 4, "stress": 2},
        }
        r = s.post(f"{API}/assessment", json=payload, timeout=30)
        assert r.status_code == 200
        result = r.json()["result"]
        assert "score" in result and 0 <= result["score"] <= 100
        assert result["stage"] in ["Foundation", "Momentum", "Performance"]
        assert result["recommended_product"] in ["Shahjeet Sticks", "RockResin"]


# ---------- Dosha quiz ----------
class TestDoshaQuiz:
    def test_dosha(self, s):
        payload = {
            "name": "TEST_Dosha",
            "email": "test_dosha@example.com",
            "answers": {"q1": "vata", "q2": "vata", "q3": "pitta", "q4": "vata"},
        }
        r = s.post(f"{API}/dosha-quiz", json=payload, timeout=30)
        assert r.status_code == 200
        result = r.json()["result"]
        assert result["dominant"] == "vata"
        assert result["counts"]["vata"] == 3


# ---------- Orders ----------
class TestOrders:
    def test_create_and_fetch_order(self, s):
        payload = {
            "customer_name": "TEST_Order",
            "email": "test_order@example.com",
            "phone": "+919999999999",
            "address": "123 Test Lane",
            "city": "Delhi",
            "state": "DL",
            "pincode": "110001",
            "items": [
                {
                    "product_id": "p1",
                    "slug": "rockresin",
                    "name": "RockResin",
                    "price": 1299,
                    "qty": 2,
                    "image": "https://x.test/img.jpg",
                }
            ],
        }
        r = s.post(f"{API}/orders", json=payload, timeout=30)
        assert r.status_code == 200
        body = r.json()
        order_id = body["order_id"]
        assert body["total"] == 1299 * 2
        # GET back
        r2 = s.get(f"{API}/orders/{order_id}", timeout=30)
        assert r2.status_code == 200
        o = r2.json()
        assert o["id"] == order_id
        assert o["customer_name"] == "TEST_Order"
        assert o["status"] == "confirmed"


# ---------- Admin auth ----------
class TestAdmin:
    def test_admin_verify_no_token(self, s):
        r = s.post(f"{API}/admin/verify", timeout=30)
        assert r.status_code == 401

    def test_admin_verify_bad_token(self, s):
        r = s.post(f"{API}/admin/verify", headers={"Authorization": "Bearer wrong"}, timeout=30)
        assert r.status_code == 403

    def test_admin_verify_ok(self, s):
        r = s.post(f"{API}/admin/verify", headers={"Authorization": f"Bearer {ADMIN_TOKEN}"}, timeout=30)
        assert r.status_code == 200

    def test_admin_stats(self, s):
        r = s.get(f"{API}/admin/stats", headers={"Authorization": f"Bearer {ADMIN_TOKEN}"}, timeout=30)
        assert r.status_code == 200
        d = r.json()
        for k in ["products", "orders", "newsletter", "leads", "assessments", "bookings", "contacts"]:
            assert k in d

    def test_admin_lists(self, s):
        for ep in ["orders", "leads", "newsletter", "bookings"]:
            r = s.get(f"{API}/admin/{ep}", headers={"Authorization": f"Bearer {ADMIN_TOKEN}"}, timeout=30)
            assert r.status_code == 200, f"/admin/{ep} -> {r.status_code}"
            assert isinstance(r.json(), list)

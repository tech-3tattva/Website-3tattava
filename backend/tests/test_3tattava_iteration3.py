"""Iteration 3 tests — Razorpay placeholder, cart abandonment, n8n fire-and-forget,
regulatory product field, webhook signature endpoint."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://website-remake-5.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_TOKEN = "3tattava-admin-2026"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ---------- Product seed / regulatory ----------
class TestProductSeedRegulatory:
    def test_products_list_has_four(self, s):
        r = s.get(f"{API}/products")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        slugs = {p["slug"] for p in data}
        assert {"rockresin", "shahjeet-sticks", "starter-kit", "shahjeet-subscription"}.issubset(slugs)

    def test_rockresin_regulatory(self, s):
        r = s.get(f"{API}/products/rockresin")
        assert r.status_code == 200
        p = r.json()
        assert p.get("regulatory"), "RockResin missing regulatory field"
        reg = p["regulatory"]
        assert reg.get("mfg_lic") == "RJ-926Ayu E"
        for key in ("manufacturer", "marketer", "care_email", "care_phone", "disclaimer"):
            assert reg.get(key), f"regulatory.{key} missing"
        # Image is CloudFront
        assert "media.3tattava.com" in p["image"]
        # Dosage spec
        specs = {sp["label"]: sp["value"] for sp in p.get("specs", [])}
        assert "300" in specs.get("Dosage", "")

    def test_shahjeet_regulatory_and_specs(self, s):
        r = s.get(f"{API}/products/shahjeet-sticks")
        assert r.status_code == 200
        p = r.json()
        assert p.get("regulatory", {}).get("mfg_lic") == "RJ-926Ayu E"
        specs = {sp["label"]: sp["value"] for sp in p.get("specs", [])}
        assert "600" in specs.get("Shilajit per Stick", "")
        assert "7.4" in specs.get("Madhu per Stick", "")
        assert "media.3tattava.com" in p["image"]


# ---------- Razorpay placeholder flow ----------
class TestRazorpayPlaceholder:
    @pytest.fixture(scope="class")
    def order_payload(self):
        return {
            "customer_name": "TEST_RZP User",
            "email": f"test-rzp-{uuid.uuid4().hex[:6]}@example.com",
            "phone": "9810012345",
            "address": "123 Test Lane",
            "city": "Delhi",
            "state": "Delhi",
            "pincode": "110001",
            "items": [{
                "product_id": "p1",
                "slug": "rockresin",
                "name": "RockResin",
                "price": 1299,
                "qty": 1,
                "image": "https://media.3tattava.com/products/Rockresin-hero.jpeg",
            }],
            "notes": "iteration3 test",
        }

    def test_create_rzp_order_mock(self, s, order_payload, request):
        r = s.post(f"{API}/payments/razorpay/order", json=order_payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert data.get("mock") is True
        assert data["rzp_order_id"].startswith("order_mock_")
        assert data["total"] == 1299  # subtotal>=999 -> shipping 0
        assert data["amount"] == 1299 * 100
        assert data["key_id"].endswith("placeholder")
        request.config._rzp_internal_id = data["order_id"]
        request.config._rzp_order_id = data["rzp_order_id"]
        request.config._rzp_email = order_payload["email"]

    def test_verify_with_mock_signature_success(self, s, request):
        internal = request.config._rzp_internal_id
        rzp_id = request.config._rzp_order_id
        r = s.post(f"{API}/payments/razorpay/verify", json={
            "order_id": internal,
            "rzp_order_id": rzp_id,
            "rzp_payment_id": "pay_mock_123",
            "rzp_signature": "mock-ok",
        })
        assert r.status_code == 200
        data = r.json()
        assert data["ok"] is True
        assert data["status"] == "paid"

        # GET order — verify persisted status==paid
        g = s.get(f"{API}/orders/{internal}")
        assert g.status_code == 200
        assert g.json()["status"] == "paid"

    def test_verify_with_bad_signature_fails(self, s, order_payload):
        # Create another order first
        r = s.post(f"{API}/payments/razorpay/order", json=order_payload)
        internal = r.json()["order_id"]
        rzp_id = r.json()["rzp_order_id"]
        v = s.post(f"{API}/payments/razorpay/verify", json={
            "order_id": internal,
            "rzp_order_id": rzp_id,
            "rzp_payment_id": "pay_mock_bad",
            "rzp_signature": "definitely-not-mock-ok",
        })
        assert v.status_code == 200
        d = v.json()
        assert d["ok"] is False
        assert d["status"] == "payment_failed"

    def test_webhook_invalid_signature_400(self, s):
        # Note: webhook is mounted directly on app (still under /api prefix)
        r = s.post(
            f"{API}/payments/razorpay/webhook",
            data=b'{"event":"payment.captured"}',
            headers={"X-Razorpay-Signature": "invalid", "Content-Type": "application/json"},
        )
        assert r.status_code == 400


# ---------- COD legacy flow still works ----------
class TestCODOrder:
    def test_create_cod_order(self, s):
        payload = {
            "customer_name": "TEST_COD",
            "email": "test-cod@example.com",
            "phone": "9810012345",
            "address": "1 COD Lane",
            "city": "Delhi", "state": "Delhi", "pincode": "110001",
            "items": [{"product_id": "p1", "slug": "shahjeet-sticks", "name": "Shahjeet",
                       "price": 999, "qty": 1, "image": "x"}],
        }
        r = s.post(f"{API}/orders", json=payload)
        assert r.status_code == 200
        d = r.json()
        assert d["ok"] is True
        assert d["total"] == 999
        # GET order verifies persistence
        g = s.get(f"{API}/orders/{d['order_id']}")
        assert g.status_code == 200
        assert g.json()["customer_name"] == "TEST_COD"


# ---------- Cart abandonment ----------
class TestCartAbandoned:
    def test_create_abandoned(self, s):
        email = f"abandon-{uuid.uuid4().hex[:6]}@example.com"
        payload = {
            "name": "TEST_Abandon",
            "email": email,
            "items": [{"product_id": "p1", "slug": "rockresin", "name": "RockResin",
                       "price": 1299, "qty": 1, "image": "x"}],
            "subtotal": 1299,
        }
        r = s.post(f"{API}/cart/abandoned", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert not data.get("duplicate")

        # Second call same email same day → duplicate
        r2 = s.post(f"{API}/cart/abandoned", json=payload)
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["ok"] is True
        assert d2.get("duplicate") is True

    def test_admin_cart_recovery_listing(self, s):
        r = s.get(f"{API}/admin/cart-recovery",
                  headers={"Authorization": f"Bearer {ADMIN_TOKEN}"})
        assert r.status_code == 200
        rows = r.json()
        assert isinstance(rows, list)
        assert any(row.get("name") == "TEST_Abandon" for row in rows)

    def test_admin_cart_recovery_unauthorized(self, s):
        r = s.get(f"{API}/admin/cart-recovery")
        assert r.status_code == 401


# ---------- n8n fire-and-forget (endpoints must still succeed) ----------
class TestN8nFireAndForget:
    """Even if N8N is unreachable, none of these should fail."""
    def test_newsletter_ok(self, s):
        r = s.post(f"{API}/newsletter",
                   json={"email": f"n8n-news-{uuid.uuid4().hex[:6]}@example.com", "source": "iter3"})
        assert r.status_code == 200
        assert r.json()["ok"] is True

    def test_assessment_ok(self, s):
        r = s.post(f"{API}/assessment", json={
            "name": "TEST_Assess", "email": f"n8n-a-{uuid.uuid4().hex[:6]}@example.com",
            "answers": {"energy": 4, "sleep": 4, "recovery": 4, "stress": 2}
        })
        assert r.status_code == 200
        assert r.json()["ok"] is True
        assert "result" in r.json()

    def test_doctor_booking_ok(self, s):
        r = s.post(f"{API}/doctors/book", json={
            "name": "TEST_Book", "email": f"n8n-b-{uuid.uuid4().hex[:6]}@example.com",
            "phone": "9810012345", "doctor_slug": "dr-kashish-gupta",
            "preferred_date": "2026-02-01", "concern": "energy", "consultation_type": "free-starter"
        })
        assert r.status_code == 200
        assert r.json()["ok"] is True

    def test_order_create_ok(self, s):
        r = s.post(f"{API}/orders", json={
            "customer_name": "TEST_N8N", "email": "test@example.com",
            "phone": "9810012345", "address": "x", "city": "Delhi",
            "state": "Delhi", "pincode": "110001",
            "items": [{"product_id": "p1", "slug": "rockresin", "name": "RockResin",
                       "price": 1299, "qty": 1, "image": "x"}],
        })
        assert r.status_code == 200


# ---------- Regression smoke (iteration 1+2) ----------
class TestRegressionSmoke:
    def test_root(self, s):
        r = s.get(f"{API}/")
        assert r.status_code == 200

    def test_doctors_list(self, s):
        r = s.get(f"{API}/doctors")
        assert r.status_code == 200
        assert len(r.json()) >= 2

    def test_locations_29(self, s):
        r = s.get(f"{API}/locations")
        assert r.status_code == 200
        assert len(r.json()) == 29

    def test_knowledge(self, s):
        r = s.get(f"{API}/knowledge")
        assert r.status_code == 200
        assert len(r.json()) >= 6

    def test_admin_stats(self, s):
        r = s.get(f"{API}/admin/stats", headers={"Authorization": f"Bearer {ADMIN_TOKEN}"})
        assert r.status_code == 200
        assert "products" in r.json()

    def test_dosha_quiz(self, s):
        r = s.post(f"{API}/dosha-quiz", json={"answers": {"q1": "vata", "q2": "vata", "q3": "pitta"}})
        assert r.status_code == 200
        assert r.json()["result"]["dominant"] == "vata"

    def test_chat_stream_json_encoded(self, s):
        # Hit SSE endpoint, ensure data lines are JSON-encoded ({"t":"..."})
        with s.post(f"{API}/chat/stream",
                    json={"session_id": "test", "message": "hi", "history": []},
                    stream=True, timeout=30) as r:
            assert r.status_code == 200
            seen = False
            for raw in r.iter_lines(decode_unicode=True):
                if raw and raw.startswith("data: ") and "[DONE]" not in raw:
                    payload = raw[6:]
                    # Must be JSON containing 't' key
                    import json
                    obj = json.loads(payload)
                    assert "t" in obj
                    seen = True
                    break
            assert seen, "No JSON-encoded SSE data line received"

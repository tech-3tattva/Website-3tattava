"""Iteration 2 — admin product CRUD, admin assessments/contacts, chat SSE stream."""
import os
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE}/api"
ADMIN_TOKEN = "3tattava-admin-2026"
AUTH = {"Authorization": f"Bearer {ADMIN_TOKEN}"}


@pytest.fixture(scope="module")
def s():
    return requests.Session()


# ---------- Admin Product CRUD ----------
class TestAdminProductCRUD:
    SLUG = "test_iter2_temp_product"

    def test_create_requires_auth(self, s):
        r = s.post(f"{API}/admin/products", json={"slug": "x", "name": "x", "price": 1})
        assert r.status_code == 401

    def test_create_bad_token(self, s):
        r = s.post(f"{API}/admin/products", json={"slug": "x", "name": "x", "price": 1},
                   headers={"Authorization": "Bearer wrong"})
        assert r.status_code == 403

    def test_full_crud_roundtrip(self, s):
        # cleanup if leftover
        s.delete(f"{API}/admin/products/{self.SLUG}", headers=AUTH)

        # CREATE
        payload = {
            "slug": self.SLUG,
            "name": "TEST_Product",
            "tagline": "Temp tagline",
            "ritual_name": "TestRitual",
            "price": 555,
            "category": "Shilajit Resin",
            "short_desc": "short",
            "long_desc": "long",
            "benefits": ["b1", "b2"],
        }
        r = s.post(f"{API}/admin/products", json=payload, headers=AUTH)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["slug"] == self.SLUG
        assert body["name"] == "TEST_Product"
        assert body["price"] == 555
        assert "id" in body
        assert "_id" not in body  # never leak mongo id

        # Duplicate slug -> 400
        r_dupe = s.post(f"{API}/admin/products", json=payload, headers=AUTH)
        assert r_dupe.status_code == 400

        # GET public by slug to verify persistence
        rg = s.get(f"{API}/products/{self.SLUG}")
        assert rg.status_code == 200
        assert rg.json()["name"] == "TEST_Product"

        # UPDATE
        payload["name"] = "TEST_Product_Updated"
        payload["price"] = 777
        ru = s.put(f"{API}/admin/products/{self.SLUG}", json=payload, headers=AUTH)
        assert ru.status_code == 200
        assert ru.json()["name"] == "TEST_Product_Updated"
        assert ru.json()["price"] == 777

        # Verify update persisted
        rg2 = s.get(f"{API}/products/{self.SLUG}")
        assert rg2.json()["name"] == "TEST_Product_Updated"
        assert rg2.json()["price"] == 777

        # DELETE
        rd = s.delete(f"{API}/admin/products/{self.SLUG}", headers=AUTH)
        assert rd.status_code == 200
        assert rd.json().get("ok") is True

        # Verify gone
        rg3 = s.get(f"{API}/products/{self.SLUG}")
        assert rg3.status_code == 404

    def test_update_nonexistent_404(self, s):
        r = s.put(f"{API}/admin/products/does-not-exist-xyz",
                  json={"slug": "x", "name": "x", "price": 1}, headers=AUTH)
        assert r.status_code == 404

    def test_delete_nonexistent_404(self, s):
        r = s.delete(f"{API}/admin/products/does-not-exist-xyz", headers=AUTH)
        assert r.status_code == 404


# ---------- Admin assessments / contacts ----------
class TestAdminListings:
    def test_admin_assessments_requires_auth(self, s):
        r = s.get(f"{API}/admin/assessments")
        assert r.status_code == 401

    def test_admin_assessments_ok(self, s):
        # seed one
        s.post(f"{API}/assessment", json={
            "name": "TEST_AdminAssess", "email": "ta_iter2@example.com",
            "answers": {"energy": 3, "sleep": 3, "recovery": 3, "stress": 3},
        })
        r = s.get(f"{API}/admin/assessments", headers=AUTH)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # no _id leaks
        if data:
            assert "_id" not in data[0]

    def test_admin_contacts_requires_auth(self, s):
        r = s.get(f"{API}/admin/contacts")
        assert r.status_code == 401

    def test_admin_contacts_ok(self, s):
        s.post(f"{API}/contact", json={
            "name": "TEST_Contact", "email": "tc_iter2@example.com",
            "message": "Hello from iter2 test",
        })
        r = s.get(f"{API}/admin/contacts", headers=AUTH)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert any(c.get("email") == "tc_iter2@example.com" for c in data)


# ---------- Background email tasks do not break responses ----------
class TestEmailBackgroundTasks:
    def test_newsletter_still_returns_ok(self, s):
        email = f"test_news_iter2_{os.urandom(3).hex()}@example.com"
        r = s.post(f"{API}/newsletter", json={"email": email}, timeout=15)
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_order_creation_still_returns_full_payload(self, s):
        r = s.post(f"{API}/orders", json={
            "customer_name": "TEST_EmailOrder", "email": "te_iter2@example.com",
            "phone": "+919999999999", "address": "1 St", "city": "Delhi",
            "state": "DL", "pincode": "110001",
            "items": [{"product_id": "p1", "slug": "rockresin", "name": "RockResin",
                       "price": 1299, "qty": 1, "image": "https://x/y.jpg"}],
        }, timeout=20)
        assert r.status_code == 200
        b = r.json()
        assert b["ok"] is True
        for k in ["order_id", "subtotal", "shipping", "total"]:
            assert k in b
        assert b["subtotal"] == 1299
        assert b["total"] == b["subtotal"] + b["shipping"]

    def test_assessment_still_returns_result(self, s):
        r = s.post(f"{API}/assessment", json={
            "name": "TEST_EmailAssess", "email": "tea_iter2@example.com",
            "answers": {"energy": 4, "sleep": 4, "recovery": 4, "stress": 2},
        }, timeout=15)
        assert r.status_code == 200
        assert r.json()["result"]["score"] > 0

    def test_doctor_booking_still_returns_ok(self, s):
        r = s.post(f"{API}/doctors/book", json={
            "name": "TEST_EmailBook", "email": "teb_iter2@example.com",
            "phone": "+919999999999", "doctor_slug": "dr-kashish-gupta",
            "preferred_date": "2026-03-01", "concern": "stamina",
        }, timeout=15)
        assert r.status_code == 200
        assert r.json()["ok"] is True


# ---------- Chat SSE stream (real Claude haiku-4-5) ----------
class TestChatStream:
    def test_chat_stream_real_tokens(self, s):
        url = f"{API}/chat/stream"
        payload = {"session_id": "test-iter2-session", "message": "In one sentence, what is RockResin?", "history": []}
        with s.post(url, json=payload, stream=True, timeout=60) as r:
            assert r.status_code == 200
            ct = r.headers.get("content-type", "")
            assert "text/event-stream" in ct, f"got ct={ct}"
            tokens = []
            saw_done = False
            for raw in r.iter_lines(decode_unicode=True):
                if raw is None:
                    continue
                line = raw.strip()
                if not line:
                    continue
                if line.startswith("data:"):
                    chunk = line[5:].lstrip()
                    if chunk == "[DONE]":
                        saw_done = True
                        break
                    tokens.append(chunk)
                if len(tokens) > 200:
                    break
        joined = "".join(tokens).lower()
        assert len(joined) > 5, f"no tokens streamed; got {tokens!r}"
        # Should mention something on-brand
        assert any(k in joined for k in ["shilajit", "resin", "ayurveda", "3tattava", "ritual", "rockresin"]), \
            f"unexpected response: {joined[:200]}"
        # [DONE] is optional but commonly present
        # If not in stream we don't fail strictly

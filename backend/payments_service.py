"""Razorpay payments service."""
from __future__ import annotations
import logging
import os
from typing import Optional
import razorpay

log = logging.getLogger("3tattava.payments")

KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "rzp_test_placeholder")
KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "placeholder")
WEBHOOK_SECRET = os.environ.get("RAZORPAY_WEBHOOK_SECRET", "placeholder")

_client: Optional[razorpay.Client] = None


def get_client() -> Optional[razorpay.Client]:
    """Lazy client — returns None when running with placeholder keys."""
    global _client
    if KEY_ID.endswith("placeholder") or KEY_SECRET == "placeholder":
        return None
    if _client is None:
        _client = razorpay.Client(auth=(KEY_ID, KEY_SECRET))
    return _client


def create_razorpay_order(amount_inr: int, receipt: str, notes: dict | None = None) -> dict:
    """Returns dict with mocked fields if Razorpay is not configured."""
    client = get_client()
    if client is None:
        # Placeholder mode — return a mock structure so the UI flow can be exercised end-to-end
        return {
            "id": f"order_mock_{receipt[:18]}",
            "amount": amount_inr * 100,
            "currency": "INR",
            "receipt": receipt[:40],
            "status": "created",
            "mock": True,
        }
    try:
        return client.order.create({
            "amount": amount_inr * 100,
            "currency": "INR",
            "receipt": receipt[:40],
            "notes": notes or {},
        })
    except Exception as e:
        log.warning("Razorpay order create failed: %s", e)
        return {"error": str(e), "mock": True, "id": f"order_err_{receipt[:18]}"}


def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> bool:
    client = get_client()
    if client is None:
        # In placeholder mode, accept signature == "mock-ok"
        return signature == "mock-ok"
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
        })
        return True
    except Exception as e:
        log.warning("Razorpay signature verification failed: %s", e)
        return False


def verify_webhook_signature(body: bytes, signature: str) -> bool:
    client = get_client()
    if client is None or not signature:
        return False
    try:
        client.utility.verify_webhook_signature(body.decode("utf-8"), signature, WEBHOOK_SECRET)
        return True
    except Exception as e:
        log.warning("Razorpay webhook signature failed: %s", e)
        return False

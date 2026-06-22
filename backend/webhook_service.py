"""n8n CRM webhook + cart-abandonment email helpers."""
from __future__ import annotations
import logging
import os
from typing import Any, Dict
import httpx

log = logging.getLogger("3tattava.webhook")
N8N_URL = os.environ.get("N8N_LEAD_WEBHOOK_URL")


async def push_to_n8n(event: str, payload: Dict[str, Any]) -> None:
    """Fire-and-forget POST to n8n. Never raises."""
    if not N8N_URL:
        return
    try:
        async with httpx.AsyncClient(timeout=5.0) as cx:
            await cx.post(N8N_URL, json={"event": event, "payload": payload})
    except Exception as e:
        log.warning("n8n webhook failed (%s): %s", event, e)

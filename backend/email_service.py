"""AWS SES transactional email service for 3Tattava."""
from __future__ import annotations
import asyncio
import logging
import os
from typing import Optional
import boto3
from botocore.exceptions import ClientError

log = logging.getLogger("3tattava.email")

_AWS_REGION = os.environ.get("AWS_REGION", "ap-south-1")
_FROM_EMAIL = os.environ.get("AWS_SES_FROM_EMAIL", "orders@3tattava.com")
_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY_ID")
_SECRET_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")


def _get_client():
    if not _ACCESS_KEY or not _SECRET_KEY:
        return None
    return boto3.client(
        "ses",
        region_name=_AWS_REGION,
        aws_access_key_id=_ACCESS_KEY,
        aws_secret_access_key=_SECRET_KEY,
    )


def _send_sync(recipient: str, subject: str, html_body: str, text_body: Optional[str] = None) -> dict:
    client = _get_client()
    if client is None:
        log.warning("SES not configured — skipping email to %s", recipient)
        return {"skipped": True}
    body = {"Html": {"Data": html_body, "Charset": "UTF-8"}}
    if text_body:
        body["Text"] = {"Data": text_body, "Charset": "UTF-8"}
    try:
        return client.send_email(
            Source=_FROM_EMAIL,
            Destination={"ToAddresses": [recipient]},
            Message={"Subject": {"Data": subject, "Charset": "UTF-8"}, "Body": body},
        )
    except ClientError as e:
        log.warning("SES error for %s: %s", recipient, e.response.get("Error", {}).get("Message"))
        return {"error": str(e)}


async def send_email(recipient: str, subject: str, html_body: str, text_body: Optional[str] = None) -> dict:
    """Async wrapper — never raises, logs failures."""
    return await asyncio.to_thread(_send_sync, recipient, subject, html_body, text_body)


# ---------- Templates ----------
def _wrap(title: str, intro: str, content_html: str, cta_label: str = "EXPLORE 3TATTAVA", cta_link: str = "https://www.3tattava.com") -> str:
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>{title}</title></head>
<body style="margin:0;padding:0;background:#f7f0e2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1c1304;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f0e2;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ede4d0;">
        <tr><td style="background:#1c1304;padding:28px 32px;color:#f7f0e2;">
          <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#C8963E;">3TATTAVA · Performance Ayurveda</div>
          <div style="font-size:28px;font-weight:800;letter-spacing:-0.02em;margin-top:8px;">Balance. Build. Become.</div>
        </td></tr>
        <tr><td style="padding:40px 32px;">
          <h1 style="font-size:26px;line-height:1.15;margin:0 0 16px 0;letter-spacing:-0.01em;">{title}</h1>
          <p style="font-size:16px;line-height:1.6;color:#3a2d18;margin:0 0 20px 0;">{intro}</p>
          {content_html}
          <div style="margin-top:32px;">
            <a href="{cta_link}" style="display:inline-block;background:#C8963E;color:#1c1304;padding:14px 32px;text-decoration:none;font-size:11px;letter-spacing:0.18em;font-weight:600;text-transform:uppercase;">{cta_label}</a>
          </div>
        </td></tr>
        <tr><td style="background:#1c1304;color:#a89881;padding:20px 32px;font-size:11px;line-height:1.6;text-align:center;">
          SankalpaSiddhi Ayupharma Pvt. Ltd. · Made in India<br/>
          Doctor-Led · Lab-Tested · AYUSH GMP
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
""".strip()


def tpl_newsletter_welcome(email: str) -> tuple[str, str]:
    subject = "Welcome to the Performance Ayurveda Circle."
    intro = "Thank you for subscribing. You'll receive educational insights, performance tips and new research — never spam."
    content = (
        "<p style='font-size:14px;color:#3a2d18;line-height:1.7;'>What to expect:</p>"
        "<ul style='font-size:14px;color:#3a2d18;line-height:1.9;padding-left:18px;'>"
        "<li>Doctor-led articles on Shilajit, recovery and resilience</li>"
        "<li>Behind-the-scenes from the Himalayan source</li>"
        "<li>Early access to new rituals and lab reports</li>"
        "<li>Invitations to athlete and community sessions</li>"
        "</ul>"
    )
    return subject, _wrap("You're in the Circle.", intro, content, "TAKE THE ASSESSMENT", "https://www.3tattava.com/assessment")


def tpl_order_confirmation(order: dict) -> tuple[str, str]:
    subject = f"Order Confirmed · #{order['id'][:8].upper()}"
    items_html = "".join(
        f"<tr><td style='padding:10px 0;border-bottom:1px solid #ede4d0;font-size:14px;'>{i['name']} × {i['qty']}</td>"
        f"<td style='padding:10px 0;border-bottom:1px solid #ede4d0;text-align:right;font-size:14px;'>₹{(i['price']*i['qty']):,}</td></tr>"
        for i in order.get("items", [])
    )
    content = (
        f"<p style='font-size:14px;color:#3a2d18;line-height:1.7;'>Order <b>#{order['id'][:8].upper()}</b> · Cash on Delivery</p>"
        f"<table width='100%' cellpadding='0' cellspacing='0' style='margin-top:18px;'>{items_html}"
        f"<tr><td style='padding:14px 0;font-weight:700;'>Total</td><td style='padding:14px 0;text-align:right;font-weight:700;'>₹{order.get('total',0):,}</td></tr></table>"
        f"<p style='font-size:13px;color:#7a6f5a;margin-top:24px;'>Delivering to: {order.get('customer_name','')}, {order.get('address','')}, {order.get('city','')}, {order.get('state','')} {order.get('pincode','')}</p>"
    )
    return subject, _wrap("Your Ritual Begins.", "We're preparing your order. Pay on delivery — no advance.", content, "TRACK YOUR ORDER", f"https://www.3tattava.com/order-confirmation/{order['id']}")


def tpl_assessment_result(name: str, result: dict) -> tuple[str, str]:
    subject = f"Your Performance Score: {result['score']}/100"
    content = (
        f"<div style='background:#1c1304;color:#f7f0e2;padding:32px;text-align:center;margin:8px 0 24px 0;'>"
        f"<div style='font-size:12px;letter-spacing:0.28em;color:#C8963E;'>YOUR SCORE</div>"
        f"<div style='font-size:72px;font-weight:800;color:#E4C079;line-height:1;margin:12px 0 8px 0;'>{result['score']}</div>"
        f"<div style='font-size:11px;letter-spacing:0.28em;opacity:0.7;'>/ 100 · STAGE: {result['stage'].upper()}</div></div>"
        f"<p style='font-size:14px;color:#3a2d18;line-height:1.7;'>{result['summary']}</p>"
        f"<p style='font-size:14px;color:#3a2d18;line-height:1.7;margin-top:18px;'>Recommended starting ritual: <b style='color:#A67B2F;'>{result['recommended_product']}</b></p>"
    )
    return subject, _wrap(f"{name}, your Performance Score is in.", "We've reviewed your responses. Here's your starting point.", content, "BEGIN THE RITUAL", "https://www.3tattava.com/shop")


def tpl_booking_confirmation(name: str, doctor_name: str, date: str, booking_id: str) -> tuple[str, str]:
    subject = f"Consultation Confirmed · Dr. {doctor_name.split()[-1]}"
    content = (
        f"<p style='font-size:14px;color:#3a2d18;line-height:1.7;'><b>Doctor:</b> {doctor_name}<br/>"
        f"<b>Preferred date:</b> {date}<br/>"
        f"<b>Booking ID:</b> #{booking_id[:8].upper()}</p>"
        f"<p style='font-size:13px;color:#7a6f5a;margin-top:20px;'>Our team will reach out within 24 hours to confirm your slot via WhatsApp or phone.</p>"
    )
    return subject, _wrap(f"Hi {name}, your consultation is confirmed.", "Thank you for booking with VaidyaConnect.", content, "PREPARE FOR YOUR SESSION", "https://www.3tattava.com/vaidyaconnect")


def tpl_cart_abandonment(name: str, items, subtotal: int) -> tuple[str, str]:
    subject = "You left your ritual behind."
    rows = "".join(
        f"<tr><td style='padding:10px 0;border-bottom:1px solid #ede4d0;font-size:14px;'>{getattr(i, 'name', None) or (i.get('name') if isinstance(i, dict) else '')} × {getattr(i, 'qty', None) or (i.get('qty', 1) if isinstance(i, dict) else 1)}</td>"
        f"<td style='padding:10px 0;border-bottom:1px solid #ede4d0;text-align:right;font-size:14px;'>₹{(getattr(i, 'price', None) or (i.get('price', 0) if isinstance(i, dict) else 0))*(getattr(i, 'qty', None) or (i.get('qty', 1) if isinstance(i, dict) else 1)):,}</td></tr>"
        for i in (items or [])
    ) or "<tr><td style='padding:10px 0;font-size:14px;color:#7a6f5a;'>Your ritual basket</td></tr>"
    content = (
        f"<p style='font-size:14px;color:#3a2d18;line-height:1.7;'>{name}, your selection is still saved — and free shipping is yours above ₹999.</p>"
        f"<table width='100%' cellpadding='0' cellspacing='0' style='margin-top:18px;'>{rows}"
        f"<tr><td style='padding:14px 0;font-weight:700;'>Subtotal</td><td style='padding:14px 0;text-align:right;font-weight:700;'>₹{subtotal:,}</td></tr></table>"
        f"<p style='font-size:13px;color:#7a6f5a;margin-top:18px;'>Daily rituals are built one decision at a time. Come back when ready.</p>"
    )
    return subject, _wrap("Your ritual is waiting.", "We saved your cart. Resume in a single click.", content, "RESUME CHECKOUT", "https://www.3tattava.com/checkout")

"""3Tattava — Performance Ayurveda backend."""
from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends, Request
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import asyncio
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr, ConfigDict

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from email_service import (
    send_email,
    tpl_newsletter_welcome,
    tpl_order_confirmation,
    tpl_assessment_result,
    tpl_booking_confirmation,
    tpl_cart_abandonment,
)
from chat_service import chat_stream
from webhook_service import push_to_n8n
from payments_service import create_razorpay_order, verify_payment_signature, verify_webhook_signature, KEY_ID as RZP_KEY_ID

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "3tattava-admin-2026")

app = FastAPI(title="3Tattava API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("3tattava")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id() -> str:
    return str(uuid.uuid4())


def clean(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return doc
    doc.pop("_id", None)
    return doc


# ---------- Models ----------
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    slug: str
    name: str
    tagline: str
    ritual_name: str
    price: int
    compare_at: Optional[int] = None
    currency: str = "INR"
    category: str
    image: str
    gallery: List[str] = []
    short_desc: str
    long_desc: str
    benefits: List[str]
    ingredients: List[Dict[str, str]] = []
    how_to_use: List[Dict[str, str]] = []
    specs: List[Dict[str, str]] = []
    pillars: List[Dict[str, str]] = []
    faqs: List[Dict[str, str]] = []
    badges: List[str] = []
    accent_color: str = "#C8963E"
    in_stock: bool = True
    is_featured: bool = False
    regulatory: Optional[Dict[str, str]] = None


class NewsletterIn(BaseModel):
    email: EmailStr
    source: str = "footer"


class LeadIn(BaseModel):
    name: str
    email: EmailStr
    whatsapp: Optional[str] = None
    source: str = "homepage"
    payload: Dict[str, Any] = {}


class AssessmentIn(BaseModel):
    name: str
    email: EmailStr
    whatsapp: Optional[str] = None
    answers: Dict[str, Any]


class DoshaQuizIn(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    answers: Dict[str, Any]


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str
    phone: Optional[str] = None


class CartItem(BaseModel):
    product_id: str
    slug: str
    name: str
    price: int
    qty: int
    image: str


class OrderIn(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    state: str
    pincode: str
    items: List[CartItem]
    notes: Optional[str] = None


class DoctorBooking(BaseModel):
    name: str
    email: EmailStr
    phone: str
    doctor_slug: str
    preferred_date: str
    concern: str
    consultation_type: str = "paid"  # paid / free-starter


# ---------- Seed data ----------
PRODUCTS_SEED = [
    {
        "slug": "rockresin",
        "name": "RockResin",
        "tagline": "One Resin. Complete Vitality.",
        "ritual_name": "The Deep Ritual",
        "price": 1299,
        "compare_at": 1599,
        "category": "Shilajit Resin",
        "image": "https://media.3tattava.com/products/Rockresin-hero.jpeg",
        "gallery": [
            "https://media.3tattava.com/products/Rockresin-hero.jpeg",
            "https://media.3tattava.com/products/rockresin-float.jpeg",
            "https://media.3tattava.com/features/resin-mountain.png",
            "https://media.3tattava.com/features/resin-pulled.png",
        ],
        "short_desc": "RockResin® · Shodhit Shilajit Resin — Ancient Mineral Elixir For Modern Vitality. ENERGY · STRENGTH · LONGEVITY. \"रसायनं बल्यं जीवनाय\"",
        "long_desc": "Born of Altitude. Refined by Ayurveda. RockResin is 100% pure Shodhit Shilajit resin — Triphala-purified through classical Shodhana — preserving ≥70% natural fulvic acid and 80+ trace minerals. No capsules. No fillers. No artificial additives. Just Shilajit, exactly as nature intended. Revered in Ayurveda as a Rasayana for holistic vitality and systemic balance.",
        "benefits": [
            "Supports Energy, Strength & Recovery",
            "Supports Focus & Hormonal Balance",
            "Supports Bone Health & Healthy Aging",
            "≥70% Natural Fulvic Acid",
            "≥80 Trace Minerals",
            "NABL 3rd-Party Lab Tested",
            "Pure Resin · No Fillers · No Capsules",
        ],
        "ingredients": [
            {"name": "Shudh Shilajit (Asphaltum Punjabianum)", "benefit": "1000mg per 1g RockResin — Triphala-purified Shodhit Shilajit, classical Rasayana"},
        ],
        "how_to_use": [
            {"step": "01", "title": "Dip", "desc": "Dip the spatula to lift a pea-sized portion (300–500mg)."},
            {"step": "02", "title": "Hook", "desc": "The resin will stretch like honey — that's the authenticity test."},
            {"step": "03", "title": "Swirl", "desc": "Swirl into warm water or warm milk, post-meal. Once or twice daily."},
        ],
        "specs": [
            {"label": "Format", "value": "100% Pure Resin"},
            {"label": "Net Weight", "value": "20 g"},
            {"label": "Dosage", "value": "300–500mg (pea-sized) once or twice daily"},
            {"label": "Fulvic Acid", "value": "≥ 70%"},
            {"label": "Trace Minerals", "value": "≥ 80"},
            {"label": "Source Altitude", "value": "16,000+ ft (Himalayas)"},
            {"label": "Mfg. Lic. No.", "value": "RJ-926Ayu E"},
            {"label": "Type", "value": "Ayurvedic Proprietary Medicine"},
            {"label": "For", "value": "Men & Women · Adults"},
        ],
        "pillars": [
            {"title": "From the Roof of the World", "desc": "Himalayan Shilajit, sourced at 16,000+ ft."},
            {"title": "Ancient Wisdom, Uncompromised", "desc": "Classical Triphala Shodhana purification."},
            {"title": "Absorption You Can Feel", "desc": "Resin form — no capsule shell, no fillers."},
            {"title": "Nature's Complete Mineral Complex", "desc": "≥80 trace minerals · ≥70% fulvic acid."},
            {"title": "3rd Party Verified", "desc": "NABL-accredited Eurofins testing per batch."},
            {"title": "Govt-Certified Quality", "desc": "AYUSH GMP · US-FDA registered facility."},
            {"title": "Pure Resin · No Shortcuts", "desc": "100% resin. No capsules. No artificial anything."},
        ],
        "faqs": [
            {"q": "What is RockResin?", "a": "RockResin is 100% pure Shodhit Shilajit resin — Triphala-purified, NABL-tested, sourced from Himalayan deposits above 16,000 ft. Each 1g contains 1000mg of Shudh Shilajit (Asphaltum Punjabianum)."},
            {"q": "What's the recommended dosage?", "a": "300–500mg (pea-sized, one dip) once or twice daily. Take with warm water or milk post-meal. Pitta-dominant individuals: prefer a milk or ghee-based anupaan, or follow your Ayurvedic physician's guidance."},
            {"q": "Is it tested?", "a": "Yes — every batch is verified through NABL-accredited 3rd-party labs (Eurofins) for heavy metals, microbes, fulvic acid and identity. Scan the QR on pack for the report."},
            {"q": "Is it safe during pregnancy?", "a": "No — avoid during pregnancy and lactation. RockResin is for adult use only. Keep out of reach of children."},
            {"q": "Can people on chronic medication take it?", "a": "Consult your physician first if you have chronic conditions (diabetes, hypertension, kidney issues) or are on long-term medications."},
        ],
        "badges": ["NABL Tested", "AYUSH GMP", "Triphala Shodhit", "≥70% Fulvic Acid", "Pure Resin"],
        "accent_color": "#C9A84C",
        "is_featured": True,
        "regulatory": {
            "mfg_lic": "RJ-926Ayu E",
            "manufacturer": "URMI LIFESCIENCES LLP, A2/101 Site 5, UPSIDC Kasna, Greater Noida, UP, 201308. Unit at Facher, 312601, Rajasthan.",
            "marketer": "SankalpaSiddhi Ayupharma Pvt. Ltd., 690A/1, Kabool Nagar, Shahdara, Delhi - 110032",
            "care_email": "info@3tattava.com",
            "care_phone": "+91 95601 49956",
            "disclaimer": "This is an Ayurvedic Proprietary Medicine. Adult use only. Use as directed. Not for the diagnosis, treatment, cure, or prevention of disease. Avoid during pregnancy and lactation. Keep out of reach of children. Store in a cool, dry place, tightly closed, away from direct sunlight and moisture. Do not use if the safety seal is damaged or missing.",
        },
    },
    {
        "slug": "shahjeet-sticks",
        "name": "Shahjeet Sticks",
        "tagline": "Performance In Your Pocket.",
        "ritual_name": "The Fast Ritual",
        "price": 999,
        "compare_at": 1199,
        "category": "Honey Sticks",
        "image": "https://media.3tattava.com/products/shahjeet-box.png",
        "gallery": [
            "https://media.3tattava.com/products/shahjeet-box.png",
            "https://media.3tattava.com/features/shahjeet-sachet.png",
        ],
        "short_desc": "India's first Shilajit + Madhu honey stick. 600mg Shodhit Shilajit + 7.4g Madhu per stick. Tear · Squeeze · Perform.",
        "long_desc": "Shahjeet is engineered for the modern human in motion — the entrepreneur, the athlete, the parent, the traveller. Each portable single-serve stick combines 600mg of Triphala-purified Shilajit with 7.4g of traditional Madhu (honey) — the classical Yogavahi carrier that supports bioavailability. No measuring. No mixing. No spoons. Just consistency, on the go.",
        "benefits": [
            "600 mg Shodhit Shilajit per stick",
            "7.4 g Traditional Madhu (Yogavahi carrier)",
            "Single-serve · Travel-friendly",
            "No measuring · No mixing · No cleanup",
            "Doctor-formulated · BAMS reviewed",
            "NABL 3rd-Party Lab Tested",
            "Triphala-Shodhit",
        ],
        "ingredients": [
            {"name": "Shudh Shilajit (Asphaltum Punjabianum)", "benefit": "600mg per stick — Triphala-purified Shodhit form, classical Rasayana"},
            {"name": "Madhu (Honey)", "benefit": "7.4g per stick — Yogavahi carrier, traditional companion herb"},
        ],
        "how_to_use": [
            {"step": "01", "title": "Tear", "desc": "Tear the sachet open — anytime, anywhere. No jars. No spoons."},
            {"step": "02", "title": "Squeeze", "desc": "Squeeze the stick directly. No measuring required."},
            {"step": "03", "title": "Perform", "desc": "Continue your day. Once daily, post-meal or pre-training."},
        ],
        "specs": [
            {"label": "Pack Size", "value": "30 Single-Serve Sticks"},
            {"label": "Shilajit per Stick", "value": "600 mg"},
            {"label": "Madhu per Stick", "value": "7.4 g"},
            {"label": "Dosage", "value": "1 stick daily"},
            {"label": "Format", "value": "Portable Sachet"},
            {"label": "Type", "value": "Ayurvedic Proprietary Medicine"},
            {"label": "For", "value": "Men & Women · Adults"},
        ],
        "pillars": [
            {"title": "Himalayan Shilajit", "desc": "Authentic source material above 16,000 ft."},
            {"title": "Triphala Purification", "desc": "Classical Shodhana process."},
            {"title": "Traditional Madhu", "desc": "Yogavahi honey carrier — bioavailability."},
            {"title": "Single-Serve Format", "desc": "No measuring · repeatable ritual."},
            {"title": "Quality Verified", "desc": "NABL 3rd-party tested per batch."},
        ],
        "faqs": [
            {"q": "What is Shahjeet?", "a": "India's first Shilajit + Madhu honey stick. Each portable single-serve sachet combines 600mg of Triphala-purified Shilajit with 7.4g of traditional Madhu (honey). Tear, squeeze, perform."},
            {"q": "How is it different from RockResin?", "a": "RockResin is the Deep Ritual — traditional 20g resin for home. Shahjeet is the Fast Ritual — 30 portable sticks for everywhere else. Same source, same standards, different formats."},
            {"q": "Can I take it daily?", "a": "Yes — Shahjeet is designed as a daily ritual. One stick per day. Pre-training, post-meal, or anytime."},
            {"q": "Can people with diabetes take it?", "a": "Because Shahjeet contains honey (Madhu), individuals with diabetes or those monitoring blood sugar should consult their healthcare professional before use."},
            {"q": "Is the packaging recyclable?", "a": "The outer box is fully recyclable. The single-serve sachets are designed for hygienic single-use; please dispose responsibly."},
        ],
        "badges": ["NABL Tested", "AYUSH GMP", "Doctor Reviewed", "Triphala Shodhit", "Travel-Ready"],
        "accent_color": "#CD872A",
        "is_featured": True,
        "regulatory": {
            "mfg_lic": "RJ-926Ayu E",
            "manufacturer": "URMI LIFESCIENCES LLP, A2/101 Site 5, UPSIDC Kasna, Greater Noida, UP, 201308. Unit at Facher, 312601, Rajasthan.",
            "marketer": "SankalpaSiddhi Ayupharma Pvt. Ltd., 690A/1, Kabool Nagar, Shahdara, Delhi - 110032",
            "care_email": "info@3tattava.com",
            "care_phone": "+91 95601 49956",
            "disclaimer": "This is an Ayurvedic Proprietary Medicine. Adult use only. Use as directed. Not for the diagnosis, treatment, cure, or prevention of disease. Avoid during pregnancy and lactation. Keep out of reach of children. Individual stick is not for sale. Consult your physician if you have any chronic conditions or are on long-term medications.",
        },
    },
    {
        "slug": "starter-kit",
        "name": "The Starter Kit",
        "tagline": "Begin Both Rituals.",
        "ritual_name": "The Complete Ritual",
        "price": 1799,
        "compare_at": 2298,
        "category": "Bundles",
        "image": "https://media.3tattava.com/banners/preview.webp",
        "gallery": [
            "https://media.3tattava.com/banners/preview.webp",
            "https://media.3tattava.com/banners/preview-3.webp",
        ],
        "short_desc": "RockResin + Shahjeet Sticks. The Deep Ritual for home. The Fast Ritual for everywhere else.",
        "long_desc": "The Starter Kit pairs our two flagship rituals so you never miss a day. RockResin grounds your mornings at home. Shahjeet travels with you everywhere else.",
        "benefits": ["RockResin 20g · Pure Resin", "Shahjeet 30 Sticks · 600mg each", "Save ₹499 vs separate", "Free Shipping", "Performance Assessment included"],
        "specs": [
            {"label": "Includes", "value": "RockResin + Shahjeet"},
            {"label": "Value", "value": "₹2,298"},
            {"label": "You Save", "value": "₹499"},
        ],
        "badges": ["Best Value", "Free Shipping"],
        "accent_color": "#C8963E",
        "is_featured": True,
    },
    {
        "slug": "shahjeet-subscription",
        "name": "Monthly Shahjeet Subscription",
        "tagline": "Consistency, Delivered.",
        "ritual_name": "The Forever Ritual",
        "price": 799,
        "compare_at": 999,
        "category": "Subscribe & Save",
        "image": "https://media.3tattava.com/banners/preview-4.webp",
        "gallery": ["https://media.3tattava.com/banners/preview-4.webp"],
        "short_desc": "Auto-delivered every month. 25% off. Cancel anytime.",
        "long_desc": "Because consistency compounds. Get 30 Shahjeet sticks delivered to your door every month — at 25% off retail.",
        "benefits": ["25% off forever", "Free monthly delivery", "Skip / cancel anytime", "Priority customer support"],
        "specs": [
            {"label": "Frequency", "value": "Every 30 days"},
            {"label": "Discount", "value": "25%"},
            {"label": "Lock-in", "value": "None"},
        ],
        "badges": ["Subscribe & Save"],
        "accent_color": "#CD872A",
        "is_featured": False,
    },
]


DOCTORS_SEED = [
    {
        "slug": "dr-kashish-gupta",
        "name": "Dr. Kashish Gupta",
        "title": "Founder | Ayurveda Physician",
        "credentials": "BAMS, CBPACS · Ministry of AYUSH Experience",
        "specialty": "Performance Ayurveda",
        "bio": "Founder of 3Tattava. Built the Performance Ayurveda category from inside the Ministry of AYUSH. Author of the Performance Ayurveda Podcast.",
        "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900&q=80&auto=format&fit=crop",
        "consultation_fee": 0,
        "consultation_type": "Complimentary Starter Guidance",
        "languages": ["English", "Hindi"],
    },
    {
        "slug": "dr-falguni-chauhan",
        "name": "Dr. Falguni Chauhan",
        "title": "Performance Nutrition Expert",
        "credentials": "BAMS, CBPACS · Ayurveda Dietician",
        "specialty": "Diet & Lifestyle",
        "bio": "Designs personalized Prakriti-based nutrition programs. Specialist in performance-oriented Ayurvedic diet.",
        "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80&auto=format&fit=crop",
        "consultation_fee": 1500,
        "consultation_type": "Personalized Program (Paid)",
        "languages": ["English", "Hindi"],
    },
]


KNOWLEDGE_SEED = [
    {
        "slug": "what-is-performance-ayurveda",
        "title": "What Is Performance Ayurveda?",
        "category": "Performance Ayurveda",
        "excerpt": "Ayurveda was never just about treating illness. It was about supporting human potential. Here is the modern thesis.",
        "image": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80&auto=format&fit=crop",
        "read_time": "6 min",
        "body": "Performance Ayurveda is the discipline of using authentic Ayurvedic principles to support energy, recovery, resilience and long-term performance — before problems begin. It is doctor-led, science-validated and built for the modern individual who refuses to wait for breakdown before building.",
    },
    {
        "slug": "shilajit-beyond-the-hype",
        "title": "Shilajit: Beyond The Hype",
        "category": "Shilajit Science",
        "excerpt": "Not all Shilajit is created equal. Source, purification and verification all matter. Here's what to look for.",
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80&auto=format&fit=crop",
        "read_time": "8 min",
        "body": "Shilajit is a Rasayana classically described in Ayurvedic literature. Its quality depends on source altitude, purification process (Shodhana), and verified laboratory testing. Fulvic acid, trace minerals and identity all need independent verification.",
    },
    {
        "slug": "why-we-use-triphala-purification",
        "title": "Why We Use Triphala Purification",
        "category": "Shilajit Science",
        "excerpt": "Classical Shodhana is not optional. It is essential. Here is the philosophy behind our process.",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80&auto=format&fit=crop",
        "read_time": "5 min",
        "body": "Triphala-based purification is rooted in classical Ayurvedic Shodhana principles. It reduces impurities, balances the formulation and prepares the Shilajit for daily ritual use. Preparation matters as much as sourcing.",
    },
    {
        "slug": "recovery-vs-rest",
        "title": "Recovery vs Rest: The Hidden Distinction",
        "category": "Recovery",
        "excerpt": "Most people confuse rest with recovery. Elite performers don't. Here's the difference.",
        "image": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80&auto=format&fit=crop",
        "read_time": "7 min",
        "body": "Rest is the absence of effort. Recovery is the active restoration of capacity. Sleep, nutrition, hydration, breathwork and rituals all influence the recovery curve. Performance Ayurveda focuses on the conditions that make recovery possible.",
    },
    {
        "slug": "balance-build-become",
        "title": "Balance • Build • Become Explained",
        "category": "Performance Ayurveda",
        "excerpt": "The three-pillar framework that guides every 3Tattava product, ritual and recommendation.",
        "image": "https://images.unsplash.com/photo-1483721310020-03333e577078?w=1200&q=80&auto=format&fit=crop",
        "read_time": "6 min",
        "body": "Balance (Samatva) restores the foundation. Build (Bala) develops resilience. Become (Utkarsha) reaches potential. Every ritual, every product, every recommendation maps to this framework.",
    },
    {
        "slug": "shilajit-for-women",
        "title": "Shilajit for Women: The Honest Guide",
        "category": "Women's Wellness",
        "excerpt": "Shilajit is not a male supplement. Here's why women have been using it for centuries.",
        "image": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&q=80&auto=format&fit=crop",
        "read_time": "9 min",
        "body": "There is no Ayurvedic restriction limiting Shilajit to one gender. Energy, recovery, resilience and vitality are human goals. Women can incorporate Shilajit safely into their wellness routine unless otherwise advised by their physician.",
    },
]


WTF_LOCATIONS_SEED = [
    {"name": "WTF Punjabi Bagh", "city": "Delhi", "area": "West Delhi", "lat": 28.6712, "lng": 77.1276, "phone": "+91-98100-12345"},
    {"name": "WTF Greater Kailash", "city": "Delhi", "area": "South Delhi", "lat": 28.5495, "lng": 77.2426, "phone": "+91-98100-12346"},
    {"name": "WTF Vasant Kunj", "city": "Delhi", "area": "South West Delhi", "lat": 28.5208, "lng": 77.1591, "phone": "+91-98100-12347"},
    {"name": "WTF Connaught Place", "city": "Delhi", "area": "Central Delhi", "lat": 28.6315, "lng": 77.2167, "phone": "+91-98100-12348"},
    {"name": "WTF Karol Bagh", "city": "Delhi", "area": "Central Delhi", "lat": 28.6519, "lng": 77.1909, "phone": "+91-98100-12349"},
    {"name": "WTF Dwarka Sec-10", "city": "Delhi", "area": "South West Delhi", "lat": 28.5821, "lng": 77.0539, "phone": "+91-98100-12350"},
    {"name": "WTF Rohini Sec-7", "city": "Delhi", "area": "North Delhi", "lat": 28.7100, "lng": 77.1300, "phone": "+91-98100-12351"},
    {"name": "WTF Pitampura", "city": "Delhi", "area": "North West Delhi", "lat": 28.6985, "lng": 77.1318, "phone": "+91-98100-12352"},
    {"name": "WTF Janakpuri", "city": "Delhi", "area": "West Delhi", "lat": 28.6219, "lng": 77.0878, "phone": "+91-98100-12353"},
    {"name": "WTF Lajpat Nagar", "city": "Delhi", "area": "South Delhi", "lat": 28.5677, "lng": 77.2436, "phone": "+91-98100-12354"},
    {"name": "WTF Gurgaon Sec-29", "city": "Gurgaon", "area": "Gurgaon", "lat": 28.4663, "lng": 77.0726, "phone": "+91-98100-12355"},
    {"name": "WTF Gurgaon Sec-56", "city": "Gurgaon", "area": "Gurgaon", "lat": 28.4123, "lng": 77.0876, "phone": "+91-98100-12356"},
    {"name": "WTF Cyber Hub", "city": "Gurgaon", "area": "DLF Cyber City", "lat": 28.4949, "lng": 77.0888, "phone": "+91-98100-12357"},
    {"name": "WTF Golf Course Road", "city": "Gurgaon", "area": "Gurgaon", "lat": 28.4421, "lng": 77.0901, "phone": "+91-98100-12358"},
    {"name": "WTF Sohna Road", "city": "Gurgaon", "area": "South Gurgaon", "lat": 28.4030, "lng": 77.0431, "phone": "+91-98100-12359"},
    {"name": "WTF Noida Sec-18", "city": "Noida", "area": "Noida", "lat": 28.5707, "lng": 77.3260, "phone": "+91-98100-12360"},
    {"name": "WTF Noida Sec-62", "city": "Noida", "area": "Noida", "lat": 28.6271, "lng": 77.3711, "phone": "+91-98100-12361"},
    {"name": "WTF Noida Sec-104", "city": "Noida", "area": "Noida", "lat": 28.5453, "lng": 77.3611, "phone": "+91-98100-12362"},
    {"name": "WTF Greater Noida", "city": "Greater Noida", "area": "Greater Noida", "lat": 28.4744, "lng": 77.5040, "phone": "+91-98100-12363"},
    {"name": "WTF Ghaziabad Indirapuram", "city": "Ghaziabad", "area": "Indirapuram", "lat": 28.6358, "lng": 77.3717, "phone": "+91-98100-12364"},
    {"name": "WTF Vaishali", "city": "Ghaziabad", "area": "Vaishali", "lat": 28.6450, "lng": 77.3382, "phone": "+91-98100-12365"},
    {"name": "WTF Faridabad Sec-15", "city": "Faridabad", "area": "Faridabad", "lat": 28.3950, "lng": 77.3160, "phone": "+91-98100-12366"},
    {"name": "WTF Faridabad NIT", "city": "Faridabad", "area": "Faridabad", "lat": 28.4060, "lng": 77.3120, "phone": "+91-98100-12367"},
    {"name": "WTF Saket", "city": "Delhi", "area": "South Delhi", "lat": 28.5244, "lng": 77.2066, "phone": "+91-98100-12368"},
    {"name": "WTF Hauz Khas", "city": "Delhi", "area": "South Delhi", "lat": 28.5494, "lng": 77.2001, "phone": "+91-98100-12369"},
    {"name": "WTF Mayur Vihar", "city": "Delhi", "area": "East Delhi", "lat": 28.6094, "lng": 77.2940, "phone": "+91-98100-12370"},
    {"name": "WTF Preet Vihar", "city": "Delhi", "area": "East Delhi", "lat": 28.6346, "lng": 77.2944, "phone": "+91-98100-12371"},
    {"name": "WTF Model Town", "city": "Delhi", "area": "North Delhi", "lat": 28.7024, "lng": 77.1894, "phone": "+91-98100-12372"},
    {"name": "WTF Shalimar Bagh", "city": "Delhi", "area": "North West Delhi", "lat": 28.7186, "lng": 77.1620, "phone": "+91-98100-12373"},
]


async def seed():
    """Seed products / doctors / knowledge / locations (upsert products on every startup, others on first run)."""
    # Products: upsert by slug so packaging/image updates apply on each deploy
    for p in PRODUCTS_SEED:
        existing = await db.products.find_one({"slug": p["slug"]})
        if existing:
            update = {**p}
            update["id"] = existing.get("id") or new_id()
            await db.products.update_one({"slug": p["slug"]}, {"$set": update})
        else:
            obj = Product(**p).model_dump()
            await db.products.insert_one(obj)
    log.info("Upserted %d products", len(PRODUCTS_SEED))

    if await db.doctors.count_documents({}) == 0:
        for d in DOCTORS_SEED:
            await db.doctors.insert_one({"id": new_id(), **d})
        log.info("Seeded %d doctors", len(DOCTORS_SEED))

    if await db.knowledge.count_documents({}) == 0:
        for a in KNOWLEDGE_SEED:
            await db.knowledge.insert_one({"id": new_id(), "published_at": now_iso(), **a})
        log.info("Seeded %d articles", len(KNOWLEDGE_SEED))

    if await db.locations.count_documents({}) == 0:
        for loc in WTF_LOCATIONS_SEED:
            await db.locations.insert_one({"id": new_id(), **loc})
        log.info("Seeded %d locations", len(WTF_LOCATIONS_SEED))


@app.on_event("startup")
async def on_start():
    await seed()


# ---------- Auth helper ----------
def require_admin(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing admin token")
    token = authorization.split(" ", 1)[1]
    if token != ADMIN_TOKEN:
        raise HTTPException(403, "Invalid admin token")
    return True


# ---------- Routes ----------
@api.get("/")
async def root():
    return {"name": "3Tattava API", "tagline": "Performance Ayurveda"}


@api.get("/products")
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None):
    q: Dict[str, Any] = {}
    if category and category != "all":
        q["category"] = category
    if featured is not None:
        q["is_featured"] = featured
    docs = await db.products.find(q, {"_id": 0}).to_list(100)
    return docs


@api.get("/products/{slug}")
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Product not found")
    return doc


@api.get("/doctors")
async def list_doctors():
    return await db.doctors.find({}, {"_id": 0}).to_list(50)


@api.get("/doctors/{slug}")
async def get_doctor(slug: str):
    doc = await db.doctors.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Doctor not found")
    return doc


@api.post("/doctors/book")
async def book_doctor(b: DoctorBooking):
    doc = {"id": new_id(), "created_at": now_iso(), "status": "pending", **b.model_dump()}
    await db.bookings.insert_one(doc)
    doctor = await db.doctors.find_one({"slug": b.doctor_slug}, {"_id": 0, "name": 1})
    doctor_name = doctor["name"] if doctor else "the Vaidya"
    subject, html = tpl_booking_confirmation(b.name, doctor_name, b.preferred_date, doc["id"])
    asyncio.create_task(send_email(b.email, subject, html))
    asyncio.create_task(push_to_n8n("doctor.booking", {**b.model_dump(), "booking_id": doc["id"], "doctor_name": doctor_name}))
    return {"ok": True, "booking_id": doc["id"]}


@api.get("/knowledge")
async def list_knowledge(category: Optional[str] = None):
    q: Dict[str, Any] = {}
    if category and category != "all":
        q["category"] = category
    return await db.knowledge.find(q, {"_id": 0}).to_list(100)


@api.get("/knowledge/{slug}")
async def get_article(slug: str):
    doc = await db.knowledge.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Article not found")
    return doc


@api.get("/locations")
async def list_locations():
    return await db.locations.find({}, {"_id": 0}).to_list(200)


@api.post("/newsletter")
async def newsletter(payload: NewsletterIn):
    existing = await db.newsletter.find_one({"email": payload.email})
    if existing:
        return {"ok": True, "duplicate": True}
    await db.newsletter.insert_one({"id": new_id(), "created_at": now_iso(), **payload.model_dump()})
    subject, html = tpl_newsletter_welcome(payload.email)
    asyncio.create_task(send_email(payload.email, subject, html))
    asyncio.create_task(push_to_n8n("newsletter.subscribed", payload.model_dump()))
    return {"ok": True}


@api.post("/leads")
async def leads(payload: LeadIn):
    await db.leads.insert_one({"id": new_id(), "created_at": now_iso(), **payload.model_dump()})
    return {"ok": True}


@api.post("/assessment")
async def assessment(payload: AssessmentIn):
    # tiny scoring: count answer values weighted
    answers = payload.answers
    energy = int(answers.get("energy", 3))
    sleep = int(answers.get("sleep", 3))
    recovery = int(answers.get("recovery", 3))
    stress = int(answers.get("stress", 3))
    score = max(0, min(100, (energy + sleep + recovery + (6 - stress)) * 5))
    stage = "Foundation" if score < 40 else ("Momentum" if score < 65 else "Performance")
    recommendation = "Shahjeet Sticks" if score < 50 else "RockResin"
    result = {
        "score": score,
        "stage": stage,
        "recommended_product": recommendation,
        "summary": f"Your Performance Score is {score}/100. You are in the {stage} stage. We recommend starting with {recommendation}.",
    }
    doc = {"id": new_id(), "created_at": now_iso(), "result": result, **payload.model_dump()}
    await db.assessments.insert_one(doc)
    subject, html = tpl_assessment_result(payload.name, result)
    asyncio.create_task(send_email(payload.email, subject, html))
    asyncio.create_task(push_to_n8n("assessment.completed", {**payload.model_dump(), "result": result}))
    return {"ok": True, "result": result}


@api.post("/dosha-quiz")
async def dosha_quiz(payload: DoshaQuizIn):
    # count vata/pitta/kapha responses
    counts = {"vata": 0, "pitta": 0, "kapha": 0}
    for v in payload.answers.values():
        if v in counts:
            counts[v] += 1
    dominant = max(counts, key=counts.get)
    descriptions = {
        "vata": "Creative, quick, and adaptable. Vata constitutions benefit from grounding rituals, warm foods and consistent sleep.",
        "pitta": "Driven, focused, and sharp. Pitta constitutions benefit from cooling rituals, structured recovery and stress modulation.",
        "kapha": "Steady, strong, and grounded. Kapha constitutions benefit from movement, stimulating rituals and lighter foods.",
    }
    result = {"dominant": dominant, "counts": counts, "description": descriptions[dominant]}
    doc = {"id": new_id(), "created_at": now_iso(), "result": result, **payload.model_dump()}
    await db.dosha_quizzes.insert_one(doc)
    return {"ok": True, "result": result}


@api.post("/contact")
async def contact(payload: ContactIn):
    await db.contacts.insert_one({"id": new_id(), "created_at": now_iso(), **payload.model_dump()})
    return {"ok": True}


@api.post("/orders")
async def create_order(payload: OrderIn):
    subtotal = sum(it.price * it.qty for it in payload.items)
    shipping = 0 if subtotal >= 999 else 49
    total = subtotal + shipping
    order = {
        "id": new_id(),
        "created_at": now_iso(),
        "status": "confirmed",
        "subtotal": subtotal,
        "shipping": shipping,
        "total": total,
        "currency": "INR",
        **payload.model_dump(),
    }
    await db.orders.insert_one(order)
    subject, html = tpl_order_confirmation(order)
    asyncio.create_task(send_email(payload.email, subject, html))
    asyncio.create_task(push_to_n8n("order.created", {**order}))
    return {"ok": True, "order_id": order["id"], "subtotal": subtotal, "shipping": shipping, "total": total}


@api.get("/orders/{order_id}")
async def get_order(order_id: str):
    o = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not o:
        raise HTTPException(404, "Order not found")
    return o


# ---------- Admin ----------
@api.get("/admin/stats", dependencies=[Depends(require_admin)])
async def admin_stats():
    return {
        "products": await db.products.count_documents({}),
        "orders": await db.orders.count_documents({}),
        "newsletter": await db.newsletter.count_documents({}),
        "leads": await db.leads.count_documents({}),
        "assessments": await db.assessments.count_documents({}),
        "bookings": await db.bookings.count_documents({}),
        "contacts": await db.contacts.count_documents({}),
    }


@api.get("/admin/orders", dependencies=[Depends(require_admin)])
async def admin_orders():
    return await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api.get("/admin/leads", dependencies=[Depends(require_admin)])
async def admin_leads():
    return await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api.get("/admin/newsletter", dependencies=[Depends(require_admin)])
async def admin_newsletter():
    return await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api.get("/admin/bookings", dependencies=[Depends(require_admin)])
async def admin_bookings():
    return await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api.post("/admin/verify", dependencies=[Depends(require_admin)])
async def admin_verify():
    return {"ok": True}


# ---------- Admin Product CRUD ----------
class ProductIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    slug: str
    name: str
    tagline: str = ""
    ritual_name: str = ""
    price: int
    compare_at: Optional[int] = None
    category: str = "Shilajit Resin"
    image: str = ""
    gallery: List[str] = []
    short_desc: str = ""
    long_desc: str = ""
    benefits: List[str] = []
    ingredients: List[Dict[str, str]] = []
    how_to_use: List[Dict[str, str]] = []
    specs: List[Dict[str, str]] = []
    pillars: List[Dict[str, str]] = []
    faqs: List[Dict[str, str]] = []
    badges: List[str] = []
    accent_color: str = "#C8963E"
    in_stock: bool = True
    is_featured: bool = False


@api.post("/admin/products", dependencies=[Depends(require_admin)])
async def admin_create_product(p: ProductIn):
    if await db.products.find_one({"slug": p.slug}):
        raise HTTPException(400, "Slug already exists")
    doc = Product(**p.model_dump()).model_dump()
    await db.products.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/admin/products/{slug}", dependencies=[Depends(require_admin)])
async def admin_update_product(slug: str, p: ProductIn):
    existing = await db.products.find_one({"slug": slug})
    if not existing:
        raise HTTPException(404, "Product not found")
    update = p.model_dump()
    # Path slug is authoritative — ignore any divergent slug in body to prevent accidental rename
    update["slug"] = slug
    update["id"] = existing["id"]
    await db.products.update_one({"slug": slug}, {"$set": update})
    update.pop("_id", None)
    return update


@api.delete("/admin/products/{slug}", dependencies=[Depends(require_admin)])
async def admin_delete_product(slug: str):
    res = await db.products.delete_one({"slug": slug})
    if res.deleted_count == 0:
        raise HTTPException(404, "Product not found")
    return {"ok": True}


@api.get("/admin/assessments", dependencies=[Depends(require_admin)])
async def admin_assessments():
    return await db.assessments.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api.get("/admin/contacts", dependencies=[Depends(require_admin)])
async def admin_contacts():
    return await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


# ---------- Chatbot ----------
class ChatIn(BaseModel):
    session_id: str
    message: str
    history: List[Dict[str, str]] = []


import json


@api.post("/chat/stream")
async def chat_stream_endpoint(payload: ChatIn):
    async def event_gen():
        async for token in chat_stream(payload.session_id, payload.message, payload.history):
            # JSON-encode each token so SSE spec doesn't strip leading whitespace and so newlines/control chars survive
            yield f"data: {json.dumps({'t': token})}\n\n"
        yield "event: done\ndata: [DONE]\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no", "Connection": "keep-alive"},
    )


class CartAbandonIn(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    items: List[CartItem]
    subtotal: int


@api.post("/cart/abandoned")
async def cart_abandoned(payload: CartAbandonIn):
    # Dedupe: only one outreach per email per day
    today = datetime.now(timezone.utc).date().isoformat()
    existing = await db.cart_recovery.find_one({"email": payload.email, "date": today})
    if existing:
        return {"ok": True, "duplicate": True}
    doc = {"id": new_id(), "created_at": now_iso(), "date": today, "status": "queued", **payload.model_dump()}
    await db.cart_recovery.insert_one(doc)
    subject, html = tpl_cart_abandonment(payload.name or "There", payload.items, payload.subtotal)
    asyncio.create_task(send_email(payload.email, subject, html))
    asyncio.create_task(push_to_n8n("cart.abandoned", payload.model_dump()))
    return {"ok": True}


class RzpOrderIn(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    state: str
    pincode: str
    items: List[CartItem]
    notes: Optional[str] = None


@api.post("/payments/razorpay/order")
async def rzp_order(payload: RzpOrderIn):
    subtotal = sum(it.price * it.qty for it in payload.items)
    shipping = 0 if subtotal >= 999 else 49
    total = subtotal + shipping

    internal = {
        "id": new_id(),
        "created_at": now_iso(),
        "status": "pending_payment",
        "subtotal": subtotal,
        "shipping": shipping,
        "total": total,
        "currency": "INR",
        "payment_method": "razorpay",
        **payload.model_dump(),
    }
    await db.orders.insert_one(internal)

    rzp = create_razorpay_order(total, receipt=f"3T-{internal['id'][:18]}", notes={"customer": payload.customer_name})
    await db.orders.update_one(
        {"id": internal["id"]},
        {"$set": {"rzp_order_id": rzp.get("id"), "rzp_mock": rzp.get("mock", False)}},
    )
    return {
        "ok": True,
        "order_id": internal["id"],
        "rzp_order_id": rzp.get("id"),
        "amount": rzp.get("amount", total * 100),
        "currency": "INR",
        "key_id": RZP_KEY_ID,
        "mock": rzp.get("mock", False),
        "subtotal": subtotal,
        "shipping": shipping,
        "total": total,
    }


class RzpVerifyIn(BaseModel):
    order_id: str  # internal
    rzp_order_id: str
    rzp_payment_id: str
    rzp_signature: str


@api.post("/payments/razorpay/verify")
async def rzp_verify(payload: RzpVerifyIn):
    ok = verify_payment_signature(payload.rzp_order_id, payload.rzp_payment_id, payload.rzp_signature)
    status = "paid" if ok else "payment_failed"
    await db.orders.update_one(
        {"id": payload.order_id},
        {"$set": {
            "status": status,
            "rzp_payment_id": payload.rzp_payment_id,
            "rzp_signature": payload.rzp_signature,
            "paid_at": now_iso() if ok else None,
        }},
    )
    if ok:
        order = await db.orders.find_one({"id": payload.order_id}, {"_id": 0})
        if order:
            subject, html = tpl_order_confirmation(order)
            asyncio.create_task(send_email(order["email"], subject, html))
            asyncio.create_task(push_to_n8n("order.paid", order))
    return {"ok": ok, "status": status}


@app.post("/api/payments/razorpay/webhook")
async def rzp_webhook(request: Request):
    body = await request.body()
    sig = request.headers.get("X-Razorpay-Signature", "")
    if not verify_webhook_signature(body, sig):
        raise HTTPException(400, "Invalid signature")
    import json as _json
    try:
        event = _json.loads(body)
    except Exception:
        raise HTTPException(400, "Invalid JSON")
    event_type = event.get("event", "")
    payment = event.get("payload", {}).get("payment", {}).get("entity", {})
    rzp_order_id = payment.get("order_id")
    payment_id = payment.get("id")
    if rzp_order_id:
        await db.orders.update_one(
            {"rzp_order_id": rzp_order_id},
            {"$set": {"webhook_event": event_type, "webhook_payment_id": payment_id, "webhook_at": now_iso()}},
        )
    return {"ok": True}


@api.get("/admin/cart-recovery", dependencies=[Depends(require_admin)])
async def admin_cart_recovery():
    return await db.cart_recovery.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown():
    client.close()

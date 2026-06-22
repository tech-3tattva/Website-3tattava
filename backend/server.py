"""3Tattava — Performance Ayurveda backend."""
from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr, ConfigDict

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

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
        "image": "https://images.unsplash.com/photo-1610113151529-c0e0743a9c9f?w=900&q=80&auto=format&fit=crop",
        "gallery": [
            "https://images.unsplash.com/photo-1610113151529-c0e0743a9c9f?w=1400&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1547139762-bd34af49ab64?w=1400&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1502230831726-fe5549140034?w=1400&q=80&auto=format&fit=crop",
        ],
        "short_desc": "Traditional Himalayan Shilajit Resin, Triphala-purified. Built for those who appreciate the depth of Ayurveda.",
        "long_desc": "RockResin is our flagship Shodhit Shilajit Resin — sourced from above 16,000 ft Himalayan deposits, purified through classical Triphala Shodhana and verified through NABL third-party labs. For people who want to build a daily ritual rooted in patience, consistency and long-term vitality.",
        "benefits": [
            "Traditional Resin Form",
            "Triphala Purified (Shodhit)",
            "70%+ Fulvic Acid",
            "80+ Trace Minerals",
            "NABL 3rd-Party Lab Tested",
            "AYUSH GMP Manufactured",
            "US-FDA Registered Facility",
        ],
        "ingredients": [
            {"name": "Shodhit Shilajit", "benefit": "Traditional Rasayana, Triphala purified"},
        ],
        "how_to_use": [
            {"step": "01", "title": "Dip", "desc": "Dip the hook into a rice-grain portion of resin."},
            {"step": "02", "title": "Hook", "desc": "Lift gently — the resin will stretch like honey."},
            {"step": "03", "title": "Swirl", "desc": "Swirl into warm water or milk. Not stir. A ritual."},
        ],
        "specs": [
            {"label": "Format", "value": "100% Pure Resin"},
            {"label": "Net Weight", "value": "20g"},
            {"label": "Fulvic Acid", "value": "≥ 70%"},
            {"label": "Source Altitude", "value": "16,000+ ft"},
            {"label": "Ideal For", "value": "16+ years, all genders"},
        ],
        "pillars": [
            {"title": "Himalayan Sourcing", "desc": "Above 16,000 ft."},
            {"title": "Classical Shodhana", "desc": "Triphala-based purification."},
            {"title": "NABL Tested", "desc": "Heavy metals, microbes, fulvic acid."},
            {"title": "US-FDA Facility", "desc": "Global manufacturing standards."},
            {"title": "AYUSH GMP", "desc": "Certified Ayurvedic production."},
            {"title": "QR Verified", "desc": "Scan. Verify. Trust."},
            {"title": "Transparency First", "desc": "Open lab reports per batch."},
        ],
        "faqs": [
            {"q": "What is RockResin?", "a": "RockResin is 100% pure Shodhit Shilajit resin sourced from Himalayan deposits and purified using a Triphala-based classical Ayurvedic process."},
            {"q": "How do I use it?", "a": "Dip the spatula into a rice-grain portion of resin. Hook. Swirl into warm water or milk. Consume once daily, preferably morning."},
            {"q": "Is it safe for women?", "a": "Yes. RockResin is formulated for both men and women aged 16 and above. Vitality is a human goal — not gender-specific."},
            {"q": "How is it tested?", "a": "Every batch is verified through NABL-accredited third-party labs (Eurofins) for heavy metals, microbes, fulvic acid and identity."},
        ],
        "badges": ["NABL Tested", "AYUSH GMP", "US-FDA Facility", "Triphala Purified"],
        "accent_color": "#C9A84C",
        "is_featured": True,
    },
    {
        "slug": "shahjeet-sticks",
        "name": "Shahjeet Sticks",
        "tagline": "Performance In Your Pocket.",
        "ritual_name": "The Fast Ritual",
        "price": 999,
        "compare_at": 1199,
        "category": "Honey Sticks",
        "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=900&q=80&auto=format&fit=crop",
        "gallery": [
            "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1400&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1400&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=1400&q=80&auto=format&fit=crop",
        ],
        "short_desc": "Shodhit Shilajit + traditional Madhu, in a portable single-serve stick. Tear. Squeeze. Perform.",
        "long_desc": "Shahjeet is India's first Shilajit Honey Stick — designed for the entrepreneur, the athlete, the parent, the traveller. 600mg of Triphala-purified Shilajit combined with 7.4g of authentic Madhu in every stick. Built for consistency without complexity.",
        "benefits": [
            "600mg Shilajit Per Stick",
            "Honey Infused (Madhu)",
            "No Measuring",
            "No Mixing",
            "Travel Friendly",
            "Performance Focused",
            "Doctor Reviewed",
        ],
        "ingredients": [
            {"name": "Shodhit Shilajit", "benefit": "600mg per stick — Triphala purified"},
            {"name": "Madhu (Honey)", "benefit": "7.4g — Yogavahi carrier, traditional companion"},
        ],
        "how_to_use": [
            {"step": "01", "title": "Tear", "desc": "Open. Anytime. Anywhere. No jars. No spoons."},
            {"step": "02", "title": "Squeeze", "desc": "Squeeze the stick directly. No measuring."},
            {"step": "03", "title": "Perform", "desc": "Continue your day. No mixing. No cleanup."},
        ],
        "specs": [
            {"label": "Pack Size", "value": "30 Sticks"},
            {"label": "Shilajit per Stick", "value": "600mg"},
            {"label": "Honey per Stick", "value": "7.4g"},
            {"label": "Format", "value": "Single-serve Sachet"},
            {"label": "Ideal For", "value": "16+ years, on-the-go"},
        ],
        "pillars": [
            {"title": "Himalayan Shilajit", "desc": "Authentic source material."},
            {"title": "Triphala Purification", "desc": "Classical Shodhana process."},
            {"title": "Traditional Madhu", "desc": "Yogavahi honey carrier."},
            {"title": "Single-Serve", "desc": "No measuring, repeatable."},
            {"title": "Quality Verified", "desc": "Lab tested per batch."},
        ],
        "faqs": [
            {"q": "What is Shahjeet?", "a": "A portable formulation that combines Triphala-purified Shilajit with traditional honey in a convenient single-serve stick."},
            {"q": "Can I take it daily?", "a": "Yes. Shahjeet is designed as a daily ritual. Follow the serving recommendations on pack."},
            {"q": "Can people with diabetes take it?", "a": "Because Shahjeet contains honey, individuals with diabetes or those monitoring blood sugar should consult their healthcare professional before use."},
            {"q": "How is it different from RockResin?", "a": "RockResin is the Deep Ritual — traditional resin form. Shahjeet is the Fast Ritual — portable, no-prep format. Same philosophy, different moments."},
        ],
        "badges": ["NABL Tested", "AYUSH GMP", "Doctor Reviewed", "Triphala Purified"],
        "accent_color": "#CD872A",
        "is_featured": True,
    },
    {
        "slug": "starter-kit",
        "name": "The Starter Kit",
        "tagline": "Begin Both Rituals.",
        "ritual_name": "The Complete Ritual",
        "price": 1799,
        "compare_at": 2298,
        "category": "Bundles",
        "image": "https://images.unsplash.com/photo-1607006333439-505849ef4f76?w=900&q=80&auto=format&fit=crop",
        "gallery": [
            "https://images.unsplash.com/photo-1607006333439-505849ef4f76?w=1400&q=80&auto=format&fit=crop",
        ],
        "short_desc": "RockResin + Shahjeet Sticks. The Deep Ritual for home. The Fast Ritual for everywhere else.",
        "long_desc": "The Starter Kit pairs our two flagship rituals so you never miss a day. RockResin grounds your mornings at home. Shahjeet travels with you everywhere else.",
        "benefits": ["RockResin 20g", "Shahjeet 30 Sticks", "Save ₹499", "Free Shipping", "Performance Assessment included"],
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
        "image": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=900&q=80&auto=format&fit=crop",
        "gallery": ["https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1400&q=80&auto=format&fit=crop"],
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
    """Seed products / doctors / knowledge / locations if collections empty."""
    if await db.products.count_documents({}) == 0:
        for p in PRODUCTS_SEED:
            obj = Product(**p).model_dump()
            await db.products.insert_one(obj)
        log.info("Seeded %d products", len(PRODUCTS_SEED))

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

# 3TATTAVA — Ayurveda Doctor Network & Consultation Booking Platform
## Feature Specification & Implementation Blueprint

**Brand:** 3TATTAVA — Performance Ayurveda
**Date:** April 20, 2026
**Version:** 1.0
**Prepared for:** Development Team / Claude Code Implementation
**Status:** Feature Definition — Ready for Sprint Planning

---

## Executive Summary

3TATTAVA will build a **Doctor Network & Consultation Booking Platform** — a system that aggregates genuine Ayurveda doctors and meditation practitioners across Delhi NCR, enables patients to discover, evaluate, and book time slots with them through the 3TATTAVA website, and in return, integrates these doctors into the 3TATTAVA brand ecosystem through co-branded prescription pads, clinic posters, and product placement. This transforms 3TATTAVA from a product brand into a **platform brand** — a move no competitor (Kapiva, Upakarma, Zandu, Man Matters) has made.

**The Strategic Logic:**
- Doctors become distribution channels (prescribing 3TATTAVA products on branded pads)
- Patients discover 3TATTAVA through their trusted doctor's recommendation
- The website becomes a destination for health seekers, not just product buyers
- Doctor endorsements create the strongest possible trust signal in Ayurveda
- SEO value: "Ayurveda doctor near me Delhi" is a high-intent, high-volume keyword 3TATTAVA can own

---

## Table of Contents

1. Core Feature Requirements (Client Brief)
2. User Journeys (Patient, Doctor, Admin)
3. Information Architecture & Sitemap
4. Page-by-Page Wireframe Specifications
5. Database Schema
6. Calendar & Booking System
7. Notification System
8. Doctor Onboarding & Verification
9. Co-Branding Assets (Prescription Pad, Posters, Clinic Kit)
10. Additional Features (Strategic Enhancements)
11. SEO Strategy for Doctor Pages
12. Technical Architecture
13. Implementation Phases & Priority
14. Brand Alignment Checklist

---

## 1. Core Feature Requirements (Client Brief)

### What the Client Wants:

| # | Requirement | Details |
|---|-------------|---------|
| 1 | **Gather genuine Ayurveda doctors & meditation practitioners** | Delhi NCR region first, expand later. Must verify credentials (BAMS/MD Ayurveda/BNYS). Include meditation/yoga practitioners with recognized certifications. |
| 2 | **Doctor profiles on website** | Each doctor gets a dedicated profile page with photo, qualifications, specializations, clinic address, working hours, ratings, and reviews. |
| 3 | **Slot booking through website** | Patient selects a doctor → views available time slots on a calendar → books a slot → receives confirmation. |
| 4 | **Booking notification to doctor** | When a patient books, the doctor receives an instant notification (SMS + WhatsApp + email) with patient details and slot info. |
| 5 | **Doctor receives 3TATTAVA co-branding kit** | In return for being listed, doctor must display: branded prescription pad, clinic poster, product standee/shelf display. |

---

## 2. User Journeys

### Journey A: Patient (Website Visitor → Booked Consultation)

```
Step 1: DISCOVER
Patient lands on 3tattava.com/doctors (via Google search "ayurveda doctor near me", 
Instagram link, or website navigation)

Step 2: BROWSE
Patient sees a filterable directory of verified Ayurveda doctors in Delhi NCR.
Filters: Location/Area, Specialization, Gender, Language, Consultation Type 
(In-Clinic / Online), Rating, Available Today

Step 3: SELECT
Patient clicks on a doctor profile. Sees:
- Doctor's photo, name, credentials (BAMS, MD, etc.)
- Specializations (e.g., "Hormonal Balance, Digestive Health, Sports Recovery")
- Clinic address with map
- Working hours
- Consultation fee
- Patient ratings & reviews
- "Recommended by 3TATTAVA" trust badge

Step 4: BOOK
Patient selects a date on the calendar → sees available time slots → selects a slot
→ fills basic info (Name, Phone, Age, Brief concern) → confirms booking

Step 5: CONFIRM
Patient receives:
- On-screen confirmation with booking ID
- SMS confirmation
- WhatsApp message with doctor details, clinic address map link, and preparation tips
- Email confirmation (if provided)

Step 6: PRE-VISIT (Automated — 24hr before)
Patient receives reminder via WhatsApp:
- Appointment details
- "Tip: Ask your doctor about 3TATTAVA Shilajit for mineral support"
- Clinic directions

Step 7: POST-VISIT (Automated — 24hr after)
Patient receives:
- "How was your consultation?" review request
- "Dr. [Name] recommends 3TATTAVA for daily mineral support → Shop Now"
- Rating prompt (1-5 stars + optional text review)
```

### Journey B: Doctor (Onboarding → Active Listing)

```
Step 1: OUTREACH
3TATTAVA's field team contacts doctor OR doctor applies via 3tattava.com/doctors/join

Step 2: APPLICATION
Doctor fills onboarding form:
- Full name, qualifications, registration number (state medical council)
- Clinic name, address, Google Maps pin
- Specializations (multi-select from predefined list)
- Working hours (per day of week)
- Consultation fee (in-clinic and online separately)
- Languages spoken
- Professional photo upload
- Scanned copy of degree certificate
- Scanned copy of medical council registration

Step 3: VERIFICATION
3TATTAVA admin team verifies:
- Medical council registration number (cross-check with state Ayush board)
- Degree certificate authenticity
- Clinic visit by field team (for Delhi NCR — confirm poster/pad placement)
- Profile approval or rejection with feedback

Step 4: LISTING GOES LIVE
Doctor's profile appears on 3tattava.com/doctors
Doctor receives:
- 3TATTAVA Co-Branding Kit (shipped to clinic):
  - Branded prescription pads (100 sheets — "Prescribed by Dr. [Name] | Powered by 3TATTAVA")
  - Clinic wall poster (A2 size — "This clinic is part of the 3TATTAVA Doctor Network")
  - Product standee/shelf display with QR code linking to website
  - 5 sample Shilajit Honey Sticks for patient trials
- Doctor dashboard login credentials
- WhatsApp Business integration for booking notifications

Step 5: ONGOING
Doctor manages bookings via:
- Dashboard (mark slots as available/unavailable, view upcoming bookings, manage calendar)
- WhatsApp notifications for each new booking
- Monthly performance report (bookings received, reviews, rating)
- Prescription pad refill requests through dashboard
```

### Journey C: Admin (3TATTAVA Team)

```
- Review and approve/reject doctor applications
- Monitor booking volume and doctor performance
- Flag low-rated doctors for review
- Manage co-branding kit inventory and shipments
- Generate reports (bookings by area, doctor, specialization)
- Handle patient complaints and booking disputes
- Manage featured/promoted doctor placements
```

---

## 3. Information Architecture & Sitemap

### New Pages to Add to 3TATTAVA Website:

```
3tattava.com/
├── /doctors                          → Doctor Directory (main listing page)
│   ├── /doctors/[slug]               → Individual Doctor Profile Page
│   ├── /doctors/[slug]/book          → Booking Flow Page
│   ├── /doctors/join                 → Doctor Application Form
│   └── /doctors/specializations/
│       ├── /hormonal-balance         → Specialization Landing Page
│       ├── /digestive-health         → Specialization Landing Page
│       ├── /sports-performance       → Specialization Landing Page
│       ├── /womens-health            → Specialization Landing Page
│       ├── /stress-anxiety           → Specialization Landing Page
│       └── /meditation-yoga          → Specialization Landing Page
├── /doctor-dashboard                 → Doctor Portal (authenticated)
│   ├── /dashboard/calendar           → Manage Availability
│   ├── /dashboard/bookings           → View/Manage Bookings
│   ├── /dashboard/reviews            → View Patient Reviews
│   ├── /dashboard/profile            → Edit Profile
│   └── /dashboard/supplies           → Request Prescription Pads/Refills
└── /admin/doctors                    → Admin Panel (internal)
    ├── /admin/doctors/applications    → Review Applications
    ├── /admin/doctors/listings        → Manage Active Listings
    ├── /admin/doctors/analytics       → Booking & Performance Data
    └── /admin/doctors/inventory       → Co-Branding Kit Tracking
```

### Navigation Integration:

**Main Nav Update:**
```
SHOP ALL | DOSHAS ▾ | OUR STORY | EDUCATION HUB | FIND A DOCTOR ← NEW
```

"FIND A DOCTOR" should be positioned as a primary navigation item — it signals authority and differentiates from every competitor.

---

## 4. Page-by-Page Wireframe Specifications

---

### PAGE 1: Doctor Directory (/doctors)

**H1:** "Find a Verified Ayurveda Doctor Near You"
**Subheadline:** "Every doctor in the 3TATTAVA network is credential-verified, clinic-inspected, and committed to Performance Ayurveda."

**Search & Filter Bar:**
```
[🔍 Search by doctor name, area, or specialization...]

Filters:
| Location ▾        | Specialization ▾      | Consultation ▾    | Sort ▾          |
| South Delhi        | Hormonal Balance      | In-Clinic          | Rating (High→Low)|
| North Delhi        | Digestive Health      | Online (Video)     | Distance         |
| East Delhi         | Sports Performance    | Both               | Most Booked      |
| West Delhi         | Women's Health        |                    | Newest           |
| Gurgaon            | Stress & Anxiety      |                    |                  |
| Noida              | Meditation & Yoga     |                    |                  |
| Faridabad          | Skin & Hair           |                    |                  |
| Ghaziabad          | Weight Management     |                    |                  |
|                    | General Wellness      |                    |                  |
|                    | Panchakarma           |                    |                  |
```

**Doctor Card (repeated for each listing):**
```
┌─────────────────────────────────────────────────────────┐
│  [PHOTO]   Dr. Anita Sharma                             │
│            BAMS, MD (Kayachikitsa)                       │
│            ★★★★★ 4.8 (127 reviews)                      │
│                                                         │
│  📍 Lajpat Nagar, South Delhi                           │
│  🏥 Specializations: Hormonal Balance, Women's Health   │
│  💬 Hindi, English                                      │
│  💰 ₹500 (In-Clinic) | ₹400 (Online)                   │
│                                                         │
│  🟢 Available Today                                     │
│                                                         │
│  [VIEW PROFILE]              [BOOK NOW]                 │
│                                                         │
│  ✅ 3TATTAVA Verified  |  🩺 12 years experience        │
└─────────────────────────────────────────────────────────┘
```

**Below Listings — Trust Section:**
> "Every doctor in our network is verified through a 3-step process: credential check with the State AYUSH Board, clinic inspection by our team, and ongoing patient review monitoring. We don't list — we curate."

**CTA for Doctors:**
> "Are you an Ayurveda practitioner in Delhi NCR? [JOIN THE 3TATTAVA DOCTOR NETWORK →]"

---

### PAGE 2: Individual Doctor Profile (/doctors/[slug])

**Sections in order:**

**Section 1 — Doctor Header**
```
┌─────────────────────────────────────────────────────────┐
│  [LARGE PHOTO]                                          │
│                                                         │
│  Dr. Anita Sharma                                       │
│  BAMS, MD (Kayachikitsa) — Delhi University             │
│  Registration: [State Board] #12345                     │
│  ★★★★★ 4.8 (127 reviews)                               │
│                                                         │
│  ✅ 3TATTAVA Verified Doctor                            │
│  🏥 12 years of practice                                │
│  📍 Sharma Ayurveda Clinic, Lajpat Nagar, South Delhi   │
│                                                         │
│  Specializations:                                       │
│  [Hormonal Balance] [Women's Health] [Panchakarma]      │
│                                                         │
│  [BOOK CONSULTATION →]                                  │
└─────────────────────────────────────────────────────────┘
```

**Section 2 — About the Doctor**
> A 150-250 word bio written in the doctor's voice or by them. Covers their background, philosophy, and approach to treatment. Can include specific conditions they frequently treat.

**Section 3 — Clinic Details**
```
Clinic Name: Sharma Ayurveda Clinic
Address: B-24, Lajpat Nagar III, New Delhi - 110024
[Embedded Google Map]

Working Hours:
| Day        | Hours              | Status    |
|------------|-------------------|-----------|
| Monday     | 10:00 AM - 6:00 PM | Available |
| Tuesday    | 10:00 AM - 6:00 PM | Available |
| Wednesday  | 10:00 AM - 2:00 PM | Available |
| Thursday   | CLOSED              | —         |
| Friday     | 10:00 AM - 6:00 PM | Available |
| Saturday   | 10:00 AM - 4:00 PM | Available |
| Sunday     | CLOSED              | —         |

Consultation Fee:
- In-Clinic: ₹500
- Online (Video): ₹400
```

**Section 4 — Book a Slot (Calendar)**
```
Select Date:
◀  April 2026  ▶
┌────┬────┬────┬────┬────┬────┬────┐
│ Mo │ Tu │ We │ Th │ Fr │ Sa │ Su │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │ 1  │  2 │  3 │  4 │  5 │
│  6 │  7 │ 8  │  - │ 10 │ 11 │  - │
│ 13 │ 14 │ 15 │  - │ 17 │ 18 │  - │
│ 20✓│ 21 │ 22 │  - │ 24 │ 25 │  - │
│ 27 │ 28 │ 29 │  - │    │    │    │
└────┴────┴────┴────┴────┴────┴────┘
(Green = available, Grey = unavailable/past, - = clinic closed)

Available Slots for April 20:
[10:00 AM] [10:30 AM] [11:00 AM] [11:30 AM] 
[12:00 PM] [12:30 PM] [2:00 PM] [2:30 PM]
[3:00 PM] [3:30 PM✓] [4:00 PM] [4:30 PM]

Selected: 3:30 PM, April 20, 2026
Consultation Type: ⚪ In-Clinic (₹500) | ⚪ Online Video (₹400)

[CONTINUE TO BOOKING →]
```

**Section 5 — Patient Reviews**
```
★★★★★ 4.8 average (127 reviews)

Rating breakdown:
5 ★ ████████████████████ 89
4 ★ █████████ 24
3 ★ ████ 10
2 ★ █ 3
1 ★ ▏ 1

Sort by: [Most Recent ▾]

─────────────────────
Priya M., Delhi | ★★★★★ | April 15, 2026
"Dr. Sharma identified my iron deficiency in the first visit itself. 
Her approach is methodical and she explains everything clearly. 
The 3TATTAVA Shilajit she recommended has genuinely helped."
─────────────────────
Rahul K., Noida | ★★★★☆ | April 10, 2026
"Good consultation. Thorough analysis of my health history. 
Recommended specific dietary changes along with mineral supplementation."
─────────────────────
```

**Section 6 — Related Doctors**
> "Other doctors near Lajpat Nagar specializing in Women's Health"
> [3 doctor cards — cross-linking]

---

### PAGE 3: Booking Confirmation Flow (/doctors/[slug]/book)

**Step 1 — Patient Information Form**
```
Booking Summary:
Dr. Anita Sharma | April 20, 2026 | 3:30 PM | In-Clinic | ₹500

Your Details:
[Full Name *]
[Phone Number * (for confirmation)]
[Email (optional)]
[Age *]
[Gender: ⚪ Male ⚪ Female ⚪ Other ⚪ Prefer not to say]

Brief Health Concern:
[Textarea — "Describe your primary health concern in 2-3 lines. 
This helps the doctor prepare for your visit."]

Have you consulted an Ayurveda doctor before?
⚪ Yes  ⚪ No, this is my first time

☐ I agree to the Terms of Service and Privacy Policy
☐ I consent to sharing my details with the selected doctor

[CONFIRM BOOKING →]
```

**Step 2 — Confirmation Screen**
```
✅ Booking Confirmed!

Booking ID: 3T-20260420-1234
Doctor: Dr. Anita Sharma
Date: April 20, 2026 (Monday)
Time: 3:30 PM
Type: In-Clinic
Fee: ₹500 (payable at clinic)

Clinic Address: B-24, Lajpat Nagar III, New Delhi - 110024
[Open in Google Maps →]

You will receive a confirmation on WhatsApp at +91-XXXXXXXX.

Prepare for Your Visit:
• Bring any previous prescriptions or blood reports
• Arrive 10 minutes early for registration
• Wear comfortable clothing if Panchakarma may be recommended

Need to reschedule? Contact us at care@3tattava.com or call +91-XXXXXXXXXX

[BROWSE MORE DOCTORS]  [SHOP 3TATTAVA]
```

---

### PAGE 4: Doctor Application Form (/doctors/join)

**H1:** "Join the 3TATTAVA Doctor Network"
**Subheadline:** "We're building Delhi NCR's most trusted directory of genuine Ayurveda practitioners. Get a verified listing, patient bookings, and co-branded clinic materials — at zero cost."

**Benefits Section (above the form):**
```
What You Get:
✅ Verified profile on 3tattava.com with patient booking system
✅ Branded prescription pads (100 sheets, free refills)
✅ A2 clinic wall poster — "3TATTAVA Verified Doctor Network"
✅ Product display standee with patient QR code
✅ Free Shilajit samples for patient trials (5 honey sticks)
✅ Monthly performance report (bookings, reviews, trends)
✅ Listing in "Find a Doctor" — marketed across 3TATTAVA's channels

What We Require:
📋 Valid BAMS / MD (Ayurveda) / BNYS / equivalent qualification
📋 Active state medical council registration
📋 Operational clinic in Delhi NCR (for in-clinic listings)
📋 Willingness to display 3TATTAVA co-branding materials in clinic
📋 Commitment to genuine, ethical Ayurvedic practice
```

**Application Form Fields:**
```
PERSONAL INFORMATION
[Full Name *]
[Phone Number *]
[Email *]
[Profile Photo Upload * (Professional headshot, min 500x500px)]

QUALIFICATIONS
[Degree * (Dropdown: BAMS / MD Ayurveda / BNYS / Yoga & Naturopathy / Other)]
[University/Institution *]
[Year of Graduation *]
[State Medical Council Registration Number *]
[Registration Certificate Upload * (PDF/Image)]
[Degree Certificate Upload * (PDF/Image)]
[Years of Practice *]

CLINIC DETAILS
[Clinic Name *]
[Clinic Address Line 1 *]
[Clinic Address Line 2]
[Area/Locality * (Dropdown — Delhi NCR areas)]
[City * (Delhi / Gurgaon / Noida / Faridabad / Ghaziabad / Greater Noida)]
[Pincode *]
[Google Maps Link (optional — helps us locate your clinic faster)]
[Clinic Photos Upload (up to 5 images)]

PRACTICE DETAILS
[Specializations * (Multi-select checkboxes):
  ☐ Hormonal Balance      ☐ Women's Health        ☐ Digestive Health
  ☐ Sports Performance    ☐ Stress & Anxiety      ☐ Skin & Hair (Ayurvedic)
  ☐ Weight Management     ☐ Panchakarma           ☐ General Wellness
  ☐ Meditation & Yoga     ☐ Respiratory Health    ☐ Joint & Bone Health
  ☐ Fertility & Reproductive Health              ☐ Pediatric Ayurveda
  ☐ Other: [specify]
]
[Languages Spoken * (Multi-select: Hindi, English, Punjabi, Urdu, Other)]
[Consultation Fee — In-Clinic * (₹)]
[Consultation Fee — Online (₹) (leave blank if not offering online)]
[Do you offer online/video consultations? * (Yes/No)]

WORKING HOURS
[For each day of the week:]
Monday:    ☐ Closed  |  From [HH:MM ▾] To [HH:MM ▾]  |  Break: [HH:MM] to [HH:MM]
Tuesday:   ☐ Closed  |  From [HH:MM ▾] To [HH:MM ▾]  |  Break: [HH:MM] to [HH:MM]
... (repeat for all 7 days)

ABOUT YOU
[Bio * (200-500 words — describe your practice, approach, and philosophy)]
[Any published research or media appearances? (optional — textarea)]

AGREEMENT
☐ I confirm all information provided is accurate and verifiable *
☐ I agree to display 3TATTAVA co-branding materials in my clinic *
☐ I agree to the Doctor Network Terms of Service *
☐ I understand that 3TATTAVA will verify my credentials before listing *

[SUBMIT APPLICATION →]
```

**Post-Submission:**
> "Thank you, Dr. [Name]! We've received your application. Our team will verify your credentials and visit your clinic within 5-7 working days. You'll receive an email once your profile is live. Questions? Reach us at doctors@3tattava.com"

---

## 5. Database Schema

### Collections (MongoDB Atlas)

**Collection: `doctors`**
```json
{
  "_id": "ObjectId",
  "slug": "dr-anita-sharma-lajpat-nagar",
  "status": "pending | verified | active | suspended | rejected",
  
  "personal": {
    "fullName": "Dr. Anita Sharma",
    "phone": "+919876543210",
    "email": "dr.anita@email.com",
    "photo": "s3://3tattava-media-prod/doctors/dr-anita-sharma.jpg",
    "gender": "female"
  },
  
  "qualifications": {
    "degree": "BAMS",
    "university": "Delhi University",
    "graduationYear": 2014,
    "registrationNumber": "DL-AYU-12345",
    "registrationBoard": "Delhi Council of Indian Medicine",
    "registrationCertificate": "s3://3tattava-media-prod/doctors/certs/dr-anita-reg.pdf",
    "degreeCertificate": "s3://3tattava-media-prod/doctors/certs/dr-anita-degree.pdf",
    "yearsOfPractice": 12,
    "verifiedAt": "2026-04-15T10:30:00Z",
    "verifiedBy": "admin_user_id"
  },
  
  "clinic": {
    "name": "Sharma Ayurveda Clinic",
    "address": {
      "line1": "B-24, Lajpat Nagar III",
      "line2": "",
      "area": "Lajpat Nagar",
      "city": "New Delhi",
      "state": "Delhi",
      "pincode": "110024"
    },
    "location": {
      "type": "Point",
      "coordinates": [77.2373, 28.5700]
    },
    "googleMapsLink": "https://maps.google.com/...",
    "photos": ["s3://..."],
    "inspectedAt": "2026-04-12T14:00:00Z",
    "inspectedBy": "field_team_member_id"
  },
  
  "practice": {
    "specializations": ["hormonal-balance", "womens-health", "panchakarma"],
    "languages": ["hindi", "english"],
    "consultationFee": {
      "inClinic": 500,
      "online": 400
    },
    "offersOnline": true,
    "bio": "Dr. Anita Sharma has been practicing..."
  },
  
  "workingHours": {
    "monday":    { "closed": false, "from": "10:00", "to": "18:00", "breakFrom": "13:00", "breakTo": "14:00" },
    "tuesday":   { "closed": false, "from": "10:00", "to": "18:00", "breakFrom": "13:00", "breakTo": "14:00" },
    "wednesday": { "closed": false, "from": "10:00", "to": "14:00", "breakFrom": null, "breakTo": null },
    "thursday":  { "closed": true },
    "friday":    { "closed": false, "from": "10:00", "to": "18:00", "breakFrom": "13:00", "breakTo": "14:00" },
    "saturday":  { "closed": false, "from": "10:00", "to": "16:00", "breakFrom": null, "breakTo": null },
    "sunday":    { "closed": true }
  },
  
  "slotConfig": {
    "durationMinutes": 30,
    "bufferMinutes": 0,
    "maxAdvanceBookingDays": 30,
    "autoConfirm": true
  },
  
  "ratings": {
    "average": 4.8,
    "count": 127,
    "breakdown": { "5": 89, "4": 24, "3": 10, "2": 3, "1": 1 }
  },
  
  "coBranding": {
    "kitShipped": true,
    "kitShippedAt": "2026-04-14T09:00:00Z",
    "prescriptionPadCount": 100,
    "posterInstalled": true,
    "standeeInstalled": true,
    "lastRefillRequestAt": null
  },
  
  "analytics": {
    "totalBookings": 342,
    "bookingsThisMonth": 28,
    "profileViews": 1580,
    "profileViewsThisMonth": 156
  },
  
  "createdAt": "2026-04-10T08:00:00Z",
  "updatedAt": "2026-04-20T12:00:00Z"
}
```

**Collection: `bookings`**
```json
{
  "_id": "ObjectId",
  "bookingId": "3T-20260420-1234",
  "status": "confirmed | completed | cancelled | no-show | rescheduled",
  
  "doctor": {
    "doctorId": "ObjectId (ref: doctors)",
    "name": "Dr. Anita Sharma",
    "clinic": "Sharma Ayurveda Clinic"
  },
  
  "patient": {
    "name": "Priya Malhotra",
    "phone": "+919876543210",
    "email": "priya@email.com",
    "age": 31,
    "gender": "female"
  },
  
  "appointment": {
    "date": "2026-04-20",
    "timeSlot": "15:30",
    "endTime": "16:00",
    "type": "in-clinic",
    "fee": 500,
    "healthConcern": "Persistent fatigue and low iron levels despite supplementation",
    "isFirstAyurvedaVisit": true
  },
  
  "notifications": {
    "patientConfirmation": { "sms": true, "whatsapp": true, "email": true, "sentAt": "..." },
    "doctorNotification": { "sms": true, "whatsapp": true, "email": true, "sentAt": "..." },
    "reminderSent": { "patient24hr": true, "sentAt": "..." },
    "postVisitSent": { "reviewRequest": true, "productRecommendation": true, "sentAt": "..." }
  },
  
  "review": {
    "rating": 5,
    "text": "Dr. Sharma identified my iron deficiency...",
    "createdAt": "2026-04-21T10:00:00Z",
    "isVerified": true
  },
  
  "source": "website | instagram | whatsapp | referral",
  "createdAt": "2026-04-18T14:30:00Z",
  "updatedAt": "2026-04-20T16:00:00Z"
}
```

**Collection: `blocked_slots`**
```json
{
  "_id": "ObjectId",
  "doctorId": "ObjectId (ref: doctors)",
  "date": "2026-04-22",
  "slots": ["10:00", "10:30", "11:00"],
  "reason": "personal | leave | emergency | holiday",
  "note": "Personal leave"
}
```

---

## 6. Calendar & Booking System

### Slot Generation Logic

```
INPUT: 
- Doctor's working hours for the selected day
- Slot duration (default: 30 minutes)
- Buffer between slots (default: 0 minutes)
- Break time (if applicable)
- Already booked slots for that day
- Manually blocked slots for that day

PROCESS:
1. Get the day of week from selected date
2. Look up working hours for that day
3. If closed → show "Doctor is not available on [day]"
4. Generate all possible slots from opening to closing time
5. Remove slots that overlap with break time
6. Remove slots that are already booked (status: confirmed)
7. Remove manually blocked slots
8. Remove slots in the past (if today's date)
9. Return remaining slots as available

OUTPUT: Array of available time strings ["10:00", "10:30", "11:00", ...]
```

### Booking Rules

- Patients can book up to 30 days in advance (configurable per doctor)
- Patients cannot book slots less than 2 hours from now (prevents last-minute bookings the doctor can't prepare for)
- A patient can have only 1 active booking per doctor at a time
- If a patient has 3+ no-shows, they are flagged and require admin approval for future bookings
- Double-booking is prevented via atomic MongoDB operations (findOneAndUpdate with booking status check)
- Cancellation policy: Free cancellation up to 4 hours before. After that, booking counts as a no-show

### Doctor Calendar Management (Dashboard)

Doctors can:
- View all upcoming bookings in a calendar view (day/week/month)
- Block specific slots or entire days (leave, emergency, holiday)
- Set recurring unavailability (e.g., "every Thursday closed")
- View patient details for each booking (name, phone, health concern)
- Mark bookings as completed / no-show after the appointment
- Export weekly schedule as PDF

---

## 7. Notification System

### Notification Matrix

| Event | Patient (SMS) | Patient (WhatsApp) | Patient (Email) | Doctor (SMS) | Doctor (WhatsApp) | Doctor (Email) |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| Booking Confirmed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Booking Cancelled | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Booking Rescheduled | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| 24hr Reminder | — | ✅ | — | — | ✅ | — |
| 2hr Reminder | — | ✅ | — | — | — | — |
| Post-Visit Review | — | ✅ | ✅ | — | — | — |
| Post-Visit Product Rec | — | ✅ | — | — | — | — |
| Monthly Report | — | — | — | — | — | ✅ |
| Pad Refill Reminder | — | — | — | — | ✅ | — |

### WhatsApp Message Templates (via WhatsApp Business API)

**Booking Confirmed (to Patient):**
```
✅ Appointment Confirmed | 3TATTAVA

Dr. [Doctor Name]
📅 [Date], [Time]
📍 [Clinic Name], [Area]
🏥 [Consultation Type] | ₹[Fee]

Booking ID: [ID]

📋 Prepare for your visit:
• Bring previous prescriptions/blood reports
• Arrive 10 mins early
• Wear comfortable clothing

Need to reschedule? Reply RESCHEDULE
Need to cancel? Reply CANCEL

— 3TATTAVA Performance Ayurveda
```

**Booking Confirmed (to Doctor):**
```
🔔 New Booking | 3TATTAVA Doctor Network

Patient: [Patient Name]
📅 [Date], [Time]
📞 [Patient Phone]
🏥 [In-Clinic / Online]

Health Concern: "[Brief concern text]"
First Ayurveda visit: [Yes/No]

Booking ID: [ID]

Manage bookings: dashboard.3tattava.com
```

**Post-Visit (to Patient — 24hr after):**
```
Hi [Patient Name]! 👋

How was your consultation with Dr. [Doctor Name]?

⭐ Rate your experience (1-5):
Reply with a number to rate.

Your feedback helps other patients find the right doctor.

—

💡 Dr. [Doctor Name] recommends mineral supplementation for sustained energy. 
Try 3TATTAVA Shilajit Honey Sticks — your daily performance ritual.
🛒 Shop now: 3tattava.com/shop
```

---

## 8. Doctor Onboarding & Verification

### Verification Checklist (Admin)

```
CREDENTIAL VERIFICATION:
☐ Medical council registration number checked against State AYUSH Board database
☐ Registration number is active (not expired/suspended)
☐ Degree certificate matches stated qualification
☐ University is recognized by NCISM (National Commission for Indian System of Medicine)
☐ Photo matches the person on certificate

CLINIC VERIFICATION (Field Visit):
☐ Clinic exists at stated address
☐ Clinic is operational and clean
☐ Doctor is the practitioner at the clinic (not just lending name)
☐ Clinic has proper signage
☐ Photos taken of clinic interior/exterior
☐ Doctor agreed to co-branding placement
☐ Poster placement location identified
☐ Prescription pad handover confirmed

PROFILE QUALITY:
☐ Professional photo (not blurry, not a selfie, face clearly visible)
☐ Bio is well-written and accurate (no false claims)
☐ Specializations match actual practice
☐ Working hours are accurate
☐ Consultation fees are reasonable and accurate
```

### Rejection Reasons (Templated)

- Invalid/expired medical council registration
- University not recognized by NCISM
- Clinic not found at stated address
- Doctor not practicing at stated clinic
- Photo quality insufficient (guidance provided for retake)
- Unverifiable credentials
- Refused co-branding requirement

---

## 9. Co-Branding Assets (Prescription Pad, Posters, Clinic Kit)

### Prescription Pad Design Spec

```
Size: A5 (148mm x 210mm)
Paper: 80 GSM, off-white
Quantity per batch: 100 sheets
Binding: Pad binding (glue at top)

LAYOUT:
┌──────────────────────────────────────────┐
│  [3TATTAVA Logo]     PERFORMANCE AYURVEDA│
│─────────────────────────────────────────│
│  Dr. [Full Name], [Degree]               │
│  [Clinic Name]                           │
│  [Clinic Address]                        │
│  Reg. No: [Registration Number]          │
│  Ph: [Phone Number]                      │
│─────────────────────────────────────────│
│  Patient Name: _________________________│
│  Age/Gender: ________  Date: ___________│
│  Diagnosis: ____________________________│
│                                          │
│  Rx                                      │
│  ________________________________________│
│  ________________________________________│
│  ________________________________________│
│  ________________________________________│
│  ________________________________________│
│  ________________________________________│
│  ________________________________________│
│  ________________________________________│
│                                          │
│  Advice: ________________________________│
│  ________________________________________│
│  Follow-up: ____________________________│
│                                          │
│─────────────────────────────────────────│
│  [3TATTAVA Logo]  3tattava.com           │
│  "Performance Ayurveda for Modern Humans"│
│  Scan for Shilajit: [QR Code]            │
└──────────────────────────────────────────┘

Colors: Deep black text, gold (#C8963E) accent line, 3TATTAVA logo in brand colors
QR Code: Links to 3tattava.com/shop?ref=dr-[slug]&utm_source=prescription
```

### Clinic Poster Design Spec

```
Size: A2 (420mm x 594mm)
Material: Semi-gloss poster paper or sunboard
Mounting: Self-adhesive strips or frame

LAYOUT:
┌────────────────────────────────────────────┐
│                                            │
│         [3TATTAVA Logo — Large]             │
│                                            │
│     "This Clinic is Part of the            │
│      3TATTAVA Doctor Network"              │
│                                            │
│     ✅ Credential-Verified Doctor           │
│     ✅ Lab-Certified Products               │
│     ✅ Performance Ayurveda                 │
│                                            │
│     ─────────────────────────              │
│                                            │
│     Ask your doctor about                  │
│     3TATTAVA Shilajit —                    │
│     80+ minerals for daily energy.         │
│                                            │
│     [Product Image: Honey Sticks + Resin]  │
│                                            │
│     Scan to shop:                          │
│     [QR Code]                              │
│                                            │
│     3tattava.com                           │
│     "Performance Ayurveda for              │
│      Modern Humans."                       │
│                                            │
└────────────────────────────────────────────┘

Colors: Dark background (#1A1A1A), gold accents (#C8963E), white text
QR Code: Links to 3tattava.com/shop?ref=clinic-[slug]&utm_source=poster
```

### Product Standee/Shelf Display Spec

```
Type: Countertop acrylic standee or small shelf talker
Size: A5 or tent card format

Content:
- 3TATTAVA logo
- "Recommended by your doctor"
- Product image (Honey Sticks)
- "Tear. Squeeze. Perform."
- "Ask for a free sample"
- QR code → product page

Placement: Reception desk or waiting area
```

### Complete Clinic Kit Contents

| Item | Quantity | Replenishment |
|------|----------|---------------|
| Branded prescription pads | 100 sheets | Request via dashboard (free) |
| A2 clinic poster | 1 | On damage/request |
| Countertop product standee | 1 | On damage/request |
| Sample Honey Sticks | 5 packs | Monthly (first 3 months) |
| Doctor welcome letter | 1 | One-time |
| Doctor network certificate | 1 (framed A4) | One-time |

---

## 10. Additional Features (Strategic Enhancements)

Beyond the core requirements, these features will significantly increase the platform's value:

### Feature A: Online Video Consultation (High Priority)

**What:** Doctors can offer video consultations directly through the 3TATTAVA website using a built-in video call system (WebRTC or integration with Daily.co / Whereby).

**Why:** 
- Expands reach beyond Delhi NCR without physical clinic requirement
- Increases booking volume significantly (patients don't need to travel)
- Positions 3TATTAVA as a tech-forward Ayurveda platform
- Zandu offers free doctor consultation — 3TATTAVA needs to match or beat this

**How:** 
- Patient books an online slot
- 5 minutes before appointment, both patient and doctor get a unique video room link
- Session auto-records (with consent) for compliance
- Post-session, doctor can send digital prescription (PDF generated from dashboard)

---

### Feature B: Doctor Referral Commission System (High Priority)

**What:** When a doctor prescribes 3TATTAVA products on the branded prescription pad AND the patient purchases through the doctor's unique referral link/QR code, the doctor earns a commission.

**Why:**
- Direct financial incentive for doctors to recommend 3TATTAVA products
- Trackable ROI on the doctor network program
- Creates a genuine prescription → purchase pipeline

**How:**
- Each doctor gets a unique referral code: `dr-anita-sharma`
- QR on prescription pad encodes: `3tattava.com/shop?ref=dr-anita-sharma`
- Orders placed with this ref code are tracked
- Doctor earns 10-15% commission on referred sales
- Commission dashboard visible in doctor portal
- Monthly payout via bank transfer (minimum ₹500 threshold)

---

### Feature C: "Ask a Doctor" Quick Consultation (Medium Priority)

**What:** A free, text-based Q&A feature where patients can ask quick health questions and get answers from verified doctors within 24 hours.

**Why:**
- Massive SEO value (user-generated health Q&A content)
- Builds trust and engagement before a paid consultation
- Positions 3TATTAVA as a health platform, not just a product brand
- Kapiva and competitors have nothing like this

**How:**
- Patient submits a question (max 200 characters) with category tag
- Question goes to a pool visible to all network doctors
- Any verified doctor can answer (earns "helpfulness" points)
- Best answers get highlighted
- Public Q&A page (anonymized) builds SEO content
- CTA: "Want a detailed consultation? Book a slot with Dr. [Name]"

---

### Feature D: Health Assessment Quiz → Doctor Recommendation (Medium Priority)

**What:** A guided quiz that assesses the patient's health concerns and recommends both a product (Shilajit Resin or Honey Sticks) AND a specific doctor based on their specialization and proximity.

**Why:**
- Bridges the product and doctor features seamlessly
- Increases both product conversion AND doctor bookings
- Personalized recommendation > generic browsing

**How:**
- 8-10 question quiz (energy levels, diet, exercise, symptoms, goals)
- Output: "Based on your responses, we recommend..."
  - Product: Shilajit Honey Sticks (for daily energy support)
  - Doctor: Dr. Anita Sharma (specializes in Hormonal Balance, 2km from you)
- CTA: [SHOP HONEY STICKS] + [BOOK DR. ANITA]

---

### Feature E: Doctor-Generated Content Hub (Low Priority — Phase 2)

**What:** Doctors in the network can publish short educational articles/videos through their dashboard. Content appears on both their profile and the Education Hub.

**Why:**
- Massive SEO content generation at zero cost
- Doctors build their personal brand through 3TATTAVA
- Each article links back to the doctor's booking page
- Creates a content moat competitors can't easily replicate

**How:**
- Simple WYSIWYG editor in doctor dashboard
- Content reviewed by 3TATTAVA team before publishing
- Published under: "By Dr. [Name], 3TATTAVA Doctor Network"
- Tags map to specialization pages for SEO clustering

---

### Feature F: Loyalty Points for Bookings (Low Priority — Phase 2)

**What:** Patients earn 3TATTAVA loyalty points for every consultation booked and completed. Points redeemable on 3TATTAVA product purchases.

**Why:**
- Creates a flywheel: Book doctor → earn points → buy products → return for more consultations
- Following Kapiva Coins model (proven to drive 70% repeat purchases)

**How:**
- 1 consultation completed = 100 3TATTAVA Points
- 1 review submitted = 50 Points
- 500 Points = ₹50 discount on product purchase
- Points visible in patient account on 3tattava.com

---

## 11. SEO Strategy for Doctor Pages

### Target Keywords

| Page | Primary Keyword | Secondary Keywords |
|------|----------------|-------------------|
| /doctors | ayurveda doctor near me delhi | best ayurvedic doctor delhi ncr, ayurveda consultation online, book ayurveda doctor |
| /doctors/[slug] | dr [name] ayurveda [area] | [name] ayurveda doctor reviews, [clinic name] |
| /doctors/specializations/womens-health | ayurveda doctor for women delhi | ayurvedic treatment for PCOS delhi, female ayurveda doctor near me |
| /doctors/specializations/hormonal-balance | ayurvedic treatment hormonal imbalance | ayurveda for thyroid delhi, natural hormone balance treatment |
| /doctors/specializations/sports-performance | ayurveda for athletes | sports ayurveda delhi, ayurvedic supplements gym performance |
| /doctors/specializations/digestive-health | ayurvedic doctor stomach problems | IBS ayurveda treatment delhi, digestive issues ayurveda |
| /doctors/specializations/meditation-yoga | meditation teacher near me delhi | yoga therapy delhi, mindfulness teacher |
| /doctors/join | — (not indexed) | — |

### Schema Markup

**Doctor Profile Pages:**
- Use `Physician` schema (schema.org)
- Include: name, image, medicalSpecialty, address, telephone, openingHours, aggregateRating
- This enables Google's rich snippets for doctor searches

**Booking Pages:**
- Use `MedicalBusiness` schema for the overall directory

### Content Strategy for Doctor SEO

Each specialization landing page should contain:
- 800-1,200 words of educational content about the condition/specialty
- "Reviewed by [Doctor Name], [Credential]" tag
- FAQ section (5-8 questions targeting "People Also Ask")
- List of doctors specializing in this area (with booking CTAs)
- Internal links to relevant Education Hub articles
- Internal links to relevant products (e.g., Hormonal Balance → Shilajit for women article → Honey Sticks product page)

---

## 12. Technical Architecture

### Stack (Aligned with Existing 3TATTAVA Infrastructure)

| Component | Technology | Notes |
|-----------|------------|-------|
| Frontend | Next.js 14 (Vercel) | Doctor pages as dynamic routes with ISR |
| Backend API | Node.js/Express (EC2) | New `/api/doctors/*` and `/api/bookings/*` endpoints |
| Database | MongoDB Atlas | New collections: `doctors`, `bookings`, `blocked_slots`, `reviews` |
| File Storage | AWS S3 (`3tattava-media-prod`) | Doctor photos, certificates, clinic photos |
| CDN | CloudFront | Serve doctor images via existing CDN |
| SMS | AWS SNS or MSG91 | Booking confirmations and reminders |
| WhatsApp | WhatsApp Business API (via Interakt/Wati/Gupshup) | All patient and doctor notifications |
| Email | AWS SES | Booking confirmations, doctor reports |
| Calendar Logic | Custom (Node.js) | Slot generation, conflict detection, timezone handling |
| Video Calls | Daily.co or Whereby API | For online consultations (Phase 2) |
| Payments | Razorpay (existing) | For online consultation fee collection (optional — can be pay-at-clinic initially) |
| Analytics | Google Analytics 4 + custom events | Track bookings, profile views, conversion rates |

### New API Endpoints

```
DOCTORS:
GET    /api/doctors                    → List all active doctors (with filters)
GET    /api/doctors/:slug              → Get single doctor profile
POST   /api/doctors/apply              → Submit doctor application
PUT    /api/doctors/:id                → Update doctor profile (authenticated)
GET    /api/doctors/:id/slots?date=    → Get available slots for date
GET    /api/doctors/specializations    → List all specializations with counts

BOOKINGS:
POST   /api/bookings                   → Create new booking
GET    /api/bookings/:bookingId        → Get booking details
PUT    /api/bookings/:bookingId/cancel → Cancel booking
PUT    /api/bookings/:bookingId/reschedule → Reschedule booking

DOCTOR DASHBOARD (authenticated):
GET    /api/dashboard/bookings         → Doctor's bookings (upcoming/past)
PUT    /api/dashboard/slots/block      → Block specific slots
PUT    /api/dashboard/slots/unblock    → Unblock slots
GET    /api/dashboard/analytics        → Doctor's performance data
POST   /api/dashboard/supplies/refill  → Request prescription pad refill

REVIEWS:
POST   /api/reviews                    → Submit patient review (after booking)
GET    /api/reviews/:doctorId          → Get doctor's reviews

ADMIN:
GET    /api/admin/applications         → List pending applications
PUT    /api/admin/applications/:id     → Approve/reject application
GET    /api/admin/analytics            → Platform-wide analytics
```

### Security Considerations

- Doctor dashboard protected by JWT authentication
- Admin routes protected by role-based access control
- Patient phone numbers verified via OTP before booking
- Doctor certificates stored in private S3 bucket (not public)
- Rate limiting on booking creation (prevent spam bookings)
- CAPTCHA on doctor application form
- Patient health concern text sanitized against XSS
- Doctor registration numbers validated against format (no SQL injection)

---

## 13. Implementation Phases & Priority

### Phase 1: MVP (Week 1-3) — Get Doctors Listed

**Goal:** Launch the directory with 10-15 verified doctors. Manual booking confirmation.

| Task | Priority | Estimate |
|------|----------|----------|
| Database schema (doctors, bookings collections) | P0 | 1 day |
| Doctor application form (frontend + backend) | P0 | 2 days |
| Admin approval workflow (simple admin panel) | P0 | 2 days |
| Doctor directory page with filters | P0 | 3 days |
| Individual doctor profile page | P0 | 2 days |
| Basic calendar & slot selection UI | P0 | 3 days |
| Booking creation API with conflict prevention | P0 | 2 days |
| Booking confirmation page | P0 | 1 day |
| SMS notification (patient + doctor) on booking | P0 | 1 day |
| Navigation update ("Find a Doctor") | P0 | 0.5 day |
| **Total Phase 1** | | **~17 days** |

**Deliverable:** Patients can browse doctors, see profiles, book slots, and both parties get SMS confirmations.

### Phase 2: Full Notifications & Dashboard (Week 4-5)

| Task | Priority | Estimate |
|------|----------|----------|
| WhatsApp Business API integration | P1 | 3 days |
| Doctor dashboard (calendar view, manage bookings) | P1 | 4 days |
| Doctor dashboard (block/unblock slots) | P1 | 2 days |
| Post-visit review system | P1 | 2 days |
| Patient reminder notifications (24hr, 2hr) | P1 | 1 day |
| Post-visit product recommendation flow | P1 | 1 day |
| **Total Phase 2** | | **~13 days** |

### Phase 3: Co-Branding & Growth (Week 6-8)

| Task | Priority | Estimate |
|------|----------|----------|
| Prescription pad design finalization | P1 | 2 days |
| Poster & standee design | P1 | 2 days |
| Doctor referral tracking system | P2 | 3 days |
| Specialization landing pages (SEO) | P2 | 3 days |
| Doctor schema markup (structured data) | P2 | 1 day |
| Supply request system in dashboard | P2 | 1 day |
| Monthly doctor performance reports | P2 | 2 days |
| **Total Phase 3** | | **~14 days** |

### Phase 4: Advanced Features (Month 3+)

| Task | Priority | Estimate |
|------|----------|----------|
| Online video consultation (Daily.co/Whereby) | P2 | 5 days |
| Health Assessment Quiz → Doctor + Product recommendation | P2 | 4 days |
| "Ask a Doctor" Q&A feature | P3 | 5 days |
| Doctor-generated content system | P3 | 4 days |
| Loyalty points for bookings | P3 | 3 days |
| Online payment for consultations (Razorpay) | P3 | 2 days |
| Expansion beyond Delhi NCR | P3 | Ongoing |

---

## 14. Brand Alignment Checklist

Before launching any doctor-related page, verify:

- [ ] **No "ancient wisdom" language** — Doctor pages should feel modern, clinical, performance-oriented
- [ ] **"3TATTAVA Verified" badge** — Every listed doctor must display this
- [ ] **"Performance Ayurveda" framing** — Not "traditional Ayurveda healing" or "holistic wellness center"
- [ ] **Dr. Kashish positioned as the network founder** — "Curated by Dr. Kashish Gupta, BAMS, Founder of 3TATTAVA"
- [ ] **Color palette maintained** — Deep black (#1A1A1A), warm gold (#C8963E), earth green (#2D4A3E), off-white (#F5F0EB)
- [ ] **Typography consistent** — Clean sans-serif, no ornate Devanagari, no "spiritual" fonts
- [ ] **Product integration is subtle, not aggressive** — Doctors recommend products naturally, not through popup ads
- [ ] **Every doctor page has a product cross-sell** — But positioned as "recommended by doctors in our network," not a hard sell
- [ ] **Review language is monitored** — Flag reviews that make unsubstantiated medical claims
- [ ] **Prescription pad copy reviewed** — No "cure" or "miracle" language, stays within FSSAI-compliant supplement claims

---

## Appendix: Competitive Advantage Analysis

### Why No Competitor Has Done This

| Competitor | Doctor Strategy | Why 3TATTAVA Wins |
|------------|----------------|-------------------|
| **Kapiva** | No doctor network. Uses Tiger Shroff (celebrity) as trust signal. | Real doctors > celebrity endorsement for health products |
| **Upakarma** | No doctor presence. Relies on Mankind Pharma parent brand trust. | Local, verified doctors in your neighborhood > distant corporate parent |
| **Zandu** | Offers free online Ayurvedic doctor consultation (200K+ patients). | Zandu's is a customer service feature. 3TATTAVA's is a platform — with booking, profiles, reviews, and co-branding. |
| **Man Matters** | Uses doctor consultations as part of treatment plans (in-house). | Man Matters' doctors are employed. 3TATTAVA's are independent — wider network, more trust. |

### The Platform Play

This feature transforms 3TATTAVA from:
**"A brand that sells Shilajit"** → **"A platform that connects you with genuine Ayurveda — doctors, products, and knowledge."**

This is a defensible moat. Once 50+ doctors are on the network with branded materials in their clinics, a competitor can't replicate this overnight. Each doctor is a physical distribution point, a trust endorser, and a lead generator — simultaneously.

---

*End of Document*
*Version 1.0 | April 20, 2026*
*Prepared by: 3TATTAVA CMO Strategy Layer*

// Single source of truth for the company's legal identity so the name, CIN,
// GSTIN, addresses, emails, manufacturer and grievance details cannot diverge
// across pages / footer / product Legal-Metrology blocks.
// All values verified against Certificate of Incorporation + GST RC + COA.
export const LEGAL = {
  company: "SankalpaSiddhi Ayupharma Private Limited",
  companyShort: "SankalpaSiddhi Ayupharma Pvt. Ltd.",
  brand: "3TATTAVA",
  cin: "U21001DL2026PTC464092",
  gstin: "07ABSCS9652C1ZU",
  website: "https://www.3tattava.com",

  // Registered office per Certificate of Incorporation (authoritative).
  registeredOffice:
    "C-17, Ground Floor, Central Market, New Seemapuri, East Delhi, Delhi – 110095, India",
  // GST principal place of business — used for dispatch / operations.
  operationsAddress: "690A/1, Kabool Nagar, Shahdara, Delhi – 110032, India",

  // Manufacturer (per COA) — distinct from the marketer above.
  manufacturer: "URMILIFE SCIENCES LLP",
  manufacturerAddress: "Ground Floor, A2/101, Site-V, Kasna Industrial Area, Greater Noida, Gautam Buddha Nagar, Uttar Pradesh – 201308",
  manufacturerLicence: "RJ-926AYU",
  countryOfOrigin: "India",

  emailGeneral: "support@3tattava.com",
  emailOrders: "orders@3tattava.com",
  careMobile: "+91 95601 49956",

  // Grievance / consumer-complaint + data-protection contact (DPDP).
  grievanceOfficer: "Dr. Kashish Gupta",
  grievanceOfficerRole: "Grievance Officer & Data Protection Contact",
  grievanceEmail: "support@3tattava.com",

  policyUpdated: "17 July 2026",
  copyrightYear: 2026,
} as const;

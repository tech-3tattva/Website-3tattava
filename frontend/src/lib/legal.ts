// Single source of truth for the company's legal identity so the name, CIN,
// addresses, emails and grievance details cannot diverge across pages/footer.
// NOTE: two fields are legally mandatory before publication and are placeholders:
//   - grievanceOfficer  ({{GRIEVANCE_OFFICER_NAME}})
//   - careMobile        ({{CUSTOMER_CARE_MOBILE}})
export const LEGAL = {
  company: "SankalpaSiddhi Ayupharma Private Limited",
  companyShort: "SankalpaSiddhi Ayupharma Pvt. Ltd.",
  brand: "3TATTAVA",
  cin: "U21001DL2026PTC464092",
  website: "https://www.3tattava.com",

  // Per the legal policies master copy (registered = C-17). The homepage footer
  // block follows the client's explicit spec (registered = 690A/1) — reconcile with counsel.
  registeredOffice: "C-17, Ground Floor, Central Market, New Seemapuri, East Delhi, Delhi – 110095, India",
  correspondenceAddress: "690A/1, Kabool Nagar, Shahdara, Delhi – 110032, India",

  // Footer "Marketed by" block — exactly as specified by the client (Image #12).
  footerRegisteredOffice: "690A/1, Kabool Nagar, Shahdara, Delhi – 110032",
  footerMarketingOffice: "C-17 G/F, Central Market, New Seemapuri, East Delhi – 110095",

  emailGeneral: "care@3tattava.com",
  emailOrders: "orders@3tattava.com",

  grievanceOfficer: "To be designated", // {{GRIEVANCE_OFFICER_NAME}} — required before publish
  careMobile: "To be added", // {{CUSTOMER_CARE_MOBILE}} — required before publish

  policyUpdated: "17 July 2026",
  copyrightYear: 2026,
} as const;

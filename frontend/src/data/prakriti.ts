// Prakriti Analysis Form — question configuration (sections 1–11).
// Section 12 (Final Prakriti Scoring) is filled by the doctor, not here.
// One question per step drives the VaidyaConnect assessment stepper.

export type Dosha = "vata" | "pitta" | "kapha";

export type PrakritiOption = { label: string; dosha?: Dosha };

export type PrakritiStep = {
  sectionNo: number;
  section: string;
  key: string;
  question: string;
  hint?: string;
  type: "text" | "textarea" | "number" | "select" | "single";
  placeholder?: string;
  required?: boolean;
  options?: PrakritiOption[];
};

// For 3-option constitution questions the PDF column order is Vata · Pitta · Kapha.
const V: Dosha = "vata";
const P: Dosha = "pitta";
const K: Dosha = "kapha";

export const PRAKRITI_SECTIONS: { no: number; title: string }[] = [
  { no: 1, title: "Patient Details" },
  { no: 2, title: "Body Frame & Structure" },
  { no: 3, title: "Agni · Digestive Fire" },
  { no: 4, title: "Bowel Habits" },
  { no: 5, title: "Sleep Pattern" },
  { no: 6, title: "Mind & Emotions" },
  { no: 7, title: "Skin, Sweat & Temperature" },
  { no: 8, title: "Activity & Energy" },
  { no: 9, title: "Food Preferences" },
  { no: 10, title: "Seasonal Effects" },
  { no: 11, title: "Medical History" },
];

export const PRAKRITI_STEPS: PrakritiStep[] = [
  // ── 1. PATIENT BASIC DETAILS ────────────────────────────────────────────
  { sectionNo: 1, section: "Patient Details", key: "fullName", question: "What is your full name?", type: "text", placeholder: "Full name", required: true },
  { sectionNo: 1, section: "Patient Details", key: "age", question: "How old are you?", type: "number", placeholder: "Age in years", required: true },
  { sectionNo: 1, section: "Patient Details", key: "gender", question: "What is your gender?", type: "select", required: true, options: [{ label: "Male" }, { label: "Female" }, { label: "Other" }] },
  { sectionNo: 1, section: "Patient Details", key: "height", question: "What is your height?", type: "text", placeholder: "e.g. 5'8\" or 172 cm" },
  { sectionNo: 1, section: "Patient Details", key: "weight", question: "What is your weight?", type: "text", placeholder: "e.g. 68 kg" },
  { sectionNo: 1, section: "Patient Details", key: "occupation", question: "What is your occupation?", type: "text", placeholder: "Your profession" },
  { sectionNo: 1, section: "Patient Details", key: "dailyActivity", question: "What is your daily activity level?", type: "single", options: [{ label: "Sedentary" }, { label: "Moderate" }, { label: "Active" }] },
  { sectionNo: 1, section: "Patient Details", key: "chiefComplaints", question: "What are your chief complaints?", hint: "Your main health concerns right now.", type: "textarea", placeholder: "Describe your main concerns" },
  { sectionNo: 1, section: "Patient Details", key: "durationComplaints", question: "How long have you had these complaints?", type: "text", placeholder: "e.g. 3 months" },

  // ── 2. BODY FRAME & PHYSICAL STRUCTURE ──────────────────────────────────
  { sectionNo: 2, section: "Body Frame & Structure", key: "bodyBuild", question: "How would you describe your body build?", type: "single", options: [
    { label: "Very thin (emaciated)", dosha: V }, { label: "Lean", dosha: V }, { label: "Medium built", dosha: P }, { label: "Heavy / obese", dosha: K }, { label: "Broad and muscular", dosha: K },
  ] },
  { sectionNo: 2, section: "Body Frame & Structure", key: "boneStructure", question: "What is your bone structure like?", type: "single", options: [
    { label: "Prominent joints", dosha: V }, { label: "Moderate structure", dosha: P }, { label: "Well developed / strong bones", dosha: K },
  ] },
  { sectionNo: 2, section: "Body Frame & Structure", key: "skinType", question: "What is your skin type?", type: "single", options: [
    { label: "Dry / rough / cracked", dosha: V }, { label: "Warm / sensitive / oily-prone", dosha: P }, { label: "Thick / smooth / oily / cold", dosha: K },
  ] },
  { sectionNo: 2, section: "Body Frame & Structure", key: "hairType", question: "What is your hair type?", type: "single", options: [
    { label: "Dry, frizzy, brittle", dosha: V }, { label: "Early greying / hair fall / thin", dosha: P }, { label: "Thick, oily, strong hair", dosha: K },
  ] },
  { sectionNo: 2, section: "Body Frame & Structure", key: "nails", question: "What are your nails like?", type: "single", options: [
    { label: "Brittle / ridged", dosha: V }, { label: "Soft / pink / medium strength", dosha: P }, { label: "Thick / strong / slow growing", dosha: K },
  ] },

  // ── 3. AGNI ANALYSIS ────────────────────────────────────────────────────
  { sectionNo: 3, section: "Agni · Digestive Fire", key: "appetite", question: "How is your appetite pattern?", type: "single", options: [
    { label: "Irregular", dosha: V }, { label: "Strong hunger", dosha: P }, { label: "Slow / low appetite", dosha: K },
  ] },
  { sectionNo: 3, section: "Agni · Digestive Fire", key: "digestion", question: "How do you feel after meals?", type: "single", options: [
    { label: "Bloating / gas / heaviness", dosha: V }, { label: "Burning / acidity / thirst", dosha: P }, { label: "Drowsiness / heaviness", dosha: K },
  ] },
  { sectionNo: 3, section: "Agni · Digestive Fire", key: "spicyFood", question: "How does spicy food affect you?", type: "single", options: [
    { label: "Good tolerance", dosha: V }, { label: "Causes acidity", dosha: P }, { label: "Poor digestion", dosha: K },
  ] },
  { sectionNo: 3, section: "Agni · Digestive Fire", key: "coldFood", question: "How does cold food affect you?", type: "single", options: [
    { label: "OK", dosha: P }, { label: "Causes mucus", dosha: K }, { label: "Causes bloating", dosha: V },
  ] },
  { sectionNo: 3, section: "Agni · Digestive Fire", key: "dairy", question: "How does dairy affect you?", type: "single", options: [
    { label: "Tolerated", dosha: P }, { label: "Causes heaviness / cough", dosha: K }, { label: "Not preferred", dosha: V },
  ] },

  // ── 4. BOWEL HABITS ─────────────────────────────────────────────────────
  { sectionNo: 4, section: "Bowel Habits", key: "stoolPattern", question: "What is your stool pattern like?", type: "single", options: [
    { label: "Hard / dry / constipation", dosha: V }, { label: "Loose / frequent / burning", dosha: P }, { label: "Sticky / heavy / slow evacuation", dosha: K },
  ] },
  { sectionNo: 4, section: "Bowel Habits", key: "gas", question: "How often do you experience gas?", type: "single", options: [
    { label: "Frequent", dosha: V }, { label: "Moderate", dosha: P }, { label: "Rare", dosha: K },
  ] },
  { sectionNo: 4, section: "Bowel Habits", key: "urination", question: "What is your urination pattern?", type: "single", options: [
    { label: "Scanty / irregular", dosha: V }, { label: "Frequent / yellow / burning", dosha: P }, { label: "Normal / clear / steady", dosha: K },
  ] },

  // ── 5. SLEEP PATTERN ────────────────────────────────────────────────────
  { sectionNo: 5, section: "Sleep Pattern", key: "sleepQuality", question: "How would you describe your sleep?", type: "single", options: [
    { label: "Light sleeper, easily disturbed", dosha: V }, { label: "Moderate sleep, dreams", dosha: P }, { label: "Deep sleep, difficult to wake up", dosha: K },
  ] },
  { sectionNo: 5, section: "Sleep Pattern", key: "sleepDuration", question: "How many hours do you usually sleep?", type: "single", options: [
    { label: "Less than 5 hours", dosha: V }, { label: "6–7 hours", dosha: P }, { label: "More than 8 hours", dosha: K },
  ] },
  { sectionNo: 5, section: "Sleep Pattern", key: "dreams", question: "What are your dreams usually like?", type: "single", options: [
    { label: "Frequent / fearful / active", dosha: V }, { label: "Aggressive / emotional", dosha: P }, { label: "Rare / deep sleep", dosha: K },
  ] },

  // ── 6. MENTAL & EMOTIONAL STATUS ────────────────────────────────────────
  { sectionNo: 6, section: "Mind & Emotions", key: "naturalTendency", question: "What is your natural mental tendency?", type: "single", options: [
    { label: "Anxiety / overthinking / fear", dosha: V }, { label: "Anger / perfection / impatience", dosha: P }, { label: "Calm / stable / lazy tendency", dosha: K },
  ] },
  { sectionNo: 6, section: "Mind & Emotions", key: "memory", question: "How is your memory & learning?", type: "single", options: [
    { label: "Fast but forgetful", dosha: V }, { label: "Sharp and analytical", dosha: P }, { label: "Slow but long-lasting memory", dosha: K },
  ] },
  { sectionNo: 6, section: "Mind & Emotions", key: "speech", question: "What is your speech pattern like?", type: "single", options: [
    { label: "Fast / irregular speech", dosha: V }, { label: "Sharp / commanding speech", dosha: P }, { label: "Slow / steady speech", dosha: K },
  ] },

  // ── 7. SKIN, SWEATING & TEMPERATURE ─────────────────────────────────────
  { sectionNo: 7, section: "Skin, Sweat & Temperature", key: "sweating", question: "How much do you sweat?", type: "single", options: [
    { label: "Very low", dosha: V }, { label: "Moderate", dosha: P }, { label: "Excessive", dosha: K },
  ] },
  { sectionNo: 7, section: "Skin, Sweat & Temperature", key: "tempPreference", question: "What temperature do you prefer?", type: "single", options: [
    { label: "Always feels cold", dosha: V }, { label: "Always feels hot", dosha: P }, { label: "Comfortable most of the time", dosha: K },
  ] },
  { sectionNo: 7, section: "Skin, Sweat & Temperature", key: "skinReactions", question: "How does your skin usually react?", type: "single", options: [
    { label: "Dryness / itching", dosha: V }, { label: "Rashes / redness / burning", dosha: P }, { label: "Oiliness / acne / sluggish skin", dosha: K },
  ] },

  // ── 8. PHYSICAL ACTIVITY & ENERGY ───────────────────────────────────────
  { sectionNo: 8, section: "Activity & Energy", key: "energyLevel", question: "How is your energy level?", type: "single", options: [
    { label: "Variable (ups & downs)", dosha: V }, { label: "High energy, easily tired by heat", dosha: P }, { label: "Slow but steady energy", dosha: K },
  ] },
  { sectionNo: 8, section: "Activity & Energy", key: "exerciseTolerance", question: "What is your exercise tolerance?", type: "single", options: [
    { label: "Low stamina", dosha: V }, { label: "Moderate stamina", dosha: P }, { label: "High stamina", dosha: K },
  ] },

  // ── 9. FOOD PREFERENCES ─────────────────────────────────────────────────
  { sectionNo: 9, section: "Food Preferences", key: "craving", question: "What foods do you crave most?", type: "single", options: [
    { label: "Sweet / bakery / carbs", dosha: V }, { label: "Spicy / sour / salty", dosha: P }, { label: "Heavy / oily / fried food", dosha: K },
  ] },
  { sectionNo: 9, section: "Food Preferences", key: "eatingSpeed", question: "How fast do you eat?", type: "single", options: [
    { label: "Fast eating", dosha: V }, { label: "Moderate", dosha: P }, { label: "Slow eating", dosha: K },
  ] },

  // ── 10. SEASONAL EFFECTS ────────────────────────────────────────────────
  { sectionNo: 10, section: "Seasonal Effects", key: "summer", question: "How does summer affect you?", type: "single", options: [
    { label: "Weakness / dehydration", dosha: V }, { label: "Irritation / acidity", dosha: P }, { label: "Comfortable", dosha: K },
  ] },
  { sectionNo: 10, section: "Seasonal Effects", key: "winter", question: "How does winter affect you?", type: "single", options: [
    { label: "Very affected (cold intolerance)", dosha: V }, { label: "Moderate", dosha: P }, { label: "Stable", dosha: K },
  ] },
  { sectionNo: 10, section: "Seasonal Effects", key: "monsoon", question: "How does the monsoon affect you?", type: "single", options: [
    { label: "Gas / bloating increases", dosha: V }, { label: "Pitta imbalance", dosha: P }, { label: "Stable digestion", dosha: K },
  ] },

  // ── 11. MEDICAL HISTORY ─────────────────────────────────────────────────
  { sectionNo: 11, section: "Medical History", key: "chronicConditions", question: "Any chronic conditions?", hint: "Diabetes, BP, thyroid, etc. — write “None” if not applicable.", type: "textarea", placeholder: "List any chronic conditions" },
  { sectionNo: 11, section: "Medical History", key: "painAreas", question: "Any areas of pain?", type: "text", placeholder: "e.g. lower back, knees — or “None”" },
  { sectionNo: 11, section: "Medical History", key: "inflammation", question: "Any inflammation?", type: "text", placeholder: "e.g. joints — or “None”" },
  { sectionNo: 11, section: "Medical History", key: "hormonalIssues", question: "Any hormonal issues?", type: "text", placeholder: "e.g. thyroid, PCOS — or “None”" },
  { sectionNo: 11, section: "Medical History", key: "lifestyleDiseases", question: "Any lifestyle diseases?", type: "text", placeholder: "e.g. obesity, hypertension — or “None”" },
];

// Which step keys belong to the free-text patient / medical-history groups.
export const PATIENT_KEYS = ["fullName", "age", "gender", "height", "weight", "occupation", "dailyActivity", "chiefComplaints", "durationComplaints"] as const;
export const MEDICAL_KEYS = ["chronicConditions", "painAreas", "inflammation", "hormonalIssues", "lifestyleDiseases"] as const;

export const DOCTOR_SCORING_TRAITS: { key: string; label: string }[] = [
  { key: "bodyType", label: "Body type" },
  { key: "digestion", label: "Digestion" },
  { key: "sleep", label: "Sleep" },
  { key: "mind", label: "Mind" },
  { key: "skin", label: "Skin" },
  { key: "energy", label: "Energy" },
];

// Rough, non-clinical dosha indication from the tagged answers.
// The doctor's Section 12 scoring is the authoritative result.
export function computePreliminaryDosha(
  answers: { dosha?: Dosha }[]
): { vata: number; pitta: number; kapha: number; primary: Dosha } {
  const tally = { vata: 0, pitta: 0, kapha: 0 };
  for (const a of answers) {
    if (a.dosha && a.dosha in tally) tally[a.dosha] += 1;
  }
  const primary = (Object.keys(tally) as Dosha[]).reduce((a, b) => (tally[b] > tally[a] ? b : a), "vata" as Dosha);
  return { ...tally, primary };
}

export interface Faq {
  id: string; pillar: string; category: string;
  q: string; a: string; intent: string; priority: string;
}

export const FAQS: Faq[] = [
  {
    "id": "FAQ001",
    "pillar": "Shilajit",
    "category": "General",
    "q": "What is Shilajit?",
    "a": "Shilajit is a sticky, tar-like resin that oozes from Himalayan and other high-altitude rocks, formed over centuries from compressed plant and microbial matter. In Ayurveda it is a classical Rasayana (rejuvenative) valued for energy, stamina and vitality.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ002",
    "pillar": "Shilajit",
    "category": "General",
    "q": "What is Shilajit called in Ayurveda?",
    "a": "Shilajit (Sanskrit शिलाजतु, ‘shila-jatu’ = ‘conqueror of rock / destroyer of weakness’) is classified as a Rasayana dravya and is described in the Charaka Samhita and Sushruta Samhita.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ003",
    "pillar": "Shilajit",
    "category": "General",
    "q": "What is the botanical/scientific name of Shilajit?",
    "a": "Shilajit is not a single plant; the exudate is often labelled Asphaltum punjabianum (mineral pitch). It is a herbo-mineral exudate rather than a botanical species.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ004",
    "pillar": "Shilajit",
    "category": "General",
    "q": "What is Shilajit made of?",
    "a": "Its main bioactive components are fulvic acid, humic substances, dibenzo-alpha-pyrones (DBPs), and 80+ trace minerals in ionic form. Exact composition varies by source and purification.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ005",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Is Shilajit a mineral, herb, or something else?",
    "a": "It is a herbo-mineral exudate — neither purely herb nor purely mineral. It forms from decomposed plant matter combined with rock minerals under geological pressure.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ006",
    "pillar": "Shilajit",
    "category": "General",
    "q": "What does Shilajit taste like?",
    "a": "Pure resin tastes bitter, smoky and earthy, with a faint tar-like aroma. A strongly sweet or odourless product often signals adulteration.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ007",
    "pillar": "Shilajit",
    "category": "General",
    "q": "What colour should real Shilajit be?",
    "a": "Purified resin is dark brown to blackish; it softens and becomes pliable in warm hands and dissolves in warm water to a reddish-brown or golden solution.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ008",
    "pillar": "Shilajit",
    "category": "General",
    "q": "What is Shilajit resin?",
    "a": "Resin is Shilajit in its least-processed, concentrated form — a semi-solid paste taken in pea-sized amounts. It contains no fillers, unlike capsules or powders.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ009",
    "pillar": "Shilajit",
    "category": "General",
    "q": "What is the difference between Shilajit resin, powder, and capsules?",
    "a": "Resin is closest to the raw purified exudate; powders and capsules are processed and often contain excipients or maltodextrin. Resin generally offers the highest concentration per dose.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ010",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Is Shilajit the same as Mumijo or Moomiyo?",
    "a": "Yes — ‘Mumijo/Moomiyo/Mumie’ are Central Asian and Russian names for the same class of high-altitude mineral-rich exudate studied under those terms.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ011",
    "pillar": "Shilajit",
    "category": "General",
    "q": "What is Shilajit used for?",
    "a": "Traditionally it is used as a Rasayana for energy, stamina, strength, recovery and healthy aging. Modern research is preliminary and strongest for general energy and everyday fatigue support.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ012",
    "pillar": "Shilajit",
    "category": "General",
    "q": "How does Shilajit work in the body?",
    "a": "Fulvic acid is thought to aid mineral transport and antioxidant activity, and DBPs may support mitochondrial energy pathways. Mechanisms are still being researched and are not fully established.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ013",
    "pillar": "Shilajit",
    "category": "General",
    "q": "How long has Shilajit been used?",
    "a": "Shilajit has been used in Ayurveda for over 3,000 years and is documented in classical texts including the Charaka Samhita, Sushruta Samhita and Ashtanga Hridaya.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ014",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Is Shilajit safe?",
    "a": "Purified, third-party-tested Shilajit is generally considered safe for healthy adults at typical doses. Raw or unpurified Shilajit can contain heavy metals and should never be consumed.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ015",
    "pillar": "Shilajit",
    "category": "General",
    "q": "What is Triphala-purified Shilajit?",
    "a": "It is Shilajit purified using a classical Shodhana process that uses Triphala decoction to remove impurities while preserving bioactives — the method 3Tattava uses for RockResin.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ016",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Why choose purified resin over raw Shilajit?",
    "a": "Raw Shilajit can carry rock fragments, fungi and heavy metals; only purified (Shodhit), lab-tested resin is safe. Purification is the single most important quality step.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ017",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Does Shilajit expire?",
    "a": "Purified resin is highly stable and typically carries a 24–36 month shelf life when stored cool, dry and sealed. Always follow the expiry printed on the pack.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ018",
    "pillar": "Shilajit",
    "category": "General",
    "q": "How should Shilajit be stored?",
    "a": "Store in a cool, dry place away from direct sunlight and moisture, tightly closed. Resin naturally softens in heat and firms when cool — this is normal.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ019",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Can Shilajit be taken every day?",
    "a": "Yes, daily use at the recommended dose is the traditional pattern for a Rasayana. Many users cycle 5 days on/2 off, though continuous daily use is also common.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ020",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Is Shilajit vegan and vegetarian?",
    "a": "Pure Shilajit resin is a mineral-plant exudate and is vegetarian and vegan. Honey-based products such as Shahjeet Sticks are vegetarian but not vegan.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ021",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Is Shilajit halal?",
    "a": "Pure Shilajit resin contains no animal or alcohol ingredients and is generally considered permissible; check for brand-specific certification if required.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ022",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Does Shilajit contain caffeine?",
    "a": "No. Shilajit contains no caffeine or stimulants; any energy effect is attributed to mineral and mitochondrial support, not stimulation.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ023",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Will Shilajit show up on a drug test?",
    "a": "Shilajit contains no banned stimulants or steroids, but supplements can be contaminated; athletes under testing should choose third-party/Informed-Sport-style tested products.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ024",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Is Shilajit a steroid?",
    "a": "No. Shilajit is not a steroid, and it contains no added hormones. It is traditionally used as a Rasayana to support everyday energy and vitality.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ025",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Is Shilajit addictive?",
    "a": "No. Shilajit is not known to be habit-forming or addictive.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ026",
    "pillar": "Shilajit",
    "category": "General",
    "q": "How quickly does Shilajit work?",
    "a": "Effects are gradual. As a Rasayana it is typically taken for 8–12 weeks; energy or wellbeing changes, where they occur, are usually noticed over weeks, not days.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ027",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Is more Shilajit better?",
    "a": "No. Higher doses do not mean better results and raise the risk of side effects. Stay within 300–500 mg/day unless advised otherwise by a physician.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ028",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Can I take Shilajit with other supplements?",
    "a": "Generally yes with common vitamins; however Shilajit contains iron and minerals, so avoid stacking with high-dose iron and separate from medications by 2 hours.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ029",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Does Shilajit help with anti-aging or longevity?",
    "a": "Ayurveda classifies Shilajit as a Rasayana associated with longevity; modern longevity evidence in humans is limited and largely mechanistic, so claims should stay measured.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ030",
    "pillar": "Shilajit",
    "category": "General",
    "q": "Is Shilajit backed by science?",
    "a": "There is preliminary human evidence for energy and fatigue, plus lab and animal antioxidant data; overall the evidence base is small and early-stage.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ031",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "What is fulvic acid?",
    "a": "Fulvic acid is a small organic molecule formed during natural decomposition of plant matter. In Shilajit it is a primary marker compound thought to aid mineral transport and antioxidant activity.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ032",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "What does fulvic acid do?",
    "a": "It may bind and shuttle minerals into cells and act as an antioxidant. Human clinical evidence for specific health outcomes is still limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ033",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "What percentage of fulvic acid is good in Shilajit?",
    "a": "There is no universal standard, but reputable resins commonly declare 60–80% fulvic acid with the test method stated. 3Tattava RockResin is lab-verified at ≥70%.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ034",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Why does the fulvic acid test method matter?",
    "a": "Different methods (HPLC vs colorimetric) can produce very different numbers, so a percentage without a stated method is not comparable or fully meaningful.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ035",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "What is humic acid?",
    "a": "Humic acid is a larger molecule in the same humic-substance family as fulvic acid, also present in Shilajit; it is less bioavailable than fulvic acid due to its size.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ036",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "What are dibenzo-alpha-pyrones (DBPs)?",
    "a": "DBPs are marker compounds in genuine Shilajit believed to support mitochondrial/cellular energy pathways; they are also used as an authenticity marker.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ037",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "What trace minerals are in Shilajit?",
    "a": "Genuine Shilajit contains 80+ trace minerals in ionic form, including iron, magnesium, zinc, selenium, potassium and copper, though amounts vary by source.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ038",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Is Shilajit an adaptogen?",
    "a": "Shilajit is often described as an adaptogen/Rasayana that may help the body cope with stress; formal adaptogen classification is traditional rather than regulatory.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ039",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "How does Shilajit relate to mitochondria and ATP?",
    "a": "Lab studies suggest Shilajit and its DBPs may support mitochondrial function and ATP (energy) production; this is mechanistic and not yet confirmed by large human trials.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ040",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Does Shilajit have antioxidant effects?",
    "a": "Preliminary lab and animal studies indicate antioxidant activity from fulvic acid and DBPs; robust human antioxidant outcome data are limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ041",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Does Shilajit reduce inflammation?",
    "a": "Some preclinical studies suggest anti-inflammatory activity, but human evidence is insufficient to make inflammation claims.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ042",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Can Shilajit help with oxidative stress?",
    "a": "Its antioxidant compounds may theoretically reduce oxidative stress; current human evidence is preliminary.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ043",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "What is the gut-brain axis and does Shilajit affect it?",
    "a": "The gut-brain axis is two-way communication between gut and brain; there is no strong direct Shilajit evidence here, though Triphala has gut-microbiome research.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ044",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Does Shilajit affect cognitive performance?",
    "a": "A 2012 review proposed procognitive potential (e.g., in models of Alzheimer's), but human cognitive-outcome trials are lacking; claims should remain cautious.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ045",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Does Shilajit support muscle physiology?",
    "a": "One study suggested purified Shilajit may influence muscle-related genes/strength retention with exercise; evidence is early and single-study.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ046",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Is fulvic acid the same as Shilajit?",
    "a": "No. Fulvic acid is one component of Shilajit. Standalone fulvic acid supplements are not equivalent to whole purified Shilajit resin.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ047",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Does Shilajit contain iron?",
    "a": "Yes, Shilajit naturally contains iron among its trace minerals, which is one reason it is discussed for energy and for women with low iron — though it is not an iron treatment.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ048",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "What is the ORAC/antioxidant value of Shilajit?",
    "a": "There is no standardized ORAC label value for Shilajit; antioxidant claims should reference specific studies rather than a fixed number.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ049",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Is Shilajit nano or ionic minerals?",
    "a": "Marketing terms like ‘nano’ or ‘ionic’ describe mineral form; genuine Shilajit minerals are largely ionic, but ‘nano’ claims are usually unverified marketing.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ050",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "How does Shilajit support the body at a cellular level?",
    "a": "Purified Shilajit is rich in fulvic acid and trace minerals, and its proposed mechanism involves antioxidant and mineral support. Traditionally it is valued as a Rasayana for everyday energy and vitality.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ051",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "What is humic vs fulvic bioavailability?",
    "a": "Fulvic acid molecules are smaller and considered more bioavailable than larger humic acids, which is why fulvic content is emphasized in Shilajit.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ052",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Are Shilajit minerals better absorbed than tablets?",
    "a": "Fulvic acid may improve mineral uptake, and ionic minerals are theoretically well absorbed, but direct head-to-head human absorption studies vs tablets are limited.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ053",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Does Shilajit help collagen or skin at a cellular level?",
    "a": "Antioxidant activity is sometimes linked to skin health, but there is no strong human Shilajit-skin trial; treat skin claims as traditional/indirect.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ054",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "Is Shilajit good for the immune system?",
    "a": "Traditionally considered immunomodulatory; modern human immune-outcome evidence is limited, so claims should be cautious.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ055",
    "pillar": "Science",
    "category": "Fulvic & Compounds",
    "q": "What makes genuine Shilajit different from humic shale or coal-derived fulvic?",
    "a": "Genuine Shilajit is a high-altitude biological exudate with DBP markers; cheap fulvic products may be derived from leonardite/shale and lack Shilajit's full profile.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ056",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Is Shilajit good for men?",
    "a": "Shilajit is traditionally used as a Rasayana to support men's everyday energy, strength and stamina. Modern evidence is preliminary, so it is best viewed as general wellbeing support rather than a treatment.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ057",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Is Shilajit used to support men's everyday vitality?",
    "a": "Purified Shilajit is traditionally used as a Rasayana to support men's everyday energy, stamina and vitality. It is not a treatment for any medical condition, and this information is for general awareness — consult a qualified healthcare practitioner where required.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ058",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "How much Shilajit should men take for general vitality?",
    "a": "A common traditional intake is around 250-500 mg of purified Shilajit per day, which can be split into two servings. Start low, follow the product label, and consult a qualified healthcare practitioner where required.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ059",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Is Shilajit used to support men's overall vitality?",
    "a": "Purified Shilajit is traditionally used as a Rasayana for men's overall energy, stamina and general wellbeing. This information is for general awareness and is not a substitute for professional medical advice — consult a qualified healthcare practitioner where required.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ060",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Is Shilajit used to support men's everyday energy and stamina?",
    "a": "Purified Shilajit is traditionally used as a Rasayana to support everyday energy, stamina and general vitality. It is best viewed as general wellbeing support rather than a treatment for any specific concern.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ061",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Can Shilajit address specific men's health concerns?",
    "a": "Shilajit is traditionally used as a Rasayana for general energy and everyday vitality, not as a treatment for any medical condition. For specific health concerns, consult a qualified healthcare practitioner rather than self-treating.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ062",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Does Shilajit help build muscle?",
    "a": "It may support strength/recovery indirectly via energy and possibly muscle-gene expression (one study), but it is not a substitute for training and protein.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ063",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Does Shilajit help gym performance?",
    "a": "Users take it for energy and recovery; a small study suggested benefits to strength retention with resistance training. Evidence is early.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ064",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Is Shilajit good for muscle recovery?",
    "a": "Its antioxidant and mineral profile is the rationale for recovery use; direct recovery-outcome trials are limited, so frame as supportive not proven.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ065",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Does Shilajit increase strength?",
    "a": "One resistance-training study suggested purified Shilajit helped maintain strength; broader strength claims are not yet well established.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ066",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Does Shilajit help male energy and fatigue?",
    "a": "Reducing fatigue and boosting energy is among the more supported traditional uses, consistent with proposed mitochondrial support; human data remain preliminary.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ067",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Is Shilajit good for men's hair?",
    "a": "Its minerals (including iron, zinc) are linked to hair health generally, but there is no strong Shilajit-specific hair-growth trial; manage expectations.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ068",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Does Shilajit help men sleep?",
    "a": "Shilajit is not a sedative; any sleep benefit would be indirect via stress/energy balance. For sleep, Ayurveda uses other herbs (e.g., in 3T Nidra).",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ069",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Does Shilajit improve brain performance in men?",
    "a": "Proposed procognitive potential exists in reviews/models, but human cognitive trials are lacking; keep brain-performance claims measured.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ070",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Is Shilajit good for men over 40?",
    "a": "Shilajit is traditionally used across adulthood as a Rasayana, and middle-aged men often value it for everyday energy, stamina and recovery. It is best viewed as general wellbeing support.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ071",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Can young men in their 20s take Shilajit?",
    "a": "Healthy adult men can generally take purified Shilajit. It is traditionally used for everyday energy and vitality, so younger users should keep realistic expectations and follow the product label.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ072",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Does Shilajit help stamina and endurance for men?",
    "a": "Traditionally used for stamina; a small exercise study is supportive, but endurance-specific human evidence is limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ073",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Is Shilajit suitable for men who are planning a family?",
    "a": "Shilajit is traditionally used as a Rasayana for general energy and vitality, not as a treatment for any specific condition. Couples planning a family should consult a qualified healthcare practitioner rather than self-treating.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ074",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Does Shilajit affect prostate health?",
    "a": "There is no strong evidence that Shilajit benefits or harms the prostate; men with prostate concerns should consult a doctor.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ075",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Should men cycle Shilajit?",
    "a": "Cycling (e.g., 5 days on/2 off, or 3 months on then a break) is a common practice, though continuous daily use at recommended doses is also traditional.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ076",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Does Shilajit work better with Ashwagandha for men?",
    "a": "The two are often stacked for energy/stress/vitality; combination-specific clinical evidence is limited, so treat it as a traditional pairing.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ077",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Is Shilajit good for gym-goers?",
    "a": "Active men traditionally use purified Shilajit as a Rasayana to support everyday energy, stamina and recovery. It is best viewed as general wellbeing support alongside training and nutrition.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ078",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Can Shilajit help with low energy and burnout in working men?",
    "a": "Its traditional Rasayana role targets fatigue; realistic, gradual support over weeks is the right expectation, alongside sleep and nutrition.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ079",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Does Shilajit raise DHT or cause hair loss?",
    "a": "There is no reliable evidence that Shilajit raises DHT or causes hair loss; some minerals may support hair health instead.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ080",
    "pillar": "Men",
    "category": "Men's Health",
    "q": "Is Shilajit safe for men with high blood pressure?",
    "a": "Men with hypertension or on BP medication should consult a physician first, as mineral content and individual response vary.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ081",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can women take Shilajit?",
    "a": "Yes. Shilajit is not a men-only product; women can take purified Shilajit for energy, recovery and mineral support. It should be avoided in pregnancy and breastfeeding.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ082",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit safe for women?",
    "a": "Purified, lab-tested Shilajit is generally considered safe for healthy adult women at recommended doses, except during pregnancy and lactation or with certain conditions.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ083",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "What are the benefits of Shilajit for women?",
    "a": "Traditionally used to support energy, stamina, recovery, bone and skin health; the mineral (including iron) content is a key rationale for women. Human female-specific trials are limited.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ084",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Why is Shilajit marketed mostly to men?",
    "a": "Historically, vitality marketing targeted men, not because of biology — Shilajit's minerals and Rasayana action are gender-neutral. 3Tattava's pack is labelled MEN | WOMEN to correct this.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ085",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Does Shilajit help women with low energy?",
    "a": "Its mineral and proposed mitochondrial support make energy a common reason women use it; expect gradual support, and rule out causes like iron/B12 deficiency or thyroid issues.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ086",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit good for women with iron deficiency?",
    "a": "Shilajit contains iron and may complement an iron-supportive diet, but it is not a treatment for diagnosed iron-deficiency anemia — that needs medical management.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ087",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can Shilajit help with PCOS?",
    "a": "Some women report benefits and Shilajit's antioxidant/metabolic rationale is discussed for PCOS, but robust clinical evidence is lacking. PCOS should be managed with a doctor.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ088",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit safe during periods/menstruation?",
    "a": "There is no specific contraindication to taking purified Shilajit during menstruation for most women; listen to your body and consult a doctor if you have heavy bleeding or concerns.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ089",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Does Shilajit help with PMS?",
    "a": "Traditionally, mineral and energy support may help general wellbeing, but there is no strong PMS-specific Shilajit evidence; treat as supportive, not a treatment.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ090",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit used to support women's everyday wellbeing?",
    "a": "Shilajit is traditionally used as a Rasayana to support women's everyday energy and general wellbeing through life's transitions. It is best viewed as general wellbeing support rather than a proven treatment.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ091",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can Shilajit help women during menopause?",
    "a": "Its mineral/energy/bone rationale is discussed for menopause, but there is no strong menopause-specific Shilajit trial; women should combine with medical guidance.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ092",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit useful in perimenopause?",
    "a": "Perimenopausal women use it for energy and mood support traditionally; evidence is limited, so pair with proper medical care for symptoms.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ093",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit good for women's bone health?",
    "a": "Shilajit provides minerals relevant to bone (e.g., magnesium, and it is discussed alongside calcium), and the pack lists bone health as a traditional support; strong female bone-outcome trials are lacking.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ094",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Does Shilajit help women's skin?",
    "a": "Antioxidant activity is the rationale for skin/beauty-from-within use; there is no strong human Shilajit skin trial, so frame as traditional support.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ095",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Does Shilajit help women's hair?",
    "a": "Its minerals (iron, zinc) support hair health generally; there is no Shilajit-specific female hair-growth trial, so manage expectations.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ096",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can Shilajit help women's athletic performance?",
    "a": "Active women use it for energy and recovery like men; the limited exercise evidence isn't female-specific, so treat benefits as supportive.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ097",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit good for working professional women?",
    "a": "For fatigue and focus support in busy routines it is used traditionally; combine with sleep, nutrition and stress management for real results.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ098",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Does Shilajit help women manage stress?",
    "a": "As an adaptogen/Rasayana it is used for stress resilience; direct female stress-trial data are limited, so expectations should be modest.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ099",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can women take Shilajit for recovery after workouts?",
    "a": "Yes, women use it post-exercise for recovery support; the rationale is antioxidant/mineral, with limited direct trial evidence.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ100",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit safe for teenage girls?",
    "a": "Shilajit is generally recommended for adults; teenagers should only use it under medical/Ayurvedic supervision.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ101",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can pregnant women take Shilajit?",
    "a": "No. Shilajit should be avoided during pregnancy due to insufficient safety data and heavy-metal risk from unpurified products. Consult your doctor.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ102",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can breastfeeding women take Shilajit?",
    "a": "No. Shilajit is not recommended during breastfeeding due to lack of safety data. Consult your doctor before use.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ103",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit suitable for women who are planning a family?",
    "a": "Shilajit is traditionally used as a Rasayana for general energy and wellbeing, not as a treatment for any specific condition. Women who are planning a family should consult a qualified healthcare practitioner rather than self-treating.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ104",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can Shilajit help with women's iron levels during heavy periods?",
    "a": "It contains iron and may support an iron-rich diet, but heavy menstrual bleeding with anemia needs medical evaluation and possibly prescribed iron.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ105",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit good for women's energy during pregnancy?",
    "a": "No — Shilajit should not be used in pregnancy. For pregnancy fatigue, consult your obstetrician.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ106",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Does Shilajit cause weight gain or loss in women?",
    "a": "There is no reliable evidence that Shilajit directly causes weight gain or loss; weight is driven by overall diet and activity.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ107",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can women take Shilajit with iron or prenatal supplements?",
    "a": "Because Shilajit contains iron, avoid stacking with high-dose iron/prenatals without medical advice to prevent excess iron intake.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ108",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit good for women's thyroid health?",
    "a": "There is no strong evidence Shilajit treats thyroid conditions; women with thyroid disorders should consult a doctor before use.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ109",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Does Shilajit help women's mood?",
    "a": "Any mood benefit would be indirect via energy/stress support; there is no strong female mood-trial evidence.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ110",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit suitable for women over 40?",
    "a": "Yes, active and midlife women use it for energy, bone and recovery support; combine with medical checks for age-related changes.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ111",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "How much Shilajit should a woman take?",
    "a": "The general recommendation is the same 300–500 mg/day of purified resin; start low (a pea-sized/one-scoop ~250 mg) and follow pack directions.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ112",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can women take Shilajit honey sticks?",
    "a": "Yes. Shahjeet Sticks (600 mg purified Shilajit in honey per stick) are a convenient format many women prefer over bitter resin.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ113",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Does Shilajit help with post-pregnancy recovery?",
    "a": "Traditionally Rasayanas are used postpartum for strength, but Shilajit should only be started after breastfeeding ends and with medical guidance.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ114",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Is Shilajit good for women's gut/digestion?",
    "a": "Shilajit isn't primarily a digestive product; for gut health Ayurveda emphasizes Triphala. Some women pair the two.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ115",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Can Shilajit help women with fatigue from a busy lifestyle?",
    "a": "It is commonly used for daily fatigue support; ensure underlying causes (sleep, iron, thyroid, stress) are addressed for meaningful results.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ116",
    "pillar": "Women",
    "category": "Women's Health",
    "q": "Will Shilajit make women grow facial hair or feel ‘masculine’?",
    "a": "No. Shilajit is a mineral-rich Rasayana, not a steroid, and there is no evidence it causes facial hair or masculinizing effects in women.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ117",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "How much Shilajit should I take per day?",
    "a": "A common recommendation is 300–500 mg of purified resin per day (roughly a pea-sized amount). Clinical studies have used 250–500 mg; do not exceed label directions.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ118",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "How much should beginners take?",
    "a": "Beginners should start low — about 250 mg (one scoop / half a pea) once daily for the first 1–2 weeks — then adjust as tolerated.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ119",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "What is the difference between 250 mg and 500 mg?",
    "a": "250 mg is a gentle daily/starter dose; 500 mg (or 250 mg twice daily) matches the higher end used in studies. More is not automatically better.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ120",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Should I take Shilajit in the morning or at night?",
    "a": "Morning is most common because Shilajit supports energy; taking it late is fine for most but avoid it if you find it energizing near bedtime.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ121",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Should Shilajit be taken on an empty stomach?",
    "a": "It can be taken on an empty stomach in the morning or post-meal; sensitive stomachs may prefer taking it after food.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ122",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I take Shilajit before the gym?",
    "a": "Yes, many take it pre-workout for energy support; Shahjeet Sticks are designed for a convenient pre/post-workout ritual.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ123",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Should I take Shilajit after a workout?",
    "a": "Post-workout use is common for recovery support; timing is flexible — consistency matters more than exact timing.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ124",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can Shilajit be taken twice daily?",
    "a": "Yes. A common traditional intake is around 250 mg twice daily (500 mg total). Splitting the dose across the day is acceptable within the daily limit stated on the product label.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ125",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Do I need to cycle Shilajit?",
    "a": "Cycling isn't mandatory. Some cycle 5 days on/2 off or take breaks every few months; continuous daily use at recommended doses is also traditional.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ126",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Is long-term daily Shilajit use safe?",
    "a": "Purified, tested Shilajit at recommended doses is traditionally used long-term; still, periodic breaks and annual health checks are sensible.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ127",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "What if I miss a dose?",
    "a": "Simply resume your next scheduled dose. Do not double up to compensate; consistency over time matters more than one missed day.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ128",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I take too much Shilajit?",
    "a": "Yes. Exceeding recommended amounts increases the risk of side effects and excess mineral intake. Stay within 300–500 mg/day unless advised otherwise.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ129",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "How do I measure a pea-sized dose of resin?",
    "a": "A pea-sized portion of resin is roughly 300–500 mg. Use the pack's spoon/scoop where provided; one 3Tattava scoop ≈ 250 mg.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ130",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "How many scoops of 3Tattava RockResin should I take?",
    "a": "One scoop ≈ 250 mg (starter/daily); two scoops ≈ 500 mg (higher end). Start with one and follow pack directions.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ131",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "How do I take Shilajit resin?",
    "a": "Dip a pea-sized amount, dissolve it in warm water or milk (not boiling), stir/swirl until dissolved, and drink. 3Tattava's ritual is Dip, Hook, Swirl.",
    "intent": "HowTo",
    "priority": "P1"
  },
  {
    "id": "FAQ132",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I take Shilajit with warm water?",
    "a": "Yes, warm (not boiling) water is the most common carrier and helps the resin dissolve fully.",
    "intent": "HowTo",
    "priority": "P1"
  },
  {
    "id": "FAQ133",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I take Shilajit with milk?",
    "a": "Yes. Warm milk is a classical anupana (carrier), traditionally preferred for Pitta types and for a nourishing effect.",
    "intent": "HowTo",
    "priority": "P1"
  },
  {
    "id": "FAQ134",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I take Shilajit with herbal tea?",
    "a": "Yes, warm herbal tea works as a carrier; avoid very hot or boiling liquids and highly caffeinated teas if sensitive.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ135",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I add Shilajit to a protein shake?",
    "a": "Yes, dissolve resin in a little warm water first, then add to a room-temperature shake; avoid blending into very hot liquids.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ136",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I add Shilajit to a smoothie?",
    "a": "Yes; pre-dissolve resin in warm water, then blend into the smoothie so it disperses evenly.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ137",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I take Shilajit with coffee?",
    "a": "It can be added to warm (not scalding) coffee, but coffee's heat and acidity aren't ideal; water or milk are better carriers.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ138",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I take Shilajit with honey?",
    "a": "Yes, honey is a classical anupana that improves palatability; Shahjeet Sticks already combine Shilajit with honey.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ139",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "How many honey sticks should I take per day?",
    "a": "One Shahjeet Stick (600 mg purified Shilajit) per day is the standard serving; follow the pack directions.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ140",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "What is the best carrier (anupana) for Shilajit?",
    "a": "Warm water for general use; warm milk or ghee for Pitta types or a more nourishing effect; honey for taste. Choose per your constitution.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ141",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Should Shilajit be taken with or without food?",
    "a": "Both are acceptable; empty-stomach morning use is traditional, while sensitive stomachs may prefer taking it after meals.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ142",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "How long should I take Shilajit to see results?",
    "a": "Clinical studies ran for about 90 days. Allow 8–12 weeks of consistent use for a fair assessment, as effects are gradual.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ143",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I take Shilajit at night without affecting sleep?",
    "a": "Most people are unaffected, but if you find it energizing, take it earlier in the day.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ144",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Is it okay to take Shilajit every day long-term for energy?",
    "a": "Yes, daily Rasayana use is traditional; ensure the product is purified and lab-tested and take occasional breaks.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ145",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I dissolve Shilajit in cold water?",
    "a": "It dissolves best in warm water; cold water works but takes longer and may leave the resin sticky.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ146",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Does boiling water damage Shilajit?",
    "a": "Very hot/boiling liquids are discouraged as heat may affect sensitive compounds; use warm, not boiling, liquids.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ147",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I take Shilajit resin directly without dissolving?",
    "a": "You can, but dissolving in warm liquid improves palatability and even dosing; direct intake is stronger-tasting.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ148",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "What is the maximum safe daily dose of Shilajit?",
    "a": "Most sources cap general use around 500 mg/day of purified resin; higher study doses existed but aren't recommended for self-use. Do not exceed the label.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ149",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Should dosage differ for men and women?",
    "a": "General dosing (300–500 mg/day) is similar; women should start low and avoid use in pregnancy/lactation. Individual factors matter more than gender.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ150",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "How should older adults dose Shilajit?",
    "a": "Older adults should start at the low end (≈250 mg), monitor tolerance, and consult a doctor if on medications for chronic conditions.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ151",
    "pillar": "Dosage",
    "category": "Dosage & Timing",
    "q": "Can I take Shilajit twice a day for gym and recovery?",
    "a": "Yes, splitting into pre-workout and evening doses (within 500 mg/day total) is a common pattern.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ152",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "What are the side effects of Shilajit?",
    "a": "Reported side effects are uncommon with purified products but can include GI upset, headache, dizziness, or a sore throat; unpurified Shilajit risks heavy-metal toxicity.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ153",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Does Shilajit have heavy metals?",
    "a": "Raw/unpurified Shilajit can contain lead, arsenic, mercury and other heavy metals. Only purified, third-party (NABL) lab-tested Shilajit within safe limits should be consumed.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ154",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "How do I know if Shilajit is safe to consume?",
    "a": "Choose purified resin with a batch-specific third-party lab report (heavy metals within WHO limits), from a GMP-compliant maker. If a brand can't show a report, avoid it.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ155",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can Shilajit cause allergic reactions?",
    "a": "Allergies are rare but possible; stop use and seek care if you experience rash, itching, swelling or difficulty breathing.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ156",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe for people with diabetes?",
    "a": "People with diabetes should consult their doctor first; Shilajit may interact with blood-sugar control and medications, and monitoring is advised.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ157",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe with high blood pressure?",
    "a": "Those with hypertension or on BP medication should consult a physician before use due to individual variability in response.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ158",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe for kidney disease?",
    "a": "People with kidney disease should avoid self-use and consult a nephrologist, as mineral load and clearance are concerns.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ159",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe for liver disease?",
    "a": "Those with liver disease should consult a doctor before use; safety data in liver impairment are lacking.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ160",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can people with thyroid disorders take Shilajit?",
    "a": "There's no strong evidence of benefit or harm; people with thyroid conditions or on thyroid meds should consult their doctor and separate timing from medication.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ161",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe with autoimmune diseases?",
    "a": "Because Shilajit is described as immunomodulatory, people with autoimmune conditions should consult their doctor before use.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ162",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can Shilajit interact with medications?",
    "a": "It can. Separate Shilajit from medications by ~2 hours and consult a doctor if you take drugs for diabetes, blood pressure, thyroid, blood thinners or iron.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ163",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe with blood thinners?",
    "a": "Consult your doctor; mineral content and theoretical effects mean anticoagulant users should get medical advice first.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ164",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can children take Shilajit?",
    "a": "Shilajit is generally intended for adults; give to children only under qualified medical/Ayurvedic supervision.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ165",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe for the elderly?",
    "a": "Older adults can use purified Shilajit but should start low, review medications with a doctor, and monitor tolerance.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ166",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can Shilajit cause iron overload?",
    "a": "Because it contains iron, people with hemochromatosis or on iron therapy should avoid or seek medical advice to prevent excess iron.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ167",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe during pregnancy?",
    "a": "No. Avoid Shilajit in pregnancy due to insufficient safety data and heavy-metal risk from impure products.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ168",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe while breastfeeding?",
    "a": "No. It is not recommended during breastfeeding; consult your doctor.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ169",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can Shilajit cause gout or raise uric acid?",
    "a": "Evidence is unclear; people with gout should consult a doctor before use as a precaution.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ170",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "What should I do if I feel dizzy after taking Shilajit?",
    "a": "Stop use, hydrate, and reassess your dose; dizziness may relate to dose or blood pressure. Seek medical advice if it persists.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ171",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can Shilajit upset my stomach?",
    "a": "Occasionally; taking it with food, lowering the dose, or using warm milk as a carrier can help.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ172",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is unpurified or raw Shilajit dangerous?",
    "a": "Yes. Raw Shilajit may contain heavy metals, fungi and rock debris and can be toxic. Never consume unpurified Shilajit.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ173",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "How much heavy metal is safe in Shilajit?",
    "a": "Reputable products test lead, arsenic, mercury and cadmium against WHO/limit thresholds; the goal is ‘within permissible limits’, verified per batch by an accredited lab.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ174",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Does purification remove heavy metals from Shilajit?",
    "a": "Classical Shodhana reduces impurities, but only third-party lab testing confirms heavy metals are within safe limits — purification and testing are both required.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ175",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can I take Shilajit with antibiotics?",
    "a": "Minerals in Shilajit can bind some antibiotics (e.g., tetracyclines/quinolones); separate by at least 2 hours and consult your doctor/pharmacist.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ176",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe with heart conditions?",
    "a": "People with cardiovascular disease or on cardiac medication should consult a doctor before use.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ177",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can Shilajit affect blood sugar?",
    "a": "It may influence blood sugar; diabetics should monitor levels and consult a doctor, especially when combined with medication.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ178",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Are there any drug classes to avoid with Shilajit?",
    "a": "Use caution and seek advice with iron therapy, thyroid meds, antidiabetics, antihypertensives, anticoagulants and certain antibiotics.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ179",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "What are signs of fake or contaminated Shilajit?",
    "a": "No lab report, unusually low price, dissolves poorly, plastic-like burning, no batch/QR traceability, or a sweet/odourless product are red flags.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ180",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can Shilajit cause headaches?",
    "a": "Occasionally, particularly at higher doses or when starting; lowering the dose usually helps. Persistent headaches warrant stopping and seeking advice.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ181",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is it safe to drive or operate machinery after Shilajit?",
    "a": "Shilajit is not sedating for most people, but if you feel dizzy when starting, avoid such activities until you know how you respond.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ182",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Should I stop Shilajit before surgery?",
    "a": "Tell your surgeon about all supplements; as a precaution, discontinue Shilajit ~1–2 weeks before surgery unless advised otherwise.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ183",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can Shilajit cause acne or skin breakouts?",
    "a": "There's no strong evidence linking Shilajit to acne; if breakouts occur, reassess dose and overall routine.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ184",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is Shilajit safe for people with anemia?",
    "a": "It contains iron and may complement diet, but anemia needs medical diagnosis and treatment; don't rely on Shilajit alone.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ185",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can teenagers take Shilajit for studies or sports?",
    "a": "Only under medical/Ayurvedic supervision; it is generally recommended for adults.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ186",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "What is the safest way to start Shilajit?",
    "a": "Choose a purified, lab-tested resin; start at ~250 mg once daily with warm water or milk; monitor tolerance for 1–2 weeks before increasing.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ187",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Are Shilajit honey sticks safe for diabetics?",
    "a": "Shahjeet Sticks contain honey, which affects blood sugar; diabetics should prefer plain resin and consult their doctor.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ188",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Can I take Shilajit if I have an iron-rich diet already?",
    "a": "Yes in moderation, but be mindful of total iron intake; those with high iron status should seek advice.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ189",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Does Shilajit interact with alcohol?",
    "a": "No specific dangerous interaction is documented, but alcohol undermines the recovery/energy goals Shilajit is used for; moderate accordingly.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ190",
    "pillar": "Safety",
    "category": "Safety & Contraindications",
    "q": "Is lab-tested Shilajit completely free of heavy metals?",
    "a": "‘Free’ is the wrong word — the goal is heavy metals within safe permissible limits, verified per batch by an accredited (NABL) lab.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ191",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "How do I check if Shilajit is real?",
    "a": "Real resin dissolves fully in warm water, softens in the hand, doesn't burn like plastic, and — most importantly — comes with a third-party lab report and batch traceability. Home tests suggest; lab reports prove.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ192",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What is the water test for Shilajit?",
    "a": "Genuine resin dissolves in warm water, turning it reddish-brown to golden with no plastic residue; fakes may not dissolve or leave sediment. This test suggests but doesn't prove purity.",
    "intent": "HowTo",
    "priority": "P1"
  },
  {
    "id": "FAQ193",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What is the flame/fire test for Shilajit?",
    "a": "Real Shilajit tends to bubble and not catch fire like plastic; however, some fakes can pass this, so it isn't proof on its own.",
    "intent": "HowTo",
    "priority": "P1"
  },
  {
    "id": "FAQ194",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What is the solubility test for Shilajit?",
    "a": "Purified resin fully dissolves in warm water/milk without gritty residue; incomplete dissolution or grit suggests adulteration.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ195",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "Why is a lab report important when buying Shilajit?",
    "a": "Only an accredited third-party lab report confirms heavy metals are within safe limits and verifies fulvic acid content — the two things you cannot see or taste.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ196",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What certifications should genuine Shilajit have?",
    "a": "Look for third-party NABL lab testing, an AYUSH-GMP compliant facility, and (for genuine reviews) transparent batch/QR traceability.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ197",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "Why is cheap Shilajit risky?",
    "a": "Real sourcing, Shodhana purification and per-batch lab testing have a cost floor; unusually cheap Shilajit often skips purification or testing, risking contamination.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ198",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "Is resin better than gummies or capsules for authenticity?",
    "a": "Resin is closest to the purified exudate and easiest to test as the actual product; gummies/capsules add ingredients and can mask low Shilajit content.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ199",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What is Triphala-purified Shilajit and is it better?",
    "a": "It's Shilajit purified via classical Shodhana using Triphala decoction. It's a recognised traditional method; note competitors use similar language, so verify with the lab report, not the term alone.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ200",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "How can I tell purified from unpurified Shilajit?",
    "a": "Purified (Shodhit) resin is smooth, uniform, dissolves cleanly and has a lab report; unpurified may be gritty, inconsistent and untested — and unsafe.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ201",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What does NABL-tested mean?",
    "a": "NABL is India's National Accreditation Board for Testing and Calibration Laboratories; NABL-tested means an accredited lab verified the product's safety/quality parameters.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ202",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What does AYUSH-GMP mean?",
    "a": "AYUSH-GMP certifies that an Ayurvedic product is made under Good Manufacturing Practices regulated by the Ministry of AYUSH, ensuring quality controls.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ203",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "How do I read a Shilajit COA (Certificate of Analysis)?",
    "a": "Check heavy metals (lead, arsenic, mercury, cadmium) are within limits, review microbial results, and confirm fulvic acid % with the test method — for your specific batch.",
    "intent": "HowTo",
    "priority": "P1"
  },
  {
    "id": "FAQ204",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "Is Himalayan Shilajit better than other sources?",
    "a": "Himalayan Shilajit is the most researched and traditionally prized, but ‘better’ depends on purification and testing, not origin claims alone. Avoid unverified superiority claims.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ205",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "Does a QR code guarantee Shilajit is genuine?",
    "a": "A QR that links to a real, batch-specific lab report adds strong traceability; a QR that leads nowhere or to generic marketing does not.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ206",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What is the price range for genuine Shilajit resin in India?",
    "a": "Genuine purified, lab-tested resin typically ranges roughly ₹900–₹2,000 for ~20 g; prices far below this often signal skipped purification or testing.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ207",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "Why do Shilajit prices vary so much?",
    "a": "Sourcing quality, purification method, per-batch lab testing, packaging and brand model all affect price; the cheapest options usually cut purification or testing.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ208",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "How much genuine Shilajit is actually on the market?",
    "a": "Industry commentary suggests much of the ‘Shilajit’ sold is adulterated or untested, which is why third-party testing and traceability matter so much.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ209",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What is the shelf life of Shilajit resin?",
    "a": "Typically 24–36 months when stored cool, dry and sealed; always follow the printed expiry.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ210",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "Can Shilajit be exported/imported legally?",
    "a": "Genuine Ayurvedic Shilajit is traded internationally; export-quality products meet additional testing. Check destination-country supplement rules.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ211",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What is the best form of Shilajit to buy?",
    "a": "Purified, lab-tested resin for potency and testability; honey sticks (like Shahjeet) for convenience and taste. Avoid unverified powders/capsules.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ212",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "How do I store Shilajit after opening?",
    "a": "Keep it tightly sealed in a cool, dry place away from sunlight and moisture; the resin naturally softens in heat and hardens when cool.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ213",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "Is 3Tattava RockResin third-party tested?",
    "a": "Yes. RockResin is NABL third-party lab tested with ≥70% fulvic acid, Triphala-purified, and made in an AYUSH-GMP compliant facility, with a QR linking to batch reports.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ214",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "What makes 3Tattava different from other Shilajit brands?",
    "a": "3Tattava is doctor-formulated (BAMS), publishes per-batch lab reports, uses Triphala Shodhana, and offers both resin (RockResin) and honey sticks (Shahjeet) with QR traceability.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ215",
    "pillar": "Buying",
    "category": "Authenticity & Buying",
    "q": "Should I buy Shilajit on marketplaces or brand websites?",
    "a": "Buying from the brand's official site or verified stores reduces counterfeit risk and ensures batch-tested stock with genuine reports.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ216",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is a Rasayana in Ayurveda?",
    "a": "Rasayana is the Ayurvedic branch of rejuvenation and longevity; Rasayana substances like Shilajit are used to restore vitality, immunity and healthy aging.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ217",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "Is Shilajit a Rasayana?",
    "a": "Yes. Classical texts describe Shilajit as a premier Rasayana (Yogavahi) that enhances the action of other herbs and supports vitality.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ218",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "Can Vata types take Shilajit?",
    "a": "Yes, Shilajit is generally suitable and grounding for Vata; warm milk or ghee as a carrier is often recommended.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ219",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "Can Pitta types take Shilajit?",
    "a": "Pitta types can take Shilajit in moderate doses, ideally with cooling carriers like milk, and should avoid overheating foods; consult an Ayurvedic doctor if Pitta is aggravated.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ220",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "Can Kapha types take Shilajit?",
    "a": "Yes, Shilajit's stimulating, mobilizing quality suits Kapha well; warm water is a good carrier.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ221",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is Agni and how does Shilajit relate to it?",
    "a": "Agni is the digestive/metabolic fire; Shilajit is considered to support healthy metabolism and is traditionally paired with good Agni for best absorption.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ222",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is Ama and does Shilajit affect it?",
    "a": "Ama is undigested metabolic residue/toxins; Shilajit taken with strong Agni is traditionally said to help clear Ama, but should be avoided in heavy Ama states without guidance.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ223",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is Ojas and does Shilajit build it?",
    "a": "Ojas is the subtle essence of vitality/immunity; Rasayanas like Shilajit are traditionally said to nourish Ojas.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ224",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is Virya and what is Shilajit's Virya?",
    "a": "Virya is the heating/cooling potency of a substance; Shilajit is generally considered to have ushna (warming) virya, which informs its use across doshas.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ225",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is Vipaka and Shilajit's Vipaka?",
    "a": "Vipaka is the post-digestive taste/effect; Shilajit's vipaka is traditionally described as katu (pungent), relevant to its metabolic actions.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ226",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is Rasa and what is Shilajit's Rasa?",
    "a": "Rasa is taste; Shilajit is chiefly katu (pungent), tikta (bitter) and kashaya (astringent), which relate to its Kapha-reducing, metabolic qualities.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ227",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is Prabhava and does Shilajit have it?",
    "a": "Prabhava is a unique action not explained by taste/potency; Shilajit's Yogavahi (bio-enhancing) nature is considered a Prabhava.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ228",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is Yogavahi and why is Shilajit called it?",
    "a": "Yogavahi means a carrier that enhances and directs the effect of other herbs; Shilajit is classically Yogavahi, improving co-administered formulations.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ229",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is the best anupana (carrier) for Shilajit by dosha?",
    "a": "Vata: warm milk/ghee; Pitta: milk or cool-natured carriers; Kapha: warm water or honey. Choose per your constitution and season.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ230",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "Should Pitta users take Shilajit in summer?",
    "a": "Pitta types should use lower doses with cooling carriers (milk) in summer and monitor for heat signs; consult an Ayurvedic doctor if prone to Pitta aggravation.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ231",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "Is Shilajit better in winter?",
    "a": "Shilajit's warming nature makes it especially popular in colder months, though it can be used year-round with appropriate carriers.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ232",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What foods should be avoided with Shilajit?",
    "a": "Traditionally avoid heavy, incompatible (Viruddha) foods and, per some texts, certain pulses like horse gram in excess; keep the diet Pathya (wholesome).",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ233",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What foods pair well with Shilajit?",
    "a": "Warm milk, ghee, honey and a wholesome (Pathya) diet support Shilajit's action; a strong-Agni, light diet is ideal.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ234",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "Does Shilajit balance all three doshas?",
    "a": "Shilajit is considered tridoshic when used appropriately, though its warming nature means Pitta types should use suitable carriers and moderate doses.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ235",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What is Shodhana purification in Ayurveda?",
    "a": "Shodhana is classical purification to remove impurities and toxicity from a substance; for Shilajit it typically uses Triphala decoction, making it safe and potent.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ236",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "What classical texts mention Shilajit?",
    "a": "Shilajit is described in the Charaka Samhita, Sushruta Samhita and Ashtanga Hridaya among other classical Ayurvedic texts.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ237",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "Is Shilajit used in classical Ayurvedic Rasayana traditions?",
    "a": "Yes. Shilajit features prominently in the Rasayana tradition, where it is valued for supporting everyday energy, strength and vitality. Modern evidence remains preliminary, so it is best viewed as general wellbeing support.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ238",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "How does Ayurveda explain Shilajit's energy effect?",
    "a": "Ayurveda attributes it to Rasayana action nourishing the dhatus (tissues) and Ojas, plus Yogavahi bio-enhancement — distinct from stimulant energy.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ239",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "Can Shilajit be taken with Ashwagandha in Ayurveda?",
    "a": "Yes, they are a classical-style pairing for vitality and stress; Shilajit's Yogavahi nature is said to enhance co-herbs. Combination trials are limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ240",
    "pillar": "Ayurveda",
    "category": "Ayurveda & Shilajit",
    "q": "Can Shilajit be taken with Triphala?",
    "a": "Yes; Triphala supports digestion/Agni and Shilajit supports vitality — a traditional complementary pairing (and the basis of Triphala-purified Shilajit).",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ241",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit good for bodybuilding?",
    "a": "Bodybuilders use it for energy, recovery and possible strength support; one study suggested benefits to strength retention with training, but it's an adjunct, not a mass-builder.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ242",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Does Shilajit help muscle growth?",
    "a": "It may support training indirectly (energy, recovery, one muscle-gene study), but muscle growth is driven mainly by training and protein intake.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ243",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit good for running or endurance?",
    "a": "Athletes use it for energy and recovery; endurance-specific human evidence is limited, so treat benefits as supportive.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ244",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit useful for CrossFit or Hyrox?",
    "a": "For high-intensity mixed training, users take it for energy and recovery support; there is no sport-specific trial, so expectations should be realistic.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ245",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit good for cycling?",
    "a": "Cyclists use it for stamina and recovery; evidence is general rather than cycling-specific.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ246",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit good for cricket/football/team sports?",
    "a": "Team-sport athletes use it for energy and recovery; there is no sport-specific evidence, and tested-for-sport products are advisable for competitors.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ247",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit good for swimming?",
    "a": "Swimmers may use it for stamina and recovery support; no swimming-specific evidence exists.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ248",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Does Shilajit reduce muscle soreness (DOMS)?",
    "a": "Its antioxidant rationale suggests possible recovery support, but direct DOMS trial evidence is limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ249",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Does Shilajit improve protein synthesis?",
    "a": "There is no strong human evidence that Shilajit directly increases muscle protein synthesis; adequate protein and training remain primary.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ250",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit a pre-workout?",
    "a": "It's not a stimulant pre-workout but is used before training for non-jittery energy support; Shahjeet Sticks are designed for this.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ251",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Should I take Shilajit before or after training?",
    "a": "Either works; pre-workout for energy, post-workout for recovery. Consistency matters more than exact timing.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ252",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Can Shilajit replace my pre-workout supplement?",
    "a": "It can replace stimulant pre-workouts for those avoiding caffeine, but it won't give the same acute ‘kick’; it's a different, non-stimulant approach.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ253",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit good for recovery between workouts?",
    "a": "Its mineral/antioxidant profile is the rationale for recovery use; pair with sleep, protein and hydration for best results.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ254",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Does Shilajit help with energy during workouts?",
    "a": "A 2019 study suggested purified Shilajit may support performance/strength retention; acute energy claims should stay modest.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ255",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Can I stack Shilajit with creatine?",
    "a": "Yes, they work differently and are commonly stacked; keep hydration up and doses within recommendations.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ256",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Can I stack Shilajit with whey protein?",
    "a": "Yes; dissolve resin in warm water first, then add to a room-temperature shake.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ257",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Can I stack Shilajit with ashwagandha for training?",
    "a": "Yes, a common vitality/recovery stack; combination-specific evidence is limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ258",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit banned in sports (WADA)?",
    "a": "Shilajit itself isn't a WADA-banned substance, but supplements risk contamination; competitive athletes should use batch-tested/Informed-Sport products.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ259",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Does Shilajit improve VO2 max or aerobic capacity?",
    "a": "There is no strong human evidence that Shilajit improves VO2 max; endurance claims are not well supported.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ260",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit good for strength training specifically?",
    "a": "One resistance-training study suggested it helped maintain strength; it's a plausible adjunct alongside proper programming.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ261",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Does Shilajit help with fatigue in athletes?",
    "a": "Its Rasayana role targets fatigue; athletes use it for daily energy support, though direct athletic-fatigue trials are limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ262",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit good for older/masters athletes?",
    "a": "Midlife athletes traditionally value purified Shilajit as a Rasayana for everyday energy and recovery support; start low, follow the label and monitor how you feel.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ263",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Can women athletes take Shilajit for performance?",
    "a": "Yes, like men, for energy and recovery support; evidence isn't female-specific, and it should be avoided in pregnancy.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ264",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "How long before I see gym benefits from Shilajit?",
    "a": "Allow 8–12 weeks of consistent use alongside training; benefits are gradual and supportive, not immediate.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ265",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Does Shilajit help with joint or bone health for lifters?",
    "a": "Its mineral profile is linked traditionally to bone health; direct joint-health trials are lacking, so frame as supportive.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ266",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit good for HYROX-style hybrid athletes?",
    "a": "Hybrid athletes use it for energy and recovery; there's no event-specific evidence, so treat it as general support.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ267",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Should I take Shilajit on rest days?",
    "a": "Yes; daily consistency supports the Rasayana pattern, so continue on rest days.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ268",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Can Shilajit help me train fasted?",
    "a": "Some take it before fasted training for non-stimulant energy; individual tolerance on an empty stomach varies.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ269",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Does Shilajit improve grip or power output?",
    "a": "There's no strong evidence for acute power/grip improvements; benefits, if any, are gradual and general.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ270",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shilajit worth it for casual gym-goers?",
    "a": "For non-stimulant energy and recovery support with a quality-verified product, many find it worthwhile; set realistic, gradual expectations.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ271",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Can Shilajit help with workout consistency and motivation?",
    "a": "Indirectly, via energy and reduced fatigue; motivation also depends on sleep, routine and goals.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ272",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Is Shahjeet Stick good for pre-workout energy?",
    "a": "Yes — Shahjeet delivers 600 mg purified Shilajit in honey, giving quick-carrier energy support without stimulants; tear, squeeze, and take before training.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ273",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Should endurance athletes use resin or honey sticks?",
    "a": "Honey sticks are convenient mid-session and provide a carrier; resin suits a fixed daily ritual. Choose by convenience and preference.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ274",
    "pillar": "Fitness",
    "category": "Fitness & Sports",
    "q": "Does Shilajit help with cramp prevention?",
    "a": "Its minerals (e.g., magnesium) are associated with muscle function, but there's no strong cramp-prevention trial; hydration and electrolytes remain primary.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ275",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for students?",
    "a": "Students use it for energy and focus support; procognitive potential is proposed but unproven in humans, so pair it with sleep and study habits.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ276",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for entrepreneurs and founders?",
    "a": "For sustained energy and stress resilience without stimulants it's a popular Rasayana choice; treat it as support alongside sleep and recovery.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ277",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for shift workers?",
    "a": "Shift workers use it for energy support against disrupted rhythms; take it at the start of your active period and prioritize sleep hygiene.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ278",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for frequent travelers?",
    "a": "Travelers use it for energy and recovery; honey sticks are travel-friendly and mess-free. Keep to recommended doses and hydrate.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ279",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for biohackers?",
    "a": "Biohackers value its fulvic acid, DBPs and mineral profile; the evidence is early, so track your own response (e.g., energy, labs) objectively.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ280",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for busy working professionals?",
    "a": "For daily fatigue and focus support it's widely used; results are gradual and depend on addressing sleep, nutrition and stress too.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ281",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for older adults?",
    "a": "Older adults use it for energy, bone and vitality support; start low, review medications with a doctor, and choose a lab-tested product.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ282",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Can Shilajit help with brain fog?",
    "a": "Users take it for mental clarity; procognitive potential is proposed but not proven, so address sleep, hydration and stress as well.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ283",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for stress and burnout?",
    "a": "As an adaptogen/Rasayana it's used for stress resilience; combine with rest and lifestyle changes for meaningful relief.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ284",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Can Shilajit improve daily energy without caffeine?",
    "a": "Yes, that's a core reason people choose it — non-stimulant energy support; effects build gradually with consistent use.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ285",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for people who sit all day?",
    "a": "It's used for energy and to counter afternoon slumps, but movement, posture and sleep remain essential.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ286",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for new parents with sleep deprivation?",
    "a": "It may support daytime energy, but it's not a sleep replacement; breastfeeding parents should avoid it until nursing ends.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ287",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Can Shilajit help with jet lag?",
    "a": "There's no direct jet-lag evidence; some travelers use it for energy on arrival, alongside light exposure and hydration strategies.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ288",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for exam preparation?",
    "a": "Students use it for sustained energy; it's not a nootropic shortcut, so prioritize sleep, revision and nutrition.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ289",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit suitable for a vegan lifestyle?",
    "a": "Pure resin is vegan; honey-based Shahjeet Sticks are vegetarian but not vegan.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ290",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for people who don't eat much red meat?",
    "a": "Its iron and minerals may complement plant-based diets, but it isn't a substitute for balanced nutrition or diagnosed-deficiency treatment.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ291",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Can Shilajit help with seasonal energy dips?",
    "a": "Its warming, Rasayana nature is popular in colder months for energy support; use appropriate carriers by season.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ292",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for a longevity-focused routine?",
    "a": "It's a classical Rasayana associated with healthy aging; human longevity evidence is limited, so include it as one part of a broader routine.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ293",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Can Shilajit fit into a corporate wellness routine?",
    "a": "Yes, as a daily non-stimulant energy ritual; pair with movement, hydration and stress practices.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ294",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for gamers or long screen sessions?",
    "a": "Users take it for sustained energy and focus support; manage screen breaks, hydration and sleep for real benefit.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ295",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for people trying to cut caffeine?",
    "a": "It's a common non-stimulant alternative for energy support during caffeine reduction; taper caffeine gradually.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ296",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Can Shilajit support a morning routine?",
    "a": "Yes; the Dip-Hook-Swirl resin ritual or a honey stick fits naturally into a morning wellness routine.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ297",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for people recovering from illness fatigue?",
    "a": "Rasayanas are traditionally used in convalescence, but anyone recovering from illness should consult a doctor before starting.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ298",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Can Shilajit help with productivity?",
    "a": "Indirectly, by supporting energy and reducing fatigue; productivity ultimately depends on sleep, focus habits and workload.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ299",
    "pillar": "Lifestyle",
    "category": "Lifestyle Segments",
    "q": "Is Shilajit good for men and women equally in daily life?",
    "a": "Yes; the daily energy, recovery and mineral rationale applies to both, with pregnancy/lactation being the key exception for women.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ300",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "How do I make a Shilajit morning drink?",
    "a": "Dissolve a pea-sized (≈300–500 mg) resin in a cup of warm water or milk, stir until fully dissolved, and drink on an empty stomach or after breakfast.",
    "intent": "HowTo",
    "priority": "P1"
  },
  {
    "id": "FAQ301",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I make Shilajit lemonade?",
    "a": "Yes — dissolve resin in a little warm water, cool it, then mix into fresh lemonade. Avoid adding resin directly to ice-cold or boiling liquid.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ302",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "How do I make a Shilajit summer cooler?",
    "a": "Pre-dissolve resin in warm water, cool, and combine with coconut water, mint and lemon for a cooling drink — a good option for Pitta types in summer.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ303",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I make a Shilajit smoothie?",
    "a": "Yes; dissolve resin in warm water first, then blend into a fruit or protein smoothie so it disperses evenly.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ304",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "How do I add Shilajit to a protein shake?",
    "a": "Dissolve resin in a few tablespoons of warm water, then stir into a room-temperature protein shake; avoid very hot liquids.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ305",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I make Shilajit coffee?",
    "a": "You can stir pre-dissolved resin into warm (not scalding) coffee, though water or milk are better carriers for taste and dissolution.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ306",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "How do I make Shilajit golden milk?",
    "a": "Dissolve resin in warm milk with a pinch of turmeric and black pepper; a soothing evening or winter drink.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ307",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I make a Shilajit electrolyte drink?",
    "a": "Yes; combine pre-dissolved resin with coconut water, a pinch of salt and lemon for a natural post-workout electrolyte drink.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ308",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "How do I make a Shilajit honey tonic?",
    "a": "Mix pre-dissolved resin with warm water and a teaspoon of honey; or simply use a Shahjeet honey stick, which already combines both.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ309",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I make a Shilajit mocktail?",
    "a": "Yes; pre-dissolve resin, cool, and mix with soda, lemon, mint and a touch of honey for a functional mocktail.",
    "intent": "HowTo",
    "priority": "P3"
  },
  {
    "id": "FAQ310",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I add Shilajit to herbal tea?",
    "a": "Yes; add pre-dissolved resin to warm (not boiling) herbal tea such as tulsi or ginger.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ311",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "How do I make a pre-workout Shilajit drink?",
    "a": "Dissolve resin (or use a Shahjeet stick) in warm water 20–30 minutes before training for non-stimulant energy support.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ312",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "How do I make a post-workout Shilajit recovery drink?",
    "a": "Combine pre-dissolved resin with coconut water, lemon and a pinch of salt, or add to a protein shake for recovery support.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ313",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I make Shilajit ginger tea?",
    "a": "Yes; add pre-dissolved resin to warm ginger tea — a warming option for Kapha or cold weather.",
    "intent": "HowTo",
    "priority": "P3"
  },
  {
    "id": "FAQ314",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I use Shilajit in overnight oats or food?",
    "a": "It's best taken in warm liquid for dosing accuracy; adding to cold food is possible but harder to dose and taste-mask.",
    "intent": "HowTo",
    "priority": "P3"
  },
  {
    "id": "FAQ315",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "What is the best drink to mask Shilajit's bitter taste?",
    "a": "Warm milk with honey, or golden milk, masks bitterness best; Shahjeet honey sticks avoid the taste entirely.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ316",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I make a Shilajit turmeric shot?",
    "a": "Yes; combine pre-dissolved resin with turmeric, black pepper, lemon and warm water for a concentrated wellness shot.",
    "intent": "HowTo",
    "priority": "P3"
  },
  {
    "id": "FAQ317",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I make a Shilajit and ashwagandha drink?",
    "a": "Yes; dissolve resin and ashwagandha in warm milk for an evening vitality/stress drink (a traditional-style pairing).",
    "intent": "HowTo",
    "priority": "P3"
  },
  {
    "id": "FAQ318",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Is it okay to mix Shilajit into hot chocolate?",
    "a": "Warm (not boiling) hot chocolate can carry pre-dissolved resin, though sugar content should be considered.",
    "intent": "HowTo",
    "priority": "P3"
  },
  {
    "id": "FAQ319",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I make iced Shilajit drinks in summer?",
    "a": "Yes; always pre-dissolve resin in warm water first, then cool and pour over ice — don't add resin directly to ice-cold liquid.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ320",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "How much Shilajit goes into one recipe serving?",
    "a": "One serving should contain your daily dose (≈300–500 mg resin or one Shahjeet stick), not more, even in a recipe.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ321",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I prepare Shilajit drinks in advance?",
    "a": "It's best made fresh; if prepared ahead, refrigerate and consume within the day, keeping it sealed.",
    "intent": "HowTo",
    "priority": "P3"
  },
  {
    "id": "FAQ322",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "What carrier is best for a Pitta-friendly Shilajit recipe?",
    "a": "Milk, coconut water or cooling herbs (mint, fennel) suit Pitta; avoid overly heating spices in large amounts.",
    "intent": "HowTo",
    "priority": "P3"
  },
  {
    "id": "FAQ323",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can children have Shilajit recipes?",
    "a": "No; Shilajit drinks are formulated for adults. Children should only use Shilajit under medical supervision.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ324",
    "pillar": "Recipes",
    "category": "Recipes & Beverages",
    "q": "Can I make a Shilajit latte?",
    "a": "Yes; a Shilajit milk latte (with optional turmeric or cacao) using warm milk is a popular format — pre-dissolve the resin first.",
    "intent": "HowTo",
    "priority": "P3"
  },
  {
    "id": "FAQ325",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "What is Triphala?",
    "a": "Triphala is a classical Ayurvedic formulation of three fruits — Haritaki, Bibhitaki and Amalaki — used chiefly for digestion, detoxification and as a tridoshic Rasayana.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ326",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "What are the three fruits in Triphala?",
    "a": "Haritaki (Terminalia chebula), Bibhitaki (Terminalia bellirica) and Amalaki (Emblica officinalis / Indian gooseberry), combined in classical proportions.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ327",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "What is Haritaki used for?",
    "a": "Haritaki (Terminalia chebula) is traditionally used for digestion, elimination and rejuvenation, and is called the ‘king of medicines’ in Ayurveda.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ328",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "What is Bibhitaki used for?",
    "a": "Bibhitaki (Terminalia bellirica) is traditionally used for respiratory and digestive support and Kapha balance.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ329",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "What is Amalaki (Amla) used for?",
    "a": "Amalaki (Indian gooseberry) is a vitamin-C-rich Rasayana traditionally used for immunity, digestion, hair, skin and antioxidant support.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ330",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "What are the benefits of Triphala?",
    "a": "Traditionally used for digestion, regularity, detox and rejuvenation; a 2017 review summarizes evidence for digestive and antioxidant effects, though more trials are needed.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ331",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala good for digestion?",
    "a": "Yes, digestion and regularity are Triphala's most established traditional uses, supported by preliminary research.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ332",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Does Triphala help with constipation?",
    "a": "Triphala is traditionally used to support healthy, non-habit-forming elimination; it's a common natural approach to occasional constipation.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ333",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala good for the gut microbiome?",
    "a": "Preliminary research suggests Triphala's polyphenols may support gut microbiome balance; human data are still emerging.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ334",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Does Triphala have antioxidants?",
    "a": "Yes, Triphala (especially Amalaki) is rich in polyphenols and vitamin C, giving it notable antioxidant activity.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ335",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala good for weight management?",
    "a": "Some studies suggest possible metabolic/weight benefits, but evidence is preliminary; it's an adjunct to diet and activity, not a weight-loss drug.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ336",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala good for the eyes?",
    "a": "Traditionally used for eye health (e.g., as Triphala eyewash/netra), though robust modern clinical eye evidence is limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ337",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala good for skin?",
    "a": "Its antioxidant/detox rationale supports skin-from-within use traditionally; direct skin trials are limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ338",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala good for hair?",
    "a": "Amalaki content links Triphala to traditional hair support; strong clinical hair evidence is limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ339",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Can women take Triphala?",
    "a": "Yes, Triphala is generally suitable for women; it should be avoided in pregnancy (Haritaki is traditionally contraindicated in pregnancy).",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ340",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Can men take Triphala?",
    "a": "Yes; men use Triphala for digestion, detox and general wellness.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ341",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "What is the best time to take Triphala?",
    "a": "Traditionally taken at night (before bed) for elimination or in the morning for rejuvenation, depending on the goal.",
    "intent": "HowTo",
    "priority": "P1"
  },
  {
    "id": "FAQ342",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "What is the dosage of Triphala?",
    "a": "Commonly 1–3 g of churna (powder) or as directed; start low and adjust. Follow product-specific directions.",
    "intent": "HowTo",
    "priority": "P1"
  },
  {
    "id": "FAQ343",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "How is Triphala taken?",
    "a": "As churna (powder) in warm water, as tablets, or as a decoction; powder with warm water at night is the classic method.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ344",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala safe for daily long-term use?",
    "a": "Triphala is traditionally used long-term as a Rasayana; still, take periodic breaks and consult a doctor if you have GI conditions.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ345",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "What are Triphala's side effects?",
    "a": "Occasional loose stools, cramping or gas, especially at higher doses; reduce the dose if this occurs.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ346",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Who should avoid Triphala?",
    "a": "Avoid in pregnancy; use caution in diarrhea, and consult a doctor if you have chronic GI disease or take medications.",
    "intent": "Safety",
    "priority": "P1"
  },
  {
    "id": "FAQ347",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala a Rasayana?",
    "a": "Yes, Triphala is a classical tridoshic Rasayana used for rejuvenation and balancing all three doshas.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ348",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Can Triphala be taken with Shilajit?",
    "a": "Yes; they complement each other (digestion + vitality), and Triphala decoction is used to purify Shilajit (Triphala-purified Shilajit).",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ349",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala good for immunity?",
    "a": "Its antioxidant, vitamin-C-rich profile supports immunity traditionally; direct immune-outcome trials are limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ350",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala good for athletes?",
    "a": "Athletes use it for digestion, detox and recovery support; sport-specific evidence is limited.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ351",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Can Triphala help with bloating?",
    "a": "Traditionally yes, by supporting digestion and elimination; individual response varies.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ352",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "What classical texts describe Triphala?",
    "a": "Triphala is described across classical texts including the Charaka Samhita and Sushruta Samhita as a key Rasayana and digestive formulation.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ353",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala tridoshic?",
    "a": "Yes; each fruit predominantly balances one dosha (Amalaki-Pitta, Bibhitaki-Kapha, Haritaki-Vata), making the blend tridoshic.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ354",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "How should Triphala be stored?",
    "a": "Store the powder or tablets in a cool, dry, airtight container away from moisture and sunlight.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ355",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala standardized in modern products?",
    "a": "Quality products standardize ingredient ratios and may test for tannin/polyphenol markers and contaminants; look for GMP and lab testing.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ356",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Can Triphala be used as a mouth or eye wash?",
    "a": "Traditionally Triphala decoction is used for gargling and eye washing (netra prakshalana); use only sterile, properly prepared preparations and seek guidance.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ357",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Does Triphala help with detox?",
    "a": "Ayurveda uses Triphala for gentle detoxification (Ama clearance) via improved digestion and elimination; ‘detox’ here is traditional, not a clinical claim.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ358",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Is Triphala good for gut-brain health?",
    "a": "Emerging microbiome research is of interest for gut-brain links, but direct Triphala gut-brain trials are lacking.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ359",
    "pillar": "Triphala",
    "category": "Triphala Knowledge",
    "q": "Why does 3Tattava use Triphala to purify Shilajit?",
    "a": "Triphala decoction is a classical Shodhana medium that helps remove impurities from raw Shilajit while aligning with Ayurvedic tradition — the basis of RockResin's purification.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ360",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Ayurveda?",
    "a": "Ayurveda is a ~3,000-year-old Indian system of medicine focused on balance of body, mind and environment through diet, lifestyle, herbs and therapies. ‘Ayurveda’ means ‘science of life’.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ361",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is the history of Ayurveda?",
    "a": "Ayurveda originates in the Vedic period of ancient India and was systematized in classical texts like the Charaka Samhita and Sushruta Samhita over 2,000 years ago.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ362",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is the philosophy behind Ayurveda?",
    "a": "Ayurveda draws on Samkhya and other Indian philosophies, viewing health as balance among doshas, dhatus, Agni and mind, in harmony with nature.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ363",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is the Panchamahabhuta theory?",
    "a": "It's the five-element theory — space (Akasha), air (Vayu), fire (Agni/Tejas), water (Jala) and earth (Prithvi) — that compose all matter, including the body and doshas.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ364",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What are the three doshas (Tridosha)?",
    "a": "Vata (air+space), Pitta (fire+water) and Kapha (earth+water) are the three functional energies governing physiology; balance means health, imbalance means disease.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ365",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What are the Sapta Dhatus?",
    "a": "The seven body tissues — Rasa (plasma), Rakta (blood), Mamsa (muscle), Meda (fat), Asthi (bone), Majja (marrow) and Shukra (reproductive) — nourished in sequence.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ366",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What are Malas in Ayurveda?",
    "a": "Malas are the body's waste products — mainly urine (Mutra), feces (Purisha) and sweat (Sweda) — whose proper elimination is essential to health.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ367",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Agni in Ayurveda?",
    "a": "Agni is the digestive and metabolic ‘fire’ responsible for transforming food into energy and tissues; strong Agni is central to health.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ368",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Ama in Ayurveda?",
    "a": "Ama is toxic, undigested residue produced by weak Agni; its accumulation is considered a root cause of many disorders.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ369",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Ojas?",
    "a": "Ojas is the subtle essence of all tissues, governing immunity, vitality and resilience; Rasayanas aim to build Ojas.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ370",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Tejas in Ayurveda?",
    "a": "Tejas is the subtle essence of fire/metabolism governing intelligence and transformation at a cellular level, complementary to Ojas and Prana.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ371",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Prana in Ayurveda?",
    "a": "Prana is the vital life-force/energy governing breath, movement and mind; it is one of the three subtle essences with Tejas and Ojas.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ372",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What are Srotas?",
    "a": "Srotas are the body's channels (e.g., for nutrition, circulation, elimination); their healthy flow or blockage determines wellness or disease.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ373",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Prakriti?",
    "a": "Prakriti is your innate constitution — the dosha balance you're born with — which shapes physical traits, personality and health tendencies.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ374",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Vikriti?",
    "a": "Vikriti is your current state of dosha imbalance, as opposed to Prakriti (natural constitution); Ayurvedic treatment aims to return Vikriti toward Prakriti.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ375",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Dinacharya?",
    "a": "Dinacharya is the Ayurvedic daily routine — practices like waking early, oral care, oil massage, exercise and meals — aligned to natural rhythms for health.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ376",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Ritucharya?",
    "a": "Ritucharya is the seasonal routine — adjusting diet and lifestyle to each season (Ritu) to maintain dosha balance and prevent seasonal illness.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ377",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Ritusandhi?",
    "a": "Ritusandhi is the transition period between two seasons; Ayurveda advises gradually changing routine during it to avoid disease.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ378",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Sadvritta?",
    "a": "Sadvritta is the Ayurvedic code of ethical and healthy conduct — mental and social behaviours that preserve health and harmony.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ379",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Rasayana?",
    "a": "Rasayana is the rejuvenation branch of Ayurveda aimed at longevity, immunity and vitality; Shilajit and Triphala are classical Rasayanas.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ380",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Vajikarana?",
    "a": "Vajikarana is a classical branch of Ayurveda traditionally concerned with rejuvenation, strength and overall vitality. This is historical and educational context, not a therapeutic claim.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ381",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Nidana?",
    "a": "Nidana is the study of the causes and diagnosis of disease in Ayurveda.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ382",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Samprapti?",
    "a": "Samprapti is the pathogenesis — the step-by-step process by which a disease develops from cause to manifestation.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ383",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Chikitsa Siddhanta?",
    "a": "Chikitsa Siddhanta refers to the principles of Ayurvedic treatment, including Shodhana (purification) and Shamana (pacification) approaches.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ384",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Panchakarma?",
    "a": "Panchakarma is Ayurveda's five-fold detoxification therapy (e.g., Vamana, Virechana, Basti, Nasya, Raktamokshana) for deep cleansing and rebalancing.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ385",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Shodhana in Ayurveda?",
    "a": "Shodhana is purification — both body-detox therapies and the processing of substances (like Shilajit) to remove impurities.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ386",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Shamana?",
    "a": "Shamana is the pacification approach — using diet, herbs and lifestyle to calm aggravated doshas without full detox.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ387",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Pathya and Apathya?",
    "a": "Pathya means wholesome, suitable diet/lifestyle that supports healing; Apathya means unsuitable choices to avoid. They're central to Ayurvedic therapy.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ388",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Sankhya philosophy's role in Ayurveda?",
    "a": "Samkhya philosophy provides Ayurveda's framework of Purusha (consciousness), Prakriti (nature) and the evolution of the elements and mind.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ389",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is the goal of Ayurveda?",
    "a": "To maintain the health of the healthy and treat the diseased — balancing doshas, Agni, tissues and mind for longevity and wellbeing.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ390",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "Is Ayurveda scientific?",
    "a": "Ayurveda is an experiential medical system; some remedies have modern research support while others lack it. 3Tattava distinguishes traditional use from proven evidence.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ391",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is the Ministry of AYUSH?",
    "a": "AYUSH is the Indian government ministry regulating Ayurveda, Yoga, Unani, Siddha and Homeopathy, including manufacturing standards (AYUSH-GMP).",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ392",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What are the classical texts of Ayurveda?",
    "a": "The principal classical texts (Brihat Trayi) are the Charaka Samhita, Sushruta Samhita and Ashtanga Hridaya of Vagbhata.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ393",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "What is Dravyaguna?",
    "a": "Dravyaguna is the Ayurvedic science of medicinal substances — their properties (Guna), taste (Rasa), potency (Virya), post-digestive effect (Vipaka) and action.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ394",
    "pillar": "Ayurveda Fundamentals",
    "category": "Fundamentals",
    "q": "How does Ayurveda define health?",
    "a": "Ayurveda (Sushruta) defines health as balanced doshas, Agni, tissues and wastes, with a clear, happy state of soul, senses and mind — not merely absence of disease.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ395",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Why does Prakriti matter for supplements?",
    "a": "Your constitution guides which herbs, carriers and doses suit you; e.g., Pitta types may prefer Shilajit with milk, while Kapha types do well with warm water.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ396",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "How is Prakriti assessed?",
    "a": "Through Prakriti Parikshan — evaluating physical traits, physiology, and temperament, ideally by an Ayurvedic physician or a structured assessment/quiz.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ397",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What is Prakriti vs Vikriti?",
    "a": "Prakriti is your natural constitution; Vikriti is your current imbalance. Treatment aims to bring Vikriti back toward Prakriti.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ398",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Can I have a mixed constitution?",
    "a": "Yes; most people are dual-doshic (e.g., Vata-Pitta) and some are tridoshic (Sama). Recommendations blend the guidance for each dominant dosha.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ399",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What are Vata characteristics?",
    "a": "Vata types tend to be light, lean, quick, creative and prone to dryness, cold and irregular digestion when imbalanced.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ400",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What are Pitta characteristics?",
    "a": "Pitta types tend to be medium-built, focused, driven and warm, prone to acidity, inflammation and irritability when imbalanced.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ401",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What are Kapha characteristics?",
    "a": "Kapha types tend to be solid, calm, steady and nurturing, prone to sluggishness, weight gain and congestion when imbalanced.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ402",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Which foods suit Vata?",
    "a": "Warm, moist, grounding foods — cooked grains, healthy fats, warm milk — while avoiding excess raw, cold, dry foods.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ403",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Which foods suit Pitta?",
    "a": "Cooling, less spicy foods — sweet fruits, vegetables, milk — while avoiding excess heat, oil, sour and spicy foods.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ404",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Which foods suit Kapha?",
    "a": "Light, warm, spiced foods — vegetables, legumes, warming spices — while avoiding excess heavy, oily, sweet foods.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ405",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Is Shilajit suitable for Vata types?",
    "a": "Yes; Shilajit's grounding, nourishing Rasayana action suits Vata, ideally with warm milk or ghee.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ406",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Is Shilajit suitable for Pitta types?",
    "a": "Yes in moderation, with cooling carriers like milk; Pitta types should watch for heat signs and use lower doses.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ407",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Is Shilajit suitable for Kapha types?",
    "a": "Yes; its warming, mobilizing quality suits Kapha well, with warm water as the carrier.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ408",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Is Triphala suitable for all doshas?",
    "a": "Yes; Triphala is tridoshic and generally suitable for Vata, Pitta and Kapha constitutions.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ409",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What is Sama (balanced) Prakriti?",
    "a": "Sama Prakriti is a rare, balanced tridoshic constitution where all three doshas are relatively equal, associated with good resilience.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ410",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What is Manas Prakriti?",
    "a": "Manas Prakriti is the mental constitution based on the three gunas — Sattva (clarity), Rajas (activity) and Tamas (inertia).",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ411",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What is Sattva?",
    "a": "Sattva is the mental quality of clarity, calm and balance; a Sattvic lifestyle and diet support mental performance and equanimity.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ412",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What is Rajas?",
    "a": "Rajas is the mental quality of activity, drive and restlessness; balanced Rajas fuels productivity, excess causes stress.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ413",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What is Tamas?",
    "a": "Tamas is the mental quality of inertia, heaviness and dullness; excess leads to lethargy and low motivation.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ414",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "How do I balance Vata dosha?",
    "a": "Favor warmth, routine, grounding foods, oil massage (Abhyanga) and adequate rest; avoid excess cold, dryness and irregularity.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ415",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "How do I balance Pitta dosha?",
    "a": "Favor cooling foods, moderation, calm environments and avoiding excess heat, spice and overwork.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ416",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "How do I balance Kapha dosha?",
    "a": "Favor activity, warmth, lighter spiced foods and stimulation; avoid excess sleep, heaviness and sweets.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ417",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What are signs of Vata aggravation?",
    "a": "Dryness, constipation, anxiety, insomnia, joint cracking and irregular energy are common Vata-aggravation signs.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ418",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What are signs of Pitta aggravation?",
    "a": "Acidity, heat, inflammation, irritability, skin rashes and loose stools are common Pitta-aggravation signs.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ419",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What are signs of Kapha aggravation?",
    "a": "Heaviness, congestion, weight gain, lethargy and excessive sleep are common Kapha-aggravation signs.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ420",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Does season affect my dosha?",
    "a": "Yes; each season predominates a dosha (e.g., Vata in autumn, Pitta in summer, Kapha in spring), which is why Ritucharya adjusts routines.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ421",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Which dosha benefits most from Shilajit?",
    "a": "Kapha and Vata types often align well with Shilajit's warming, grounding action; Pitta types should use cooling carriers and moderation.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ422",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Can my Prakriti change over life?",
    "a": "Prakriti (birth constitution) stays constant; Vikriti (current state) changes with age, diet, season and lifestyle.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ423",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "How can I find my dosha online?",
    "a": "A structured Prakriti quiz gives a useful indication, but a qualified Ayurvedic assessment is more accurate; use quizzes as a starting point.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ424",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Does exercise depend on dosha?",
    "a": "Yes; Vata suits gentle grounding exercise, Pitta moderate non-overheating activity, Kapha vigorous stimulating exercise.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ425",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Does sleep need vary by dosha?",
    "a": "Yes; Vata often needs more rest and routine, Pitta moderate cooling rest, Kapha benefits from earlier rising and less oversleeping.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ426",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "What herbs suit each dosha?",
    "a": "Vata: ashwagandha, Shilajit with milk; Pitta: amla, shatavari, cooling herbs; Kapha: Triphala, ginger, Shilajit with warm water (general guidance).",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ427",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "How does Manas Prakriti relate to modern psychology?",
    "a": "The gunas loosely parallel modern ideas of clarity, arousal/drive and lethargy; correlations are conceptual, not clinically validated.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ428",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "How can I increase Sattva?",
    "a": "Favor fresh Sattvic foods, meditation, routine, nature and calm; reduce excess stimulation, intoxicants and overwork.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ429",
    "pillar": "Prakriti",
    "category": "Prakriti & Dosha",
    "q": "Does Prakriti affect stress and productivity?",
    "a": "Yes; understanding your constitution helps tailor diet, routine and recovery to sustain focus and manage stress.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ430",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Ahara in Ayurveda?",
    "a": "Ahara means food/nutrition; Ayurveda considers proper food, quantity, timing and combination central to health and Agni.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ431",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Ahara Kala (meal timing)?",
    "a": "Ahara Kala is the Ayurvedic principle of eating at the right times, aligned with Agni and daily rhythm — typically the largest meal at midday.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ432",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "Why is midday the best time for the main meal?",
    "a": "Agni (digestive fire) is strongest at midday, mirroring the sun, so the largest meal digests best then.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ433",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Viruddha Ahara (incompatible foods)?",
    "a": "Viruddha Ahara are food combinations Ayurveda considers incompatible (e.g., milk with fish or sour fruit), believed to create Ama and disturb health.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ434",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is food combining in Ayurveda?",
    "a": "Ayurveda advises pairing compatible foods and avoiding conflicting combinations to protect digestion and prevent Ama.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ435",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "Does Ayurveda support intermittent fasting?",
    "a": "Ayurveda has long used Langhana (lightening/fasting) to kindle Agni and clear Ama; approaches should suit your constitution and season.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ436",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Ayurvedic gym/sports nutrition?",
    "a": "It emphasizes strong Agni, wholesome (Pathya) protein and warm cooked foods, good timing, and Rasayanas like Shilajit for recovery support.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ437",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "How does Ayurveda view protein intake?",
    "a": "Ayurveda values easily digestible protein aligned with Agni; over-eating protein beyond digestive capacity is thought to create Ama.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ438",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is recovery nutrition in Ayurveda?",
    "a": "Warm, nourishing, easily digested foods, adequate rest, and Rasayanas support post-exertion recovery in Ayurveda.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ439",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is seasonal eating (Ritucharya diet)?",
    "a": "Adjusting foods to the season — cooling foods in summer, warming foods in winter — to keep doshas balanced.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ440",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Varsha Ritu and its diet?",
    "a": "Varsha (monsoon) aggravates Vata and weakens Agni; favor light, warm, easily digestible foods and avoid heavy, raw items.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ441",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Grishma Ritu and its diet?",
    "a": "Grishma (summer) aggravates Pitta; favor cooling, hydrating, sweet foods and reduce heating, spicy items — use cooling Shilajit carriers.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ442",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Sharad Ritu and its diet?",
    "a": "Sharad (autumn) aggravates Pitta; favor cooling, bitter-sweet foods and Pitta-pacifying routines.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ443",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Hemanta Ritu and its diet?",
    "a": "Hemanta (early winter) strengthens Agni; nourishing, heavier, warming foods and Rasayanas like Shilajit are well-suited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ444",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Shishira Ritu and its diet?",
    "a": "Shishira (late winter) is cold and Kapha-accumulating; warm, nourishing foods and warming spices are advised.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ445",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Vasanta Ritu and its diet?",
    "a": "Vasanta (spring) aggravates Kapha; favor light, warm, spiced foods, and reduce heavy sweet/oily items.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ446",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "Is Shilajit better in some seasons?",
    "a": "Its warming nature makes autumn/winter (Hemanta/Shishira) ideal, though it can be used year-round with appropriate carriers.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ447",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "When should I take Triphala seasonally?",
    "a": "Triphala can be used year-round; it's especially valued in spring (Kapha season) and for routine digestive support.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ448",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Dinacharya (daily routine)?",
    "a": "Dinacharya is the ideal Ayurvedic daily routine — early waking, oral hygiene, Abhyanga (oil massage), exercise, timed meals and sleep — for health.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ449",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "How does circadian rhythm relate to Ayurveda?",
    "a": "Ayurveda's dosha clock (Vata/Pitta/Kapha times of day) parallels circadian rhythm, guiding when to wake, eat and sleep.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ450",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Pathya diet for a supplement routine?",
    "a": "Pathya means wholesome foods/habits that support your goal — warm, fresh, balanced meals that aid Agni and complement Rasayanas.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ451",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What is Apathya to avoid with Shilajit?",
    "a": "Heavy, incompatible (Viruddha), excessively cold or processed foods that dampen Agni are traditionally discouraged alongside Rasayana use.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ452",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "Does meal timing affect supplement absorption?",
    "a": "Ayurveda links absorption to Agni strength and timing; taking Rasayanas when Agni is appropriate (often morning) is traditional.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ453",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "What foods strengthen Agni?",
    "a": "Warm cooked foods, ginger, cumin, black pepper and mindful eating strengthen Agni; cold, heavy, processed foods weaken it.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ454",
    "pillar": "Ahara",
    "category": "Ahara & Ritucharya",
    "q": "How does Ayurveda approach hydration?",
    "a": "Warm or room-temperature water, sipped through the day, is preferred; iced water is thought to dampen Agni.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ455",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "Where does Shilajit come from?",
    "a": "Shilajit forms in high-altitude mountain rocks over centuries from compressed plant/microbial matter; the Himalayas are the most famous and researched source.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ456",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "What is Himalayan Shilajit?",
    "a": "Himalayan Shilajit is sourced from high Himalayan altitudes (often 10,000–18,000 ft) and is the most traditionally prized and studied type.",
    "intent": "Informational",
    "priority": "P1"
  },
  {
    "id": "FAQ457",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "Is Kashmir Shilajit good?",
    "a": "Kashmir-region Shilajit is part of the Himalayan belt; quality depends on altitude, purification and testing rather than the name alone.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ458",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "What about Gilgit-Baltistan Shilajit?",
    "a": "Gilgit-Baltistan (in the Karakoram/Himalaya belt) is a noted high-altitude source; as always, purity and lab testing matter more than origin claims.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ459",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "Is Nepali Shilajit different?",
    "a": "Nepal lies in the Himalayan belt and produces Shilajit similar to other Himalayan sources; verified purification and testing determine quality.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ460",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "What is Altai Shilajit?",
    "a": "Altai (Russia/Mongolia region) Shilajit, often called Mumijo, is a documented non-Himalayan source studied under that name.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ461",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "Is Russian/Siberian Mumijo the same as Shilajit?",
    "a": "Yes; Mumijo/Moomiyo from Russia and Central Asia is the same class of exudate as Shilajit, studied under regional names.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ462",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "Does Shilajit come from Afghanistan or Pakistan?",
    "a": "Yes; the Hindu Kush and Karakoram ranges in Afghanistan and Pakistan are documented Shilajit sources within the broader Himalayan system.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ463",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "Is there Shilajit in Tibet or Bhutan?",
    "a": "Yes; Tibet and Bhutan sit in the Himalayan belt and are documented traditional sources.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ464",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "What about Caucasus or Mongolia Shilajit?",
    "a": "These regions produce Mumijo-type exudates; they are legitimate documented sources studied under regional names.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ465",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "Is one geographic source of Shilajit better than others?",
    "a": "Altitude and biology vary, but ‘better’ depends on purification and lab-verified purity, not origin marketing. Avoid unverified superiority claims.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ466",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "How is Shilajit formed geologically?",
    "a": "Over centuries, plant and microbial matter is compressed within rock under heat and pressure at altitude, slowly exuding as a mineral-rich resin in warm months.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ467",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "Does altitude affect Shilajit quality?",
    "a": "Higher altitudes are traditionally associated with mature, mineral-rich Shilajit, but purification and testing ultimately determine safety and potency.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ468",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "How is raw Shilajit processed into resin?",
    "a": "Raw exudate is collected, dissolved, filtered to remove rock/plant debris, purified (Shodhana), and reduced into a concentrated resin, then lab-tested.",
    "intent": "HowTo",
    "priority": "P2"
  },
  {
    "id": "FAQ469",
    "pillar": "Origins",
    "category": "Shilajit Origins",
    "q": "Where does 3Tattava source its Shilajit?",
    "a": "3Tattava RockResin is sourced from high-altitude Himalayan deposits and Triphala-purified, then NABL third-party tested — origin plus verified purity.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ470",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs Ashwagandha — which is better?",
    "a": "They serve different goals: Shilajit is a mineral Rasayana traditionally used for energy and vitality, while Ashwagandha is an adaptogen associated with stress and sleep support. Many people use both.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ471",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Can I take Shilajit and Ashwagandha together?",
    "a": "Yes; it's a common traditional-style stack for energy plus stress resilience. Combination-specific clinical evidence is limited.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ472",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs multivitamin — do I still need a multivitamin?",
    "a": "Shilajit provides trace minerals in ionic form but is not a complete multivitamin (no full vitamin spectrum); they can be complementary, not identical.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ473",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs creatine for the gym?",
    "a": "Creatine is a well-evidenced performance supplement for strength/power; Shilajit is a non-stimulant vitality Rasayana. They work differently and can be combined.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ474",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs marketed vitality supplements?",
    "a": "Many marketed vitality supplements lack strong evidence. Purified Shilajit is traditionally used as a Rasayana for everyday energy and vitality — general wellbeing support rather than a guaranteed quick fix.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ475",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs pre-workout?",
    "a": "Pre-workouts give acute stimulant energy (caffeine); Shilajit gives non-stimulant, gradual energy support without jitters or crash.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ476",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs fulvic acid supplement?",
    "a": "Whole purified Shilajit contains fulvic acid plus DBPs and minerals; a standalone fulvic supplement is only one part and not equivalent.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ477",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs iron supplement for low iron?",
    "a": "Iron supplements deliver a measured, higher iron dose for diagnosed deficiency; Shilajit provides smaller dietary iron and isn't a deficiency treatment.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ478",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit resin vs gummies?",
    "a": "Resin is concentrated, testable and filler-free; gummies add sugar/gelatin and often contain little actual Shilajit. Resin is preferred for potency.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ479",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs Chyawanprash?",
    "a": "Chyawanprash is an Amla-based herbal jam Rasayana; Shilajit is a mineral resin Rasayana. Both support vitality via different mechanisms.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ480",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs Safed Musli?",
    "a": "Safed Musli is a herb used for strength/vitality; Shilajit is a herbo-mineral resin. They are sometimes combined in vitality formulations.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ481",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs Cordyceps for energy?",
    "a": "Cordyceps is a fungus studied for endurance; Shilajit is a mineral Rasayana. Both are used for energy but are chemically unrelated.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ482",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs coffee for energy?",
    "a": "Coffee gives fast stimulant energy with a crash; Shilajit gives slower, non-stimulant support. Many use Shilajit to reduce caffeine dependence.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ483",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Is resin or honey sticks better?",
    "a": "Resin is the most concentrated, flexible-dose format; honey sticks (Shahjeet) win on convenience, taste and portability. Choose by lifestyle.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ484",
    "pillar": "Comparisons",
    "category": "Shilajit vs X",
    "q": "Shilajit vs Shatavari for women?",
    "a": "Shatavari is a herb traditionally used in Ayurveda to support women's general wellbeing, while Shilajit is a mineral-rich Rasayana traditionally used for energy and vitality. Women sometimes use both for different everyday goals.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ485",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "What is RockResin?",
    "a": "RockResin is 3Tattava's hero product — a Triphala-purified Shodhit Shilajit resin (20 g), NABL third-party lab tested with ≥70% fulvic acid and 80+ trace minerals, doctor-formulated.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ486",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "What is Shahjeet Sticks?",
    "a": "Shahjeet Sticks are 3Tattava's daily honey-based Shilajit format — each stick delivers 600 mg of purified Shilajit in honey; tear, squeeze and take, no mixing needed.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ487",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "How much fulvic acid is in RockResin?",
    "a": "RockResin is lab-verified at ≥70% fulvic acid, with the test method disclosed on the batch certificate of analysis.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ488",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Is RockResin third-party tested?",
    "a": "Yes — every batch is NABL third-party lab tested for heavy metals and purity, with a QR code on the pack linking to the report.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ489",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "How do I use RockResin?",
    "a": "Dip a pea-sized amount (≈300–500 mg; one scoop ≈250 mg), dissolve in warm water or milk, swirl until fully dissolved, and drink — the Dip, Hook, Swirl ritual.",
    "intent": "HowTo",
    "priority": "P1"
  },
  {
    "id": "FAQ490",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "How much Shilajit is in one Shahjeet Stick?",
    "a": "Each Shahjeet Stick contains 600 mg of purified Shilajit resin in a honey base (8 g stick).",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ491",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Are 3Tattava products suitable for men and women?",
    "a": "Yes; both RockResin and Shahjeet are labelled MEN | WOMEN and are formulated for adults of any gender (except pregnancy/lactation).",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ492",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Is RockResin Triphala-purified?",
    "a": "Yes; RockResin uses classical Triphala Shodhana purification, then third-party lab testing for safety and potency.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ493",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Who formulated 3Tattava products?",
    "a": "3Tattava products are formulated under Dr. Kashish Gupta, BAMS (former consultant, NCISM, Ministry of AYUSH), reflecting a doctor-led approach.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ494",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Where are 3Tattava products made?",
    "a": "In an AYUSH-GMP compliant facility (URMI Lifesciences), with export-quality standards and per-batch lab testing.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ495",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "What is the shelf life of RockResin?",
    "a": "RockResin is a stable resin; follow the expiry printed on the pack and store cool, dry and sealed.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ496",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Can I take RockResin and Shahjeet together?",
    "a": "Yes — many use RockResin as the daily base ritual and Shahjeet for on-the-go/pre-workout use; keep total Shilajit within recommended daily amounts.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ497",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Is Shahjeet suitable for diabetics?",
    "a": "Shahjeet contains honey, which affects blood sugar; diabetics should prefer plain RockResin and consult their doctor.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ498",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "What certifications do 3Tattava products carry?",
    "a": "NABL third-party lab testing, AYUSH-GMP compliant manufacturing, and QR-linked batch traceability.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ499",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Does RockResin contain any fillers?",
    "a": "No; RockResin is 100% purified Shilajit resin with no capsules, binders or artificial additives.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ500",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "What is the RockResin dosage per jar?",
    "a": "A 20 g jar provides roughly 40–65 daily servings depending on whether you take 300–500 mg per day.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ501",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Is 3Tattava RockResin export quality?",
    "a": "Yes; RockResin is produced to export-quality standards with third-party testing, as printed on the pack.",
    "intent": "Commercial",
    "priority": "P3"
  },
  {
    "id": "FAQ502",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Why is 3Tattava a doctor-led brand?",
    "a": "Because its products are formulated and its education reviewed by a BAMS doctor, and it publishes lab reports rather than relying on marketing claims.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ503",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "Does 3Tattava publish its lab reports?",
    "a": "Yes; 3Tattava publishes per-batch lab reports accessible via the QR code on packs and the website, prioritizing proof over promises.",
    "intent": "Commercial",
    "priority": "P1"
  },
  {
    "id": "FAQ504",
    "pillar": "Product",
    "category": "3Tattava Products",
    "q": "What makes Shahjeet different from other Shilajit sticks?",
    "a": "Shahjeet pairs 600 mg purified, Triphala-processed Shilajit with honey (a classical anupana) in a portable stick, from a doctor-led, lab-tested brand.",
    "intent": "Commercial",
    "priority": "P2"
  },
  {
    "id": "FAQ505",
    "pillar": "Women",
    "category": "Women's Health (extended)",
    "q": "Does Shilajit help women with hair fall?",
    "a": "Its iron and minerals support hair health generally and low iron is a common cause of female hair fall, but Shilajit is supportive, not a proven hair-fall treatment; investigate the cause.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ506",
    "pillar": "Women",
    "category": "Women's Health (extended)",
    "q": "Can Shilajit help women's skin glow?",
    "a": "Antioxidant activity underpins the ‘beauty from within’ rationale; there's no strong female skin trial, so treat glow claims as traditional support.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ507",
    "pillar": "Women",
    "category": "Women's Health (extended)",
    "q": "Is Shilajit good for women in their 20s?",
    "a": "Healthy adult women in their 20s can take purified Shilajit for energy/recovery support; benefits are general, and pregnancy is the key exception.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ508",
    "pillar": "Women",
    "category": "Women's Health (extended)",
    "q": "Is Shilajit good for women over 50?",
    "a": "Postmenopausal women use it for energy and bone/vitality support; combine with medical guidance for age-related health.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ509",
    "pillar": "Women",
    "category": "Women's Health (extended)",
    "q": "Can Shilajit help with menstrual fatigue?",
    "a": "The iron/mineral rationale is relevant to cycle-related fatigue, but heavy bleeding with anemia needs medical care, not just Shilajit.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ510",
    "pillar": "Women",
    "category": "Women's Health (extended)",
    "q": "Does Shilajit affect estrogen?",
    "a": "There is no reliable evidence that Shilajit meaningfully affects estrogen; it is a mineral-rich Rasayana and contains no added hormones.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ511",
    "pillar": "Women",
    "category": "Women's Health (extended)",
    "q": "Can Shilajit help with mood swings?",
    "a": "Any benefit would be indirect via energy/stress support; there's no strong female mood-trial evidence.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ512",
    "pillar": "Women",
    "category": "Women's Health (extended)",
    "q": "Is Shilajit safe for women on birth control?",
    "a": "No specific dangerous interaction is documented, but separate timing from medication and consult your doctor if unsure.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ513",
    "pillar": "Women",
    "category": "Women's Health (extended)",
    "q": "Can Shilajit help women build strength?",
    "a": "Like men, women use it as training support (energy/recovery); the limited strength evidence isn't female-specific.",
    "intent": "Informational",
    "priority": "P3"
  },
  {
    "id": "FAQ514",
    "pillar": "Women",
    "category": "Women's Health (extended)",
    "q": "Should women take a lower Shilajit dose than men?",
    "a": "Not necessarily — the 300–500 mg/day range applies to adults generally; start low and adjust to tolerance regardless of gender.",
    "intent": "Informational",
    "priority": "P2"
  },
  {
    "id": "FAQ515",
    "pillar": "Safety",
    "category": "Safety (extended)",
    "q": "Can I take Shilajit with vitamin C?",
    "a": "Yes; vitamin C may even aid iron absorption. There's no known problematic interaction with Shilajit.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ516",
    "pillar": "Safety",
    "category": "Safety (extended)",
    "q": "Can I take Shilajit with zinc or magnesium?",
    "a": "Shilajit already contains trace minerals; avoid stacking high-dose single minerals without advice to prevent excess intake.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ517",
    "pillar": "Safety",
    "category": "Safety (extended)",
    "q": "Is it safe to take Shilajit on an empty stomach every day?",
    "a": "For most people yes; if it causes mild stomach upset, switch to taking it after food or with warm milk.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ518",
    "pillar": "Safety",
    "category": "Safety (extended)",
    "q": "Can Shilajit cause insomnia?",
    "a": "It's not a stimulant, but a few people find it energizing; if so, take it earlier in the day.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ519",
    "pillar": "Safety",
    "category": "Safety (extended)",
    "q": "Is Shilajit safe for people with G6PD deficiency?",
    "a": "Safety data are lacking; anyone with G6PD deficiency or rare metabolic conditions should consult a doctor first.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ520",
    "pillar": "Safety",
    "category": "Safety (extended)",
    "q": "Can I take Shilajit while on antidepressants?",
    "a": "No specific interaction is well documented, but consult your doctor before combining supplements with psychiatric medication.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ521",
    "pillar": "Safety",
    "category": "Safety (extended)",
    "q": "Is Shilajit safe for people with gallstones?",
    "a": "Consult a doctor; there's no strong evidence either way, so caution is advised for gallbladder disease.",
    "intent": "Safety",
    "priority": "P3"
  },
  {
    "id": "FAQ522",
    "pillar": "Safety",
    "category": "Safety (extended)",
    "q": "Can Shilajit be taken with thyroid medication?",
    "a": "Minerals may interfere with absorption of thyroid medication; separate by at least 4 hours and consult your doctor.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ523",
    "pillar": "Safety",
    "category": "Safety (extended)",
    "q": "Is Shilajit safe for cancer patients?",
    "a": "Cancer patients should not self-treat; any supplement must be cleared with the treating oncologist due to interaction and safety concerns.",
    "intent": "Safety",
    "priority": "P2"
  },
  {
    "id": "FAQ524",
    "pillar": "Safety",
    "category": "Safety (extended)",
    "q": "How do I know my Shilajit isn't causing harm over time?",
    "a": "Use a purified, lab-tested product at recommended doses, take periodic breaks, and get routine health check-ups; stop and seek advice if new symptoms arise.",
    "intent": "Safety",
    "priority": "P2"
  }
];

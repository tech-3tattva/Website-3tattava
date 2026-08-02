export const DOSHA_GUIDE = [
  {
    key: "Vata",
    doshaIcon: "vata" as const,
    subtitle: "Air & Space",
    characteristics:
      "Light, cold, dry, rough, subtle, mobile, and quick to change.",
    imbalance:
      "Anxiety, worry, dry skin, constipation, insomnia, and irregular energy.",
    support:
      "Grounding routines, warmth, nourishment, and mineral-rich support help stabilize Vata.",
    productHref: "/products?dosha=vata",
  },
  {
    key: "Pitta",
    doshaIcon: "pitta" as const,
    subtitle: "Fire & Water",
    characteristics:
      "Hot, sharp, focused, intense, and naturally driven.",
    imbalance:
      "Irritability, acidity, inflammation, heat, sensitivity, and burnout.",
    support:
      "Shilajit can be beneficial in smaller doses, but Pitta should use it mindfully with cooling habits.",
    productHref: "/products?dosha=pitta",
  },
  {
    key: "Kapha",
    doshaIcon: "kapha" as const,
    subtitle: "Earth & Water",
    characteristics:
      "Heavy, steady, cool, nurturing, soft, and deeply resilient.",
    imbalance:
      "Lethargy, sluggish digestion, congestion, attachment, and low motivation.",
    support:
      "Stimulating herbs and active daily rituals help mobilize stagnant Kapha and improve vitality.",
    productHref: "/products?dosha=kapha",
  },
] as const;

export const EDUCATION_ARTICLES = [
  {
    slug: "shilajit-for-men",
    title: "Shilajit for Men: Unlocking Vitality and Strength",
    category: "Shilajit",
    readTime: "6 min read",
    coverImage: "/education/covers/shilajit-for-men.svg",
    summary:
      "How mineral-rich Shilajit supports energy, stamina, resilience, and sustained performance.",
    content: [
      "Shilajit has been prized in Ayurveda as a rasayana, a rejuvenative substance used to restore vitality and support long-term resilience.",
      "For men balancing high stress, long workdays, and inconsistent recovery, Shilajit is valued for supporting energy, stamina, and physical renewal without relying on short-lived stimulation.",
      "Its fulvic acid and trace mineral profile help improve nutrient transport, making it a useful complement to sleep, training, and disciplined routines.",
    ],
  },
  {
    slug: "understanding-your-dosha",
    title: "Understanding Your Dosha: The Key to Personalized Wellness",
    category: "Dosha Guide",
    readTime: "5 min read",
    coverImage: "/education/covers/understanding-your-dosha.svg",
    summary:
      "Learn how Vata, Pitta, and Kapha shape your tendencies, imbalances, and ideal routines.",
    content: [
      "Ayurveda views health through the lens of three doshas: Vata, Pitta, and Kapha. Each person has a unique constitutional blend.",
      "When your lifestyle, food, and environment support your prakriti, you feel steady and energized. When they don’t, imbalance begins to show up in digestion, sleep, skin, energy, and mood.",
      "Recognizing your primary dosha helps you choose the right foods, herbs, and daily rituals with much greater clarity.",
    ],
  },
  {
    slug: "the-shilajit-swirl-ritual",
    title: "The Shilajit Swirl Ritual: A Daily Practice for Balance",
    category: "Ritual",
    readTime: "4 min read",
    coverImage: "/education/covers/the-shilajit-swirl-ritual.svg",
    summary:
      "A simple warm-water ritual that turns your Shilajit dose into a grounded daily wellness practice.",
    content: [
      "The most effective Ayurvedic rituals are often the simplest. A small pea-sized portion of Shilajit in warm water can become a steady anchor for your day.",
      "Taking a brief moment to dissolve, stir, and drink the resin mindfully encourages consistency and lets the practice feel grounding instead of rushed.",
      "The ritual works best when paired with sleep, nourishment, and a daily rhythm that supports recovery and focus.",
    ],
  },
  {
    slug: "shilajit-for-women",
    title: "Shilajit for Women: Does It Actually Work?",
    category: "Women's Health",
    readTime: "7 min read",
    coverImage: "/education/covers/shilajit-for-women.svg",
    summary:
      "Most Shilajit content targets men, but women have long used this mineral-rich Rasayana too. Here's an honest, educational look at how Shilajit is traditionally used to support energy and everyday wellbeing — and where the evidence is still limited.",
    content: [
      "Shilajit is not a men-only supplement. Classical Ayurvedic texts — including Charaka Samhita and Ashtanga Hridayam — describe Shilajit (Asphaltum Punjabanum) as a rasayana suitable for both men and women, with specific benefits for women experiencing depletion, fatigue, and mineral deficiency.",
      "A commonly discussed area for women is mineral nutrition. Fulvic acid, the primary active compound in high-quality Shilajit (≥70% in NABL-accredited third-party tested samples), has been studied as a natural chelator and mineral carrier. Traditionally, Shilajit is valued as a mineral-rich Rasayana that supports everyday wellbeing.",
      "Shilajit naturally contains iron and other trace minerals, which is why it has long been used as part of a mineral-supportive daily routine. It is not a treatment for anaemia or any diagnosed deficiency — low iron should be assessed and managed by a qualified healthcare practitioner.",
      "Shilajit is traditionally described as an adaptogenic Rasayana, valued for supporting the body's resilience to everyday stress and fatigue. This is a general wellbeing role rooted in tradition, not a hormonal or medical treatment — anyone managing a specific health concern should speak with a qualified healthcare practitioner.",
      "Recommended form for women: Shodhit Shilajit Resin (300mg daily in warm milk or water) or SHAHJEET Honey Sticks (600mg per stick in raw honey, which provides its own mineral co-factors). Both formats have been used safely by women in India for centuries.",
      "Important note: Shilajit is not recommended during pregnancy or breastfeeding. If you have PCOS, hypothyroidism, or are on hormonal medication, consult your physician before beginning a Shilajit protocol. This content is for educational purposes and does not constitute medical advice.",
    ],
  },
  {
    slug: "iron-deficiency-indian-women",
    title: "Iron Deficiency in Indian Women: Why Supplements Aren't Enough",
    category: "Women's Health",
    readTime: "6 min read",
    coverImage: "/education/covers/shilajit-for-women.svg",
    summary:
      "Iron deficiency is very common among Indian women, and absorption — not just intake — is part of the challenge. Here's how Ayurveda has traditionally approached mineral nutrition, framed honestly.",
    content: [
      "Iron deficiency anaemia affects over 53% of Indian women of reproductive age (NFHS-5 data). Despite widespread iron supplementation programs, the numbers have barely moved over two decades. The reason is not the amount of iron consumed — it's how much the body actually absorbs.",
      "Conventional iron tablets (ferrous sulphate) have notoriously low bioavailability — typically 10–15%. They also cause constipation, nausea, and stomach upset that leads to non-compliance. Many women stop taking them within 2 weeks.",
      "Ayurveda identified this absorption problem centuries before biochemistry confirmed it. The concept of Anupana — a carrier substance that amplifies bioavailability — is central to Ayurvedic mineral supplementation. For iron-rich substances, honey and milk are the classical Anupanas. For Shilajit, the Anupana is warm water or milk.",
      "Fulvic acid in Shilajit has been studied as a natural mineral chelator that binds to iron and other trace minerals. Shilajit also provides a broad profile of trace minerals, which is part of why it is traditionally valued as a mineral-rich Rasayana.",
      "Shilajit is traditionally taken as part of a daily routine alongside a balanced diet — a general wellbeing practice rather than a clinical intervention. Any diagnosed deficiency should be assessed and managed by a qualified healthcare practitioner.",
      "This is not a replacement for medical treatment of severe anaemia. If your haemoglobin is below 8 g/dL, see a physician immediately. For mild-to-moderate iron deficiency, incorporating Shilajit into your morning ritual may be a well-tolerated and effective long-term strategy. Disclaimer: This is educational content and not medical advice.",
    ],
  },
  {
    slug: "what-is-performance-ayurveda",
    title: "What Is Performance Ayurveda? (And Why It's Different From Wellness Ayurveda)",
    category: "Performance Ayurveda",
    readTime: "5 min read",
    coverImage: "/education/covers/the-shilajit-swirl-ritual.svg",
    summary:
      "3TATTAVA was built on a concept called Performance Ayurveda. Here's what it means, why it's different, and why it matters more than generic wellness.",
    content: [
      "Performance Ayurveda is not spa Ayurveda. It is not the Ayurveda of chyawanprash and weekly massages. It is the Ayurveda of Rasayanas — the branch of classical Ayurveda dedicated to cellular regeneration, longevity, and peak human function.",
      "The Rasayana tradition in Ayurveda identified specific substances — Shilajit, Ashwagandha, Amalaki, Shatavari — that do not merely treat symptoms but rebuild the body at a cellular level over months of consistent use. This is precisely what modern biohackers are looking for, and precisely what Ayurveda has codified for over 3,000 years.",
      "Performance Ayurveda means applying these classical substances with modern precision: verified dosages, third-party lab testing of potency, transparent quality documentation, and formats designed for how people actually live today. A 10-second honey stick. A 30-second resin swirl. No compromise on the substance. No compromise on the ritual.",
      "The 3TATTAVA approach was designed by Dr. Kashish Gupta (BAMS, CBPACS, former Ministry of AYUSH consultant) specifically for modern Indians and global consumers who want the benefits of classical Ayurveda without the complexity of a full Ayurvedic lifestyle overhaul.",
      "Performance Ayurveda starts with one substance, one ritual, one outcome. You do not need to change your diet, adopt a dosha, or learn Sanskrit. You need 10 seconds every morning and the right substance at the right dose.",
    ],
  },
  {
    slug: "shilajit-honey-sticks-india",
    title: "Shilajit Honey Sticks: Everything You Need to Know Before Buying in India",
    category: "Product Guide",
    readTime: "6 min read",
    coverImage: "/education/covers/shilajit-for-men.svg",
    summary:
      "Shilajit honey sticks are the fastest-growing Ayurvedic product in India. But quality varies enormously. Here's what to check before you buy.",
    content: [
      "Shilajit honey sticks are single-serve sachets containing Shilajit mixed with honey, designed to be torn open and consumed directly or dissolved in water. They are convenient, mess-free, and have driven mainstream adoption of Shilajit among people who would never use a resin jar.",
      "The market, however, is flooded with products that contain 50–200mg of Shilajit per stick rather than a therapeutic dose. The classical therapeutic dose of Shilajit is 300–500mg per day. A stick containing 100mg is nutritional theatre, not Ayurvedic medicine.",
      "What to look for when buying Shilajit honey sticks in India: (1) Shilajit content per stick — minimum 300mg, ideally 600mg. (2) NABL-accredited third-party lab report — not a certificate from the manufacturer's own lab. (3) AYUSH-GMP manufacturing certification. (4) Fulvic acid percentage — should be ≥40% for therapeutic effect. (5) No artificial preservatives, added sugars, or 'Shilajit extract' (a highly diluted form).",
      "SHAHJEET STICKS by 3TATTAVA contain 600mg of Shodhit Shilajit per stick. Every batch is tested by an NABL-accredited third-party laboratory. The honey used is raw Himalayan honey with no added sugar, used as the classical Anupana (bioavailability enhancer) for Shilajit.",
      "How to take Shilajit honey sticks: Tear along the notch, squeeze directly into the mouth or into warm water (not hot — above 60°C denatures fulvic acid). Take on an empty stomach or 30 minutes before training. One stick per day is sufficient for most adults.",
    ],
  },
  {
    slug: "shilajit-resin-vs-capsules-vs-powder",
    title: "Shilajit Resin vs Capsules vs Powder: Which Form Is Most Effective?",
    category: "Product Guide",
    readTime: "5 min read",
    coverImage: "/education/covers/shilajit-for-men.svg",
    summary:
      "Shilajit comes in three main forms. One is significantly more effective. Here's why — and what the lab data shows.",
    content: [
      "Shilajit in its natural state is a resin — a thick, tar-like substance that seeps from Himalayan rocks between June and August at high altitude. This resin form is what classical Ayurvedic texts prescribe. Capsules and powders are processed forms with important trade-offs.",
      "Shilajit Resin: The most bioavailable form. When dissolved in warm water or milk, fulvic acid (the key active compound) is immediately available for absorption. No processing layers, no additives, no lag time. The trade-off is inconvenience — you need a spatula and warm liquid.",
      "Shilajit Capsules: The most convenient form, but with the lowest bioavailability. The gelatin or vegetable capsule shell must dissolve before fulvic acid can be released. Capsules also require binding agents and anti-caking compounds that can interfere with absorption. Many capsules contain as little as 100mg of actual Shilajit, padded with maltodextrin or starch.",
      "Shilajit Powder: Intermediate bioavailability. Better than capsules if the powder is pure, but the drying process can degrade some volatile compounds in Shilajit. Quality varies enormously — powders are easy to adulterate.",
      "The 3TATTAVA verdict: Pure Shodhit Shilajit Resin is the most effective form for daily supplementation. SHAHJEET Honey Sticks are the best convenience format — they combine resin-form Shilajit with honey (natural Anupana) in a pre-portioned single serve. Both are NABL-accredited third-party tested at ≥70% fulvic acid. Neither contains capsule shells, binders, or additives.",
    ],
  },
  {
    slug: "how-to-take-shilajit",
    title: "How to Take Shilajit: Dosage, Timing, and the Right Anupana",
    category: "How To",
    readTime: "4 min read",
    coverImage: "/education/covers/the-shilajit-swirl-ritual.svg",
    summary:
      "The correct dose, timing, and carrier substance (Anupana) can double the effectiveness of your Shilajit protocol. Here's the Ayurvedic guide.",
    content: [
      "Dosage: The classical therapeutic dose of Shilajit is 300–500mg per day for general use, up to 1000mg per day for specific therapeutic protocols under physician guidance. Start with 300mg (a pea-sized amount of resin) and assess tolerance over the first week.",
      "Timing: Morning, on an empty stomach, is optimal. Shilajit's mineral-loading effect is most pronounced when there is no competing digestive activity. Alternatively, take 30 minutes before training for performance support.",
      "Anupana (carrier substance): The Anupana amplifies bioavailability. For Shilajit, the classical Anupanas are: warm milk (traditionally paired for energy and vitality), warm water (general use), raw honey (amplifies absorption and adds co-factors), and warm ghee (for Vata-dominant conditions). Do not mix with cold water — temperature below 20°C slows dissolution of fulvic acid.",
      "Duration: Shilajit is a rasayana — its traditional benefits are said to build gradually with consistent use. A common routine runs for at least 45–60 days, and traditionally it is taken over about 90 days before assessing how it suits you.",
      "Contraindications: Avoid Shilajit during acute fever, active infection, or in combination with blood thinners (consult physician). Not recommended during pregnancy. If you have haemochromatosis (iron overload), avoid Shilajit without physician guidance.",
    ],
  },
  {
    slug: "what-is-fulvic-acid",
    title: "What Is Fulvic Acid? (And Why It's the Key to Shilajit's Power)",
    category: "Science",
    readTime: "5 min read",
    coverImage: "/education/covers/shilajit-for-men.svg",
    summary:
      "Fulvic acid is the compound that makes Shilajit work. Here's the science — without the jargon.",
    content: [
      "Fulvic acid is a naturally occurring organic compound formed over millions of years as microbial decomposition of plant matter interacts with mineral-rich rock. In Shilajit, it comprises 60–85% of the active dry matter (in high-quality, NABL-accredited third-party tested samples). It is fulvic acid that gives Shilajit much of its distinctive character.",
      "How fulvic acid works: Fulvic acid molecules are small enough to penetrate cell membranes. They carry minerals, vitamins, and other nutrients directly into cells — bypassing the digestive barriers that reduce the bioavailability of most supplements. This is why Shilajit with ≥60% fulvic acid is significantly more effective than Shilajit with 20–30% fulvic acid.",
      "Fulvic acid also acts as a natural chelator — it binds to heavy metals and helps the body excrete them. This detoxification property is part of why classical Ayurvedic Shodhan (purification) is important: properly purified Shilajit uses its own fulvic acid content to eliminate the heavy metal impurities present in raw ore.",
      "In modern research, fulvic acid has been studied for its antioxidant properties and its potential role in mitochondrial energy production. These are areas of early scientific interest rather than proven clinical outcomes.",
      "What to look for on a lab report: a Shilajit lab report from a NABL-accredited third-party laboratory should state the fulvic acid percentage by dry weight, with the test method disclosed. 3TATTAVA's ROCKRESIN carries ≥70% fulvic acid, with a per-batch certificate of analysis available.",
    ],
  },
  {
    slug: "is-shilajit-safe",
    title: "Is Shilajit Safe? Side Effects, Drug Interactions, and Who Should Avoid It",
    category: "Safety",
    readTime: "5 min read",
    coverImage: "/education/covers/the-shilajit-swirl-ritual.svg",
    summary:
      "Shilajit has a 3,000-year safety record when used correctly. Here's what the evidence says about side effects, interactions, and who should avoid it.",
    content: [
      "Shodhit (purified) Shilajit has an excellent safety profile when sourced correctly and taken at recommended doses. Classical Ayurvedic texts document its use across thousands of years without significant adverse event reports. Modern clinical studies have confirmed safety at doses up to 500mg per day in healthy adults.",
      "The critical safety factor is purification. Raw, unpurified Shilajit contains heavy metals (lead, mercury, arsenic) present in the Himalayan rock it seeps from. Classical Shodhan (Triphala-based purification) removes these impurities while preserving the therapeutic compounds. Always verify that your Shilajit has been purified and has a third-party NABL lab certificate confirming heavy metal levels below safe thresholds.",
      "Side effects: At therapeutic doses (300–500mg daily), side effects are rare. The most commonly reported are mild digestive warmth in the first week (normal as the body adjusts) and very occasionally mild headache (typically a detoxification response, resolves within 3–5 days). These resolve without discontinuation in most users.",
      "Drug interactions: Shilajit may interact with blood thinners (warfarin, aspirin therapy), immunosuppressants, and antidiabetic medications (Shilajit can enhance insulin sensitivity — monitor blood glucose if on medication). Consult your physician before starting Shilajit if you are on prescription medication.",
      "Who should avoid Shilajit: Pregnant and breastfeeding women (insufficient safety data for this population). People with haemochromatosis (iron overload). People with acute active infections or high fever. Children under 12. Anyone with a known allergy to Himalayan minerals.",
      "Disclaimer: This educational content does not constitute medical advice. Consult a qualified physician before starting any supplement protocol, especially if you have a chronic medical condition or are on prescription medication.",
    ],
  },
] as const;

export function getEducationArticle(slug: string) {
  return EDUCATION_ARTICLES.find((article) => article.slug === slug);
}

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
] as const;

export function getEducationArticle(slug: string) {
  return EDUCATION_ARTICLES.find((article) => article.slug === slug);
}

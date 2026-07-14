export type Cluster = "Shilajit" | "Ayurveda" | "Application";
export interface Pillar { pillar: string; page: string; count: number; cluster: Cluster; blurb: string; }

export const PILLARS: Pillar[] = [
  {
    "pillar": "Shilajit Core",
    "page": "/education/what-is-shilajit",
    "count": 9,
    "cluster": "Shilajit",
    "blurb": "What Shilajit is, what it does, and why purified resin is the classical gold standard."
  },
  {
    "pillar": "Shilajit Science",
    "page": "/education/shilajit-science-fulvic-acid",
    "count": 13,
    "cluster": "Shilajit",
    "blurb": "Fulvic acid, 80+ trace minerals and the mechanisms behind the mineral pitch."
  },
  {
    "pillar": "Shilajit Origins",
    "page": "/education/shilajit-origins",
    "count": 7,
    "cluster": "Shilajit",
    "blurb": "How Himalayan Shilajit forms over centuries — geology, altitude and sourcing."
  },
  {
    "pillar": "Men",
    "page": "/education/shilajit-for-men",
    "count": 12,
    "cluster": "Shilajit",
    "blurb": "Energy, testosterone support, stamina and recovery — Shilajit for men."
  },
  {
    "pillar": "Women",
    "page": "/education/shilajit-for-women",
    "count": 17,
    "cluster": "Shilajit",
    "blurb": "Iron, hormones and cellular energy — the underreported case for Shilajit in women."
  },
  {
    "pillar": "Dosage & Usage",
    "page": "/education/how-to-take-shilajit",
    "count": 11,
    "cluster": "Shilajit",
    "blurb": "How much, when and with which Anupana — dosing Shilajit correctly."
  },
  {
    "pillar": "Safety",
    "page": "/education/shilajit-safety",
    "count": 9,
    "cluster": "Shilajit",
    "blurb": "Purity, heavy metals, contraindications and who should avoid Shilajit."
  },
  {
    "pillar": "Buying & Authenticity",
    "page": "/education/how-to-check-real-shilajit",
    "count": 10,
    "cluster": "Shilajit",
    "blurb": "How to spot real resin, read a COA and avoid adulterated Shilajit."
  },
  {
    "pillar": "Ayurveda & Shilajit",
    "page": "/education/shilajit-in-ayurveda",
    "count": 4,
    "cluster": "Ayurveda",
    "blurb": "Shilajit as a classical Rasayana — its place in Ayurvedic medicine."
  },
  {
    "pillar": "Performance & Fitness",
    "page": "/education/shilajit-for-performance",
    "count": 11,
    "cluster": "Application",
    "blurb": "Training, endurance, recovery and stacking for the modern athlete."
  },
  {
    "pillar": "Lifestyle",
    "page": "/education/shilajit-for-performance",
    "count": 10,
    "cluster": "Application",
    "blurb": "Sleep, stress, focus and daily rituals for sustained vitality."
  },
  {
    "pillar": "Recipes",
    "page": "/education/shilajit-recipes",
    "count": 7,
    "cluster": "Application",
    "blurb": "Simple ways to take Shilajit — drinks, milks and morning rituals."
  },
  {
    "pillar": "Triphala",
    "page": "/education/what-is-triphala",
    "count": 13,
    "cluster": "Ayurveda",
    "blurb": "The three-fruit formulation for digestion, detox and daily balance."
  },
  {
    "pillar": "Ayurveda Fundamentals",
    "page": "/education/what-is-ayurveda",
    "count": 26,
    "cluster": "Ayurveda",
    "blurb": "The first principles of Ayurveda — doshas, dhatus, agni and the Rasayana idea."
  },
  {
    "pillar": "Prakriti & Dosha",
    "page": "/education/prakriti-dosha-guide",
    "count": 12,
    "cluster": "Ayurveda",
    "blurb": "Discover your constitution and how Vata, Pitta and Kapha shape your rituals."
  },
  {
    "pillar": "Ahara & Ritucharya",
    "page": "/education/ritucharya-ahara",
    "count": 14,
    "cluster": "Ayurveda",
    "blurb": "Ayurvedic nutrition and seasonal living — eating right for your dosha and the season."
  },
  {
    "pillar": "Comparisons",
    "page": "/education/shilajit-comparisons",
    "count": 10,
    "cluster": "Application",
    "blurb": "Shilajit vs other adaptogens, forms and popular supplements — honestly compared."
  },
  {
    "pillar": "Gut & Digestion",
    "page": "/education/gut-health-ayurveda",
    "count": 7,
    "cluster": "Ayurveda",
    "blurb": "Agni, gut health and the Ayurvedic approach to digestion."
  },
  {
    "pillar": "Product",
    "page": "/products",
    "count": 3,
    "cluster": "Application",
    "blurb": "3Tattava RockResin and Shahjeet Sticks — formulation and testing."
  }
];

export const CLUSTERS: { key: Cluster; label: string; blurb: string }[] = [
  { key: "Shilajit", label: "Shilajit", blurb: "The resin — its science, purity, safety and use." },
  { key: "Ayurveda", label: "Ayurveda", blurb: "Doshas, digestion, Triphala and seasonal living." },
  { key: "Application", label: "Performance & Lifestyle", blurb: "Fitness, recipes, comparisons and daily rituals." },
];

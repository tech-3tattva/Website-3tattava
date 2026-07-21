// Knowledge Center PILLAR pages — full doctor-reviewed bodies rendered at /education/<slug>.
// Faithfully transformed from the 3Tattava content packs. Traditional claims are labelled
// traditional; modern claims cite a real study; weak evidence is stated as weak — the hedged
// language is intentional and must not be strengthened. Reviewed by Dr. Kashish Gupta (BAMS).
import type { BlogArticle } from "./blog-articles.generated";
import { article as shilajitForWomen } from "./pillars/shilajit-for-women";
import { article as shilajitForMen } from "./pillars/shilajit-for-men";
import { article as shilajitScience } from "./pillars/shilajit-science-fulvic-acid";
import { article as shilajitSafety } from "./pillars/shilajit-safety";
import { article as howToCheckRealShilajit } from "./pillars/how-to-check-real-shilajit";
import { article as howToTakeShilajit } from "./pillars/how-to-take-shilajit";
import { article as whatIsTriphala } from "./pillars/what-is-triphala";

export const PILLAR_ARTICLES: BlogArticle[] = [
  {
    slug: "what-is-shilajit",
    title: "What Is Shilajit? The Complete Doctor-Led Guide",
    metaTitle: "What Is Shilajit? Benefits, Uses & the Science",
    metaDesc:
      "A doctor-led guide to what Shilajit is, how it forms, what it contains, its evidence-backed benefits, and how to take it safely.",
    keyword: "what is shilajit",
    intent: "Informational",
    pillar: "Shilajit Core",
    summary:
      "Shilajit is a sticky, tar-like resin that oozes from rocks in high mountain ranges such as the Himalayas. Formed over centuries from compressed plant and microbial matter, it is rich in fulvic acid, dibenzo-alpha-pyrones and trace minerals. In Ayurveda it is classed as a *Rasayana* (rejuvenative) and used for energy, vitality and recovery.",
    readTime: "9 min read",
    intro:
      "Shilajit is one of the most storied substances in Ayurveda — and one of the most misunderstood. This doctor-led guide separates what tradition claims from what modern research actually shows, and explains why sourcing, purification and testing decide whether Shilajit is a genuine tonic or a real safety risk.",
    sections: [
      {
        heading: "What is Shilajit, exactly?",
        body: `Shilajit (Sanskrit *śilājatu*, "conqueror of rock" or "rock-born") is not a herb and not a single mineral. It is a **humic exudate** — a naturally occurring blackish-brown resin that seeps from crevices in rock faces, most famously in the Himalayas but also in the Altai, Caucasus and other high ranges. Chemically it is best described as a complex mixture of humic substances (chiefly fulvic acid), dibenzo-alpha-pyrones, plant and microbial metabolites, and a spread of trace minerals (Agarwal 2007; Stohs 2014).\n\nBecause it forms *in* the rock over very long periods, genuine Shilajit carries the mineral signature of its environment — which is also why **source and purification matter so much**. You will see it sold as raw rock, purified resin, powder, capsules and honey-based sticks; the resin is the least-processed form and the reference point for quality.\n\nIn classical Ayurveda, Shilajit sits in the *Rasayana* (rejuvenation) chapter of the Charaka Samhita (Chikitsa Sthana 1.3). We keep the traditional and the modern views clearly separated throughout this guide: where a benefit is a classical claim, we say so; where it is supported by a modern study, we cite it; and where the evidence is thin, we say that too.`,
      },
      {
        heading: "How does Shilajit form?",
        body: `Shilajit is the product of very slow geological and biological change. Over centuries, layers of plant material — and the microbes that break them down — become compressed between rock strata at altitude. Humic substances, including fulvic acid, are the end-products of that long decomposition. In warmer months, the mass softens and seeps out of the rock as the resin that is then collected and purified (Agarwal 2007).\n\nTwo practical points follow. First, Shilajit is a *finite, place-specific* material, not something manufactured in a reactor — so provenance is a real quality variable. Second, because it is collected from the environment, raw Shilajit can carry contaminants from that environment, which is exactly why purification and testing are non-negotiable.`,
      },
      {
        heading: "What is Shilajit made of?",
        body: `The constituents that matter most are:\n\n• **Fulvic acid** — the signature humic compound, studied as an antioxidant and as a carrier that may help shuttle minerals and other molecules (Stohs 2014; Agarwal 2007). Note that "fulvic acid %" depends heavily on the *test method* used, so a single headline number should always be read alongside the method and the lab report.\n\n• **Dibenzo-alpha-pyrones (DBPs)** — small molecules considered among Shilajit's key actives, investigated for antioxidant and mitochondrial-related activity (Stohs 2014).\n\n• **Humic acid** — a larger, less absorbable humic fraction.\n\n• **Trace minerals** — a spread of minerals including iron, in ionic form.\n\nFor the deeper chemistry — fulvic vs humic, DBPs, the mitochondria/ATP hypothesis and antioxidant mechanisms — see the science pillar: [Shilajit science: fulvic acid & compounds](/education/shilajit-science-fulvic-acid).`,
      },
      {
        heading: "What is Shilajit used for? Traditional claims vs modern evidence",
        body: `This is where honesty earns trust, so we split the two views deliberately.\n\n**The traditional (Ayurvedic) view.** Shilajit is a *Rasayana* — a rejuvenative used to support strength, vitality and healthy ageing — and is also described as *Yogavahi*, a substance that carries and amplifies the action of what it is taken with. Classically it is associated with energy, vitality and recovery. These are traditional uses recorded in classical texts; they are not the same as proven clinical effects, and we do not present them as such.\n\n**The modern (research) view.** The human evidence is real but still modest — mostly small or single trials:\n\n• **Everyday energy & vitality.** Shilajit is most commonly used, and traditionally valued, as general support for everyday energy and vitality. Where people report a benefit it tends to build gradually, and the human evidence here is early rather than definitive.\n\n• **Strength & connective tissue.** In an 8-week RCT, 500 mg/day (but not 250 mg/day) helped recreationally active men *retain* muscular strength after a fatiguing protocol and lowered a marker of collagen breakdown (Keller 2019). A separate biopsy study found Shilajit upregulated muscle extracellular-matrix and collagen genes (Das 2016) — a plausible recovery mechanism.\n\n• **Antioxidant, adaptogen, anti-fatigue.** A safety-and-efficacy review summarises antioxidant, anti-inflammatory, adaptogenic and anti-fatigue signals, with dibenzo-alpha-pyrones and fulvic acid as the likely actives (Stohs 2014). This is a review of mostly early studies, not proof of a specific clinical outcome.\n\n• **Cognition.** Here the honesty matters most: there is **no human clinical trial** showing Shilajit improves cognition. The interest comes from a review proposing fulvic acid as a possible pro-cognitive agent (Carrasco-Gallardo 2012) and a laboratory study showing fulvic acid can interfere with tau protein aggregation in vitro (Cornejo 2011). Mechanism only — do not read it as a proven brain benefit.\n\nFor the segment-specific detail, see [Shilajit for men](/education/shilajit-for-men) and [Shilajit for women](/education/shilajit-for-women).`,
      },
      {
        heading: "How does Shilajit work in the body?",
        body: `The most-cited hypotheses are: fulvic acid acting as an antioxidant and as a carrier that may improve the availability of minerals and co-administered compounds; dibenzo-alpha-pyrones supporting mitochondrial function and cellular energy (ATP); and a broad adaptogenic effect on stress and fatigue (Stohs 2014). The muscle-recovery signal likely runs through effects on connective-tissue/extracellular-matrix genes (Das 2016).\n\nThese mechanisms are biologically reasonable and partly supported by lab and animal work, but the human data behind them is still limited. The classical framing — Shilajit as *Yogavahi*, a carrier that enhances what it accompanies — is a striking traditional parallel to the modern "fulvic-acid-as-carrier" idea, but the two should be cited in their own registers (one traditional, one still-emerging science).`,
      },
      {
        heading: "Who is Shilajit for — and who should be cautious?",
        body: `Shilajit is used most by adults looking for support with energy, recovery, training and general vitality. Because the strongest human trials are in specific groups (for example, recreationally active men for strength retention), benefits should not be over-generalised — a healthy 22-year-old is not the population most of these studies used.\n\nIt should be **avoided or used only under medical guidance** by some people. Do not use in pregnancy or breastfeeding (inadequate safety data). Take medical advice if you have haemochromatosis or iron overload (Shilajit contains iron), if you take medication, or if you have a chronic condition. See the full [Shilajit safety guide](/education/shilajit-safety).`,
      },
      {
        heading: "Why purification and testing are non-negotiable",
        body: `This is the single most important safety point about Shilajit. Because it is collected from the environment, **unpurified or poorly processed Shilajit can contain heavy metals**. In a widely cited analysis of Ayurvedic products sold online, about one in five contained detectable lead, mercury or arsenic (Saper 2008). That is a statement about poorly controlled products — not about Ayurveda as a whole — and it is exactly why processing and independent testing exist.\n\nGenuine, safe Shilajit should be **purified** (classically via *Shodhana*, often using Triphala) and **third-party lab tested per batch**, with a Certificate of Analysis you can actually read. Learn the checks in [how to check real Shilajit](/education/how-to-check-real-shilajit), and see why we purify with Triphala on the [Triphala guide](/education/what-is-triphala).`,
      },
      {
        heading: "Which form should you choose?",
        body: `Resin is the least-processed and most traditional form and is the benchmark for potency and purity; powders and capsules trade some of that for convenience; honey-based sticks are a pre-measured, portable format. Whatever the format, the quality questions are the same: known source, proper purification, and a per-batch third-party lab report. For dose, timing and how to take it, see [how to take Shilajit](/education/how-to-take-shilajit).`,
      },
    ],
    takeaways: [
      "Shilajit is a mineral-rich humic resin — not a herb — classed in Ayurveda as a *Rasayana*.",
      "Modern evidence is genuine but modest: strongest for general energy and strength retention; weak or absent for claims like cognition.",
      "Raw or unverified Shilajit can carry heavy metals — purification (Triphala Shodhana) and per-batch third-party testing are essential.",
      "Effects build over 8–12 weeks of daily use; it is a consistent Rasayana, not a same-day stimulant.",
    ],
    faqs: [
      {
        q: "Is Shilajit a herb or a mineral?",
        a: "Neither, exactly. Shilajit is a humic resin — a naturally occurring exudate from mountain rock, made of fulvic acid, dibenzo-alpha-pyrones and trace minerals. Ayurveda classes it as a mineral-origin Rasayana rather than a plant herb.",
      },
      {
        q: "What does Shilajit taste like?",
        a: "Genuine Shilajit is strongly bitter and earthy, sometimes slightly smoky. The taste is normal and is one reason it is usually dissolved in warm water or milk, or taken as a honey-based stick.",
      },
      {
        q: "Is Shilajit safe?",
        a: "Purified, third-party-tested Shilajit is generally well tolerated in healthy adults. Raw or unpurified Shilajit can contain heavy metals, so testing is essential. Avoid in pregnancy and breastfeeding, and consult a clinician if you take medication.",
      },
      {
        q: "Is Shilajit backed by science?",
        a: "Partly. Small human trials point to benefits like strength retention, and reviews describe antioxidant and anti-fatigue effects. Other claims — cognition especially — rest on lab work only, with no human trials yet.",
      },
      {
        q: "Does Shilajit work immediately?",
        a: "No. In studies, meaningful effects were measured over 8–12 weeks of daily use, not hours. Treat Shilajit as a consistent daily Rasayana, not a same-day stimulant.",
      },
    ],
    related: [
      { slug: "shilajit-science-fulvic-acid", title: "Shilajit science: fulvic acid & compounds" },
      { slug: "shilajit-for-men", title: "Shilajit for men" },
      { slug: "shilajit-for-women", title: "Shilajit for women" },
      { slug: "how-to-take-shilajit", title: "How to take Shilajit" },
      { slug: "shilajit-safety", title: "Shilajit safety" },
      { slug: "how-to-check-real-shilajit", title: "How to check real Shilajit" },
      { slug: "what-is-triphala", title: "What is Triphala" },
    ],
    productHref: "/products/shodhit-shilajit-resin",
    ctaLabel: "Explore lab-tested RockResin",
  },
  shilajitForWomen,
  shilajitForMen,
  shilajitScience,
  shilajitSafety,
  howToCheckRealShilajit,
  howToTakeShilajit,
  whatIsTriphala,
];

const MAP: Record<string, BlogArticle> = Object.fromEntries(PILLAR_ARTICLES.map((a) => [a.slug, a]));

export function getPillarArticle(slug: string): BlogArticle | undefined {
  return MAP[slug];
}

export function getPillarArticleSlugs(): string[] {
  return PILLAR_ARTICLES.map((a) => a.slug);
}

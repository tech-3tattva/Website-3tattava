/**
 * Local marketing imagery under public/assests (folder spelling preserved).
 * img1–3: Three Tattvas pillars; img4: hero ambient; img5: featured spotlight mood layer.
 */
export const HOME_ASSETS = {
  heroAmbient: "/assests/img4.png",
  spotlightTexture: "/assests/img5.png",
  tattvas: {
    balance: "/assests/img1.png",
    build: "/assests/img2.png",
    become: "/assests/img3.png",
  },
} as const;

export type TattvaKey = keyof typeof HOME_ASSETS.tattvas;

export const TATTVA_BLOCKS = [
  {
    key: "balance" as const,
    num: "01",
    title: "Balance",
    body: "Harmonize your doshas with grounded, holistic formulations.",
    imageSrc: HOME_ASSETS.tattvas.balance,
  },
  {
    key: "build" as const,
    num: "02",
    title: "Build",
    body: "Strengthen ojas, resilience, and your daily wellness rituals.",
    imageSrc: HOME_ASSETS.tattvas.build,
  },
  {
    key: "become" as const,
    num: "03",
    title: "Become",
    body: "Realize your highest potential through mindful transformation.",
    imageSrc: HOME_ASSETS.tattvas.become,
  },
] as const;

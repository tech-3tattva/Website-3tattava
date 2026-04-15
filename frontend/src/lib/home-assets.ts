/**
 * Local marketing imagery under public/assests (folder spelling preserved).
 * img1–3: Three Elements pillars; img4: hero ambient; img5: featured spotlight mood layer.
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
    outcome: "Cellular Energy",
    body: "Your mitochondria need 80+ trace minerals to produce ATP — your body's real energy currency. Shilajit delivers what caffeine can't: energy that builds over weeks, not minutes.",
    imageSrc: HOME_ASSETS.tattvas.balance,
  },
  {
    key: "build" as const,
    num: "02",
    title: "Build",
    outcome: "Physical Performance",
    body: "Fulvic acid increases nutrient absorption by up to 28x. Every supplement you're already taking works harder when your mineral foundation is right.",
    imageSrc: HOME_ASSETS.tattvas.build,
  },
  {
    key: "become" as const,
    num: "03",
    title: "Become",
    outcome: "Long-Term Vitality",
    body: "This isn't a 30-day experiment. It's a daily ritual that compounds — testosterone support, hormonal balance, recovery, and resilience that builds month over month.",
    imageSrc: HOME_ASSETS.tattvas.become,
  },
] as const;

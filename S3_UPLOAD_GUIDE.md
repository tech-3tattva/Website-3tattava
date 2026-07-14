# 3TATTAVA — S3 Upload Guide (bucket: 3tattava-media-prod, region ap-south-1)

CDN: https://media.3tattava.com  →  CloudFront E1GM3NYG30MDHK  →  S3 3tattava-media-prod

Upload each local `frontend/public` file to the S3 key shown. **All targets nest inside your existing 7 folders — no new top-level folders needed.** `[LIVE]` = needed for the pages going live now (Home / Shop / Products).


## `features/hero/`  (13 files, 13 [LIVE])

| upload local file | → S3 key |
|---|---|
| `frontend/public/hero/athlete-1.jpg` | `features/hero/athlete-1.jpg` **[LIVE]** |
| `frontend/public/hero/athlete-2.jpg` | `features/hero/athlete-2.jpg` **[LIVE]** |
| `frontend/public/hero/hero-mountain-full.png` | `features/hero/hero-mountain-full.png` **[LIVE]** |
| `frontend/public/hero/himalaya-bg.png` | `features/hero/himalaya-bg.png` **[LIVE]** |
| `frontend/public/hero/rockresin-cinematic.jpg` | `features/hero/rockresin-cinematic.jpg` **[LIVE]** |
| `frontend/public/hero/rockresin-poster.jpg` | `features/hero/rockresin-poster.jpg` **[LIVE]** |
| `frontend/public/hero/rockresin-product.jpg` | `features/hero/rockresin-product.jpg` **[LIVE]** |
| `frontend/public/hero/rockresin-teaser.png` | `features/hero/rockresin-teaser.png` **[LIVE]** |
| `frontend/public/hero/shahjeet-cinematic.jpg` | `features/hero/shahjeet-cinematic.jpg` **[LIVE]** |
| `frontend/public/hero/shahjeet-hero.png` | `features/hero/shahjeet-hero.png` **[LIVE]** |
| `frontend/public/hero/shahjeet-product.png` | `features/hero/shahjeet-product.png` **[LIVE]** |
| `frontend/public/hero/triphala-bowls.png` | `features/hero/triphala-bowls.png` **[LIVE]** |
| `frontend/public/hero/trust-flatlay.png` | `features/hero/trust-flatlay.png` **[LIVE]** |

## `features/home/`  (10 files, 10 [LIVE])

| upload local file | → S3 key |
|---|---|
| `frontend/public/home/Ayurveda-insider.png` | `features/home/Ayurveda-insider.png` **[LIVE]** |
| `frontend/public/home/dip-video.mp4` | `features/home/dip-video.mp4` **[LIVE]** |
| `frontend/public/home/homepage-rockresins.png` | `features/home/homepage-rockresins.png` **[LIVE]** |
| `frontend/public/home/mona-agarwal.jpg` | `features/home/mona-agarwal.jpg` **[LIVE]** |
| `frontend/public/home/oc-trinity.png` | `features/home/oc-trinity.png` **[LIVE]** |
| `frontend/public/home/rockresin-hero-product.png` | `features/home/rockresin-hero-product.png` **[LIVE]** |
| `frontend/public/home/rockresin-marquee.png` | `features/home/rockresin-marquee.png` **[LIVE]** |
| `frontend/public/home/rockresin.jpg` | `features/home/rockresin.jpg` **[LIVE]** |
| `frontend/public/home/Shilajeet-resins.png` | `features/home/Shilajeet-resins.png` **[LIVE]** |
| `frontend/public/home/trinity-poster-v2.png` | `features/home/trinity-poster-v2.png` **[LIVE]** |

## `products/rockresin/`  (9 files, 9 [LIVE])

| upload local file | → S3 key |
|---|---|
| `frontend/public/rockresin/frame82.png` | `products/rockresin/frame82.png` **[LIVE]** |
| `frontend/public/rockresin/icon-minerals.png` | `products/rockresin/icon-minerals.png` **[LIVE]** |
| `frontend/public/rockresin/icon-ring.png` | `products/rockresin/icon-ring.png` **[LIVE]** |
| `frontend/public/rockresin/icon-source.png` | `products/rockresin/icon-source.png` **[LIVE]** |
| `frontend/public/rockresin/pillars.png` | `products/rockresin/pillars.png` **[LIVE]** |
| `frontend/public/rockresin/product.png` | `products/rockresin/product.png` **[LIVE]** |
| `frontend/public/rockresin/swirl-bg-brown.png` | `products/rockresin/swirl-bg-brown.png` **[LIVE]** |
| `frontend/public/rockresin/swirl-poster.png` | `products/rockresin/swirl-poster.png` **[LIVE]** |
| `frontend/public/rockresin/triphala.png` | `products/rockresin/triphala.png` **[LIVE]** |

## `products/shahjeet/`  (12 files, 11 [LIVE])

| upload local file | → S3 key |
|---|---|
| `frontend/public/shahjeet/bee-real.png` | `products/shahjeet/bee-real.png` **[LIVE]** |
| `frontend/public/shahjeet/bee.png` | `products/shahjeet/bee.png` **[LIVE]** |
| `frontend/public/shahjeet/canister-2.png` | `products/shahjeet/canister-2.png` **[LIVE]** |
| `frontend/public/shahjeet/canister.png` | `products/shahjeet/canister.png` **[LIVE]** |
| `frontend/public/shahjeet/frame82.png` | `products/shahjeet/frame82.png` **[LIVE]** |
| `frontend/public/shahjeet/hero-product.png` | `products/shahjeet/hero-product.png` **[LIVE]** |
| `frontend/public/shahjeet/mountain.png` | `products/shahjeet/mountain.png` **[LIVE]** |
| `frontend/public/shahjeet/ritual-steps.png` | `products/shahjeet/ritual-steps.png` **[LIVE]** |
| `frontend/public/products/shahjeet/splash.jpg` | `products/shahjeet/splash.jpg` |
| `frontend/public/shahjeet/stick-dark.png` | `products/shahjeet/stick-dark.png` **[LIVE]** |
| `frontend/public/shahjeet/sticks-3.png` | `products/shahjeet/sticks-3.png` **[LIVE]** |
| `frontend/public/shahjeet/why-pills.png` | `products/shahjeet/why-pills.png` **[LIVE]** |

## `brand/`  (2 files, 1 [LIVE])

| upload local file | → S3 key |
|---|---|
| `frontend/public/brand/3t-icon.png` | `brand/3t-icon.png` |
| `frontend/public/brand/watermark-wordmark.png` | `brand/watermark-wordmark.png` **[LIVE]** |

## `brand/logos/`  (6 files, 6 [LIVE])

| upload local file | → S3 key |
|---|---|
| `frontend/public/logos/3tattava-wordmark.png` | `brand/logos/3tattava-wordmark.png` **[LIVE]** |
| `frontend/public/logos/logo-full-cream.png` | `brand/logos/logo-full-cream.png` **[LIVE]** |
| `frontend/public/logos/logo-full-espresso.png` | `brand/logos/logo-full-espresso.png` **[LIVE]** |
| `frontend/public/logos/sankalpa-siddhi.png` | `brand/logos/sankalpa-siddhi.png` **[LIVE]** |
| `frontend/public/logos/wordmark-cream.png` | `brand/logos/wordmark-cream.png` **[LIVE]** |
| `frontend/public/logos/wordmark-espresso.png` | `brand/logos/wordmark-espresso.png` **[LIVE]** |

## `brand/icons/`  (18 files, 15 [LIVE])

| upload local file | → S3 key |
|---|---|
| `frontend/public/icons/chevron-down.svg` | `brand/icons/chevron-down.svg` **[LIVE]** |
| `frontend/public/icons/diamond.svg` | `brand/icons/diamond.svg` **[LIVE]** |
| `frontend/public/icons/facebook.svg` | `brand/icons/facebook.svg` **[LIVE]** |
| `frontend/public/icons/heart-pulse.svg` | `brand/icons/heart-pulse.svg` **[LIVE]** |
| `frontend/public/icons/herb.svg` | `brand/icons/herb.svg` **[LIVE]** |
| `frontend/public/icons/instagram.svg` | `brand/icons/instagram.svg` **[LIVE]** |
| `frontend/public/icons/lab-certificate.svg` | `brand/icons/lab-certificate.svg` **[LIVE]** |
| `frontend/public/icons/lab-flask.svg` | `brand/icons/lab-flask.svg` **[LIVE]** |
| `frontend/public/icons/lab-microscope.svg` | `brand/icons/lab-microscope.svg` **[LIVE]** |
| `frontend/public/icons/lab-test-tube.svg` | `brand/icons/lab-test-tube.svg` |
| `frontend/public/icons/leaf.svg` | `brand/icons/leaf.svg` **[LIVE]** |
| `frontend/public/icons/linkedin.svg` | `brand/icons/linkedin.svg` **[LIVE]** |
| `frontend/public/icons/map-compass.svg` | `brand/icons/map-compass.svg` |
| `frontend/public/icons/map-pin.svg` | `brand/icons/map-pin.svg` |
| `frontend/public/icons/mountain.svg` | `brand/icons/mountain.svg` **[LIVE]** |
| `frontend/public/icons/package.svg` | `brand/icons/package.svg` **[LIVE]** |
| `frontend/public/icons/shield-check.svg` | `brand/icons/shield-check.svg` **[LIVE]** |
| `frontend/public/icons/whatsapp-line.svg` | `brand/icons/whatsapp-line.svg` **[LIVE]** |

## `videos/`  (2 files, 2 [LIVE])

| upload local file | → S3 key |
|---|---|
| `frontend/public/videos/morning-ritual.mp4` | `videos/morning-ritual.mp4` **[LIVE]** |
| `frontend/public/videos/shahjeet-reveal.mp4` | `videos/shahjeet-reveal.mp4` **[LIVE]** |

## `misc/`  (3 files, 3 [LIVE])

| upload local file | → S3 key |
|---|---|
| `frontend/public/favicon-3t.png` | `misc/favicon-3t.png` **[LIVE]** |
| `frontend/public/og-default.png` | `misc/og-default.png` **[LIVE]** |
| `frontend/public/placeholder.svg` | `misc/placeholder.svg` **[LIVE]** |

## `misc/lab-reports/`  (3 files)

| upload local file | → S3 key |
|---|---|
| `frontend/public/lab-reports/rockresin-coa.pdf` | `misc/lab-reports/rockresin-coa.pdf` |
| `frontend/public/lab-reports/RockResins-labreport.pdf` | `misc/lab-reports/RockResins-labreport.pdf` |
| `frontend/public/lab-reports/Shahjeet-Sticks.pdf` | `misc/lab-reports/Shahjeet-Sticks.pdf` |

## `blog/`  (1 files)

| upload local file | → S3 key |
|---|---|
| `frontend/public/education/shilajit-hero.svg` | `blog/shilajit-hero.svg` |

## `blog/covers/`  (3 files)

| upload local file | → S3 key |
|---|---|
| `frontend/public/education/covers/shilajit-for-men.svg` | `blog/covers/shilajit-for-men.svg` |
| `frontend/public/education/covers/the-shilajit-swirl-ritual.svg` | `blog/covers/the-shilajit-swirl-ritual.svg` |
| `frontend/public/education/covers/understanding-your-dosha.svg` | `blog/covers/understanding-your-dosha.svg` |

## `banners/find-us/`  (1 files)

| upload local file | → S3 key |
|---|---|
| `frontend/public/posters/find-us/1.jpg` | `banners/find-us/1.jpg` |

## `banners/research/`  (1 files)

| upload local file | → S3 key |
|---|---|
| `frontend/public/posters/research/1.jpg` | `banners/research/1.jpg` |

## `banners/vaidyaconnect/`  (1 files)

| upload local file | → S3 key |
|---|---|
| `frontend/public/posters/vaidyaconnect/1.jpg` | `banners/vaidyaconnect/1.jpg` |

## `misc/team/`  (1 files)

| upload local file | → S3 key |
|---|---|
| `frontend/public/team/dr-falguni-chauhan.jpg` | `misc/team/dr-falguni-chauhan.jpg` |

---

## After uploading — REQUIRED so the CDN serves (else 403)
1. S3 → 3tattava-media-prod → Permissions → Bucket policy → add the CloudFront OAC policy (see handoff).
2. Vercel → Env → set `NEXT_PUBLIC_CLOUDFRONT_URL=https://media.3tattava.com`.
3. Redeploy. The site falls back to local /public until this env is set, so nothing breaks meanwhile.

'use client'
import { media } from "@/lib/media";
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const F = 'var(--font-primary), system-ui, sans-serif'

const ESPRESSO = '#442a1b'
const GOLD = '#cd872a'
const CREAM = '#f7f0e2'
const DARK = '#1c1304'

interface ProductCard {
  title: string
  subtitle: string
  image: string
  tags?: string
  price?: string
  oldPrice?: string
  badge?: string
  bottomText?: string
  ctaLabel: string
  ctaHref: string
  comingSoon?: boolean
  ctaHoverText?: string
}

const products: ProductCard[] = [
  {
    title: 'Shahjeet Sticks',
    subtitle: 'Daily Strength & Vitality Formula',
    image: media("/hero/shahjeet-hero.png"),
    tags: '30 Sticks · 600mg · Honey-Infused',
    price: '₹1,399',
    oldPrice: '₹1,599',
    ctaLabel: 'Shop Now →',
    ctaHoverText: 'Balance. Build. Become.',
    ctaHref: '/products/shahjeet-sticks',
  },
  {
    title: 'RockResin',
    subtitle: 'Shodhit Shilajit Resin',
    image: media("/hero/rockresin-product.jpg"),
    badge: 'COMING SOON',
    bottomText: 'Ancient Mineral Elixir for Modern Vitality',
    ctaLabel: 'Notify Me →',
    ctaHoverText: 'Dip. Hook. Swirl — Soon',
    ctaHref: '#rockresin-reveal',
    comingSoon: true,
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.2,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
}

function Card({ product, index }: { product: ProductCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [ctaHovered, setCtaHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        flex: '1 1 0',
        minWidth: 280,
        maxWidth: 520,
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(68,42,27,0.08)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          background: product.comingSoon
            ? 'linear-gradient(135deg, #1c1304 0%, #442a1b 100%)'
            : CREAM,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: product.comingSoon ? 'contain' : 'cover',
            display: 'block',
            opacity: product.comingSoon ? 0.7 : 1,
          }}
        />
        {product.badge && (
          <span
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: GOLD,
              color: '#fff',
              fontFamily: F,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              padding: '6px 14px',
              borderRadius: 20,
              textTransform: 'uppercase',
            }}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: '28px 28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: F,
            fontSize: 24,
            fontWeight: 700,
            color: ESPRESSO,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {product.title}
        </h3>

        <p
          style={{
            fontFamily: F,
            fontSize: 15,
            color: GOLD,
            margin: 0,
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          {product.subtitle}
        </p>

        {product.tags && (
          <p
            style={{
              fontFamily: F,
              fontSize: 13,
              color: '#8a7560',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            {product.tags}
          </p>
        )}

        {product.bottomText && (
          <p
            style={{
              fontFamily: F,
              fontSize: 14,
              color: '#6b5a48',
              margin: 0,
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}
          >
            {product.bottomText}
          </p>
        )}

        <div style={{ flex: 1 }} />

        {/* Price or Badge area */}
        {product.price && (
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 10,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontFamily: F,
                fontSize: 28,
                fontWeight: 700,
                color: ESPRESSO,
              }}
            >
              {product.price}
            </span>
            {product.oldPrice && (
              <span
                style={{
                  fontFamily: F,
                  fontSize: 16,
                  color: '#a89580',
                  textDecoration: 'line-through',
                }}
              >
                {product.oldPrice}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          href={product.ctaHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: F,
            fontSize: 15,
            fontWeight: 600,
            color: '#fff',
            background: product.comingSoon
              ? `linear-gradient(135deg, ${ESPRESSO}, ${DARK})`
              : `linear-gradient(135deg, ${GOLD}, #b87420)`,
            padding: '14px 28px',
            borderRadius: 10,
            textDecoration: 'none',
            letterSpacing: '0.02em',
            marginTop: 4,
            transition: 'filter 0.2s ease',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'
            setCtaHovered(true)
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.filter = 'brightness(1)'
            setCtaHovered(false)
          }}
        >
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Default label – stays in flow so the button sizes to it */}
            <span
              style={{
                opacity: ctaHovered && product.ctaHoverText ? 0 : 1,
                transition: 'opacity 300ms ease',
                whiteSpace: 'nowrap',
                visibility:
                  ctaHovered && product.ctaHoverText ? 'hidden' : 'visible',
              }}
            >
              {product.ctaLabel}
            </span>

            {/* Hover tagline – absolutely positioned over the default label */}
            {product.ctaHoverText && (
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: ctaHovered ? 1 : 0,
                  transition: 'opacity 300ms ease',
                  color: product.comingSoon ? GOLD : CREAM,
                  fontStyle: 'italic',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {product.ctaHoverText}
              </span>
            )}
          </span>
        </Link>
      </div>
    </motion.div>
  )
}

export default function FeaturedProductsRevamp() {
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-60px' })

  return (
    <section
      id="products"
      style={{
        background: CREAM,
        padding: '100px 24px',
        fontFamily: F,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
        }}
      >
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            marginBottom: 64,
          }}
        >
          <h2
            style={{
              fontFamily: F,
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              color: ESPRESSO,
              margin: '0 0 20px',
              lineHeight: 1.15,
            }}
          >
            Featured Products
          </h2>
          <p
            style={{
              fontFamily: F,
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#6b5a48',
              margin: '0 auto',
              maxWidth: 720,
              lineHeight: 1.7,
            }}
          >
            We formulate science-backed wellness products that naturally support
            energy, stamina, focus, recovery, and overall well-being for men and
            women striving to perform at their best every day.
          </p>
        </motion.div>

        {/* Product Cards */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {products.map((product, i) => (
            <Card key={product.title} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

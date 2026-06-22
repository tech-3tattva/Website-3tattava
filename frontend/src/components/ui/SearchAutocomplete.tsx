'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface Suggestion {
  label: string
  route: string
  type: 'product' | 'category'
}

const SUGGESTIONS: Suggestion[] = [
  { label: 'Shodhit Shilajit Resin', route: '/products/shodhit-shilajit-resin', type: 'product' },
  { label: 'Shahjeet Honey Sticks', route: '/products/shahjeet-sticks', type: 'product' },
  { label: 'Shilajit Resin 20g Jar', route: '/products/shodhit-shilajit-resin', type: 'product' },
  { label: 'Honey Shilajit Sticks 30 Pack', route: '/products/shahjeet-sticks', type: 'product' },
  { label: 'Shilajit for Energy', route: '/products/shodhit-shilajit-resin', type: 'category' },
  { label: 'Shilajit for Women', route: '/products/shodhit-shilajit-resin', type: 'category' },
  { label: 'Shilajit for Men', route: '/products/shodhit-shilajit-resin', type: 'category' },
  { label: 'Himalayan Shilajit', route: '/products/shodhit-shilajit-resin', type: 'category' },
  { label: 'NABL Tested Shilajit', route: '/products/shodhit-shilajit-resin', type: 'category' },
  { label: 'Natural Energy Supplement', route: '/products/shahjeet-sticks', type: 'category' },
  { label: 'Daily Ritual Honey Stick', route: '/products/shahjeet-sticks', type: 'product' },
  { label: 'Iron Supplement Women', route: '/products/shodhit-shilajit-resin', type: 'category' },
  { label: 'Performance Ayurveda', route: '/shop', type: 'category' },
  { label: 'Fulvic Acid Supplement', route: '/products/shodhit-shilajit-resin', type: 'category' },
  { label: 'Ayurvedic Minerals', route: '/shop', type: 'category' },
  { label: 'Triphala Purified Shilajit', route: '/products/shodhit-shilajit-resin', type: 'category' },
  { label: 'Honey Energy Sticks', route: '/products/shahjeet-sticks', type: 'product' },
  { label: 'All Products', route: '/shop', type: 'category' },
  { label: 'Doctor Formulated Shilajit', route: '/products/shodhit-shilajit-resin', type: 'category' },
  { label: 'Recovery Supplement', route: '/products/shahjeet-sticks', type: 'category' },
]

const DEFAULTS = SUGGESTIONS.slice(0, 4)

interface Props {
  onClose?: () => void
  autoFocus?: boolean
}

export default function SearchAutocomplete({ onClose, autoFocus }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(-1)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = query.length > 0
    ? SUGGESTIONS.filter(s => s.label.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
    : DEFAULTS

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  const navigate = (route: string) => {
    router.push(route)
    setQuery('')
    setOpen(false)
    setHighlighted(-1)
    onClose?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = highlighted >= 0 ? results[highlighted] : results[0]
      if (target) navigate(target.route)
    } else if (e.key === 'Escape') {
      setOpen(false)
      onClose?.()
    }
  }

  const isDropOpen = open && results.length > 0

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
      {/* Input */}
      <div style={{ position: 'relative' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--ink-soft, rgba(28,19,4,0.6))',
            pointerEvents: 'none',
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search Shilajit, Honey Sticks..."
          onChange={e => { setQuery(e.target.value); setOpen(true); setHighlighted(-1) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: 44,
            paddingLeft: 42,
            paddingRight: query ? 36 : 14,
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: 14,
            fontFamily: 'var(--font-body, Jost, system-ui, sans-serif)',
            color: 'var(--ink, #1c1304)',
            background: '#fff',
            border: `1.5px solid ${isDropOpen ? 'var(--gold, #C8963E)' : 'rgba(28,19,4,0.15)'}`,
            borderRadius: isDropOpen ? '8px 8px 0 0' : '8px',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: isDropOpen ? '0 0 0 3px rgba(200,150,62,0.12)' : 'none',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setHighlighted(-1); inputRef.current?.focus() }}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 2,
              color: 'var(--ink-soft, rgba(28,19,4,0.5))',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isDropOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 200,
            background: '#fff',
            border: '1.5px solid var(--gold, #C8963E)',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 8px 32px rgba(28,19,4,0.12)',
            overflow: 'hidden',
          }}
        >
          {query.length === 0 && (
            <div style={{ padding: '8px 16px 4px', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft, rgba(28,19,4,0.5))', fontWeight: 700 }}>
              Popular Searches
            </div>
          )}
          {results.map((s, i) => (
            <div
              key={s.label}
              onMouseDown={() => navigate(s.route)}
              onMouseEnter={() => setHighlighted(i)}
              style={{
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                cursor: 'pointer',
                background: highlighted === i ? 'rgba(200,150,62,0.08)' : 'transparent',
                transition: 'background 0.15s',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <Search size={13} style={{ flexShrink: 0, color: 'var(--ink-soft, rgba(28,19,4,0.4))' }} />
                <span style={{
                  fontSize: 14,
                  color: 'var(--ink, #1c1304)',
                  fontFamily: 'var(--font-body, Jost, system-ui, sans-serif)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {s.label}
                </span>
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                flexShrink: 0,
                color: s.type === 'product' ? 'var(--gold-dark, #A67B2F)' : 'var(--ink-soft, rgba(28,19,4,0.5))',
              }}>
                {s.type === 'product' ? 'Product' : 'Category'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
//  GardenJournal — bottom sheet showing all planted letters
//  Filters: author, sort order, search, bloomed only, date
// ============================================================
import { useState, useMemo, useEffect, useRef } from 'react'
import { USERS } from '../utils/auth.js'
import styles from './GardenJournal.module.css'

// ── Month names for date filter ──
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

// ── Format date nicely ──
function fmtDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// ── Truncate text preview ──
function preview(text, max = 90) {
  if (!text) return ''
  const clean = text.replace(/\n/g, ' ')
  return clean.length > max ? clean.slice(0, max) + '…' : clean
}

// ── Single journal entry card ──
function JournalEntry({ flower, onClick }) {
  const user        = flower.plantedBy ? USERS[flower.plantedBy] : null
  const displayName = user?.displayName ?? flower.plantedBy ?? 'Unknown'
  const userColor   = flower.userColor ?? '#7ab648'

  const isAnniversary = (() => {
    if (!flower.plantedAt) return false
    const p = new Date(flower.plantedAt)
    const t = new Date()
    return p.getMonth() === t.getMonth() &&
           p.getDate()  === t.getDate()  &&
           p.getFullYear() < t.getFullYear()
  })()

  return (
    <div
      className={`${styles.entry} ${flower.isLoveLetter ? styles.entrySpecial : ''} ${isAnniversary ? styles.entryAnniversary : ''}`}
      onClick={() => onClick(flower)}
    >
      {/* Flower thumbnail */}
      <div className={styles.entryThumb} style={{ '--ring': userColor }}>
        <img
          src={flower.sprite?.file ?? '/images/flower1.png'}
          alt={flower.sprite?.name}
          className={styles.entryImg}
          draggable={false}
        />
        {!flower.bloomed && (
          <span className={styles.sproutBadge} title="Still growing">🌱</span>
        )}
        {isAnniversary && (
          <span className={styles.anniBadge} title="Anniversary!">✨</span>
        )}
      </div>

      {/* Text */}
      <div className={styles.entryText}>
        <div className={styles.entryTitleRow}>
          <span className={styles.entryTitle}>
            {flower.letterTitle || flower.sprite?.name || 'Untitled'}
          </span>
          {flower.mood && (
            <span className={styles.entryMood}>{flower.mood.label?.split(' ')[0]}</span>
          )}
        </div>
        <p className={styles.entryPreview}>
          {preview(flower.letterBody)}
        </p>
        <div className={styles.entryMeta}>
          <span className={styles.entryAuthor} style={{ color: userColor }}>
            {displayName}
          </span>
          <span className={styles.entryDot}>·</span>
          <span className={styles.entryDate}>{fmtDate(flower.plantedAt)}</span>
          {!flower.bloomed && (
            <>
              <span className={styles.entryDot}>·</span>
              <span className={styles.entryGrowing}>Growing…</span>
            </>
          )}
        </div>
      </div>

      {/* Arrow */}
      <svg className={styles.entryArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  )
}

// ── Main component ──
export default function GardenJournal({ flowers, open, onClose, onSelectFlower }) {
  const sheetRef = useRef(null)

  // ── Filter state ──
  const [author,      setAuthor]      = useState('all')   // 'all' | 'JabezCollano' | 'DesilynBrillante'
  const [sortOrder,   setSortOrder]   = useState('newest') // 'newest' | 'oldest'
  const [searchQuery, setSearchQuery] = useState('')
  const [bloomedOnly, setBloomedOnly] = useState(false)
  const [filterMonth, setFilterMonth] = useState('')       // '' | '0'–'11'
  const [filterDay,   setFilterDay]   = useState('')       // '' | '1'–'31'

  // Reset search when closing
  useEffect(() => {
    if (!open) setSearchQuery('')
  }, [open])

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  // ── Filtered + sorted flowers ──
  const entries = useMemo(() => {
    // Include the love letter flower at the top always
    let list = [...flowers]

    // Author filter
    if (author !== 'all') {
      list = list.filter(f => f.plantedBy === author)
    }

    // Bloomed only
    if (bloomedOnly) {
      list = list.filter(f => f.bloomed)
    }

    // Month filter
    if (filterMonth !== '') {
      list = list.filter(f => {
        if (!f.plantedAt) return false
        return new Date(f.plantedAt).getMonth() === parseInt(filterMonth)
      })
    }

    // Day filter
    if (filterDay !== '') {
      list = list.filter(f => {
        if (!f.plantedAt) return false
        return new Date(f.plantedAt).getDate() === parseInt(filterDay)
      })
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(f =>
        (f.letterTitle  ?? '').toLowerCase().includes(q) ||
        (f.letterBody   ?? '').toLowerCase().includes(q) ||
        (f.sprite?.name ?? '').toLowerCase().includes(q)
      )
    }

    // Sort
    list.sort((a, b) => {
      const ta = a.plantedAt ?? 0
      const tb = b.plantedAt ?? 0
      return sortOrder === 'newest' ? tb - ta : ta - tb
    })

    return list
  }, [flowers, author, sortOrder, bloomedOnly, filterMonth, filterDay, searchQuery])

  // Generate day options 1-31
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
      onClick={handleBackdrop}
    >
      <div
        ref={sheetRef}
        className={`${styles.sheet} ${open ? styles.sheetOpen : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className={styles.handle} onClick={onClose} />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <h2 className={styles.title}>Garden Journal</h2>
            <span className={styles.count}>{entries.length} letter{entries.length !== 1 ? 's' : ''}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close journal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search letters…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className={styles.searchClear} onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Filter bar */}
        <div className={styles.filters}>

          {/* Author */}
          <div className={styles.filterGroup}>
            {['all', 'JabezCollano', 'DesilynBrillante'].map(a => (
              <button
                key={a}
                className={`${styles.filterBtn} ${author === a ? styles.filterActive : ''}`}
                onClick={() => setAuthor(a)}
              >
                {a === 'all' ? 'All' : USERS[a]?.displayName}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className={styles.filterGroup}>
            {[['newest','Newest'],['oldest','Oldest']].map(([v,l]) => (
              <button
                key={v}
                className={`${styles.filterBtn} ${sortOrder === v ? styles.filterActive : ''}`}
                onClick={() => setSortOrder(v)}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Bloomed only toggle */}
          <button
            className={`${styles.filterBtn} ${bloomedOnly ? styles.filterActive : ''}`}
            onClick={() => setBloomedOnly(v => !v)}
          >
            🌸 Bloomed only
          </button>
        </div>

        {/* Date filter row */}
        <div className={styles.dateFilters}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" style={{opacity:0.5,flexShrink:0}}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>

          <select
            className={styles.dateSelect}
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
          >
            <option value="">Any Month</option>
            {MONTHS.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>

          <select
            className={styles.dateSelect}
            value={filterDay}
            onChange={e => setFilterDay(e.target.value)}
          >
            <option value="">Any Day</option>
            {dayOptions.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {(filterMonth !== '' || filterDay !== '') && (
            <button
              className={styles.dateClear}
              onClick={() => { setFilterMonth(''); setFilterDay('') }}
            >
              Clear date
            </button>
          )}
        </div>

        {/* Entry list */}
        <div className={styles.list}>
          {entries.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🌱</span>
              <p className={styles.emptyText}>No letters found</p>
              <p className={styles.emptySub}>Try adjusting your filters</p>
            </div>
          ) : (
            entries.map(flower => (
              <JournalEntry
                key={flower.id}
                flower={flower}
                onClick={(f) => { onClose(); onSelectFlower(f) }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
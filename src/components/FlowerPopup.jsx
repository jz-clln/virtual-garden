// ============================================================
//  FlowerPopup — letter, photo, reactions
// ============================================================
import { useState, useEffect } from 'react'
import styles from './FlowerPopup.module.css'
import { USERS } from '../utils/auth.js'

const REACTION_EMOJIS = ['🌸','💕','🥹','✨','💚','🥰']

export default function FlowerPopup({ flower, currentUser, onClose, onReact }) {
  const [revealed, setRevealed] = useState(false)
  const [imgExpanded, setImgExpanded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const user        = flower.plantedBy ? USERS[flower.plantedBy] : null
  const displayName = user?.displayName ?? flower.plantedBy ?? 'Someone'
  const userColor   = flower.userColor ?? '#7ab648'

  const dateStr = flower.plantedAt
    ? new Date(flower.plantedAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
    : ''

  const isAnniversary = (() => {
    if (!flower.plantedAt) return false
    const p = new Date(flower.plantedAt), t = new Date()
    return p.getMonth() === t.getMonth() && p.getDate() === t.getDate() && p.getFullYear() < t.getFullYear()
  })()

  const yearsAgo = isAnniversary ? new Date().getFullYear() - new Date(flower.plantedAt).getFullYear() : 0

  return (
    <div className="backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.card}>

        {/* Anniversary banner */}
        {isAnniversary && (
          <div className={styles.anniversaryBanner}>
            ✨ Planted {yearsAgo} year{yearsAgo > 1 ? 's' : ''} ago today 🌸
          </div>
        )}

        {/* Flower + photo */}
        <div className={styles.topRow}>
          <div className={styles.imgWrap} style={{ '--ring-color': userColor }}>
            <img src={flower.sprite?.file ?? `${import.meta.env.BASE_URL}images/flower1.png`} alt={flower.sprite?.name}
              className={styles.flowerImg} draggable={false} />
          </div>

          {flower.photoDataUrl && (
            <div
              className={`${styles.photoWrap} ${imgExpanded ? styles.photoExpanded : ''}`}
              onClick={() => setImgExpanded(v => !v)}
              title="Click to expand"
            >
              <img src={flower.photoDataUrl} alt="Attached memory" className={styles.photo} draggable={false} />
              <span className={styles.photoHint}>{imgExpanded ? 'Click to shrink' : '🖼 Click to expand'}</span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <span className={styles.fromBadge} style={{ borderColor: userColor, color: userColor }}>
            💌 From {displayName}
          </span>
          {dateStr && <span className={styles.date}>{dateStr}</span>}
        </div>

        {/* Title */}
        {flower.letterTitle && <h2 className={styles.letterTitle}>{flower.letterTitle}</h2>}

        {/* Mood */}
        {flower.mood && <span className={styles.moodTag}>{flower.mood.label}</span>}

        <div className={styles.divider} />

        {/* Body */}
        <div className={`${styles.message} ${revealed ? styles.revealed : ''}`}>
          {flower.letterBody}
        </div>

        <p className={styles.signature}>— With love, {displayName} 🌿</p>

        {/* ── Reactions ── */}
        <div className={styles.reactionsSection}>
          <p className={styles.reactionsLabel}>Leave a reaction</p>
          <div className={styles.emojiRow}>
            {REACTION_EMOJIS.map(emoji => {
              const reactors = flower.reactions?.[emoji] ?? []
              const hasReacted = currentUser && reactors.includes(currentUser.username)
              return (
                <button
                  key={emoji}
                  className={`${styles.emojiBtn} ${hasReacted ? styles.emojiBtnActive : ''}`}
                  onClick={() => onReact && onReact(flower.id, emoji)}
                  title={reactors.map(u => USERS[u]?.displayName ?? u).join(', ') || emoji}
                >
                  <span className={styles.emojiIcon}>{emoji}</span>
                  {reactors.length > 0 && (
                    <span className={styles.emojiCount}>{reactors.length}</span>
                  )}
                </button>
              )
            })}
          </div>
          {/* Show who reacted */}
          {flower.reactions && Object.keys(flower.reactions).length > 0 && (
            <div className={styles.reactorList}>
              {Object.entries(flower.reactions).map(([emoji, users]) =>
                users.length > 0 ? (
                  <span key={emoji} className={styles.reactorItem}>
                    {emoji} {users.map(u => USERS[u]?.displayName ?? u).join(' & ')}
                  </span>
                ) : null
              )}
            </div>
          )}
        </div>

        <button className={`pixel-btn ${styles.closeBtn}`} onClick={onClose}>Close ✿</button>
      </div>
    </div>
  )
}
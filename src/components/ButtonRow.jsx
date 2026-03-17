// ============================================================
//  ButtonRow — top-right cluster of smooth rounded icon buttons
// ============================================================
import { useState } from 'react'
import styles from './ButtonRow.module.css'

const IconMusic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
)
const IconMusicPlaying = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.3"/>
    <circle cx="18" cy="16" r="3" fill="currentColor" fillOpacity="0.3"/>
  </svg>
)
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const IconPen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconJournal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const IconStats = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
export default function ButtonRow({
  spotifyOpen, onToggleSpotify,
  onClear, showClearConfirm, onConfirmClear, onCancelClear,
  onCompose, onOpenJournal, journalOpen,
  onOpenStats, statsOpen,
}) {
  const [shaking, setShaking] = useState(false)

  const handleClearClick = () => {
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
    onClear()
  }

  return (
    <div className={styles.row}>

      {/* Spotify */}
      <button className={`${styles.btn} ${spotifyOpen ? styles.active : ''}`} onClick={onToggleSpotify} title="Her Playlist (S)" aria-label="Toggle Spotify playlist">
        {spotifyOpen ? <IconMusicPlaying /> : <IconMusic />}
        <span className={styles.tip}>Her Playlist</span>
      </button>

      {/* Plant a letter */}
      <button className={`${styles.btn} ${styles.composeBtn}`} onClick={onCompose} title="Plant a Letter" aria-label="Write and plant a letter">
        <IconPen />
        <span className={styles.tip}>Plant a Letter</span>
      </button>

      {/* Garden Journal */}
      <button className={`${styles.btn} ${journalOpen ? styles.active : ''}`} onClick={onOpenJournal} title="Garden Journal" aria-label="Open garden journal">
        <IconJournal />
        <span className={styles.tip}>Journal</span>
      </button>

      {/* Love letter page */}

      {/* Stats */}
      <button className={`${styles.btn} ${statsOpen ? styles.active : ''}`} onClick={onOpenStats} title="Garden Stats" aria-label="Open garden stats">
        <IconStats />
        <span className={styles.tip}>Stats</span>
      </button>

      {/* Clear garden */}
      <button
        className={`${styles.btn} ${styles.clearBtn} ${shaking ? styles.shake : ''} ${showClearConfirm ? styles.confirmMode : ''}`}
        onClick={showClearConfirm ? undefined : handleClearClick}
        title="Clear Garden" aria-label="Clear all flowers"
      >
        {showClearConfirm ? (
          <span className={styles.confirmRow}>
            <span className={styles.confirmYes} onClick={e => { e.stopPropagation(); onConfirmClear() }} title="Yes, clear"><IconCheck /></span>
            <span className={styles.confirmNo}  onClick={e => { e.stopPropagation(); onCancelClear()  }} title="Cancel"><IconX /></span>
          </span>
        ) : (
          <>
            <IconTrash />
            <span className={styles.tip}>Clear</span>
          </>
        )}
      </button>
    </div>
  )
}
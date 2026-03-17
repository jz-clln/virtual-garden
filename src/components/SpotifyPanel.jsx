// ============================================================
//  SpotifyPanel — sliding Spotify embed panel
// ============================================================
import styles from './SpotifyPanel.module.css'
import { SPOTIFY_EMBED_URL } from '../utils/constants.js'

/**
 * SpotifyPanel
 * A sliding panel that embeds the Spotify playlist for Desilyn.
 *
 * @param {{
 *   open:    boolean,
 *   onClose: () => void,
 * }} props
 */
export default function SpotifyPanel({ open, onClose }) {
  return (
    <div className={`${styles.panel} ${open ? styles.open : ''}`}>
      {/* Panel header */}
      <div className={styles.header}>
        <span className={styles.title}>🎵 A Playlist For You, Desilyn</span>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close playlist"
        >
          ✕
        </button>
      </div>

      {/* Spotify embed — only render iframe when open to save resources */}
      {open && (
        <iframe
          className={styles.iframe}
          src={SPOTIFY_EMBED_URL}
          height="380"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Desilyn's Playlist"
        />
      )}
    </div>
  )
}

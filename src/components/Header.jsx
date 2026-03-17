// ============================================================
//  Header — shows title + logged-in user badge + logout
// ============================================================
import styles from './Header.module.css'

export default function Header({ currentUser, onLogout }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>🌸 Our Virtual Garden 🌸</h1>

      {currentUser && (
        <div className={styles.userRow}>
          <span
            className={styles.userBadge}
            style={{ borderColor: currentUser.color, color: currentUser.color }}
          >
            <span
              className={styles.userDot}
              style={{ background: currentUser.color }}
            />
            {currentUser.displayName}
          </span>
          <button className={styles.logoutBtn} onClick={onLogout} title="Log out">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      )}
    </header>
  )
}
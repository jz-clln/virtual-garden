// ============================================================
//  ClearConfirm — cute animated popup to confirm clearing garden
// ============================================================
import styles from './ClearConfirm.module.css'

export default function ClearConfirm({ count, onConfirm, onCancel }) {
  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>

        {/* Animated flower icon */}
        <div className={styles.iconWrap} aria-hidden>
          <span className={styles.iconFlower}>🌷</span>
        </div>

        <h2 className={styles.title}>Clear the Garden?</h2>
        <p className={styles.body}>
          You have <strong>{count}</strong> flower{count === 1 ? '' : 's'} planted for Desilyn.<br />
          Are you sure you want to clear them all?
        </p>

        <div className={styles.btnRow}>
          <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onCancel}>
            🌿 Keep them
          </button>
          <button className={`${styles.btn} ${styles.btnConfirm}`} onClick={onConfirm}>
            🗑️ Yes, clear
          </button>
        </div>
      </div>
    </div>
  )
}

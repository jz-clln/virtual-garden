// ============================================================
//  BottomBar — hint text + flower count
// ============================================================
import styles from './BottomBar.module.css'

export default function BottomBar({ flowerCount }) {
  return (
    <div className={styles.bar}>

      <p className={styles.count}>
        🌷 {flowerCount} flower{flowerCount === 1 ? '' : 's'}
      </p>
    </div>
  )
}
// ============================================================
//  Toast — bottom-center notification banner
// ============================================================
import styles from './Toast.module.css'

/**
 * Toast
 * Slides up from the bottom when `visible` is true.
 *
 * @param {{
 *   message: string,
 *   visible: boolean,
 * }} props
 */
export default function Toast({ message, visible }) {
  return (
    <div
      className={`${styles.toast} ${visible ? styles.visible : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}

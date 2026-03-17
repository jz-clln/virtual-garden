// ============================================================
//  LoveLetterPage — a full-page romantic letter from Jabez
// ============================================================
import { useEffect, useState } from 'react'
import { LOVE_LETTER } from '../utils/constants.js'
import FallingPetals from '../components/FallingPetals.jsx'
import styles from './LoveLetterPage.module.css'

/**
 * LoveLetterPage
 * Displays a beautifully typeset love letter with staggered
 * reveal animations.
 *
 * @param {{ onBack: () => void }} props
 */
export default function LoveLetterPage({ onBack }) {
  const [visible, setVisible] = useState(false)

  // Trigger entrance animation after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={styles.page}>
      {/* Soft parchment background */}
      <div className={styles.parchmentBg} />

      {/* Falling petals behind everything */}
      <FallingPetals zIndex={1} />

      {/* Letter container */}
      <div className={`${styles.container} ${visible ? styles.containerVisible : ''}`}>

        {/* Back button */}
        <button className={styles.backBtn} onClick={onBack}>
          ← Back to Garden
        </button>

        {/* Decorative header flourish */}
        <div className={styles.flourish} aria-hidden>✿ ❧ ✿</div>

        {/* Date */}
        <p className={styles.date}>{LOVE_LETTER.date}</p>

        {/* Salutation */}
        <h1 className={styles.salutation}>{LOVE_LETTER.salutation}</h1>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Body paragraphs — staggered reveal */}
        <div className={`${styles.body} scrollable`}>
          {LOVE_LETTER.paragraphs.map((para, i) => (
            <p
              key={i}
              className={styles.paragraph}
              style={{ animationDelay: `${0.3 + i * 0.25}s` }}
              // Render *italic* markdown-style within paragraphs
              dangerouslySetInnerHTML={{
                __html: para.replace(/\*(.*?)\*/g, '<em>$1</em>'),
              }}
            />
          ))}

          {/* Closing */}
          <div className={styles.closing}>
            <p className={styles.closingText}>{LOVE_LETTER.closing}</p>
            <p className={styles.signature}>{LOVE_LETTER.signature}</p>
          </div>
        </div>

        {/* Bottom flourish */}
        <div className={styles.flourishBottom} aria-hidden>
          🌸 🌷 🌸
        </div>
      </div>
    </div>
  )
}

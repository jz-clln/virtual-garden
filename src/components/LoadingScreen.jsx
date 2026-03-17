// ============================================================
//  LoadingScreen — beautiful entrance animation on first load
// ============================================================
import { useEffect, useState } from 'react'
import { BACKGROUND_IMAGE } from '../utils/constants.js'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState(0)
  // 0 = growing, 1 = names reveal, 2 = fading out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200)
    const t2 = setTimeout(() => setPhase(2), 2800)
    const t3 = setTimeout(() => onComplete(), 3600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div className={`${styles.screen} ${phase === 2 ? styles.fadeOut : ''}`}>
      {/* Blurred garden bg */}
      <div className={styles.bg} style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }} />
      <div className={styles.bgOverlay} />

      {/* Floating petals */}
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          className={styles.petal}
          style={{
            left:            `${(i / 12) * 100 + Math.random() * 8}%`,
            animationDelay:  `${i * 0.18}s`,
            animationDuration:`${6 + Math.random() * 4}s`,
            fontSize:        `${0.6 + Math.random() * 0.8}rem`,
          }}
        >
          {['🌸','🌺','🌼','🌷','✿'][i % 5]}
        </span>
      ))}

      {/* Center content */}
      <div className={styles.center}>
        {/* Growing flower */}
        <div className={`${styles.flowerWrap} ${phase >= 0 ? styles.flowerGrown : ''}`}>
          <img
            src={`${import.meta.env.BASE_URL}images/flower1.png`}
            alt="flower"
            className={styles.flower}
            draggable={false}
          />
          {/* Sparkle ring */}
          {phase >= 1 && (
            <div className={styles.sparkleRing}>
              {[...Array(8)].map((_, i) => (
                <span key={i} className={styles.sparkleDot} style={{ '--a': `${i * 45}deg` }} />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <div className={`${styles.titleWrap} ${phase >= 1 ? styles.titleVisible : ''}`}>
          <h1 className={styles.title}>Our Virtual Garden</h1>
          <p className={styles.names}>Jabez & Desilyn 💚</p>
          <p className={styles.tagline}>A garden that grows with love</p>
        </div>

        {/* Loading dots */}
        {phase < 2 && (
          <div className={styles.dots}>
            {[0,1,2].map(i => (
              <span key={i} className={styles.dot} style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
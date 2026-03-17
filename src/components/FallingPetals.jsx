// ============================================================
//  FallingPetals — petals by day, fireflies by night
// ============================================================
import { useMemo } from 'react'
import styles from './FallingPetals.module.css'
import { PETAL_CONFIG } from '../utils/constants.js'
import { useDayNight } from '../hooks/useDayNight.js'

function makePetal(id) {
  const color   = PETAL_CONFIG.colors[Math.floor(Math.random() * PETAL_CONFIG.colors.length)]
  const left    = `${Math.random() * 100}%`
  const size    = 6 + Math.random() * 10
  const fallDur = `${8 + Math.random() * 10}s`
  const swayDur = `${3 + Math.random() * 4}s`
  const delay   = `${Math.random() * 14}s`
  const opacity = 0.55 + Math.random() * 0.4
  return { id, color, left, size, fallDur, swayDur, delay, opacity }
}

function makeFirefly(id) {
  return {
    id,
    left:     `${Math.random() * 95}%`,
    top:      `${20 + Math.random() * 65}%`,
    size:     3 + Math.random() * 4,
    duration: `${3 + Math.random() * 4}s`,
    delay:    `${Math.random() * 6}s`,
    driftX:   `${(Math.random() - 0.5) * 120}px`,
    driftY:   `${(Math.random() - 0.5) * 80}px`,
  }
}

export default function FallingPetals({ zIndex = 3 }) {
  const theme = useDayNight()

  const petals    = useMemo(() => Array.from({ length: PETAL_CONFIG.count },    (_, i) => makePetal(i)),    [])
  const fireflies = useMemo(() => Array.from({ length: 18 },                    (_, i) => makeFirefly(i)),  [])

  return (
    <div className={styles.layer} style={{ zIndex }} aria-hidden>
      {/* Day / dusk — falling petals */}
      {(theme === 'day' || theme === 'dusk') && petals.map(p => (
        <div
          key={p.id}
          className={styles.petal}
          style={{
            left:            p.left,
            width:           `${p.size}px`,
            height:          `${p.size}px`,
            backgroundColor: theme === 'dusk'
              ? `hsl(30, 90%, ${60 + Math.random() * 20}%)`
              : p.color,
            opacity:         p.opacity,
            animationDuration:  `${p.fallDur}, ${p.swayDur}`,
            animationDelay:     `${p.delay}, ${p.delay}`,
          }}
        />
      ))}

      {/* Night — fireflies */}
      {theme === 'night' && fireflies.map(f => (
        <div
          key={f.id}
          className={styles.firefly}
          style={{
            left:     f.left,
            top:      f.top,
            width:    `${f.size}px`,
            height:   `${f.size}px`,
            '--dx':   f.driftX,
            '--dy':   f.driftY,
            animationDuration: `${f.duration}, ${f.duration}`,
            animationDelay:    `${f.delay}, ${f.delay}`,
          }}
        />
      ))}
    </div>
  )
}
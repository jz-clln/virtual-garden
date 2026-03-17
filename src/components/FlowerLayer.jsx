// ============================================================
//  FlowerLayer — renders sprouts and bloomed flowers
//  Sprout: shows /images/sprout.png with countdown tooltip on hover
//  Bloomed: shows flower sprite with sparkle-burst bloom animation
// ============================================================
import { useState, useEffect } from 'react'
import styles from './FlowerLayer.module.css'

const SWAY_MAP = { swayA: 'swayA', swayB: 'swayB', swayC: 'swayC' }

// ── Countdown tooltip shown on sprout hover ──
function SproutCountdown({ plantedAt, growDuration }) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, (plantedAt + growDuration) - Date.now())
      if (remaining === 0) { setLabel('Blooming soon… 🌸'); return }
      const totalSec = Math.ceil(remaining / 1000)
      const m = Math.floor(totalSec / 60)
      const s = totalSec % 60
      setLabel(m > 0 ? `Blooms in ${m}m ${s}s` : `Blooms in ${s}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [plantedAt, growDuration])

  return <div className={styles.tooltip}>{label}</div>
}

// ── Single flower/sprout ──
function FlowerItem({ flower, onFlowerClick }) {
  const { id, x, y, size, sprite, sway, swayDur, zIndex, bloomed, plantedAt, growDuration } = flower
  const [hovered, setHovered]   = useState(false)
  const [bursting, setBursting] = useState(false)
  const [shown, setShown]       = useState(false)

  // When a flower blooms, trigger the burst animation
  useEffect(() => {
    if (bloomed && !shown) {
      setBursting(true)
      const t = setTimeout(() => { setBursting(false); setShown(true) }, 800)
      return () => clearTimeout(t)
    }
  }, [bloomed, shown])

  const swayName  = SWAY_MAP[sway] ?? 'swayA'
  // Sprout is slightly smaller than the final flower
  const sproutSize = size * 0.55

  if (!bloomed) {
    // ── SPROUT ──
    return (
      <div
        className={styles.sproutWrap}
        style={{ left: x - sproutSize / 2, top: y - sproutSize, zIndex, width: sproutSize, height: sproutSize }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={() => setHovered(true)}
        onTouchEnd={() => setHovered(false)}
      >
        <img
          src={`${import.meta.env.BASE_URL}images/sprout.png`}
          alt="Growing sprout"
          className={styles.sprout}
          style={{ width: sproutSize, height: sproutSize }}
          draggable={false}
        />
        {hovered && (
          <SproutCountdown plantedAt={plantedAt} growDuration={growDuration} />
        )}
      </div>
    )
  }

  // ── BLOOMED FLOWER ──
  return (
    <div
      className={styles.flowerWrap}
      style={{ left: x - size / 2, top: y - size, zIndex, width: size, height: size }}
    >
      {/* Sparkle burst ring — plays once on bloom */}
      {bursting && (
        <div className={styles.burstRing} aria-hidden>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className={styles.burstParticle}
              style={{ '--angle': `${i * 45}deg` }}
            />
          ))}
        </div>
      )}

      <img
        src={sprite.file}
        alt={sprite.name}
        className={`flower-sprite ${styles.flowerImg} ${bursting ? styles.bloomBurst : ''}`}
        style={{
          width: size, height: size,
          animation: bursting
            ? `bloomPop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards`
            : [
                `flowerGrow 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards`,
                `${swayName} ${swayDur} 0.7s ease-in-out infinite`,
              ].join(', '),
        }}
        onClick={e => { e.stopPropagation(); onFlowerClick(flower) }}
        onTouchEnd={e => { e.stopPropagation(); e.preventDefault(); onFlowerClick(flower) }}
        draggable={false}
      />
    </div>
  )
}

// ── Layer ──
export default function FlowerLayer({ flowers, onFlowerClick }) {
  return (
    <div className={styles.layer}>
      {flowers.map(flower => (
        <FlowerItem key={flower.id} flower={flower} onFlowerClick={onFlowerClick} />
      ))}
    </div>
  )
}
// ============================================================
//  useParticles — canvas-based sparkle burst when planting
// ============================================================
import { useEffect, useRef, useCallback } from 'react'

const COLORS = [
  '#ffe066', '#ffb7c5', '#b5e78a',
  '#ffffff', '#f5a0c0', '#c8f5a0', '#e8d5ff',
]

/**
 * useParticles hook
 * Manages a canvas overlay that renders pixel-art sparkle particles.
 *
 * @returns {{ canvasRef, spawnSparkles }}
 */
export function useParticles() {
  const canvasRef  = useRef(null)
  const particles  = useRef([])
  const rafRef     = useRef(null)

  /* Resize canvas to match viewport */
  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return
      canvasRef.current.width  = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  /* Animation loop */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        p.x  += p.vx
        p.y  += p.vy
        p.vy += 0.13     // gravity
        p.alpha -= p.decay
        if (p.alpha <= 0) { particles.current.splice(i, 1); continue }

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle   = p.color
        if (p.square) {
          ctx.fillRect(
            Math.round(p.x - p.size / 2),
            Math.round(p.y - p.size / 2),
            p.size, p.size
          )
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /** Spawn a burst of sparkles at (x, y) */
  const spawnSparkles = useCallback((x, y) => {
    const count = 14
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4
      const speed = 1.8 + Math.random() * 2.8
      particles.current.push({
        x, y,
        vx:     Math.cos(angle) * speed,
        vy:     Math.sin(angle) * speed - 1.8,
        size:   3 + Math.random() * 4,
        color:  COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha:  1,
        decay:  0.022 + Math.random() * 0.018,
        square: Math.random() > 0.45,
      })
    }
  }, [])

  return { canvasRef, spawnSparkles }
}

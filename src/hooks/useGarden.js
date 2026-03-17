// ============================================================
//  useGarden — flowers, sprout→bloom, letters, reactions, photos
// ============================================================
import { useState, useRef, useCallback, useEffect } from 'react'
import { GARDEN_CONFIG } from '../utils/constants.js'
import {
  isTooClose, clampPosition,
  randomSize, randomSway, randomSwayDuration, makeFlowerId,
} from '../utils/gardenUtils.js'

const STORAGE_KEY = 'desilyn_garden_v2'

function randomGrowDuration() {
  return (3 + Math.random() * 2) * 60 * 1000
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function persist(flowers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(
      flowers.map(({ messagePromise, ...rest }) => rest)
    ))
  } catch {}
}

export function useGarden({ onSpawnSparkles } = {}) {
  const isPlanting  = useRef(false)
  const lastTapTime = useRef(0)
  const timersRef   = useRef({})

  const [flowers, setFlowers] = useState(() =>
    loadSaved().map(f => ({
      ...f,
      messagePromise: Promise.resolve(f.letterBody ?? ''),
      bloomed: f.bloomed ?? false,
    }))
  )

  useEffect(() => { persist(flowers) }, [flowers])

  // ── Bloom ──
  const bloomFlower = useCallback((id) => {
    setFlowers(prev => prev.map(f => {
      if (f.id !== id || f.bloomed) return f
      if (onSpawnSparkles) onSpawnSparkles(f.x, f.y)
      return { ...f, bloomed: true }
    }))
  }, [onSpawnSparkles])

  // ── Schedule bloom ──
  const scheduleBloom = useCallback((flower) => {
    const elapsed   = Date.now() - flower.plantedAt
    const remaining = Math.max(0, flower.growDuration - elapsed)
    if (remaining === 0) {
      setTimeout(() => bloomFlower(flower.id), 50)
    } else {
      timersRef.current[flower.id] = setTimeout(() => bloomFlower(flower.id), remaining)
    }
  }, [bloomFlower])

  // ── Mount timers ──
  useEffect(() => {
    flowers.forEach(f => { if (!f.bloomed) scheduleBloom(f) })
    return () => Object.values(timersRef.current).forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Plant a letter-flower ──
  const plantLetter = useCallback(({
    rawX, rawY, sprite, letterTitle, letterBody,
    mood, plantedBy, userColor, photoDataUrl, spawnSparkles,
  }) => {
    if (isPlanting.current) return 'busy'
    if (flowers.length >= GARDEN_CONFIG.maxFlowers) return 'full'
    const { x, y } = clampPosition(rawX, rawY)
    if (isTooClose(x, y, flowers)) return 'close'

    isPlanting.current = true
    const id           = makeFlowerId()
    const size         = randomSize()
    const sway         = randomSway()
    const swayDur      = randomSwayDuration()
    const zIndex       = Math.floor(y)
    const plantedAt    = Date.now()
    const growDuration = randomGrowDuration()

    const flower = {
      id, x, y, size, sprite, sway, swayDur, zIndex,
      plantedAt, growDuration, bloomed: false,
      letterTitle, letterBody, mood,
      plantedBy, userColor,
      photoDataUrl: photoDataUrl ?? null,
      reactions: {},
      messagePromise: Promise.resolve(letterBody),
    }

    setFlowers(prev => [...prev, flower])
    scheduleBloom(flower)
    if (spawnSparkles) spawnSparkles(x, y)
    setTimeout(() => { isPlanting.current = false }, 320)
    return sprite.name
  }, [flowers, scheduleBloom])

  // ── Add / toggle reaction ──
  const addReaction = useCallback((flowerId, emoji, username) => {
    setFlowers(prev => prev.map(f => {
      if (f.id !== flowerId) return f
      const reactions = { ...(f.reactions ?? {}) }
      if (reactions[emoji]?.includes(username)) {
        // Toggle off
        reactions[emoji] = reactions[emoji].filter(u => u !== username)
        if (reactions[emoji].length === 0) delete reactions[emoji]
      } else {
        reactions[emoji] = [...(reactions[emoji] ?? []), username]
      }
      return { ...f, reactions }
    }))
  }, [])

  // ── Click guard (no direct planting now — via composer) ──
  const handleInteraction = useCallback((clientX, clientY, isTouchEnd) => {
    if (isTouchEnd) {
      const now = Date.now()
      if (now - lastTapTime.current < GARDEN_CONFIG.doubleTapGuard) return null
      lastTapTime.current = now
    }
    return null
  }, [])

  // ── Clear ──
  const clearGarden = useCallback(() => {
    Object.values(timersRef.current).forEach(clearTimeout)
    timersRef.current = {}
    setFlowers([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { flowers, flowerCount: flowers.length, plantLetter, addReaction, handleInteraction, clearGarden }
}
// ============================================================
//  useGarden — flowers, sprout→bloom, letters, reactions, photos
//  Synced realtime via Firebase RTDB /garden
// ============================================================
import { useState, useRef, useCallback, useEffect } from 'react'
import { GARDEN_CONFIG } from '../utils/constants.js'
import {
  isTooClose, clampPosition,
  randomSize, randomSway, randomSwayDuration, makeFlowerId,
} from '../utils/gardenUtils.js'
import { listenToGarden, addFlower, updateFlower, clearGarden as firebaseClearGarden } from '../utils/firebase.js'

function randomGrowDuration() {
  return (3 + Math.random() * 2) * 60 * 1000
}

export function useGarden({ onSpawnSparkles } = {}) {
  const isPlanting  = useRef(false)
  const lastTapTime = useRef(0)
  const timersRef   = useRef({})
  const listenerUnsubRef = useRef(null)

  const [flowers, setFlowers] = useState([])

  // ── Firebase listener with normalization ──
  useEffect(() => {
    listenerUnsubRef.current = listenToGarden((rawFlowers) => {
      const normalized = rawFlowers.map(f => ({
        ...f,
        messagePromise: Promise.resolve(f.letterBody ?? ''),
        plantedAt: Number(f.plantedAt || 0),
        growDuration: Number(f.growDuration || 0),
        bloomed: !!f.bloomed,
      }))
      setFlowers(normalized)
    })

    return () => {
      if (listenerUnsubRef.current) {
        listenerUnsubRef.current()
      }
    }
  }, [])

  // ── Bloom ──
  const bloomFlower = useCallback(async (id) => {
    setFlowers(prev => prev.map(f => {
      if (f.id !== id || f.bloomed) return f
      if (onSpawnSparkles) onSpawnSparkles(f.x, f.y)
      return { ...f, bloomed: true }
    }))

    try {
      await updateFlower(id, { bloomed: true })
    } catch (e) {
      console.error('Bloom sync failed:', e)
    }
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

  // ── Re-mount timers when flowers change ──
  useEffect(() => {
    // Clear existing
    Object.values(timersRef.current).forEach(clearTimeout)
    timersRef.current = {}

    // Schedule new
    flowers.forEach(f => { 
      if (!f.bloomed) scheduleBloom(f) 
    })
  }, [flowers])

  // ── Plant letter ──
  const plantLetter = useCallback(async ({
    rawX, rawY, sprite, letterTitle, letterBody,
    mood, plantedBy, userColor, photoDataUrl, spawnSparkles,
  }) => {
    if (isPlanting.current) return 'busy'
    if (flowers.length >= GARDEN_CONFIG.maxFlowers) return 'full'
    const { x, y } = clampPosition(rawX, rawY)
    if (isTooClose(x, y, flowers)) return 'close'

    isPlanting.current = true
    const id = makeFlowerId()
    const size = randomSize()
    const sway = randomSway()
    const swayDur = randomSwayDuration()
    const zIndex = Math.floor(y)
    const plantedAt = Date.now()
    const growDuration = randomGrowDuration()

    const flower = {
      id, x, y, size, sprite, sway, swayDur, zIndex,
      plantedAt, growDuration, bloomed: false,
      letterTitle, letterBody, mood,
      plantedBy, userColor,
      photoDataUrl: photoDataUrl ?? null,
      reactions: {},
    }

    // Optimistic UI
    const localFlower = { ...flower, messagePromise: Promise.resolve(letterBody) }
    setFlowers(prev => [...prev, localFlower])
    scheduleBloom(flower)
    if (spawnSparkles) spawnSparkles(x, y)

    // Firebase
    try {
      await addFlower(flower)
    } catch (e) {
      console.error('Plant failed:', e)
      setFlowers(prev => prev.filter(f => f.id !== id))
      isPlanting.current = false
      return 'error'
    }

    setTimeout(() => { isPlanting.current = false }, 320)
    return sprite.name
  }, [flowers])

  // ── Toggle reaction ──
  const addReaction = useCallback(async (flowerId, emoji, username) => {
    // Optimistic update
    setFlowers(prev => prev.map(f => {
      if (f.id !== flowerId) return f
      const reactions = { ...(f.reactions ?? {}) }
      if (reactions[emoji]?.includes(username)) {
        reactions[emoji] = reactions[emoji].filter(u => u !== username)
        if (reactions[emoji].length === 0) delete reactions[emoji]
      } else {
        reactions[emoji] = [...(reactions[emoji] ?? []), username]
      }
      return { ...f, reactions }
    }))

    try {
      // Compute new reactions state
      const currentFlower = flowers.find(f => f.id === flowerId)
      const newReactions = { ...(currentFlower?.reactions ?? {}) }
      if (newReactions[emoji]?.includes(username)) {
        newReactions[emoji] = newReactions[emoji].filter(u => u !== username)
        if (newReactions[emoji].length === 0) delete newReactions[emoji]
      } else {
        newReactions[emoji] = [...(newReactions[emoji] ?? []), username]
      }
      await updateFlower(flowerId, { reactions: newReactions })
    } catch (e) {
      console.error('Reaction sync failed:', e)
    }
  }, [flowers])

  const handleInteraction = useCallback((clientX, clientY, isTouchEnd) => {
    if (isTouchEnd) {
      const now = Date.now()
      if (now - lastTapTime.current < GARDEN_CONFIG.doubleTapGuard) return null
      lastTapTime.current = now
    }
    return null
  }, [])

  // ── Clear garden ──
  const clearGarden = useCallback(async () => {
    Object.values(timersRef.current).forEach(clearTimeout)
    timersRef.current = {}
    setFlowers([])
    try {
      await firebaseClearGarden()
    } catch (e) {
      console.error('Clear failed:', e)
    }
  }, [])

  return { 
    flowers, 
    flowerCount: flowers.length, 
    plantLetter, 
    addReaction, 
    handleInteraction, 
    clearGarden 
  }
}


// ============================================================
//  useDayNight — detects time of day in Philippine Time (UTC+8)
//  Day:   6:00 – 19:59 PHT  → normal garden
//  Dusk:  20:00 – 20:59 PHT → warm golden transition
//  Night: 21:00 – 5:59 PHT  → moonlit garden, fireflies
// ============================================================
import { useState, useEffect } from 'react'

function getPHTHour() {
  // Get current hour in Philippine Time (UTC+8) regardless of device timezone
  const now       = new Date()
  const utcMs     = now.getTime() + now.getTimezoneOffset() * 60_000
  const phtMs     = utcMs + 8 * 60 * 60_000
  return new Date(phtMs).getHours()
}

function getTheme() {
  const h = getPHTHour()
  if (h >= 6  && h < 20) return 'day'
  if (h >= 20 && h < 21) return 'dusk'
  return 'night'
}

export function useDayNight() {
  const [theme, setTheme] = useState(getTheme)

  // Re-check every minute
  useEffect(() => {
    const id = setInterval(() => setTheme(getTheme()), 60_000)
    return () => clearInterval(id)
  }, [])

  return theme   // 'day' | 'dusk' | 'night'
}
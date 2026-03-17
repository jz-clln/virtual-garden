// ============================================================
//  useToast — lightweight toast notification system
// ============================================================
import { useState, useRef, useCallback } from 'react'

/**
 * useToast hook
 * @returns {{ toast, showToast }}
 *   toast      — { visible: bool, message: string }
 *   showToast  — (message: string, duration?: ms) => void
 */
export function useToast() {
  const [toast, setToast]   = useState({ visible: false, message: '' })
  const timerRef = useRef(null)

  const showToast = useCallback((message, duration = 2800) => {
    clearTimeout(timerRef.current)
    setToast({ visible: true, message })
    timerRef.current = setTimeout(
      () => setToast({ visible: false, message }),
      duration
    )
  }, [])

  return { toast, showToast }
}

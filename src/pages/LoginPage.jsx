// ============================================================
//  LoginPage — blurred garden background + login card
// ============================================================
import { useState, useEffect } from 'react'
import { attemptLogin, saveSession } from '../utils/auth.js'
import { BACKGROUND_IMAGE } from '../utils/constants.js'
import FallingPetals from '../components/FallingPetals.jsx'
import styles from './LoginPage.module.css'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [shaking,  setShaking]  = useState(false)
  const [loading,  setLoading]  = useState(false)

  // Reset error when inputs change
  useEffect(() => { setError('') }, [username, password])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      triggerError('Please enter both username and password.')
      return
    }
    setLoading(true)
    // Small delay for a nicer feel
    setTimeout(() => {
      const user = attemptLogin(username.trim(), password)
      if (user) {
        saveSession(username.trim())
        onLogin(user)
      } else {
        setLoading(false)
        triggerError('Wrong username or password. Try again 🌿')
      }
    }, 600)
  }

  const triggerError = (msg) => {
    setError(msg)
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  return (
    <div className={styles.page}>
      {/* Blurred garden background */}
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
      />
      <div className={styles.bgBlur} />

      {/* Falling petals on top of blur */}
      <FallingPetals zIndex={2} />

      {/* Login card */}
      <div className={`${styles.card} ${shaking ? styles.shake : ''}`}>

        {/* Flower icon */}
        <div className={styles.flowerIcon} aria-hidden>🌸</div>

        <h1 className={styles.title}>Our Virtual Garden</h1>
        <p className={styles.subtitle}>This garden belongs to just the two of us 🌿</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Username */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Username
            </label>
            <input
              id="username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles.input}
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Password
            </label>
            <div className={styles.passwordWrap}>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loadingDots}>
                <span>🌱</span><span>🌱</span><span>🌱</span>
              </span>
            ) : (
              'Enter the Garden 🌸'
            )}
          </button>
        </form>

        <p className={styles.hint}>
          Only Jabez & Desilyn may enter 💚
        </p>
      </div>
    </div>
  )
}
// ============================================================
//  App — root with loading screen + auth gate
// ============================================================
import { useState, useEffect } from 'react'
import { loadSession, clearSession, USERS } from './utils/auth.js'

import LoadingScreen  from './components/LoadingScreen.jsx'
import LoginPage      from './pages/LoginPage.jsx'
import GardenPage     from './pages/GardenPage.jsx'
import LoveLetterPage from './pages/LoveLetterPage.jsx'

export default function App() {
  const [page,        setPage]        = useState('garden')
  const [currentUser, setCurrentUser] = useState(null)
  const [authReady,   setAuthReady]   = useState(false)
  const [loading,     setLoading]     = useState(true)  // show loading screen first

  // Restore session
  useEffect(() => {
    const saved = loadSession()
    if (saved) setCurrentUser({ username: saved, ...USERS[saved] })
    setAuthReady(true)
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    setPage('garden')
  }

  const handleLogout = () => {
    clearSession()
    setCurrentUser(null)
    setPage('garden')
  }

  // Show loading screen on every fresh load
  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />
  }

  if (!authReady) return null

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <>
      {page === 'garden' && (
        <GardenPage
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenLetter={() => setPage('letter')}
        />
      )}
      {page === 'letter' && (
        <LoveLetterPage onBack={() => setPage('garden')} />
      )}
    </>
  )
}
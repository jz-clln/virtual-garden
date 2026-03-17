// ============================================================
//  auth.js — hardcoded credentials config
//  Keep this file private — do not commit to public repos
// ============================================================

export const USERS = {
  DesilynBrillante: {
    password:    'DesCollano',
    displayName: 'Jabez',
    role:        'husband',
    // Signature color shown as ring around their flowers
    color:       '#7ecbf5',   // soft sky blue
    colorLabel:  'blue',
  },
  JabezCollano: {
    password:    'DesCollano',
    displayName: 'Desilyn',
    role:        'wife',
    color:       '#f5a0c0',   // soft rose pink
    colorLabel:  'pink',
  },
}

const SESSION_KEY = 'garden_session'

/** Save session to localStorage */
export function saveSession(username) {
  localStorage.setItem(SESSION_KEY, username)
}

/** Load session from localStorage — returns username or null */
export function loadSession() {
  const u = localStorage.getItem(SESSION_KEY)
  return u && USERS[u] ? u : null
}

/** Clear session */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

/** Validate login attempt — returns user object or null */
export function attemptLogin(username, password) {
  const user = USERS[username]
  if (!user) return null
  if (user.password !== password) return null
  return { username, ...user }
}
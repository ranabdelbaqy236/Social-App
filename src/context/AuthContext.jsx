import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../services/api'

const AuthContext = createContext(null)
const TOKEN_KEY = 'route_social_token'
const USER_KEY = 'route_social_user'
const withFreshAvatar = (profile) => profile ? { ...profile, __avatarVersion: Date.now() } : profile

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) }
    catch { return null }
  })
  const [checking, setChecking] = useState(Boolean(token))

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
    setChecking(false)
  }

  const saveSession = (response) => {
    const data = response?.data || response
    const newToken = data?.token || response?.token
    const newUser = withFreshAvatar(data?.user || response?.user || null)
    if (!newToken) throw new Error('The server did not return an authentication token.')
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const refreshProfile = async () => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    try {
      const response = await apiRequest('/users/profile-data')
      const profile = withFreshAvatar(response?.data?.user || response?.data || response?.user)
      if (profile) {
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
        setUser(profile)
      }
    } finally { setChecking(false) }
  }

  useEffect(() => {
    if (token) refreshProfile().catch(() => setChecking(false))
    else setChecking(false)
  }, [token])

  useEffect(() => {
    window.addEventListener('auth-expired', logout)
    return () => window.removeEventListener('auth-expired', logout)
  }, [])

  const value = useMemo(() => ({ token, user, checking, saveSession, logout, refreshProfile }), [token, user, checking])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

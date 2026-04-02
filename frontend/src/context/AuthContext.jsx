import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('obs_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.clear() }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const data = await api.auth.login({ username, password })
    localStorage.setItem('obs_token', data.token)
    localStorage.setItem('obs_user', JSON.stringify({ id: data.userId, username: data.username, role: data.role }))
    setUser({ id: data.userId, username: data.username, role: data.role })
    return data
  }

  const register = async (username, email, password) => {
    const data = await api.auth.register({ username, email, password })
    localStorage.setItem('obs_token', data.token)
    localStorage.setItem('obs_user', JSON.stringify({ id: data.userId, username: data.username, role: data.role }))
    setUser({ id: data.userId, username: data.username, role: data.role })
    return data
  }

  const logout = () => {
    localStorage.removeItem('obs_token')
    localStorage.removeItem('obs_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
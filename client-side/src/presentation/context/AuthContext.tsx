import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'penjual' | 'pembeli'
}

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    role: 'penjual' | 'pembeli',
  ) => Promise<void>
  logout: () => Promise<void>
  ensureAccessToken: (forceRefresh?: boolean) => Promise<string | null>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const accessKey = 'rr_access_token'
const refreshKey = 'rr_refresh_token'
const userKey = 'rr_user'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem(userKey)
    const storedAccess = localStorage.getItem(accessKey)
    const storedRefresh = localStorage.getItem(refreshKey)

    if (storedUser) setUser(JSON.parse(storedUser))
    if (storedAccess) setAccessToken(storedAccess)
    if (storedRefresh) setRefreshToken(storedRefresh)

    setLoading(false)
  }, [])

  const persist = useCallback((nextUser: AuthUser, access: string, refresh: string) => {
    setUser(nextUser)
    setAccessToken(access)
    setRefreshToken(refresh)
    localStorage.setItem(userKey, JSON.stringify(nextUser))
    localStorage.setItem(accessKey, access)
    localStorage.setItem(refreshKey, refresh)
  }, [])

  const clearAuth = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    localStorage.removeItem(userKey)
    localStorage.removeItem(accessKey)
    localStorage.removeItem(refreshKey)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login({ email, password })
    persist(result.data as AuthUser, result.accessToken, result.refreshToken)
  }, [persist])

  const register = useCallback(
    async (name: string, email: string, password: string, role: 'penjual' | 'pembeli') => {
      const result = await api.register({ name, email, password, role })
      persist(result.data as AuthUser, result.accessToken, result.refreshToken)
    },
    [persist],
  )

  const decodeJwt = useCallback((token: string) => {
    const payload = token.split('.')[1]
    if (!payload) return null
    try {
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
      const padding = (4 - (normalized.length % 4)) % 4
      const padded = normalized.padEnd(normalized.length + padding, '=')
      const json = atob(padded)
      return JSON.parse(json) as { exp?: number }
    } catch {
      return null
    }
  }, [])

  const isTokenExpired = useCallback(
    (token: string) => {
      const payload = decodeJwt(token)
      if (!payload?.exp) return true
      const expiry = payload.exp * 1000
      return Date.now() + 30_000 >= expiry
    },
    [decodeJwt],
  )

  const refresh = useCallback(async () => {
    if (!refreshToken) return null
    try {
      const result = await api.refresh(refreshToken)
      persist(result.data as AuthUser, result.accessToken, result.refreshToken)
      return result.accessToken
    } catch {
      clearAuth()
      return null
    }
  }, [refreshToken, persist, clearAuth])

  const ensureAccessToken = useCallback(
    async (forceRefresh?: boolean) => {
      if (!forceRefresh && accessToken && !isTokenExpired(accessToken)) {
        return accessToken
      }
      return refresh()
    },
    [accessToken, isTokenExpired, refresh],
  )

  const logout = useCallback(async () => {
    if (refreshToken) {
      try {
        await api.logout(refreshToken)
      } catch {
        // ignore
      }
    }
    clearAuth()
  }, [refreshToken, clearAuth])

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      loading,
      login,
      register,
      logout,
      ensureAccessToken,
    }),
    [user, accessToken, refreshToken, loading, login, register, logout, ensureAccessToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

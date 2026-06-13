import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import {
  createContext, useCallback, useEffect,
  useState, type ReactNode
} from 'react'
import { Platform } from 'react-native'
import { apiService } from '../services/api'

const TOKEN_KEY = 'jwt_token'

// Wrapper que usa SecureStore en móvil y AsyncStorage en web
const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key)
    }
    return SecureStore.getItemAsync(key)
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      return AsyncStorage.setItem(key, value)
    }
    return SecureStore.setItemAsync(key, value)
  },
  deleteItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(key)
    }
    return SecureStore.deleteItemAsync(key)
  },
}

export interface AuthContextType {
  token: string | null
  email: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

const decodeJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch { return null }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    storage.getItem(TOKEN_KEY)
      .then((saved) => {
        if (saved) {
          setToken(saved)
          setEmail(decodeJwt(saved)?.email ?? null)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await apiService.post<{ token: string }>(
      '/auth/login', { email, password }
    )
    await storage.setItem(TOKEN_KEY, token)
    setToken(token)
    setEmail(decodeJwt(token)?.email ?? null)
    router.replace('/(tabs)')
  }, [router])

  const register = useCallback(async (email: string, password: string) => {
    await apiService.post('/auth/register', { email, password })
    await login(email, password)
  }, [login])

  const logout = useCallback(async () => {
    await storage.deleteItem(TOKEN_KEY)
    setToken(null)
    setEmail(null)
    router.replace('/')
  }, [router])

  return (
    <AuthContext.Provider value={{ token, email, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
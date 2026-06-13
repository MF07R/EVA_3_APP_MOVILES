import { useCallback, useState } from 'react'
import { apiService } from '../services/api'
import { Category } from '../types'
import { useAuth } from './useAuth'

export function useCategories() {
  const { token } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])

  const loadCategories = useCallback(async () => {
    if (!token) return
    try {
      const data = await apiService.get<any[]>('/categories', token)
      setCategories(data.map(c => ({ id: String(c.id), name: c.name })))
    } catch (e) {
      console.error(e)
    }
  }, [token])

  return { categories, loadCategories }
}
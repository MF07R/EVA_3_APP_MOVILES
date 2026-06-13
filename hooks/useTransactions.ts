import { useCallback, useState } from 'react'
import { apiService } from '../services/api'
import { uploadImage } from '../services/upload.service'
import {
  CreateTransactionInput,
  Transaction,
  TransactionAPI,
  UpdateTransactionInput,
  mapCreateTransactionInputToAPI,
  mapTransactionAPItoUI,
  mapUpdateTransactionInputToAPI,
} from '../types'
import { useAuth } from './useAuth'

export function useTransactions() {
  const { token } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTransactions = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.get<TransactionAPI[]>('/transactions', token)
      setTransactions(data.map(mapTransactionAPItoUI))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }, [token])

  const createTransaction = async (input: CreateTransactionInput) => {
    if (!token) return

    let imageUrl: string | undefined
    if (input.photoUri) {
      imageUrl = await uploadImage(input.photoUri, token)
    }

    const nueva = await apiService.post<TransactionAPI>(
      '/transactions',
      mapCreateTransactionInputToAPI(input, imageUrl),
      token
    )
    setTransactions(prev => [...prev, mapTransactionAPItoUI(nueva)])
  }

  const updateTransaction = async (id: string, input: UpdateTransactionInput) => {
    if (!token) return

    let imageUrl: string | undefined
    if (input.photoUri && input.photoUri.startsWith('file://')) {
      imageUrl = await uploadImage(input.photoUri, token)
    } else {
      imageUrl = input.photoUri
    }

    const actualizada = await apiService.patch<TransactionAPI>(
      `/transactions/${id}`,
      mapUpdateTransactionInputToAPI(input, imageUrl),
      token
    )
    setTransactions(prev =>
      prev.map(t => t.id === id ? mapTransactionAPItoUI(actualizada) : t)
    )
  }

  const deleteTransaction = async (id: string) => {
    if (!token) return
    await apiService.delete(`/transactions/${id}`, token)
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const getById = (id: string) =>
    transactions.find(t => t.id === id)

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getById,
  }
}
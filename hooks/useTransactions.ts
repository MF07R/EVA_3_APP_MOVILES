import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { Transaction } from '../types';

type CreateTransactionInput = Omit<Transaction, 'id' | 'date'>;
type UpdateTransactionInput = Partial<Omit<Transaction, 'id' | 'date'>>;

const STORAGE_KEY = 'transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // El cálculo del balance vive en el hook, no en el componente
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      setTransactions(data);
    } catch (e) {
      setError('No se pudieron cargar las transacciones');
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = async (data: Transaction[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setTransactions(data);
  };

  const createTransaction = async (input: CreateTransactionInput) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...input,
    };
    await persist([...transactions, newTransaction]);
  };

  const updateTransaction = async (id: string, input: UpdateTransactionInput) => {
    const updated = transactions.map(t =>
      t.id === id ? { ...t, ...input } : t
    );
    await persist(updated);
  };

  const deleteTransaction = async (id: string) => {
    await persist(transactions.filter(t => t.id !== id));
  };

  const getById = (id: string) =>
    transactions.find(t => t.id === id);

  return {
    transactions,
    loading,
    error,
    totalIncome,
    totalExpense,
    balance,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getById,
  };
}
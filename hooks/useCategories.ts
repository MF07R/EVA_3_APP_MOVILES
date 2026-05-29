import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { Category } from '../types';

const STORAGE_KEY = 'categories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    setCategories(raw ? JSON.parse(raw) : []);
  }, []);

  const saveCategories = async (updated: Category[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCategories(updated);
  };

  const createCategory = async (name: string) => {
    const newCat: Category = { id: Date.now().toString(), name };
    await saveCategories([...categories, newCat]);
  };

  const updateCategory = async (id: string, name: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, name } : c);
    await saveCategories(updated);
  };

  const deleteCategory = async (id: string) => {
    await saveCategories(categories.filter(c => c.id !== id));
  };

  return { categories, loadCategories, createCategory, updateCategory, deleteCategory };
}
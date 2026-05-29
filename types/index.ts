export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  categoryId: string;
  photoUri?: string;
  location?: {
    latitude:number;
    longitude: number;
  }
}

export interface Category {
  id: string;
  name: string;
}
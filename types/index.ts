// -- Modelo API (lo que devuelve el servidor) --
export interface TransactionAPI {
  id: number
  description: string
  amount: number
  type: 'income' | 'expense'
  imageUrl: string | null
  latitude: number | null
  longitude: number | null
  createdAt: string
  updatedAt: string
  categoryId: number
  userId: number
}

// -- Modelo UI (lo que usan los componentes) --
export interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  categoryId: string
  photoUri?: string
  location?: {
    latitude: number
    longitude: number
  }
}

export interface Category {
  id: string
  name: string
}

// -- Tipos para crear y actualizar --
export type CreateTransactionInput = {
  description: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  photoUri?: string
  location?: {
    latitude: number
    longitude: number
  }
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>

// -- Tipos para la API --
export type CreateTransactionAPIInput = {
  description: string
  amount: number
  type: 'income' | 'expense'
  categoryId: number
  imageUrl?: string
  latitude?: number
  longitude?: number
}

export type UpdateTransactionAPIInput = Partial<Omit<CreateTransactionAPIInput, 'categoryId'>>

// -- Funciones de mapeo --
export const mapTransactionAPItoUI = (t: TransactionAPI): Transaction => ({
  id: String(t.id),
  description: t.description,
  amount: t.amount,
  type: t.type,
  date: t.createdAt,
  categoryId: String(t.categoryId),
  photoUri: t.imageUrl ?? undefined,
  location: t.latitude && t.longitude
    ? { latitude: t.latitude, longitude: t.longitude }
    : undefined,
})

export const mapCreateTransactionInputToAPI = (
  input: CreateTransactionInput,
  imageUrl?: string
): CreateTransactionAPIInput => ({
  description: input.description,
  amount: input.amount,
  type: input.type,
  categoryId: Number(input.categoryId),
  imageUrl,
  latitude: input.location?.latitude,
  longitude: input.location?.longitude,
})

export const mapUpdateTransactionInputToAPI = (
  input: UpdateTransactionInput,
  imageUrl?: string
): UpdateTransactionAPIInput => ({
  ...(input.description !== undefined && { description: input.description }),
  ...(input.amount !== undefined && { amount: input.amount }),
  ...(input.type !== undefined && { type: input.type }),
  ...(imageUrl !== undefined && { imageUrl }),
  ...(input.location !== undefined && {
    latitude: input.location.latitude,
    longitude: input.location.longitude,
  }),
})
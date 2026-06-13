const BASE_URL = 'https://cashi-api.labs.dobleb.cl'

const request = async <T>(
  path: string,
  options: RequestInit,
  token?: string
): Promise<T> => {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch {
     console.log('Error de fetch:', Error)
    throw new Error('Error de conexión')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.error ?? body?.message ?? `Error ${response.status}`
    throw new Error(message)
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

export const apiService = {
  get: <T>(path: string, token: string) =>
    request<T>(path, { method: 'GET' }, token),

  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, token),

  patch: <T>(path: string, body: unknown, token: string) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, token),

  delete: (path: string, token: string) =>
    request<void>(path, { method: 'DELETE' }, token),
}
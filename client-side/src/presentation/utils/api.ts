const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

type ApiErrorPayload = { error: { message: string } }

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const request = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  })

  if (!res.ok) {
    let payload: ApiErrorPayload | null = null
    try {
      payload = (await res.json()) as ApiErrorPayload
    } catch {
      payload = null
    }
    const message = payload?.error?.message ?? res.statusText
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) return {} as T
  return (await res.json()) as T
}

export const api = {
  getListings: (query?: Record<string, string>) => {
    const params = new URLSearchParams()
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (!value) return
      params.set(key, value)
    })
    const qs = params.toString()
    return request<{ data: unknown[] }>(`/listings${qs ? `?${qs}` : ''}`)
  },
  getListing: (id: string) => request<{ data: unknown }>(`/listings/${id}`),
  createListing: (payload: unknown, accessToken: string) =>
    request<{ data: unknown }>(`/listings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),
  updateListing: (id: string, payload: unknown, accessToken: string) =>
    request<{ data: unknown }>(`/listings/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<{ data: unknown; accessToken: string; refreshToken: string }>(
      `/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    ),
  register: (payload: {
    name: string
    email: string
    password: string
    role: 'penjual' | 'pembeli'
  }) =>
    request<{ data: unknown; accessToken: string; refreshToken: string }>(
      `/auth/register`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    ),
  refresh: (refreshToken: string) =>
    request<{ data: unknown; accessToken: string; refreshToken: string }>(
      `/auth/refresh`,
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      },
    ),
  logout: (refreshToken: string) =>
    request(`/auth/logout`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
}

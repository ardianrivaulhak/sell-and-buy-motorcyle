import { listings as mockListings } from '../../infrastructure/data/listings'
import { users as mockUsers } from '../../infrastructure/data/users'
import type { Listing } from '../../domain/entities/Listing'

// Mock API - No backend needed
// Data is stored in localStorage

const STORAGE_KEY = 'rodaraja-listings'
const AUTH_STORAGE_KEY = 'rodaraja-auth'

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockListings))
  }
}

initializeStorage()

// Get listings from localStorage
const getStoredListings = (): Listing[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : mockListings
}

// Save listings to localStorage
const saveListings = (listings: Listing[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings))
}

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export const api = {
  getListings: async (query?: Record<string, string>) => {
    await delay()
    let listings = getStoredListings()
    
    // Apply filters
    if (query?.category) {
      listings = listings.filter(l => l.category === query.category)
    }
    if (query?.status) {
      listings = listings.filter(l => l.status === query.status)
    }
    if (query?.location) {
      listings = listings.filter(l => l.location === query.location)
    }
    if (query?.term) {
      const term = query.term.toLowerCase()
      listings = listings.filter(l => 
        l.title.toLowerCase().includes(term) || 
        l.location.toLowerCase().includes(term)
      )
    }
    if (query?.priceMin) {
      const min = Number(query.priceMin)
      listings = listings.filter(l => l.price.amount >= min)
    }
    if (query?.priceMax) {
      const max = Number(query.priceMax)
      listings = listings.filter(l => l.price.amount <= max)
    }
    
    return { data: listings }
  },
  
  getListing: async (id: string) => {
    await delay()
    const listings = getStoredListings()
    const listing = listings.find(l => l.id === id)
    if (!listing) {
      throw new ApiError('Listing not found', 404)
    }
    return { data: listing }
  },
  
  createListing: async (payload: unknown, _accessToken: string) => {
    await delay()
    const listings = getStoredListings()
    const newListing = payload as Listing
    listings.unshift(newListing)
    saveListings(listings)
    return { data: newListing }
  },
  
  updateListing: async (id: string, payload: unknown, _accessToken: string) => {
    await delay()
    const listings = getStoredListings()
    const index = listings.findIndex(l => l.id === id)
    if (index === -1) {
      throw new ApiError('Listing not found', 404)
    }
    listings[index] = { ...listings[index], ...(payload as Partial<Listing>) }
    saveListings(listings)
    return { data: listings[index] }
  },
  
  login: async (payload: { email: string; password: string }) => {
    await delay()
    const user = mockUsers.find(
      u => u.email === payload.email && u.password === payload.password
    )
    
    if (!user) {
      throw new ApiError('Email atau password salah', 401)
    }
    
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
    
    // Store auth in localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
    
    return {
      data: userData,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    }
  },
  
  register: async (payload: {
    name: string
    email: string
    password: string
    role: 'penjual' | 'pembeli'
  }) => {
    await delay()
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === payload.email)
    if (existingUser) {
      throw new ApiError('Email sudah terdaftar', 400)
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    }
    
    mockUsers.push(newUser)
    
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
    
    return {
      data: userData,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    }
  },
  
  refresh: async (_refreshToken: string) => {
    await delay()
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) {
      throw new ApiError('Session expired', 401)
    }
    return {
      data: JSON.parse(stored),
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    }
  },
  
  logout: async (_refreshToken: string) => {
    await delay()
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return {}
  },
}


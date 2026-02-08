import type { Prisma } from '@prisma/client'
import type { Listing } from '../domain/Listing'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'listing'

export type ListingQuery = {
  category?: string
  status?: string
  location?: string
  term?: string
  priceMin?: string
  priceMax?: string
}

export const buildListing = (payload: Partial<Listing>, id?: string): Listing => {
  const title = payload.title?.trim() || 'Untitled Listing'
  const category = payload.category ?? 'Motor'
  const createdAt = payload.createdAt ?? new Date().toISOString().slice(0, 10)
  const baseId = id ?? `${category.toLowerCase()}-${slugify(title)}-${Date.now()}`

  return {
    id: baseId,
    title,
    category,
    price: payload.price ?? { amount: 0, currency: 'IDR' },
    location: payload.location ?? 'Jakarta Selatan',
    year: payload.year ?? new Date().getFullYear(),
    mileageKm: payload.mileageKm ?? 0,
    condition: payload.condition ?? 'Terawat',
    status: payload.status ?? 'Aktif',
    transmission: payload.transmission ?? 'Automatic',
    fuelType: payload.fuelType ?? 'Bensin',
    color: payload.color ?? 'Hitam',
    description: payload.description ?? '',
    features: payload.features ?? [],
    photos: payload.photos ?? [],
    thumbnailColor:
      payload.thumbnailColor ??
      (category === 'Mobil'
        ? 'linear-gradient(135deg, #d9e0ea, #f1f4f8)'
        : 'linear-gradient(135deg, #f2d2b9, #f9e8d9)'),
    views: payload.views ?? 0,
    chats: payload.chats ?? 0,
    saved: payload.saved ?? 0,
    createdAt,
    sellerId: payload.sellerId ?? null,
  }
}

export const buildWhere = (query?: ListingQuery): Prisma.ListingWhereInput => {
  if (!query) return {}
  const where: Prisma.ListingWhereInput = {}

  if (query.category) where.category = query.category
  if (query.status) where.status = query.status
  if (query.location) where.location = query.location

  const min = query.priceMin ? Number(query.priceMin) : undefined
  const max = query.priceMax ? Number(query.priceMax) : undefined
  if (!Number.isNaN(min) && min !== undefined) {
    where.priceAmount = { ...(where.priceAmount as object), gte: min }
  }
  if (!Number.isNaN(max) && max !== undefined) {
    where.priceAmount = { ...(where.priceAmount as object), lte: max }
  }

  if (query.term) {
    where.OR = [
      { title: { contains: query.term, mode: 'insensitive' } },
      { location: { contains: query.term, mode: 'insensitive' } },
    ]
  }

  return where
}

export const toListing = (item: Prisma.Listing): Listing => ({
  id: item.id,
  title: item.title,
  category: item.category as Listing['category'],
  price: {
    amount: item.priceAmount,
    currency: item.priceCurrency as Listing['price']['currency'],
  },
  location: item.location,
  year: item.year,
  mileageKm: item.mileageKm,
  condition: item.condition as Listing['condition'],
  status: item.status as Listing['status'],
  transmission: item.transmission as Listing['transmission'],
  fuelType: item.fuelType as Listing['fuelType'],
  color: item.color,
  description: item.description,
  features: item.features,
  photos: item.photos,
  thumbnailColor: item.thumbnailColor,
  views: item.views,
  chats: item.chats,
  saved: item.saved,
  createdAt: item.createdAt.toISOString().slice(0, 10),
  sellerId: item.sellerId,
})

export const toListingData = (
  listing: Listing,
  sellerId?: string | null,
): Prisma.ListingUncheckedCreateInput => ({
  id: listing.id,
  title: listing.title,
  category: listing.category,
  priceAmount: listing.price.amount,
  priceCurrency: listing.price.currency,
  location: listing.location,
  year: listing.year,
  mileageKm: listing.mileageKm,
  condition: listing.condition,
  status: listing.status,
  transmission: listing.transmission,
  fuelType: listing.fuelType,
  color: listing.color,
  description: listing.description,
  features: listing.features,
  photos: listing.photos,
  thumbnailColor: listing.thumbnailColor,
  views: listing.views,
  chats: listing.chats,
  saved: listing.saved,
  createdAt: new Date(listing.createdAt),
  sellerId: sellerId ?? listing.sellerId ?? undefined,
})

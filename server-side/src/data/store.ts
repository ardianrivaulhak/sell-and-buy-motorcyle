import { prisma } from '../db/prisma'
import type { Listing } from '../domain/Listing'
import type { ListingQuery } from '../routes/listings.helper'
import { buildWhere, toListing, toListingData } from '../routes/listings.helper'

export const getListings = async (query?: ListingQuery) => {
  const items = await prisma.listing.findMany({
    where: buildWhere(query),
    orderBy: { createdAt: 'desc' },
  })
  return items.map(toListing)
}

export const findListing = async (id: string) => {
  const item = await prisma.listing.findUnique({ where: { id } })
  return item ? toListing(item) : null
}

export const createListing = async (payload: Listing, sellerId?: string) => {
  const data = toListingData(payload, sellerId)
  const item = await prisma.listing.create({ data })
  return toListing(item)
}

export const updateListing = async (id: string, payload: Listing, sellerId?: string) => {
  const data = toListingData(payload, sellerId)
  const item = await prisma.listing.update({ where: { id }, data })
  return toListing(item)
}

export const removeListing = async (id: string) => {
  await prisma.listing.delete({ where: { id } })
}

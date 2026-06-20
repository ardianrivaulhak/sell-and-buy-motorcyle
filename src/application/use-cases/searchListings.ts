import type {
  Listing,
  ListingCategory,
  ListingStatus,
} from '../../domain/entities/Listing'
import type { ListingRepository } from '../../domain/repositories/ListingRepository'

export type PriceRange = 'lt30' | '30-70' | '70-150' | 'gt150'

export type ListingSearchQuery = {
  category?: ListingCategory
  status?: ListingStatus
  location?: string
  price?: PriceRange
  term?: string
}

const inPriceRange = (price: number, range?: PriceRange): boolean => {
  if (!range) return true
  if (range === 'lt30') return price < 30000000
  if (range === '30-70') return price >= 30000000 && price <= 70000000
  if (range === '70-150') return price > 70000000 && price <= 150000000
  return price > 150000000
}

const matchesTerm = (listing: Listing, term?: string): boolean => {
  if (!term) return true
  const keyword = term.toLowerCase()
  return (
    listing.title.toLowerCase().includes(keyword) ||
    listing.location.toLowerCase().includes(keyword)
  )
}

export const searchListings = (
  repository: ListingRepository,
  query: ListingSearchQuery,
): Listing[] => {
  return repository.findAll().filter((listing) => {
    const categoryMatch = query.category
      ? listing.category === query.category
      : true
    const statusMatch = query.status ? listing.status === query.status : true
    const locationMatch = query.location
      ? listing.location === query.location
      : true
    const priceMatch = inPriceRange(listing.price.amount, query.price)
    const termMatch = matchesTerm(listing, query.term)

    return categoryMatch && statusMatch && locationMatch && priceMatch && termMatch
  })
}

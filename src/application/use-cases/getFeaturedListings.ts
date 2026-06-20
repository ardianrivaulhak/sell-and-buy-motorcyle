import type { Listing } from '../../domain/entities/Listing'
import type { ListingRepository } from '../../domain/repositories/ListingRepository'

export const getFeaturedListings = (
  repository: ListingRepository,
  limit = 4,
): Listing[] => {
  return repository.findAll().slice(0, limit)
}

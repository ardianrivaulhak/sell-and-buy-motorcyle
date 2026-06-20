import type { Listing } from '../../domain/entities/Listing'
import type { ListingRepository } from '../../domain/repositories/ListingRepository'

export const getListingById = (
  repository: ListingRepository,
  id: string,
): Listing | null => {
  return repository.findById(id)
}

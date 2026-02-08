import type { Listing, ListingId } from '../entities/Listing'

export interface ListingRepository {
  findAll(): Listing[]
  findById(id: ListingId): Listing | null
}

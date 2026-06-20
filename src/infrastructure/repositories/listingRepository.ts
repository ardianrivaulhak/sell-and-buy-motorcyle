import type { Listing, ListingId } from '../../domain/entities/Listing'
import type { ListingRepository } from '../../domain/repositories/ListingRepository'
import { listings } from '../data/listings'

class InMemoryListingRepository implements ListingRepository {
  private readonly items: Listing[]

  constructor(data: Listing[]) {
    this.items = data
  }

  findAll(): Listing[] {
    return [...this.items]
  }

  findById(id: ListingId): Listing | null {
    return this.items.find((item) => item.id === id) ?? null
  }
}

export const listingRepository = new InMemoryListingRepository(listings)

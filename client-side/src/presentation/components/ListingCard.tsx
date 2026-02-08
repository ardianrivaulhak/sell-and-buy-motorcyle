import type { Listing } from '../../domain/entities/Listing'
import { formatCurrency, formatKm } from '../utils/format'
import { ListingImage } from './ListingImage'

export type ListingCardProps = {
  listing: Listing
  onSelect: (listing: Listing) => void
}

export const ListingCard = ({ listing, onSelect }: ListingCardProps) => {
  return (
    <article className="listing-card" onClick={() => onSelect(listing)}>
      <div
        className="listing-thumb"
        style={{ background: listing.thumbnailColor }}
      >
        <ListingImage sources={listing.photos} alt={listing.title} />
        <span className="category-pill">{listing.category}</span>
        <span className="status-pill" data-status={listing.status}>
          {listing.status}
        </span>
      </div>
      <div className="listing-body">
        <h3>{listing.title}</h3>
        <p className="listing-price">{formatCurrency(listing.price)}</p>
        <div className="listing-meta">
          <span>{listing.location}</span>
          <span>{listing.year}</span>
          <span>{formatKm(listing.mileageKm)}</span>
        </div>
        <div className="listing-stats">
          <span>{listing.views} dilihat</span>
          <span>{listing.chats} chat</span>
          <span>{listing.saved} tersimpan</span>
        </div>
      </div>
    </article>
  )
}

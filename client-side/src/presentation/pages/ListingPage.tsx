import type { Listing } from '../../domain/entities/Listing'
import type { ListingSearchQuery } from '../../application/use-cases/searchListings'
import { ListingCard } from '../components/ListingCard'

export type ListingPageProps = {
  listings: Listing[]
  query: ListingSearchQuery
  loading?: boolean
  error?: string | null
  onQueryChange: (next: ListingSearchQuery) => void
  onSelectListing: (listing: Listing) => void
}

export const ListingPage = ({
  listings,
  query,
  loading,
  error,
  onQueryChange,
  onSelectListing,
}: ListingPageProps) => {
  const updateQuery = (key: keyof ListingSearchQuery, value?: string) => {
    const next = { ...query }
    if (!value) {
      delete next[key]
    } else {
      next[key] = value as never
    }
    onQueryChange(next)
  }

  return (
    <section className="listing-page">
      <div className="listing-header">
        <div>
          <h1>Semua listing</h1>
          <p className="muted">Pantau semua iklan motor dan mobil yang kamu kelola.</p>
        </div>
        <div className="filter-bar">
          <input
            placeholder="Cari judul atau lokasi"
            value={query.term ?? ''}
            onChange={(event) => updateQuery('term', event.target.value)}
          />
          <select
            value={query.category ?? ''}
            onChange={(event) => updateQuery('category', event.target.value)}
          >
            <option value="">Semua kategori</option>
            <option value="Motor">Motor</option>
            <option value="Mobil">Mobil</option>
          </select>
          <select
            value={query.status ?? ''}
            onChange={(event) => updateQuery('status', event.target.value)}
          >
            <option value="">Semua status</option>
            <option value="Aktif">Aktif</option>
            <option value="Ditinjau">Ditinjau</option>
            <option value="Draft">Draft</option>
            <option value="Terjual">Terjual</option>
          </select>
          <select
            value={query.price ?? ''}
            onChange={(event) => updateQuery('price', event.target.value)}
          >
            <option value="">Semua harga</option>
            <option value="lt30">&lt; Rp 30 juta</option>
            <option value="30-70">Rp 30 - 70 juta</option>
            <option value="70-150">Rp 70 - 150 juta</option>
            <option value="gt150">&gt; Rp 150 juta</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="empty-state">Gagal memuat listing: {error}</div>
      ) : loading ? (
        <div className="empty-state">Memuat listing...</div>
      ) : listings.length === 0 ? (
        <div className="empty-state">Tidak ada listing yang sesuai filter.</div>
      ) : (
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onSelect={onSelectListing} />
          ))}
        </div>
      )}
    </section>
  )
}

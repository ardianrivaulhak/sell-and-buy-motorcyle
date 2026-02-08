import { Link } from 'react-router-dom'
import type { Listing } from '../../domain/entities/Listing'
import type { ListingSearchQuery } from '../../application/use-cases/searchListings'
import { ListingCard } from '../components/ListingCard'
import { ListingImage } from '../components/ListingImage'
import { formatCurrency } from '../utils/format'

export type SellMarketplacePageProps = {
  featured: Listing[]
  listings: Listing[]
  query: ListingSearchQuery
  loading?: boolean
  error?: string | null
  onQueryChange: (next: ListingSearchQuery) => void
  onSelectListing: (listing: Listing) => void
}

export const SellMarketplacePage = ({
  featured,
  listings,
  query,
  loading,
  error,
  onQueryChange,
  onSelectListing,
}: SellMarketplacePageProps) => {
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
    <>
      <section className="sell-hero">
        <div className="hero-copy">
          <span className="pill">Dashboard Penjual</span>
          <h1>Jual motor dan mobilmu lebih cepat, aman, dan rapi seperti marketplace.</h1>
          <p className="lead">
            Kelola listing, pantau chat, dan pantau performa iklan langsung dari satu dashboard.
          </p>
          <div className="hero-actions">
            <Link className="btn ghost" to="/tips-jual">
              Pelajari Tips Jual
            </Link>
          </div>
          <div className="hero-metrics">
            <div className="metric-card">
              <strong>12</strong>
              <span>Listing aktif</span>
            </div>
            <div className="metric-card">
              <strong>8.2k</strong>
              <span>View bulan ini</span>
            </div>
            <div className="metric-card">
              <strong>146</strong>
              <span>Chat masuk</span>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <h3>Highlight hari ini</h3>
          <div className="highlight-grid">
            {loading ? (
              <div className="empty-state">Memuat highlight...</div>
            ) : error ? (
              <div className="empty-state">Gagal memuat highlight.</div>
            ) : featured.length === 0 ? (
              <div className="empty-state">Belum ada highlight untuk saat ini.</div>
            ) : (
              featured.map((item) => (
                <div className="highlight-card" key={item.id}>
                  <div className="highlight-thumb" style={{ background: item.thumbnailColor }}>
                    <ListingImage sources={item.photos} alt={item.title} />
                  </div>
                  <div>
                    <p className="muted">{item.category}</p>
                    <strong>{item.title}</strong>
                    <p className="highlight-price">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="sell-workspace single">
        <div className="listing-panel">
          <div className="listing-header">
            <div>
              <h2>Listing kamu</h2>
              <p className="muted">Kelola status dan pantau performa iklan.</p>
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
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSelect={onSelectListing}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

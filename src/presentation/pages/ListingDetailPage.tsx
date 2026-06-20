import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatCurrency, formatDate, formatKm } from '../utils/format'
import { ListingImage } from '../components/ListingImage'
import { slugify } from '../utils/slug'
import type { Listing } from '../../domain/entities/Listing'
import { api } from '../utils/api'

export type ListingDetailPageProps = {
  listings: Listing[]
  isLoading?: boolean
}

export const ListingDetailPage = ({ listings, isLoading }: ListingDetailPageProps) => {
  const { id, slug } = useParams<{ id: string; slug?: string }>()
  const navigate = useNavigate()
  const listing = id ? listings.find((item) => item.id === id) ?? null : null
  const [remoteListing, setRemoteListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || listing) return
    let active = true
    setLoading(true)
    setError(null)
    setRemoteListing(null)
    api
      .getListing(id)
      .then((result) => {
        if (!active) return
        setRemoteListing(result.data as Listing)
      })
      .catch((err) => {
        if (!active) return
        setError((err as Error).message)
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id, listing])

  const resolvedListing = listing ?? remoteListing

  useEffect(() => {
    if (!resolvedListing) return
    const canonicalSlug = slugify(resolvedListing.title)
    if (slug !== canonicalSlug) {
      navigate(`/listing/${resolvedListing.id}/${canonicalSlug}`, { replace: true })
    }
  }, [resolvedListing, slug, navigate])

  if (isLoading || loading) {
    return (
      <section className="detail-empty">
        <h2>Memuat detail listing...</h2>
        <p>Mohon tunggu sebentar.</p>
      </section>
    )
  }

  if (!resolvedListing) {
    return (
      <section className="detail-empty">
        <h2>Listing tidak ditemukan</h2>
        <p>{error ?? 'Pastikan link yang kamu buka sudah benar.'}</p>
        <Link className="btn ghost" to="/">
          Kembali ke dashboard
        </Link>
      </section>
    )
  }

  const gallery =
    resolvedListing.photos.filter((photo) => !photo.endsWith('.svg')) ?? []
  const gallerySources =
    gallery.length > 0 ? gallery : resolvedListing.photos ?? []

  return (
    <section className="listing-detail">
      <Link className="btn ghost back-link" to="/">
        Kembali ke dashboard
      </Link>

      <div className="detail-hero">
        <div
          className="detail-thumb"
          style={{ background: resolvedListing.thumbnailColor }}
        >
          <ListingImage sources={resolvedListing.photos} alt={resolvedListing.title} />
        </div>
        <div className="detail-head">
          <span className="pill">{resolvedListing.category}</span>
          <h1>{resolvedListing.title}</h1>
          <div className="detail-meta">
            <span>{resolvedListing.location}</span>
            <span>{resolvedListing.year}</span>
            <span>{formatKm(resolvedListing.mileageKm)}</span>
            <span>{resolvedListing.condition}</span>
          </div>
          <div className="detail-price">{formatCurrency(resolvedListing.price)}</div>
          <div className="detail-actions">
            <Link className="btn primary" to={`/buat-listing?edit=${resolvedListing.id}`}>
              Edit Listing
            </Link>
            <button className="btn outline">Promosikan</button>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-left">
          <div className="detail-card">
            <h2>Ringkasan kendaraan</h2>
            <div className="spec-grid">
              <div className="spec-item">
                <span>Status</span>
                <strong>{resolvedListing.status}</strong>
              </div>
              <div className="spec-item">
                <span>Transmisi</span>
                <strong>{resolvedListing.transmission}</strong>
              </div>
              <div className="spec-item">
                <span>Bahan bakar</span>
                <strong>{resolvedListing.fuelType}</strong>
              </div>
              <div className="spec-item">
                <span>Warna</span>
                <strong>{resolvedListing.color}</strong>
              </div>
              <div className="spec-item">
                <span>Dibuat</span>
                <strong>{formatDate(resolvedListing.createdAt)}</strong>
              </div>
              <div className="spec-item">
                <span>Performa</span>
                <strong>{resolvedListing.views} view</strong>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h2>Deskripsi</h2>
            <p className="muted">{resolvedListing.description}</p>
          </div>

          <div className="detail-card">
            <h2>Fitur utama</h2>
            <ul className="feature-list">
              {resolvedListing.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="detail-right">
          <div className="detail-card">
            <h2>Statistik listing</h2>
            <div className="stat-grid">
              <div>
                <span>View</span>
                <strong>{resolvedListing.views}</strong>
              </div>
              <div>
                <span>Chat</span>
                <strong>{resolvedListing.chats}</strong>
              </div>
              <div>
                <span>Tersimpan</span>
                <strong>{resolvedListing.saved}</strong>
              </div>
            </div>
            <button className="btn primary full">Naikkan Listing</button>
          </div>

          <div className="detail-card">
            <h2>Foto lainnya</h2>
            <div className="photo-grid">
              {gallerySources.map((photo) => (
                <div className="photo-item" key={photo}>
                  <ListingImage
                    sources={[photo, resolvedListing.photos[1] ?? photo]}
                    alt={resolvedListing.title}
                  />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

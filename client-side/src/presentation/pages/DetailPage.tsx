import type { Motorcycle } from '../../domain/entities/Motorcycle'
import { formatCurrency, formatDate, formatKm } from '../utils/format'

export type DetailPageProps = {
  motorcycle: Motorcycle
  onBack: () => void
}

export const DetailPage = ({ motorcycle, onBack }: DetailPageProps) => {
  return (
    <section className="detail section reveal delay-1">
      <button className="btn ghost back-link" onClick={onBack}>
        Kembali ke daftar
      </button>
      <div className="detail-hero">
        <div className="detail-thumb" style={{ background: motorcycle.thumbnailColor }}>
          <img src={motorcycle.imageUrl} alt={motorcycle.name} />
          <span className="bike-tag">{motorcycle.highlightTag}</span>
        </div>
        <div className="detail-head">
          <p className="pill">Detail Motor</p>
          <h1>{motorcycle.name}</h1>
          <div className="detail-meta">
            <span>{motorcycle.year}</span>
            <span>{formatKm(motorcycle.mileageKm)}</span>
            <span>{motorcycle.location}</span>
            <span>{motorcycle.condition}</span>
          </div>
          <div className="detail-price">{formatCurrency(motorcycle.price)}</div>
          <div className="detail-actions">
            <button className="btn primary">Ajukan Kredit</button>
            <button className="btn outline">Jadwalkan Test Ride</button>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-left">
          <div className="detail-card">
            <h2>Spesifikasi utama</h2>
            <div className="spec-grid">
              <div className="spec-item">
                <span>Tipe</span>
                <strong>{motorcycle.type}</strong>
              </div>
              <div className="spec-item">
                <span>Transmisi</span>
                <strong>{motorcycle.transmission}</strong>
              </div>
              <div className="spec-item">
                <span>Mesin</span>
                <strong>{motorcycle.engineCc} cc</strong>
              </div>
              <div className="spec-item">
                <span>Warna</span>
                <strong>{motorcycle.color}</strong>
              </div>
              <div className="spec-item">
                <span>Servis terakhir</span>
                <strong>{formatDate(motorcycle.lastService)}</strong>
              </div>
              <div className="spec-item">
                <span>Dokumen</span>
                <strong>{motorcycle.documents.length} item</strong>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h2>Fitur & kelengkapan</h2>
            <ul className="feature-list">
              {motorcycle.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="detail-card">
            <h2>Dokumen kendaraan</h2>
            <div className="doc-list">
              {motorcycle.documents.map((doc) => (
                <span className="doc-pill" key={doc}>
                  {doc}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="detail-right">
          <div className="detail-card">
            <h2>Simulasi kredit</h2>
            <div className="finance-grid">
              {motorcycle.financeOffers.map((offer) => (
                <div className="finance-card" key={offer.tenorMonths}>
                  <span>Tenor {offer.tenorMonths} bulan</span>
                  <strong>{formatCurrency(offer.monthlyInstallment)}/bulan</strong>
                  <span className="muted">DP {formatCurrency(offer.downPayment)}</span>
                </div>
              ))}
            </div>
            <button className="btn primary full">Ajukan Kredit</button>
          </div>

          <div className="detail-card">
            <h2>Seller terpercaya</h2>
            <div className="seller-card">
              <div>
                <strong>{motorcycle.seller.name}</strong>
                <p className="muted">{motorcycle.seller.location}</p>
              </div>
              <div className="seller-stats">
                <div>
                  <span>Rating</span>
                  <strong>{motorcycle.seller.rating}</strong>
                </div>
                <div>
                  <span>Respon</span>
                  <strong>{motorcycle.seller.responseTime}</strong>
                </div>
                <div>
                  <span>Terjual</span>
                  <strong>{motorcycle.seller.totalSales}</strong>
                </div>
              </div>
              <button className="btn outline full">Chat Seller</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

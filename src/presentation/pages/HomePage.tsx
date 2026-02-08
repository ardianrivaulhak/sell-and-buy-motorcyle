import type { Motorcycle } from '../../domain/entities/Motorcycle'
import type { MotorcycleSearchQuery } from '../../application/use-cases/searchMotorcycles'
import { formatCurrency, formatKm } from '../utils/format'
import { BikeCard } from '../components/BikeCard'

const perks = [
  {
    title: 'Inspeksi 120 titik',
    desc: 'Mesin, kelistrikan, hingga rangka dicek oleh mekanik berpengalaman.',
  },
  {
    title: 'Pilihan kredit fleksibel',
    desc: 'Simulasi tenor 6-36 bulan dengan rekomendasi sesuai budget kamu.',
  },
  {
    title: 'Antar aman ke rumah',
    desc: 'Delivery terjadwal dengan dokumentasi lengkap dan asuransi pengiriman.',
  },
]

const steps = [
  {
    title: 'Upload detail motor',
    desc: 'Isi spesifikasi, foto, dan riwayat servis dari dashboard seller.',
  },
  {
    title: 'Dapatkan harga terbaik',
    desc: 'Tim kurator memberi rekomendasi harga berdasarkan pasar terbaru.',
  },
  {
    title: 'Transaksi aman & cepat',
    desc: 'Pembayaran ditransfer setelah inspeksi lolos dan dokumen lengkap.',
  },
]

const testimonials = [
  {
    name: 'Dina R.',
    role: 'Pembeli di Tangerang',
    quote: 'Semuanya transparan. Kondisi motor sesuai foto dan proses kreditnya cepat.',
  },
  {
    name: 'Rizky A.',
    role: 'Seller di Malang',
    quote: 'Dalam 5 hari motor langsung terjual. Timnya responsif dan profesional.',
  },
]

export type HomePageProps = {
  featured: Motorcycle[]
  results: Motorcycle[]
  query: MotorcycleSearchQuery
  onQueryChange: (next: MotorcycleSearchQuery) => void
  onSelectMotorcycle: (id: string) => void
}

export const HomePage = ({
  featured,
  results,
  query,
  onQueryChange,
  onSelectMotorcycle,
}: HomePageProps) => {
  const spotlight = featured[0]

  const updateQuery = (key: keyof MotorcycleSearchQuery, value?: string) => {
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
      <section className="hero section reveal delay-1">
        <div className="hero-content">
          <span className="pill">Kurasi motor pilihan untuk harian & hobi</span>
          <h1>Cari dan jual motor lebih cepat, aman, dan transparan di satu tempat.</h1>
          <p className="lead">
            Dapatkan motor bekas berkualitas dengan inspeksi menyeluruh, pilihan
            kredit fleksibel, dan pengantaran terjadwal.
          </p>
          <div className="hero-actions">
            <button className="btn primary">Cari Motor</button>
            <button className="btn outline">Konsultasi Kredit</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>1.200+</strong>
              <span>Motor siap pakai</span>
            </div>
            <div className="stat">
              <strong>350+</strong>
              <span>Seller aktif</span>
            </div>
            <div className="stat">
              <strong>18 kota</strong>
              <span>Jangkauan layanan</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-poster">
            <div className="poster-tag">Rekomendasi minggu ini</div>
            <div className="poster-title">{spotlight?.name ?? 'Motor Premium'}</div>
            <div className="poster-specs">
              <span>{spotlight?.year ?? 2024}</span>
              <span>{spotlight ? formatKm(spotlight.mileageKm) : '2.300 km'}</span>
              <span>{spotlight?.location ?? 'Bandung'}</span>
            </div>
            <div className="poster-price">
              {spotlight ? formatCurrency(spotlight.price) : 'Rp 32.750.000'}
            </div>
          </div>
          <div className="hero-floating">
            <p className="floating-title">Simulasi kredit instan</p>
            <div className="floating-row">
              <span>DP mulai</span>
              <strong>Rp 3,2 jt</strong>
            </div>
            <div className="floating-row">
              <span>Cicilan</span>
              <strong>Rp 1,05 jt/bulan</strong>
            </div>
            <button className="btn small ghost">Cek Simulasi</button>
          </div>
        </div>
      </section>

      <section className="search-panel reveal delay-2">
        <div>
          <h2>Cari motor sesuai kebutuhanmu</h2>
          <p className="muted">
            Filter cepat untuk tipe, harga, dan lokasi. Semua listing sudah
            diverifikasi.
          </p>
        </div>
        <form className="search-form" onSubmit={(event) => event.preventDefault()}>
          <label className="field">
            <span>Tipe Motor</span>
            <select
              value={query.type ?? ''}
              onChange={(event) => updateQuery('type', event.target.value)}
            >
              <option value="">Semua</option>
              <option value="Skutik">Skutik</option>
              <option value="Sport">Sport</option>
              <option value="Naked">Naked</option>
              <option value="Classic">Classic</option>
            </select>
          </label>
          <label className="field">
            <span>Budget</span>
            <select
              value={query.budget ?? ''}
              onChange={(event) => updateQuery('budget', event.target.value)}
            >
              <option value="">Semua</option>
              <option value="lt20">&lt; Rp 20 juta</option>
              <option value="20-30">Rp 20 - 30 juta</option>
              <option value="30-45">Rp 30 - 45 juta</option>
              <option value="gt45">&gt; Rp 45 juta</option>
            </select>
          </label>
          <label className="field">
            <span>Lokasi</span>
            <select
              value={query.location ?? ''}
              onChange={(event) => updateQuery('location', event.target.value)}
            >
              <option value="">Semua</option>
              <option value="Jakarta Selatan">Jakarta Selatan</option>
              <option value="Bandung">Bandung</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Depok">Depok</option>
              <option value="Yogyakarta">Yogyakarta</option>
              <option value="Bekasi">Bekasi</option>
              <option value="Semarang">Semarang</option>
            </select>
          </label>
          <label className="field">
            <span>Tenor</span>
            <select
              value={query.paymentPlan ?? ''}
              onChange={(event) => updateQuery('paymentPlan', event.target.value)}
            >
              <option value="">Semua</option>
              <option value="cash">Cash</option>
              <option value="6">6 bulan</option>
              <option value="12">12 bulan</option>
              <option value="24">24 bulan</option>
            </select>
          </label>
          <button className="btn primary submit" type="submit">
            Cari Motor
          </button>
        </form>
        <div className="search-suggest">Populer: NMAX, PCX, Vario, Aerox, W175</div>
      </section>

      <section id="stok" className="featured section reveal delay-3">
        <div className="section-head">
          <div>
            <h2>Motor pilihan untukmu</h2>
            <p className="muted">Pilihan motor dengan histori servis lengkap dan dokumen siap.</p>
          </div>
          <button className="btn ghost">Lihat Semua</button>
        </div>
        {results.length === 0 ? (
          <div className="empty-state">Tidak ada motor yang sesuai filter.</div>
        ) : (
          <div className="bike-grid">
            {results.map((bike) => (
              <BikeCard key={bike.id} bike={bike} onSelect={onSelectMotorcycle} />
            ))}
          </div>
        )}
      </section>

      <section className="benefits section reveal delay-4">
        <div className="section-head">
          <div>
            <h2>Kenapa RodaRaja?</h2>
            <p className="muted">Lebih dari sekadar marketplace, kami dampingi sampai motor diterima.</p>
          </div>
        </div>
        <div className="benefit-grid">
          {perks.map((perk) => (
            <article className="benefit-card" key={perk.title}>
              <h3>{perk.title}</h3>
              <p>{perk.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="jual" className="sell section reveal delay-5">
        <div className="sell-card">
          <div className="sell-copy">
            <span className="pill">Untuk penjual</span>
            <h2>Jual motor tanpa ribet, proses cepat dan aman.</h2>
            <p className="muted">
              Kami bantu inspeksi, foto profesional, dan distribusi listing ke pembeli yang tepat.
            </p>
            <button className="btn primary">Mulai Jual Motor</button>
          </div>
          <div className="step-list">
            {steps.map((step, index) => (
              <div className="step" key={step.title}>
                <span className="step-index">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kredit" className="testimonials section reveal delay-6">
        <div className="section-head">
          <div>
            <h2>Pengalaman pelanggan</h2>
            <p className="muted">Ribuan pembeli dan seller mempercayakan transaksi mereka di sini.</p>
          </div>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article className="testimonial-card" key={item.name}>
              <p className="quote">"{item.quote}"</p>
              <div className="testimonial-meta">
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="promo" className="cta section reveal delay-7">
        <div>
          <h2>Siap upgrade motor impian?</h2>
          <p>
            Dapatkan rekomendasi personal, simulasi kredit, dan jadwal test ride di kota terdekat.
          </p>
        </div>
        <div className="cta-actions">
          <button className="btn primary">Jadwalkan Test Ride</button>
          <button className="btn ghost">Chat Konsultan</button>
        </div>
      </section>
    </>
  )
}

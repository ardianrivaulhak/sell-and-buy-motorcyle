import { useMemo, useState } from 'react'
import '../App.css'
import type { MotorcycleSearchQuery } from '../application/use-cases/searchMotorcycles'
import { getFeaturedMotorcycles } from '../application/use-cases/getFeaturedMotorcycles'
import { getMotorcycleById } from '../application/use-cases/getMotorcycleById'
import { searchMotorcycles } from '../application/use-cases/searchMotorcycles'
import { motorcycleRepository } from '../infrastructure/repositories/motorcycleRepository'
import { HomePage } from './pages/HomePage'
import { DetailPage } from './pages/DetailPage'

const initialQuery: MotorcycleSearchQuery = {}

function App() {
  const [query, setQuery] = useState<MotorcycleSearchQuery>(initialQuery)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const featured = useMemo(
    () => getFeaturedMotorcycles(motorcycleRepository, 6),
    [],
  )

  const results = useMemo(
    () => searchMotorcycles(motorcycleRepository, query),
    [query],
  )

  const selected = selectedId
    ? getMotorcycleById(motorcycleRepository, selectedId)
    : null

  return (
    <div className="page">
      <header className="nav">
        <div className="brand" onClick={() => setSelectedId(null)}>
          <div className="brand-mark" />
          <div>
            <p className="brand-name">RodaRaja</p>
            <p className="brand-tag">Marketplace motor terpercaya</p>
          </div>
        </div>
        <nav className="nav-links">
          <a href="#stok">Stok Motor</a>
          <a href="#jual">Jual Motor</a>
          <a href="#kredit">Kredit</a>
          <a href="#promo">Promo</a>
        </nav>
        <div className="nav-actions">
          <button className="btn ghost">Masuk</button>
          <button className="btn primary">Jual Motor</button>
        </div>
      </header>

      <main>
        {selected ? (
          <DetailPage motorcycle={selected} onBack={() => setSelectedId(null)} />
        ) : (
          <HomePage
            featured={featured}
            results={results}
            query={query}
            onQueryChange={setQuery}
            onSelectMotorcycle={setSelectedId}
          />
        )}
      </main>

      <footer className="footer">
        <div>
          <h3>RodaRaja</h3>
          <p className="muted">
            Platform jual beli motor terpercaya dengan layanan inspeksi dan kredit terkurasi.
          </p>
        </div>
        <div>
          <h4>Perusahaan</h4>
          <a href="#">Tentang Kami</a>
          <a href="#">Karier</a>
          <a href="#">Blog</a>
        </div>
        <div>
          <h4>Layanan</h4>
          <a href="#">Beli Motor</a>
          <a href="#">Jual Motor</a>
          <a href="#">Pembiayaan</a>
        </div>
        <div>
          <h4>Bantuan</h4>
          <a href="#">FAQ</a>
          <a href="#">Kontak</a>
          <a href="#">Syarat & Ketentuan</a>
        </div>
      </footer>
    </div>
  )
}

export default App

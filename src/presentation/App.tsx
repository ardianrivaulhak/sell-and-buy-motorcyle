import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import '../App.css'
import type { ListingSearchQuery } from '../application/use-cases/searchListings'
import { getFeaturedListings } from '../application/use-cases/getFeaturedListings'
import { searchListings } from '../application/use-cases/searchListings'
import type { Listing } from '../domain/entities/Listing'
import { SellMarketplacePage } from './pages/SellMarketplacePage'
import { ListingDetailPage } from './pages/ListingDetailPage'
import { ListingPage } from './pages/ListingPage'
import { TipsPage } from './pages/TipsPage'
import { MessagesPage } from './pages/MessagesPage'
import { HelpPage } from './pages/HelpPage'
import { CreateListingPage } from './pages/CreateListingPage'
import { AuthPage } from './pages/AuthPage'
import { slugify } from './utils/slug'
import { api, ApiError } from './utils/api'
import { useAuth } from './context/AuthContext'

const initialQuery: ListingSearchQuery = {}

function App() {
  const [query, setQuery] = useState<ListingSearchQuery>(initialQuery)
  const [listingItems, setListingItems] = useState<Listing[]>([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [listingsError, setListingsError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user, ensureAccessToken, logout } = useAuth()

  const loadListings = useCallback(async () => {
    setLoadingListings(true)
    setListingsError(null)
    try {
      const result = await api.getListings()
      setListingItems(result.data as Listing[])
    } catch (err) {
      setListingsError((err as Error).message)
    } finally {
      setLoadingListings(false)
    }
  }, [])

  useEffect(() => {
    void loadListings()
  }, [loadListings])

  const listingRepo = useMemo(
    () => ({
      findAll: () => listingItems,
      findById: (id: string) => listingItems.find((item) => item.id === id) ?? null,
    }),
    [listingItems],
  )

  const featured = useMemo(
    () => getFeaturedListings(listingRepo, 2),
    [listingRepo],
  )

  const results = useMemo(
    () => searchListings(listingRepo, query),
    [listingRepo, query],
  )

  const withAccessToken = useCallback(
    async <T,>(action: (token: string) => Promise<T>) => {
      let token = await ensureAccessToken()
      if (!token) {
        navigate('/auth')
        throw new Error('Silakan login terlebih dahulu.')
      }

      try {
        return await action(token)
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          token = await ensureAccessToken(true)
          if (!token) {
            navigate('/auth')
            throw new Error('Sesi login kamu sudah berakhir.')
          }
          return await action(token)
        }
        throw err
      }
    },
    [ensureAccessToken, navigate],
  )

  const handleUpsertListing = async (
    payload: {
      category: Listing['category']
      title: string
      price: number
      location: string
      status: Listing['status']
      description: string
      year: number
      mileageKm: number
      transmission: Listing['transmission']
      fuelType: Listing['fuelType']
      color: string
      condition: Listing['condition']
      features: string[]
    },
    photos: string[],
    editingId?: string,
  ) => {
    const fallbackPhoto =
      payload.category === 'Mobil' ? '/images/avanza-2019.svg' : '/images/pcx-160.svg'
    const nextPhotos = photos.length > 0 ? photos : [fallbackPhoto]

    const requestPayload = {
      ...payload,
      price: { amount: payload.price, currency: 'IDR' as const },
      photos: nextPhotos,
    }

    if (editingId) {
      const result = await withAccessToken((token) =>
        api.updateListing(editingId, requestPayload, token),
      )
      const updated = result.data as Listing
      setListingItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      )
      navigate(`/listing/${updated.id}/${slugify(updated.title)}`)
      return
    }

    const result = await withAccessToken((token) =>
      api.createListing(requestPayload, token),
    )
    const created = result.data as Listing
    setListingItems((prev) => [created, ...prev.filter((item) => item.id !== created.id)])
    navigate(`/listing/${created.id}/${slugify(created.title)}`)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/dashboard')
  }

  const handleCreateListing = () => {
    if (!user) {
      navigate('/auth?redirect=/buat-listing')
      return
    }
    navigate('/buat-listing')
  }

  return (
    <div className="page">
      <header className="nav">
        <div className="brand" onClick={() => navigate('/dashboard')}>
          <div className="brand-mark" />
          <div>
            <p className="brand-name">RodaRaja Market</p>
            <p className="brand-tag">Dashboard penjual motor & mobil</p>
          </div>
        </div>
        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/listing">Listing</NavLink>
          <NavLink to="/pesan">Pesan</NavLink>
          <NavLink to="/bantuan">Bantuan</NavLink>
        </nav>
        <div className="nav-actions">
          {user ? (
            <div className="nav-user">
              <div>
                <p className="nav-user-name">Halo, {user.name}</p>
                <p className="nav-user-role">{user.role}</p>
              </div>
              <button className="btn ghost" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          ) : (
            <button className="btn ghost" onClick={() => navigate('/auth')}>
              Login
            </button>
          )}
          <button className="btn primary" onClick={handleCreateListing}>
            Buat Listing
          </button>
        </div>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <SellMarketplacePage
                featured={featured}
                listings={results}
                query={query}
                loading={loadingListings}
                error={listingsError}
                onQueryChange={setQuery}
                onSelectListing={(listing) =>
                  navigate(`/listing/${listing.id}/${slugify(listing.title)}`)
                }
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <SellMarketplacePage
                featured={featured}
                listings={results}
                query={query}
                loading={loadingListings}
                error={listingsError}
                onQueryChange={setQuery}
                onSelectListing={(listing) =>
                  navigate(`/listing/${listing.id}/${slugify(listing.title)}`)
                }
              />
            }
          />
          <Route
            path="/listing"
            element={
              <ListingPage
                listings={results}
                query={query}
                loading={loadingListings}
                error={listingsError}
                onQueryChange={setQuery}
                onSelectListing={(listing) =>
                  navigate(`/listing/${listing.id}/${slugify(listing.title)}`)
                }
              />
            }
          />
          <Route
            path="/buat-listing"
            element={
              <CreateListingPage
                allListings={listingItems}
                onUpsertListing={handleUpsertListing}
              />
            }
          />
          <Route path="/tips-jual" element={<TipsPage />} />
          <Route path="/pesan" element={<MessagesPage />} />
          <Route path="/bantuan" element={<HelpPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/listing/:id"
            element={
              <ListingDetailPage listings={listingItems} isLoading={loadingListings} />
            }
          />
          <Route
            path="/listing/:id/:slug"
            element={
              <ListingDetailPage listings={listingItems} isLoading={loadingListings} />
            }
          />
        </Routes>
      </main>

      <footer className="footer">
        <div>
          <h3>RodaRaja Market</h3>
          <p className="muted">
            Kelola listing motor dan mobil dengan insight dan chat realtime.
          </p>
        </div>
        <div>
          <h4>Fitur</h4>
          <a href="#">Manajemen Listing</a>
          <a href="#">Promosi Iklan</a>
          <a href="#">Analitik</a>
        </div>
        <div>
          <h4>Dukungan</h4>
          <a href="#">Pusat Bantuan</a>
          <a href="#">Panduan Jual</a>
          <a href="#">Kontak</a>
        </div>
        <div>
          <h4>Legal</h4>
          <a href="#">Syarat & Ketentuan</a>
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Keamanan</a>
        </div>
      </footer>
    </div>
  )
}

export default App

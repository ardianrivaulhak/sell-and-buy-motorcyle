import type { Listing } from '../../domain/entities/Listing'
import { ListingForm } from '../components/ListingForm'

export type CreateListingPageProps = {
  allListings: Listing[]
  onUpsertListing: (
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
  ) => Promise<void>
}

export const CreateListingPage = ({
  allListings,
  onUpsertListing,
}: CreateListingPageProps) => {
  return (
    <section className="create-page">
      <div className="create-intro">
        <span className="pill">Buat Listing Baru</span>
        <h1>Pasang iklan motor atau mobil dalam beberapa langkah.</h1>
        <p className="muted">
          Lengkapi data kendaraan, unggah foto terbaik, lalu publikasikan. Kamu bisa
          simpan draft dan lanjutkan kapan saja.
        </p>
        <div className="create-tips">
          <div>
            <strong>1. Foto terang</strong>
            <p className="muted">Gunakan 5-8 foto dari berbagai sudut.</p>
          </div>
          <div>
            <strong>2. Deskripsi jelas</strong>
            <p className="muted">Cantumkan servis terakhir & kondisi aktual.</p>
          </div>
          <div>
            <strong>3. Harga realistis</strong>
            <p className="muted">Cek harga pasar agar listing cepat dilirik.</p>
          </div>
        </div>
      </div>
      <ListingForm allListings={allListings} onUpsertListing={onUpsertListing} />
    </section>
  )
}

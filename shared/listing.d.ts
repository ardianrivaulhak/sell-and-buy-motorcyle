export type Currency = 'IDR'

export type Money = {
  amount: number
  currency: Currency
}

export type ListingCategory = 'Motor' | 'Mobil'
export type ListingStatus = 'Draft' | 'Aktif' | 'Ditinjau' | 'Terjual'
export type ListingCondition =
  | 'Baru'
  | 'Seperti baru'
  | 'Terawat'
  | 'Standar'
  | 'Siap pakai'
export type FuelType = 'Bensin' | 'Diesel' | 'Hybrid' | 'Listrik'
export type Transmission = 'Automatic' | 'Manual'

export type Listing = {
  id: string
  title: string
  category: ListingCategory
  price: Money
  location: string
  year: number
  mileageKm: number
  condition: ListingCondition
  status: ListingStatus
  transmission: Transmission
  fuelType: FuelType
  color: string
  description: string
  features: string[]
  photos: string[]
  thumbnailColor: string
  views: number
  chats: number
  saved: number
  createdAt: string
  sellerId?: string | null
}

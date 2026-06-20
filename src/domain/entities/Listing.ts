// Listing types and interfaces
export type Currency = 'IDR'

export type Money = {
  amount: number
  currency: Currency
}

export type ListingCategory = 'Motor' | 'Mobil'
export type ListingCondition = 'Terawat' | 'Siap pakai' | 'Seperti baru' | 'Standar'
export type ListingStatus = 'Aktif' | 'Draft' | 'Ditinjau' | 'Terjual'
export type FuelType = 'Bensin' | 'Diesel' | 'Listrik'
export type Transmission = 'Manual' | 'Automatic'

export type ListingId = string

export type Listing = {
  id: ListingId
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
  sellerId: string | null
}

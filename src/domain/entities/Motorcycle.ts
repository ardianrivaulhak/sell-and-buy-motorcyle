import type { Money } from '../value-objects/Money'

export type MotorcycleId = string

export type MotorcycleType = 'Skutik' | 'Sport' | 'Naked' | 'Classic'

export type MotorcycleCondition = 'Seperti baru' | 'Terawat' | 'Standar' | 'Siap pakai'

export type Transmission = 'Automatic' | 'Manual'

export type SellerProfile = {
  name: string
  rating: number
  responseTime: string
  location: string
  totalSales: number
}

export type FinanceOffer = {
  downPayment: Money
  monthlyInstallment: Money
  tenorMonths: number
}

export type Motorcycle = {
  id: MotorcycleId
  name: string
  brand: string
  model: string
  year: number
  mileageKm: number
  price: Money
  location: string
  type: MotorcycleType
  transmission: Transmission
  engineCc: number
  color: string
  condition: MotorcycleCondition
  highlightTag: string
  features: string[]
  seller: SellerProfile
  financeOffers: FinanceOffer[]
  lastService: string
  documents: string[]
  thumbnailColor: string
  imageUrl: string
  isFeatured: boolean
}

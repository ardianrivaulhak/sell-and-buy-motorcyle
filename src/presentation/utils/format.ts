import { formatMoney } from '../../domain/value-objects/Money'
import type { Money } from '../../domain/value-objects/Money'

export const formatCurrency = (money: Money): string => formatMoney(money)

export const formatKm = (km: number): string => {
  return `${km.toLocaleString('id-ID')} km`
}

export const formatDate = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

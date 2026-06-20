import type { Motorcycle, MotorcycleType } from '../../domain/entities/Motorcycle'
import type { MotorcycleRepository } from '../../domain/repositories/MotorcycleRepository'

export type BudgetRange = 'lt20' | '20-30' | '30-45' | 'gt45'
export type PaymentPlan = 'cash' | '6' | '12' | '24'

export type MotorcycleSearchQuery = {
  type?: MotorcycleType
  budget?: BudgetRange
  location?: string
  paymentPlan?: PaymentPlan
}

const inBudget = (price: number, budget?: BudgetRange): boolean => {
  if (!budget) return true
  if (budget === 'lt20') return price < 20000000
  if (budget === '20-30') return price >= 20000000 && price <= 30000000
  if (budget === '30-45') return price > 30000000 && price <= 45000000
  return price > 45000000
}

const matchesPaymentPlan = (motorcycle: Motorcycle, plan?: PaymentPlan): boolean => {
  if (!plan || plan === 'cash') return true
  const tenor = Number(plan)
  return motorcycle.financeOffers.some((offer) => offer.tenorMonths === tenor)
}

export const searchMotorcycles = (
  repository: MotorcycleRepository,
  query: MotorcycleSearchQuery,
): Motorcycle[] => {
  return repository.findAll().filter((motorcycle) => {
    const typeMatch = query.type ? motorcycle.type === query.type : true
    const locationMatch = query.location
      ? motorcycle.location === query.location
      : true
    const budgetMatch = inBudget(motorcycle.price.amount, query.budget)
    const paymentMatch = matchesPaymentPlan(motorcycle, query.paymentPlan)

    return typeMatch && locationMatch && budgetMatch && paymentMatch
  })
}

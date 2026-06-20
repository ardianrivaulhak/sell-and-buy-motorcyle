export type Currency = 'IDR'

export type Money = {
  amount: number
  currency: Currency
}

const moneyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export const formatMoney = (money: Money): string => {
  return moneyFormatter.format(money.amount)
}

const DEFAULT_CURRENCY = 'USD'

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  GHS: '₵',
  NGN: '₦',
}

export function normalizeCurrencyCode(currency?: string | null) {
  return (currency ?? DEFAULT_CURRENCY).toUpperCase()
}

export function getCurrencySymbol(currency?: string | null) {
  const code = normalizeCurrencyCode(currency)

  if (CURRENCY_SYMBOLS[code]) {
    return CURRENCY_SYMBOLS[code]
  }

  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0)

    return parts.find((part) => part.type === 'currency')?.value ?? code
  } catch {
    return code
  }
}

export function formatCurrency(
  amount: number,
  currency?: string | null,
  options?: { maximumFractionDigits?: number; minimumFractionDigits?: number },
) {
  const code = normalizeCurrencyCode(currency)

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
  }).format(amount)
}

export function parseWalletAmount(value?: string | null) {
  const parsed = Number.parseFloat(value ?? '0')
  return Number.isFinite(parsed) ? parsed : 0
}

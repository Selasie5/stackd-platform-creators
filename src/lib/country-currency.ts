export type PlatformCurrency = 'NGN' | 'GHS' | 'USD'

export function currencyForCountry(country?: string | null): PlatformCurrency {
  const normalized = (country ?? '').trim().toLowerCase()
  if (normalized.includes('nigeria') || normalized === 'ng') return 'NGN'
  if (normalized.includes('ghana') || normalized === 'gh') return 'GHS'
  return 'USD'
}

export function resolveCreatorCurrency(
  walletCurrency?: string | null,
  country?: string | null,
): PlatformCurrency {
  if (country) {
    return currencyForCountry(country)
  }

  const code = walletCurrency?.toUpperCase()
  if (code === 'NGN' || code === 'GHS' || code === 'USD') {
    return code
  }

  return 'USD'
}

import { COUNTRIES, getCountryByValue } from './constants'

export function formatStoredPhone(dialCode: string, number: string) {
  return [dialCode, number.trim()].filter(Boolean).join(' ').trim()
}

export function parseStoredPhone(
  phone: string | null | undefined,
  country: string | null | undefined,
) {
  const fallbackDialCode = country ? (getCountryByValue(country)?.dialCode ?? '') : ''

  if (!phone?.trim()) {
    return { phoneDialCode: fallbackDialCode, phoneNumber: '' }
  }

  const trimmed = phone.trim()
  const dialCodes = [...COUNTRIES]
    .map((c) => c.dialCode)
    .sort((a, b) => b.length - a.length)

  for (const dialCode of dialCodes) {
    if (trimmed.startsWith(dialCode)) {
      return {
        phoneDialCode: dialCode,
        phoneNumber: trimmed.slice(dialCode.length).trim(),
      }
    }
  }

  const [dialCode, ...rest] = trimmed.split(/\s+/)
  if (dialCode.startsWith('+') && rest.length > 0) {
    return { phoneDialCode: dialCode, phoneNumber: rest.join(' ') }
  }

  return { phoneDialCode: fallbackDialCode, phoneNumber: trimmed }
}

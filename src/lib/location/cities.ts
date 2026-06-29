import { getCountryByValue } from '@/lib/onboarding/constants'

interface CitiesResponse {
  error: boolean
  msg: string
  data: string[]
}

export async function fetchCitiesByCountry(countryValue: string): Promise<string[]> {
  const country = getCountryByValue(countryValue)
  if (!country) return []

  const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country: country.apiName }),
  })

  if (!response.ok) {
    throw new Error('Failed to load cities')
  }

  const payload = (await response.json()) as CitiesResponse
  if (payload.error || !Array.isArray(payload.data)) {
    throw new Error(payload.msg || 'Failed to load cities')
  }

  return payload.data.sort((a, b) => a.localeCompare(b))
}

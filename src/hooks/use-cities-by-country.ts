import * as React from 'react'
import { fetchCitiesByCountry } from '@/lib/location/cities'

export function useCitiesByCountry(country: string) {
  const [cities, setCities] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isError, setIsError] = React.useState(false)

  React.useEffect(() => {
    if (!country) {
      setCities([])
      setIsLoading(false)
      setIsError(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setIsError(false)

    fetchCitiesByCountry(country)
      .then((data) => {
        if (!cancelled) setCities(data)
      })
      .catch(() => {
        if (!cancelled) setIsError(true)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [country])

  return { data: cities, isLoading, isError }
}

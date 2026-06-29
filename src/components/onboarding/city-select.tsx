import { SearchableSelect } from '@/components/onboarding/searchable-select'
import { useCitiesByCountry } from '@/hooks/use-cities-by-country'

interface CitySelectProps {
  country: string
  value: string
  onChange: (value: string) => void
  id?: string
}

export function CitySelect({ country, value, onChange, id }: CitySelectProps) {
  const { data: cities = [], isLoading, isError } = useCitiesByCountry(country)

  return (
    <SearchableSelect
      id={id}
      value={value}
      onChange={onChange}
      options={cities}
      disabled={!country || isLoading}
      placeholder={
        !country
          ? 'Select a country first'
          : isLoading
            ? 'Loading cities…'
            : isError
              ? 'Search or type your city'
              : 'Search or select city'
      }
    />
  )
}

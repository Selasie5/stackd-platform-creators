export const NICHES = [
  'Fashion',
  'Beauty',
  'Tech',
  'Food',
  'Comedy',
  'Lifestyle',
  'Education',
  'Gaming',
  'Fitness',
  'Travel',
  'Music',
  'Other',
] as const

export const LANGUAGES = [
  'English',
  'French',
  'Twi',
  'Hausa',
  'Yoruba',
  'Igbo',
  'Swahili',
  'Arabic',
  'Spanish',
  'Portuguese',
] as const

export const EQUIPMENT = [
  'Phone only',
  'Ring light',
  'Tripod',
  'Microphone',
  'DSLR camera',
  'Gimbal',
  'Green screen',
  'External mic',
] as const

export const AVAILABILITY_OPTIONS = [
  { value: 'full_time', label: 'Full time' },
  { value: 'part_time', label: 'Part time' },
  { value: 'weekends_only', label: 'Weekends only' },
] as const

export const SAMPLE_CATEGORIES = [
  { value: 'ugc', label: 'UGC' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'food', label: 'Food' },
  { value: 'tech', label: 'Tech' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'education', label: 'Education' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'other', label: 'Other' },
] as const

export const SCHOOLS = [
  'University of Ghana',
  'KNUST',
  'University of Cape Coast',
  'University of Lagos',
  'University of Ibadan',
  'Covenant University',
  'Ashesi University',
  'University of Nairobi',
  'Makerere University',
  'University of the Witwatersrand',
] as const

export const COUNTRIES = [
  {
    value: 'Ghana',
    label: 'Ghana',
    apiName: 'Ghana',
    iso2: 'GH',
    dialCode: '+233',
    flag: 'https://flagcdn.com/w40/gh.png',
  },
  {
    value: 'Nigeria',
    label: 'Nigeria',
    apiName: 'Nigeria',
    iso2: 'NG',
    dialCode: '+234',
    flag: 'https://flagcdn.com/w40/ng.png',
  },
  {
    value: 'Kenya',
    label: 'Kenya',
    apiName: 'Kenya',
    iso2: 'KE',
    dialCode: '+254',
    flag: 'https://flagcdn.com/w40/ke.png',
  },
  {
    value: 'South Africa',
    label: 'South Africa',
    apiName: 'South Africa',
    iso2: 'ZA',
    dialCode: '+27',
    flag: 'https://flagcdn.com/w40/za.png',
  },
  {
    value: 'USA',
    label: 'USA',
    apiName: 'United States',
    iso2: 'US',
    dialCode: '+1',
    flag: 'https://flagcdn.com/w40/us.png',
  },
] as const

export type CountryValue = (typeof COUNTRIES)[number]['value']

export function getCountryByValue(value: string) {
  return COUNTRIES.find((country) => country.value === value)
}

export { BANKS, MOBILE_MONEY_PROVIDERS } from './payment-providers'

export const ONBOARDING_STEPS = [
  { id: 1, label: 'Personal details' },
  { id: 2, label: 'Creator identity' },
  { id: 3, label: 'Social handles' },
  { id: 4, label: 'Sample videos' },
  { id: 5, label: 'Payment details' },
  { id: 6, label: 'KYC verification' },
] as const

export const MAX_BIO_LENGTH = 300
export const MAX_SAMPLES = 5
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024
export const MAX_DOC_SIZE_BYTES = 10 * 1024 * 1024
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
export const ACCEPTED_DOC_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

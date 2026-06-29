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
  { value: 'Ghana', label: 'Ghana', flag: 'https://flagcdn.com/w40/gh.png' },
  { value: 'Nigeria', label: 'Nigeria', flag: 'https://flagcdn.com/w40/ng.png' },
  { value: 'Kenya', label: 'Kenya', flag: 'https://flagcdn.com/w40/ke.png' },
  { value: 'South Africa', label: 'South Africa', flag: 'https://flagcdn.com/w40/za.png' },
  { value: 'USA', label: 'USA', flag: 'https://flagcdn.com/w40/us.png' },
] as const

export const BANKS = [
  'GTBank',
  'Access Bank',
  'Zenith Bank',
  'First Bank',
  'UBA',
  'Ecobank',
  'GCB Bank',
  'Stanbic Bank',
  'Fidelity Bank',
] as const

export const MOBILE_MONEY_PROVIDERS = [
  'MTN MoMo',
  'AirtelTigo Money',
  'Vodafone Cash',
  'M-Pesa',
] as const

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

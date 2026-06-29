export type PaymentMethod = 'bank_transfer' | 'mobile_money'

export type VerificationDocType =
  | 'student_id'
  | 'admission_letter'
  | 'school_email'
  | 'other'

export interface SampleVideoDraft {
  id: string
  title: string
  category: string
  externalLink: string
  note: string
  fileName?: string
  fileSize?: number
}

export interface VerificationDocDraft {
  id: string
  type: VerificationDocType
  fileName?: string
  fileSize?: number
  note?: string
}

export interface CreatorOnboardingDraft {
  fullName: string
  school: string
  country: string
  city: string
  phone: string
  bio: string
  mainNiche: string
  otherNiches: string[]
  languages: string[]
  equipment: string[]
  availability: string
  tiktok: string
  instagram: string
  youtube: string
  samples: SampleVideoDraft[]
  paymentMethod: PaymentMethod | ''
  bankName: string
  accountNumber: string
  accountName: string
  mobileProvider: string
  mobileNumber: string
  verificationDocs: VerificationDocDraft[]
  otherDocNote: string
  schoolEmail: string
  kycSkipped: boolean
}

export interface SignupDraft {
  email: string
  password: string
  fullName: string
}

export const EMPTY_ONBOARDING: CreatorOnboardingDraft = {
  fullName: '',
  school: '',
  country: '',
  city: '',
  phone: '',
  bio: '',
  mainNiche: '',
  otherNiches: [],
  languages: [],
  equipment: [],
  availability: '',
  tiktok: '',
  instagram: '',
  youtube: '',
  samples: [],
  paymentMethod: '',
  bankName: '',
  accountNumber: '',
  accountName: '',
  mobileProvider: '',
  mobileNumber: '',
  verificationDocs: [],
  otherDocNote: '',
  schoolEmail: '',
  kycSkipped: false,
}

export const EMPTY_SIGNUP: SignupDraft = {
  email: '',
  password: '',
  fullName: '',
}

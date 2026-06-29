import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { ME_QUERY } from '@/graphql/auth'
import { UPDATE_CREATOR_PROFILE_MUTATION, UPDATE_PAYMENT_DETAILS_MUTATION } from '@/graphql/creator'
import { SUBMIT_KYC_MUTATION } from '@/graphql/kyc'
import { extractGqlError } from '@/lib/gql-error'
import type { CreatorOnboardingDraft } from '@/lib/onboarding/types'
import { getBankByValue } from '@/lib/onboarding/payment-providers'

interface CreatorSampleInput {
  title: string
  category: string
  videoUrl?: string
  externalLink?: string
  note?: string
}

function buildProfileInput(form: CreatorOnboardingDraft) {
  const phone = [form.phoneDialCode, form.phoneNumber.trim()].filter(Boolean).join(' ').trim()

  const samples: CreatorSampleInput[] = form.samples
    .filter(
      (sample) =>
        sample.title && sample.category && (sample.externalLink || sample.videoUrl),
    )
    .map((sample) => ({
      title: sample.title,
      category: sample.category,
      externalLink: sample.externalLink || undefined,
      videoUrl: sample.videoUrl || undefined,
      note: sample.note || undefined,
    }))

  return {
    fullName: form.fullName,
    school: form.school,
    country: form.country,
    city: form.city,
    phone,
    bio: form.bio || undefined,
    mainNiche: form.mainNiche,
    otherNiches: form.otherNiches,
    tiktokHandle: form.tiktok || undefined,
    instagramHandle: form.instagram || undefined,
    youtubeHandle: form.youtube || undefined,
    languagesSpoken: form.languages,
    equipment: form.equipment,
    availability: form.availability,
    samples,
    completeProfile: true,
  }
}

function buildPaymentInput(form: CreatorOnboardingDraft) {
  if (form.paymentMethod === 'bank_transfer') {
    const bank = getBankByValue(form.bankName)
    return {
      method: 'bank_transfer' as const,
      bankName: form.bankName,
      bankCode: bank?.bankCode ?? '000',
      accountNumber: form.accountNumber,
      accountName: form.accountName,
    }
  }

  return {
    method: 'mobile_money' as const,
    mobileMoneyNumber: form.mobileNumber,
    mobileMoneyProvider: form.mobileProvider,
    accountName: form.fullName,
  }
}

function buildKycInput(form: CreatorOnboardingDraft) {
  const documents = form.verificationDocs
    .filter((doc) => doc.type !== 'school_email' && doc.fileUrl)
    .map((doc) => ({
      documentType: doc.type,
      fileUrl: doc.fileUrl!,
      fileName: doc.fileName,
      note: doc.type === 'other' ? form.otherDocNote || doc.note : doc.note,
    }))

  if (documents.length === 0) return null

  return {
    documents,
    schoolEmail: form.schoolEmail.trim() || undefined,
    applicantNote: form.otherDocNote.trim() || undefined,
  }
}

export function useCompleteCreatorOnboarding() {
  const [updateProfile, { loading: profileLoading }] = useMutation(UPDATE_CREATOR_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })
  const [updatePayment, { loading: paymentLoading }] = useMutation(UPDATE_PAYMENT_DETAILS_MUTATION)
  const [submitKyc, { loading: kycLoading }] = useMutation(SUBMIT_KYC_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const completeOnboarding = async (form: CreatorOnboardingDraft, options?: { skipKyc?: boolean }) => {
    try {
      await updateProfile({ variables: { input: buildProfileInput(form) } })
      await updatePayment({ variables: { input: buildPaymentInput(form) } })

      if (!options?.skipKyc) {
        const kycInput = buildKycInput(form)
        if (kycInput) {
          await submitKyc({ variables: { input: kycInput } })
        }
      }

      return true
    } catch (err) {
      toast.error(extractGqlError(err))
      return false
    }
  }

  return {
    completeOnboarding,
    loading: profileLoading || paymentLoading || kycLoading,
  }
}

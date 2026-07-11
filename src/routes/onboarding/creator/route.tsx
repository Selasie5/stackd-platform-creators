import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'
import { ChevronRight } from 'lucide-react'
import { OnboardingShell } from '@/components/onboarding/onboarding-shell'
import { OnboardingSuccess } from '@/components/onboarding/onboarding-success'
import { CitySelect } from '@/components/onboarding/city-select'
import { SearchableSelect } from '@/components/onboarding/searchable-select'
import { NicheSelector } from '@/components/onboarding/niche-selector'
import { ChipMultiSelect } from '@/components/onboarding/chip-multi-select'
import { SampleVideoUploader } from '@/components/onboarding/sample-video-uploader'
import { PaymentDetailsForm } from '@/components/onboarding/payment-details-form'
import { VerificationDocUpload } from '@/components/onboarding/verification-doc-upload'
import { SocialHandleInput } from '@/components/profile/social-handle-input'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import {
  AVAILABILITY_OPTIONS,
  COUNTRIES,
  EQUIPMENT,
  getCountryByValue,
  LANGUAGES,
  MAX_BIO_LENGTH,
  SCHOOLS,
} from '@/lib/onboarding/constants'
import { createId, usePersistedState } from '@/lib/onboarding/storage'
import { EMPTY_ONBOARDING, type CreatorOnboardingDraft } from '@/lib/onboarding/types'
import { useMe } from '@/hooks/use-auth'
import { useCompleteCreatorOnboarding } from '@/hooks/use-creator-onboarding'

const onboardingSearchSchema = z.object({
  step: z.coerce.number().int().min(1).max(6).optional(),
})

export const Route = createFileRoute('/onboarding/creator')({
  validateSearch: onboardingSearchSchema,
  component: CreatorOnboardingRoute,
})

function CreatorOnboardingRoute() {
  const { step = 1 } = Route.useSearch()
  const navigate = useNavigate()
  const [form, setForm] = usePersistedState<CreatorOnboardingDraft>(
    'creator-onboarding-draft',
    EMPTY_ONBOARDING,
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [successSkippedKyc, setSuccessSkippedKyc] = React.useState(false)
  const { data: meData, loading: meLoading } = useMe()
  const { completeOnboarding } = useCompleteCreatorOnboarding()
  const sampleFilesRef = React.useRef(new Map<string, File>())
  const docFilesRef = React.useRef(new Map<string, File>())

  React.useEffect(() => {
    if (meLoading) return
    if (!meData?.me) {
      navigate({ to: '/signin' })
      return
    }
    if (meData.me.creator?.isProfileComplete) {
      navigate({ to: '/dashboard/overview' })
    }
  }, [meData?.me, meLoading, navigate])

  React.useEffect(() => {
    if (form.samples.length === 0) {
      setForm((prev) => ({
        ...prev,
        samples: [{ id: createId(), title: '', category: '', externalLink: '', note: '' }],
      }))
    }
  }, [form.samples.length, setForm])

  const setStep = (newStep: number) => {
    navigate({ to: '/onboarding/creator', search: { step: newStep } })
  }

  const update = (patch: Partial<CreatorOnboardingDraft>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (
          !form.fullName ||
          !form.school ||
          !form.country ||
          !form.city ||
          !form.phoneDialCode ||
          !form.phoneNumber.trim()
        ) {
          toast.error('Please fill in all personal details.')
          return false
        }
        return true
      case 2:
        if (!form.mainNiche || !form.availability) {
          toast.error('Please select your main niche and availability.')
          return false
        }
        if (form.bio.length > MAX_BIO_LENGTH) {
          toast.error(`Bio must be ${MAX_BIO_LENGTH} characters or less.`)
          return false
        }
        return true
      case 3: {
        if (!form.tiktok && !form.instagram && !form.youtube) {
          toast.error('Add at least one social handle.')
          return false
        }
        return true
      }
      case 4: {
        const validSample = form.samples.some(
          (s) => s.title && s.category && (s.externalLink || s.videoUrl),
        )
        if (!validSample) {
          toast.error('Add at least one complete sample video.')
          return false
        }
        return true
      }
      case 5:
        if (!form.paymentMethod) {
          toast.error('Select a payment method.')
          return false
        }
        if (form.paymentMethod === 'bank_transfer') {
          if (!form.bankName || !form.accountNumber || !form.accountName) {
            toast.error('Complete all bank transfer fields.')
            return false
          }
        }
        if (form.paymentMethod === 'mobile_money') {
          if (!form.mobileProvider || !form.mobileNumber) {
            toast.error('Complete all mobile money fields.')
            return false
          }
        }
        return true
      case 6:
        return true
      default:
        return true
    }
  }

  const validateKycSubmission = (): boolean => {
    const hasDoc =
      form.verificationDocs.length > 0 || form.schoolEmail.trim().length > 0
    if (!hasDoc) {
      toast.error('Upload a verification document or enter your school email.')
      return false
    }
    return true
  }

  const finishOnboarding = async (skippedKyc: boolean) => {
    update({ kycSkipped: skippedKyc })
    setIsSubmitting(true)
    const ok = await completeOnboarding(
      { ...form, kycSkipped: skippedKyc },
      { skipKyc: skippedKyc },
    )
    setIsSubmitting(false)
    if (!ok) return

    localStorage.removeItem('creator-onboarding-draft')
    setSuccessSkippedKyc(skippedKyc)
    setShowSuccess(true)
  }

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateKycSubmission()) return
    await finishOnboarding(false)
  }

  const handleKycSkip = async () => {
    await finishOnboarding(true)
  }

  const stepConfig = {
    1: {
      title: 'Personal details',
      subtitle: 'Tell us a bit about yourself so brands know who they are working with.',
    },
    2: {
      title: 'Creator identity',
      subtitle: 'Help brands understand your style, skills, and availability.',
    },
    3: {
      title: 'Social handles',
      subtitle: 'Share where brands can find your work. At least one handle is required.',
    },
    4: {
      title: 'Sample videos',
      subtitle: 'Show brands what you can create. Upload files or paste external links.',
    },
    5: {
      title: 'Payment details',
      subtitle: 'How should we pay you when you complete campaigns?',
    },
    6: {
      title: 'KYC verification',
      subtitle: 'Verify your student status to unlock paid campaigns. You can skip and complete this later.',
    },
  } as const

  const config = stepConfig[step as keyof typeof stepConfig]

  if (meLoading || !meData?.me) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F8] text-sm text-zinc-500">
        Loading onboarding…
      </div>
    )
  }

  if (showSuccess) {
    return (
      <OnboardingSuccess
        skippedKyc={successSkippedKyc}
        onContinue={() => navigate({ to: '/dashboard/overview' })}
      />
    )
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(step)) return
    if (step < 6) setStep(step + 1)
  }

  return (
    <OnboardingShell
      step={step}
      title={config.title}
      subtitle={config.subtitle}
      onBack={step > 1 ? () => setStep(step - 1) : undefined}
    >
      <form
        onSubmit={step === 6 ? handleKycSubmit : handleNext}
        className="space-y-6"
      >
        {step === 1 && (
          <div className="animate-in fade-in space-y-4 duration-200">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => update({ fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>School</Label>
              <SearchableSelect
                value={form.school}
                onChange={(val) => update({ school: val })}
                options={SCHOOLS}
                placeholder="Search or type your school"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Country</Label>
                <Select
                  value={form.country}
                  onChange={(val) => {
                    const country = getCountryByValue(val)
                    update({
                      country: val,
                      city: '',
                      phoneDialCode: country?.dialCode ?? form.phoneDialCode,
                    })
                  }}
                  placeholder="Select country"
                  options={COUNTRIES.map((c) => ({
                    value: c.value,
                    label: c.label,
                    icon: <img src={c.flag} alt="" className="h-4 w-auto rounded-[2px]" />,
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <CitySelect
                  id="city"
                  country={form.country}
                  value={form.city}
                  onChange={(val) => update({ city: val })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <PhoneInput
                id="phone"
                dialCode={form.phoneDialCode}
                number={form.phoneNumber}
                onDialCodeChange={(val) => update({ phoneDialCode: val })}
                onNumberChange={(val) => update({ phoneNumber: val })}
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in space-y-5 duration-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio">Bio</Label>
                <span className="text-xs text-zinc-400">
                  {form.bio.length}/{MAX_BIO_LENGTH}
                </span>
              </div>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => update({ bio: e.target.value.slice(0, MAX_BIO_LENGTH) })}
                placeholder="Tell brands about yourself…"
                rows={4}
              />
            </div>
            <NicheSelector
              mainNiche={form.mainNiche}
              otherNiches={form.otherNiches}
              onMainNicheChange={(val) =>
                update({
                  mainNiche: val,
                  otherNiches: form.otherNiches.filter((n) => n !== val),
                })
              }
              onOtherNichesChange={(val) => update({ otherNiches: val })}
            />
            <ChipMultiSelect
              label="Languages spoken"
              options={LANGUAGES}
              value={form.languages}
              onChange={(val) => update({ languages: val })}
            />
            <ChipMultiSelect
              label="Equipment"
              options={EQUIPMENT}
              value={form.equipment}
              onChange={(val) => update({ equipment: val })}
            />
            <div className="space-y-2">
              <Label>Availability</Label>
              <Select
                value={form.availability}
                onChange={(val) => update({ availability: val })}
                placeholder="Select availability"
                options={AVAILABILITY_OPTIONS.map((a) => ({
                  value: a.value,
                  label: a.label,
                }))}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in space-y-4 duration-200">
            <p className="text-xs text-zinc-500">At least one handle is required.</p>
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok handle</Label>
              <SocialHandleInput
                platform="tiktok"
                value={form.tiktok}
                onChange={(v) => update({ tiktok: v })}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram handle</Label>
              <SocialHandleInput
                platform="instagram"
                value={form.instagram}
                onChange={(v) => update({ instagram: v })}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube handle</Label>
              <SocialHandleInput
                platform="youtube"
                value={form.youtube}
                onChange={(v) => update({ youtube: v })}
                placeholder="@channel"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <SampleVideoUploader
            samples={form.samples}
            onChange={(samples) => update({ samples })}
            fileMapRef={sampleFilesRef}
          />
        )}

        {step === 5 && (
          <PaymentDetailsForm
            paymentMethod={form.paymentMethod}
            bankName={form.bankName}
            accountNumber={form.accountNumber}
            accountName={form.accountName}
            mobileProvider={form.mobileProvider}
            mobileNumber={form.mobileNumber}
            onPaymentMethodChange={(method) => update({ paymentMethod: method })}
            onFieldChange={(field, value) => update({ [field]: value })}
          />
        )}

        {step === 6 && (
          <VerificationDocUpload
            docs={form.verificationDocs}
            schoolEmail={form.schoolEmail}
            otherDocNote={form.otherDocNote}
            onDocsChange={(docs) => update({ verificationDocs: docs })}
            onSchoolEmailChange={(val) => update({ schoolEmail: val })}
            onOtherDocNoteChange={(val) => update({ otherDocNote: val })}
            fileMapRef={docFilesRef}
          />
        )}

        <div className={step === 6 ? 'flex items-center justify-between gap-4 pt-2' : 'flex justify-end pt-2'}>
          {step === 6 && (
            <Button
              type="button"
              variant="ghost"
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-900"
              onClick={() => void handleKycSkip()}
              disabled={isSubmitting}
            >
              Skip for now
            </Button>
          )}
          <Button
            type="submit"
            className="gap-2 rounded-full px-8 py-6 text-base font-semibold"
            isLoading={isSubmitting}
          >
            {step === 6 ? 'Submit verification' : 'Continue'}
            {step < 6 && <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
      </form>
    </OnboardingShell>
  )
}

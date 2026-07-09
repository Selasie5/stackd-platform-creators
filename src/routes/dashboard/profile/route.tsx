import * as React from 'react'
import { useQuery } from '@apollo/client/react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Landmark,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ChipMultiSelect } from '@/components/onboarding/chip-multi-select'
import { CitySelect } from '@/components/onboarding/city-select'
import { NicheSelector } from '@/components/onboarding/niche-selector'
import { PaymentDetailsForm } from '@/components/onboarding/payment-details-form'
import { SampleVideoUploader } from '@/components/onboarding/sample-video-uploader'
import { SearchableSelect } from '@/components/onboarding/searchable-select'
import { ProfilePhotoUpload } from '@/components/profile/profile-photo-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { EmptyState, ErrorState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { MY_PAYMENT_DETAILS_QUERY } from '@/graphql/earnings'
import { useMe } from '@/hooks/use-auth'
import {
  useCreatorProfile,
  useUpdateCreatorProfile,
  useUpdatePaymentDetails,
} from '@/hooks/use-settings'
import { CREATOR_KYC_STATUS_LABELS, normalizeKycStatus } from '@/lib/kyc'
import {
  AVAILABILITY_OPTIONS,
  COUNTRIES,
  EQUIPMENT,
  getCountryByValue,
  LANGUAGES,
  MAX_BIO_LENGTH,
  SCHOOLS,
} from '@/lib/onboarding/constants'
import { formatStoredPhone, parseStoredPhone } from '@/lib/onboarding/phone'
import type { PaymentMethod } from '@/lib/onboarding/types'

interface PaymentDetails {
  method?: PaymentMethod | string | null
  bankName?: string | null
  accountNumber?: string | null
  accountName?: string | null
  mobileMoneyNumber?: string | null
  mobileMoneyProvider?: string | null
  hasPaystackRecipient?: boolean | null
}

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: meData } = useMe()
  const { data, loading, error, refetch } = useCreatorProfile()
  const creator = data?.creator

  if (loading && !creator) {
    return (
      <div className="p-6 sm:p-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (error)
    return (
      <div className="p-6">
        <ErrorState onRetry={() => void refetch()} />
      </div>
    )
  if (!creator)
    return (
      <div className="p-6">
        <EmptyState
          title="Profile unavailable"
          description="We could not load your creator profile."
        />
      </div>
    )

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Creator profile
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your public profile and payout details.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard/settings" search={{ tab: 'verification' }}>
            Verification settings
          </Link>
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <ProfilePhotoUpload name={creator.fullName} profileImage={creator.profileImage} />
        <ProfileEditSections
          creator={creator}
          email={meData?.me?.email ?? ''}
        />
        <VerificationStatusCard kycStatus={creator.kycStatus} />
        <PaymentDetailsSection defaultAccountName={creator.fullName} />
      </div>
    </div>
  )
}
function buildProfileFormState(
  creator: NonNullable<ReturnType<typeof useCreatorProfile>['data']>['creator'],
) {
  const { phoneDialCode, phoneNumber } = parseStoredPhone(
    creator.phone,
    creator.country,
  )

  return {
    fullName: creator.fullName ?? '',
    school: creator.school ?? '',
    country: creator.country ?? '',
    city: creator.city ?? '',
    phoneDialCode,
    phoneNumber,
    bio: creator.bio ?? '',
    mainNiche: creator.mainNiche ?? '',
    otherNiches: creator.otherNiches ?? [],
    languagesSpoken: creator.languagesSpoken ?? [],
    equipment: creator.equipment ?? [],
    availability: creator.availability ?? '',
    tiktokHandle: creator.tiktokHandle ?? '',
    instagramHandle: creator.instagramHandle ?? '',
    youtubeHandle: creator.youtubeHandle ?? '',
  }
}

function ProfileEditSections({
  creator,
  email,
}: {
  creator: NonNullable<ReturnType<typeof useCreatorProfile>['data']>['creator']
  email: string
}) {
  const { updateProfile, loading } = useUpdateCreatorProfile()
  const sampleFileMapRef = React.useRef(new Map<string, File>())
  const [form, setForm] = React.useState(() => buildProfileFormState(creator))

  if (!creator) return null

  const handleSaveProfile = () => {
    void updateProfile({
      fullName: form.fullName,
      school: form.school,
      country: form.country,
      city: form.city,
      phone: formatStoredPhone(form.phoneDialCode, form.phoneNumber),
      bio: form.bio || undefined,
      mainNiche: form.mainNiche,
      otherNiches: form.otherNiches,
      languagesSpoken: form.languagesSpoken,
      equipment: form.equipment,
      availability: form.availability || undefined,
      tiktokHandle: form.tiktokHandle || undefined,
      instagramHandle: form.instagramHandle || undefined,
      youtubeHandle: form.youtubeHandle || undefined,
    })
  }

  return (
    <>
      <form
        className="flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault()
          handleSaveProfile()
        }}
      >
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-900">Personal details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" id="full-name">
              <Input
                id="full-name"
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
              />
            </Field>
            <Field label="Email" id="email">
              <Input id="email" value={email} disabled />
            </Field>
            <Field label="School" id="school" className="sm:col-span-2">
              <SearchableSelect
                value={form.school}
                onChange={(val) => setForm((f) => ({ ...f, school: val }))}
                options={SCHOOLS}
                placeholder="Search or type your school"
              />
            </Field>
            <Field label="Country" id="country">
              <Select
                value={form.country}
                onChange={(val) => {
                  const country = getCountryByValue(val)
                  setForm((f) => ({
                    ...f,
                    country: val,
                    city: '',
                    phoneDialCode: country?.dialCode ?? f.phoneDialCode,
                  }))
                }}
                placeholder="Select country"
                options={COUNTRIES.map((c) => ({
                  value: c.value,
                  label: c.label,
                  icon: (
                    <img src={c.flag} alt="" className="h-4 w-auto rounded-[2px]" />
                  ),
                }))}
              />
            </Field>
            <Field label="City" id="city">
              <CitySelect
                id="city"
                country={form.country}
                value={form.city}
                onChange={(val) => setForm((f) => ({ ...f, city: val }))}
              />
            </Field>
            <Field label="Phone number" id="phone" className="sm:col-span-2">
              <PhoneInput
                id="phone"
                dialCode={form.phoneDialCode}
                number={form.phoneNumber}
                onDialCodeChange={(val) =>
                  setForm((f) => ({ ...f, phoneDialCode: val }))
                }
                onNumberChange={(val) =>
                  setForm((f) => ({ ...f, phoneNumber: val }))
                }
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-900">Creator identity</h2>
          <div className="mt-4 space-y-5">
            <Field label="Bio" id="bio">
              <div className="space-y-1.5">
                <div className="flex justify-end">
                  <span className="text-xs text-zinc-400">
                    {form.bio.length}/{MAX_BIO_LENGTH}
                  </span>
                </div>
                <Textarea
                  id="bio"
                  rows={4}
                  value={form.bio}
                  placeholder="Tell brands about yourself…"
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      bio: e.target.value.slice(0, MAX_BIO_LENGTH),
                    }))
                  }
                />
              </div>
            </Field>
            <NicheSelector
              mainNiche={form.mainNiche}
              otherNiches={form.otherNiches}
              onMainNicheChange={(val) =>
                setForm((f) => ({
                  ...f,
                  mainNiche: val,
                  otherNiches: f.otherNiches.filter((n) => n !== val),
                }))
              }
              onOtherNichesChange={(val) =>
                setForm((f) => ({ ...f, otherNiches: val }))
              }
            />
            <ChipMultiSelect
              label="Languages spoken"
              options={LANGUAGES}
              value={form.languagesSpoken}
              onChange={(val) =>
                setForm((f) => ({ ...f, languagesSpoken: val }))
              }
            />
            <ChipMultiSelect
              label="Equipment"
              options={EQUIPMENT}
              value={form.equipment}
              onChange={(val) => setForm((f) => ({ ...f, equipment: val }))}
            />
            <Field label="Availability" id="availability">
              <Select
                value={form.availability}
                onChange={(val) => setForm((f) => ({ ...f, availability: val }))}
                placeholder="Select availability"
                options={AVAILABILITY_OPTIONS.map((a) => ({
                  value: a.value,
                  label: a.label,
                }))}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-900">Social handles</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="TikTok" id="tiktok">
              <Input
                id="tiktok"
                value={form.tiktokHandle}
                placeholder="@username"
                onChange={(e) =>
                  setForm((f) => ({ ...f, tiktokHandle: e.target.value }))
                }
              />
            </Field>
            <Field label="Instagram" id="instagram">
              <Input
                id="instagram"
                value={form.instagramHandle}
                placeholder="@username"
                onChange={(e) =>
                  setForm((f) => ({ ...f, instagramHandle: e.target.value }))
                }
              />
            </Field>
            <Field label="YouTube" id="youtube">
              <Input
                id="youtube"
                value={form.youtubeHandle}
                placeholder="@channel"
                onChange={(e) =>
                  setForm((f) => ({ ...f, youtubeHandle: e.target.value }))
                }
              />
            </Field>
          </div>
        </section>

        <div>
          <Button type="submit" isLoading={loading}>
            Save profile
          </Button>
        </div>
      </form>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-900">Sample videos</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Show brands what you can create.
        </p>
        <div className="mt-4">
          <SampleVideoUploader
            samples={creator.samples.map((sample) => ({
              id: sample.id ?? crypto.randomUUID(),
              title: sample.title,
              category: sample.category,
              videoUrl: sample.videoUrl ?? '',
              externalLink: sample.externalLink ?? '',
              note: sample.note ?? '',
            }))}
            onChange={(samples) =>
              void updateProfile({
                samples: samples.map(
                  ({ title, category, videoUrl, externalLink, note }) => ({
                    title,
                    category,
                    videoUrl: videoUrl || undefined,
                    externalLink: externalLink || undefined,
                    note: note || undefined,
                  }),
                ),
              })
            }
            fileMapRef={sampleFileMapRef}
          />
        </div>
      </section>
    </>
  )
}

function VerificationStatusCard({ kycStatus }: { kycStatus: string }) {
  const status = normalizeKycStatus(kycStatus)
  const label = CREATOR_KYC_STATUS_LABELS[status]
  const config = getVerificationStatusConfig(status)
  const Icon = config.icon

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${config.iconClass}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-950">
                Verification status
              </h2>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.badgeClass}`}
              >
                {label}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              {config.description}
            </p>
          </div>
        </div>
        {status === 'rejected' || status === 'needs_more_info' ? (
          <Button asChild className="shrink-0" size="sm">
            <Link to="/dashboard/settings" search={{ tab: 'verification' }}>
              Resubmit verification
            </Link>
          </Button>
        ) : null}
      </div>
    </section>
  )
}

function PaymentDetailsSection({
  defaultAccountName,
}: {
  defaultAccountName: string
}) {
  const { updatePaymentDetails, loading } = useUpdatePaymentDetails()
  const {
    data,
    loading: detailsLoading,
    refetch,
  } = useQuery<{
    myPaymentDetails: PaymentDetails | null
  }>(MY_PAYMENT_DETAILS_QUERY, { fetchPolicy: 'cache-and-network' })
  const savedDetails = data?.myPaymentDetails ?? null
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod | ''>(
    '',
  )
  const [fields, setFields] = React.useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    mobileProvider: '',
    mobileNumber: '',
  })

  React.useEffect(() => {
    if (!savedDetails) return
    setPaymentMethod(
      savedDetails.method === 'bank_transfer' ||
        savedDetails.method === 'mobile_money'
        ? savedDetails.method
        : '',
    )
    setFields({
      bankName: savedDetails.bankName ?? '',
      accountNumber: savedDetails.accountNumber ?? '',
      accountName: savedDetails.accountName ?? '',
      mobileProvider: savedDetails.mobileMoneyProvider ?? '',
      mobileNumber: savedDetails.mobileMoneyNumber ?? '',
    })
  }, [savedDetails])

  const accountNameForPayload =
    paymentMethod === 'mobile_money'
      ? fields.accountName || defaultAccountName
      : fields.accountName
  const canSave =
    paymentMethod === 'bank_transfer'
      ? Boolean(
          fields.bankName && fields.accountNumber && accountNameForPayload,
        )
      : paymentMethod === 'mobile_money'
        ? Boolean(
            fields.mobileProvider &&
            fields.mobileNumber &&
            accountNameForPayload,
          )
        : false

  const handleSavePaymentDetails = async () => {
    if (!paymentMethod || !canSave) return
    const ok = await updatePaymentDetails({
      method: paymentMethod,
      bankName: fields.bankName || undefined,
      accountNumber: fields.accountNumber || undefined,
      accountName: accountNameForPayload,
      mobileMoneyProvider: fields.mobileProvider || undefined,
      mobileMoneyNumber: fields.mobileNumber || undefined,
    })
    if (ok) {
      await refetch()
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-950">Payment details</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Review the payout details saved on your account, then update them when
          needed.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <SavedPaymentDetails details={savedDetails} loading={detailsLoading} />
        <PaymentDetailsForm
          paymentMethod={paymentMethod}
          bankName={fields.bankName}
          accountNumber={fields.accountNumber}
          accountName={fields.accountName}
          mobileProvider={fields.mobileProvider}
          mobileNumber={fields.mobileNumber}
          onPaymentMethodChange={setPaymentMethod}
          onFieldChange={(field, value) =>
            setFields((current) => ({ ...current, [field]: value }))
          }
        />
        <Button
          disabled={!canSave || loading}
          isLoading={loading}
          onClick={() => void handleSavePaymentDetails()}
        >
          Save payment details
        </Button>
      </div>
    </section>
  )
}

function SavedPaymentDetails({
  details,
  loading,
}: {
  details: PaymentDetails | null
  loading: boolean
}) {
  const method = details?.method ?? null
  const isMobileMoney = method === 'mobile_money'
  const isBankTransfer = method === 'bank_transfer'
  const MethodIcon = isMobileMoney ? Smartphone : Landmark

  if (loading && !details) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-20 animate-pulse rounded-xl bg-zinc-100" />
        <div className="h-20 animate-pulse rounded-xl bg-zinc-100" />
      </div>
    )
  }

  if (!details) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
        No payment details are saved yet. Choose a payout method below to add
        one.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-200">
          <MethodIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Current payout method
          </p>
          <p className="mt-0.5 text-sm font-semibold capitalize text-zinc-950">
            {formatPaymentMethod(method)}
          </p>
        </div>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {isBankTransfer ? (
          <>
            <PaymentDetail label="Bank" value={details.bankName} />
            <PaymentDetail
              label="Account number"
              value={maskAccountNumber(details.accountNumber)}
            />
            <PaymentDetail label="Account name" value={details.accountName} />
          </>
        ) : isMobileMoney ? (
          <>
            <PaymentDetail
              label="Provider"
              value={details.mobileMoneyProvider}
            />
            <PaymentDetail
              label="Mobile number"
              value={maskPhoneNumber(details.mobileMoneyNumber)}
            />
            <PaymentDetail label="Account name" value={details.accountName} />
          </>
        ) : (
          <PaymentDetail
            label="Saved method"
            value={formatPaymentMethod(method)}
          />
        )}
        <PaymentDetail
          label="Recipient status"
          value={
            details.hasPaystackRecipient ? 'Ready for payouts' : 'Setup pending'
          }
        />
      </dl>
    </div>
  )
}

function PaymentDetail({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-zinc-950">{value || '—'}</dd>
    </div>
  )
}

function getVerificationStatusConfig(
  status: ReturnType<typeof normalizeKycStatus>,
) {
  switch (status) {
    case 'approved':
      return {
        icon: CheckCircle2,
        iconClass: 'bg-emerald-50 text-emerald-600',
        badgeClass: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
        description:
          'Your student verification is complete. You can join paid campaigns and receive payouts.',
      }
    case 'pending_review':
      return {
        icon: Clock3,
        iconClass: 'bg-amber-50 text-amber-600',
        badgeClass: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
        description:
          'Your documents are under review. We will notify you as soon as verification is complete.',
      }
    case 'rejected':
    case 'needs_more_info':
      return {
        icon: AlertTriangle,
        iconClass: 'bg-red-50 text-red-600',
        badgeClass: 'bg-red-50 text-red-700 ring-1 ring-red-100',
        description:
          'We need updated information before your account can be verified. Please resubmit your documents.',
      }
    default:
      return {
        icon: ShieldCheck,
        iconClass: 'bg-blue-50 text-blue-600',
        badgeClass: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
        description:
          'Submit your student verification to unlock paid campaigns and withdrawals.',
      }
  }
}

function formatPaymentMethod(method?: string | null) {
  if (!method) return 'Not selected'
  return method.replace(/_/g, ' ')
}

function maskAccountNumber(value?: string | null) {
  if (!value) return '—'
  return value.length > 4 ? `•••• ${value.slice(-4)}` : value
}

function maskPhoneNumber(value?: string | null) {
  if (!value) return '—'
  return value.length > 4 ? `${value.slice(0, 3)}••••${value.slice(-3)}` : value
}

function Field({
  label,
  id,
  children,
  className,
}: {
  label: string
  id: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-xs font-medium text-zinc-700">
        {label}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

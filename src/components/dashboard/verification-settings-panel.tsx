import * as React from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Landmark,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { toast } from 'sonner'
import { VerificationDocUpload } from '@/components/onboarding/verification-doc-upload'
import { Button } from '@/components/ui/button'
import { ME_QUERY } from '@/graphql/auth'
import { MY_PAYMENT_DETAILS_QUERY } from '@/graphql/earnings'
import { SUBMIT_KYC_MUTATION } from '@/graphql/kyc'
import { extractGqlError } from '@/lib/gql-error'
import type { VerificationDocDraft } from '@/lib/onboarding/types'
import { CREATOR_KYC_STATUS_LABELS, normalizeKycStatus } from '@/lib/kyc'

interface VerificationSettingsPanelProps {
  kycStatus?: string | null
}

interface PaymentDetails {
  method?: string | null
  bankName?: string | null
  accountNumber?: string | null
  accountName?: string | null
  mobileMoneyNumber?: string | null
  mobileMoneyProvider?: string | null
  hasPaystackRecipient?: boolean | null
}

export function VerificationSettingsPanel({
  kycStatus,
}: VerificationSettingsPanelProps) {
  const status = normalizeKycStatus(kycStatus)
  const canSubmit =
    status === 'not_started' ||
    status === 'rejected' ||
    status === 'needs_more_info'
  const [docs, setDocs] = React.useState<VerificationDocDraft[]>([])
  const [schoolEmail, setSchoolEmail] = React.useState('')
  const [otherDocNote, setOtherDocNote] = React.useState('')
  const docFilesRef = React.useRef(new Map<string, File>())
  const { data: paymentData, loading: paymentLoading } = useQuery<{
    myPaymentDetails: PaymentDetails | null
  }>(MY_PAYMENT_DETAILS_QUERY)
  const [submitKyc, { loading }] = useMutation(SUBMIT_KYC_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const documents = docs
      .filter((doc) => doc.type !== 'school_email' && doc.fileUrl)
      .map((doc) => ({
        documentType: doc.type,
        fileUrl: doc.fileUrl!,
        fileName: doc.fileName,
        note: doc.type === 'other' ? otherDocNote || doc.note : doc.note,
      }))

    const email = schoolEmail.trim() || undefined

    if (documents.length === 0 && !email) {
      toast.error('Upload a verification document or enter your school email.')
      return
    }

    try {
      await submitKyc({
        variables: {
          input: {
            documents,
            schoolEmail: email,
            applicantNote: otherDocNote.trim() || undefined,
          },
        },
      })
      toast.success(
        'Verification submitted. We will review your documents shortly.',
      )
      setDocs([])
      setSchoolEmail('')
      setOtherDocNote('')
    } catch (err) {
      toast.error(extractGqlError(err))
    }
  }

  return (
    <div className="space-y-5">
      <VerificationStatusCard status={status} />

      {canSubmit ? (
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
        >
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Identity verification
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Submit your student verification to unlock paid campaigns and
              withdrawals.
            </p>
          </div>

          <VerificationDocUpload
            docs={docs}
            schoolEmail={schoolEmail}
            otherDocNote={otherDocNote}
            onDocsChange={setDocs}
            onSchoolEmailChange={setSchoolEmail}
            onOtherDocNoteChange={setOtherDocNote}
            fileMapRef={docFilesRef}
          />

          <Button type="submit" isLoading={loading}>
            Submit verification
          </Button>
        </form>
      ) : null}

      <PaymentDetailsSummary
        details={paymentData?.myPaymentDetails ?? null}
        loading={paymentLoading}
      />
    </div>
  )
}

function VerificationStatusCard({
  status,
}: {
  status: ReturnType<typeof normalizeKycStatus>
}) {
  const label = CREATOR_KYC_STATUS_LABELS[status]
  const config = getVerificationStatusConfig(status)
  const Icon = config.icon

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-4 p-5">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${config.iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
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
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {config.description}
          </p>
        </div>
      </div>
    </section>
  )
}

function PaymentDetailsSummary({
  details,
  loading,
}: {
  details: PaymentDetails | null
  loading: boolean
}) {
  const method = details?.method ?? null
  const isBankTransfer = method === 'bank_transfer'
  const isMobileMoney = method === 'mobile_money'
  const MethodIcon = isMobileMoney ? Smartphone : Landmark

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-950">Payment details</h2>
        <p className="mt-1 text-sm text-zinc-500">
          These are the payout details currently saved from your account API.
        </p>
      </div>

      <div className="p-5">
        {loading && !details ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-20 animate-pulse rounded-xl bg-zinc-100" />
            <div className="h-20 animate-pulse rounded-xl bg-zinc-100" />
          </div>
        ) : !details ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
            No payment details have been saved yet. Add your bank or mobile
            money details from your profile before requesting payouts.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-200">
                <MethodIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Payout method
                </p>
                <p className="mt-0.5 text-sm font-semibold capitalize text-zinc-950">
                  {formatPaymentMethod(method)}
                </p>
              </div>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              {isBankTransfer ? (
                <>
                  <PaymentDetail label="Bank" value={details.bankName} />
                  <PaymentDetail
                    label="Account number"
                    value={maskAccountNumber(details.accountNumber)}
                  />
                  <PaymentDetail
                    label="Account name"
                    value={details.accountName}
                  />
                  <PaymentDetail
                    label="Recipient status"
                    value={
                      details.hasPaystackRecipient
                        ? 'Ready for payouts'
                        : 'Setup pending'
                    }
                  />
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
                  <PaymentDetail
                    label="Account name"
                    value={details.accountName}
                  />
                  <PaymentDetail
                    label="Recipient status"
                    value={
                      details.hasPaystackRecipient
                        ? 'Ready for payouts'
                        : 'Setup pending'
                    }
                  />
                </>
              ) : (
                <PaymentDetail
                  label="Saved method"
                  value={formatPaymentMethod(method)}
                />
              )}
            </dl>
          </div>
        )}
      </div>
    </section>
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
          'We need updated information before your account can be verified. Please resubmit your documents below.',
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

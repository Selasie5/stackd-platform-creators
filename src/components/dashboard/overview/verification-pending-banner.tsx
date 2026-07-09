import { Link } from '@tanstack/react-router'
import { Clock, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CREATOR_KYC_STATUS_LABELS, normalizeKycStatus } from '@/lib/kyc'

interface VerificationPendingBannerProps {
  kycStatus?: string | null
}

export function VerificationPendingBanner({ kycStatus }: VerificationPendingBannerProps) {
  const status = normalizeKycStatus(kycStatus)
  const label = CREATOR_KYC_STATUS_LABELS[status]
  const isPending = status === 'pending_review'
  const description = isPending
    ? 'Your documents are being reviewed. This usually takes 1–3 business days.'
    : 'Complete identity verification to unlock the full creator dashboard.'

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 bg-red-600 px-5 py-3 text-white">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
          {isPending ? <Clock className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {isPending ? 'Verification pending' : `Verification ${label.toLowerCase()}`}
          </p>
          <p className="truncate text-sm text-red-100">{description}</p>
        </div>
      </div>

      <Button
        asChild
        variant="onInverse"
        size="sm"
      >
        <Link to="/dashboard/settings">View status</Link>
      </Button>
    </div>
  )
}

export function VerificationRequiredState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h2 className="max-w-md text-2xl font-semibold tracking-tight text-zinc-900">
        Verification required
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-500">
        Complete identity verification to browse live opportunities and start earning. This usually
        takes 1–3 business days after you submit your documents.
      </p>
      <Button asChild size="auth" className="mt-8 w-auto rounded-full px-6">
        <Link to="/dashboard/settings">Complete verification</Link>
      </Button>
    </div>
  )
}

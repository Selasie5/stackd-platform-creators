import { CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OnboardingSuccessProps {
  skippedKyc: boolean
  onContinue: () => void
}

export function OnboardingSuccess({ skippedKyc, onContinue }: OnboardingSuccessProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F4F6F8] px-4">
      <div className="w-full max-w-lg animate-in fade-in zoom-in-95 rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-xl duration-300">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>

        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Profile complete
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          You&apos;re all set!
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          {skippedKyc
            ? 'Your creator profile is live. Complete KYC anytime from your dashboard to unlock paid campaigns and withdrawals.'
            : 'Your profile and verification details have been submitted. We will review your documents and notify you once approved.'}
        </p>

        <Button
          type="button"
          variant="auth"
          size="auth"
          className="mt-8"
          onClick={onContinue}
        >
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}

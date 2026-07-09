import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { kindLabel } from '@/lib/submissions/normalize'
import type { UnifiedSubmission } from '@/lib/submissions/types'
import { formatCurrency, parseWalletAmount } from '@/lib/currency'
import { cn } from '@/lib/utils'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SubmissionListItem({ submission }: { submission: UnifiedSubmission }) {
  const payout =
    submission.status === 'paid' && submission.paymentAmount
      ? formatCurrency(parseWalletAmount(submission.paymentAmount), submission.currency ?? 'NGN')
      : submission.potentialPayout
        ? formatCurrency(parseWalletAmount(submission.potentialPayout), submission.currency ?? 'NGN')
        : null

  const needsAttention = submission.status === 'revision_requested'

  return (
    <article
      className={cn(
        'rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm',
        needsAttention ? 'border-orange-200 ring-1 ring-orange-100' : 'border-zinc-200',
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            {needsAttention ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-orange-500" aria-hidden />
            ) : null}
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {kindLabel(submission.kind)}
              </p>
              <h3 className="mt-1 truncate text-base font-semibold text-zinc-900">
                {submission.opportunityTitle}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">{submission.brandName ?? 'Brand'}</p>
            </div>
          </div>

          <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-600">
            <div>
              <dt className="sr-only">Submitted</dt>
              <dd>Submitted {formatDate(submission.createdAt)}</dd>
            </div>
            {submission.status === 'paid' && submission.paymentDate ? (
              <div>
                <dt className="sr-only">Paid</dt>
                <dd>Paid {formatDate(submission.paymentDate)}</dd>
              </div>
            ) : null}
            {payout ? (
              <div>
                <dt className="sr-only">Payout</dt>
                <dd className="font-medium text-zinc-900">
                  {submission.status === 'paid' ? 'Paid' : 'Potential'}: {payout}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <StatusBadge status={submission.status} prominent={needsAttention} />
          <Button asChild size="sm" variant="outline">
            <Link
              to="/dashboard/submissions/$id"
              params={{ id: submission.id }}
              search={{ kind: submission.kind }}
            >
              View submission
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

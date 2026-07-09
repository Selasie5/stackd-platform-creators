import { PaymentStatusBadge } from '@/components/ui/status-badge'
import type { UnifiedSubmission } from '@/lib/submissions/types'
import { formatCurrency, parseWalletAmount } from '@/lib/currency'

export function PayoutStatusCard({ submission }: { submission: UnifiedSubmission }) {
  const showPayout =
    submission.status === 'winner' ||
    submission.status === 'approved' ||
    submission.status === 'paid' ||
    Boolean(submission.paymentAmount)

  if (!showPayout) return null

  const amount = submission.paymentAmount ?? submission.rewardAmount ?? submission.potentialPayout
  if (!amount) return null

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-zinc-900">Payout</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Amount</dt>
          <dd className="mt-1 text-lg font-semibold text-zinc-900">
            {formatCurrency(parseWalletAmount(amount), submission.currency ?? 'NGN')}
          </dd>
        </div>
        {submission.paymentStatus ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Payment status</dt>
            <dd className="mt-2">
              <PaymentStatusBadge status={submission.paymentStatus} />
            </dd>
          </div>
        ) : null}
        {submission.paymentDate ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {submission.status === 'paid' ? 'Payment date' : 'Expected payment'}
            </dt>
            <dd className="mt-1 text-sm text-zinc-900">
              {new Date(submission.paymentDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </dd>
          </div>
        ) : (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Expected payment</dt>
            <dd className="mt-1 text-sm text-zinc-600">Usually within 3–5 business days after approval</dd>
          </div>
        )}
      </dl>
    </section>
  )
}

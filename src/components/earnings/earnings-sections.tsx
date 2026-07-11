import { PaymentStatusBadge } from '@/components/ui/status-badge'
import { formatCurrency, parseWalletAmount } from '@/lib/currency'

export function EarningsSummary({
  totalEarned,
  pendingPayout,
  paidOut,
}: {
  totalEarned: string
  pendingPayout: string
  paidOut: string
}) {
  const cards = [
    { label: 'Total earned', value: totalEarned },
    { label: 'Pending payout', value: pendingPayout },
    { label: 'Paid out', value: paidOut },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{card.value}</p>
        </div>
      ))}
    </div>
  )
}

export function EarningsTable({
  payments,
}: {
  payments: Array<{
    id: string
    createdAt: string
    opportunityTitle?: string | null
    opportunityType?: string | null
    amount: string
    currency: string
    status: string
  }>
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/80 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Opportunity</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-4 py-3 text-zinc-600">
                  {new Date(payment.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {payment.opportunityTitle ?? 'Campaign'}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {(payment.opportunityType ?? 'campaign').replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {formatCurrency(parseWalletAmount(payment.amount), payment.currency)}
                </td>
                <td className="px-4 py-3">
                  <PaymentStatusBadge status={payment.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function PaymentDetailsCard({
  details,
  onEdit,
}: {
  details: {
    method?: string | null
    bankName?: string | null
    accountNumber?: string | null
    accountName?: string | null
    mobileMoneyNumber?: string | null
    mobileMoneyProvider?: string | null
  } | null
  onEdit?: () => void
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Payment details</h2>
          <p className="mt-1 text-sm text-zinc-500">Where your payouts are sent.</p>
        </div>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
          >
            Edit
          </button>
        ) : null}
      </div>

      {!details ? (
        <p className="mt-4 text-sm text-zinc-500">No payment details saved yet.</p>
      ) : (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <Detail label="Method" value={details.method?.replace(/_/g, ' ') ?? '—'} />
          {details.method === 'bank_transfer' ? (
            <>
              <Detail label="Bank" value={details.bankName ?? '—'} />
              <Detail label="Account number" value={details.accountNumber ?? '—'} />
              <Detail label="Account name" value={details.accountName ?? '—'} />
            </>
          ) : (
            <>
              <Detail label="Provider" value={details.mobileMoneyProvider ?? '—'} />
              <Detail label="Number" value={details.mobileMoneyNumber ?? '—'} />
            </>
          )}
        </dl>
      )}
    </section>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm capitalize text-zinc-900">{value}</dd>
    </div>
  )
}

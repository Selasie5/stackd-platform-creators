import { Clock, LifeBuoy, Wallet } from 'lucide-react'
import { EarningsChartWidget } from '@/components/dashboard/overview/earnings-chart-widget'
import type { CreatorPaymentRecord } from '@/lib/dashboard/overview'
import { formatCurrency } from '@/lib/currency'
import { cn } from '@/lib/utils'

interface EarningsSummaryCardProps {
  totalLifetime: number
  pendingPayout: number
  paidOut: number
  currency?: string | null
  payments: CreatorPaymentRecord[]
  payoutDelayed?: boolean
  locked?: boolean
}

const payoutItems = [
  {
    key: 'pending',
    label: 'Pending Payout',
    icon: Clock,
  },
  {
    key: 'paid',
    label: 'Paid Out',
    icon: Wallet,
  },
] as const

export function EarningsSummaryCard({
  totalLifetime,
  pendingPayout,
  paidOut,
  currency,
  payments,
  payoutDelayed = false,
  locked = false,
}: EarningsSummaryCardProps) {
  const values = {
    pending: pendingPayout,
    paid: paidOut,
  }

  return (
    <section className={cn('space-y-3', locked && 'opacity-60')}>
      {payoutDelayed && !locked && (
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
          <LifeBuoy className="h-3.5 w-3.5" />
          Payout taking longer than expected — contact support
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.62fr)_minmax(300px,0.38fr)]">
        <EarningsChartWidget
          totalLifetime={totalLifetime}
          currency={currency}
          payments={payments}
          locked={locked}
        />

        <div className="flex flex-col gap-3">
          {payoutItems.map((item) => {
            const Icon = item.icon
            const value = values[item.key]

            return (
              <div
                key={item.key}
                className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-zinc-500">{item.label}</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 tabular-nums">
                    {locked ? '—' : formatCurrency(value, currency)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {payoutDelayed && !locked && (
        <p className="text-xs text-zinc-500">
          If your payout has been pending for more than a week, email{' '}
          <a href="mailto:support@spleenet.com" className="font-medium text-zinc-700 underline">
            support@spleenet.com
          </a>{' '}
          with your withdrawal reference.
        </p>
      )}
    </section>
  )
}

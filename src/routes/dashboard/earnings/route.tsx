import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  EarningsSummary,
  EarningsTable,
  PaymentDetailsCard,
} from '@/components/earnings/earnings-sections'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { EmptyState, ErrorState } from '@/components/ui/empty-state'
import { EarningsTableSkeleton } from '@/components/ui/skeleton'
import { useEarnings, type EarningsFilters, type PaymentStatusFilter } from '@/hooks/use-earnings'

export const Route = createFileRoute('/dashboard/earnings')({
  component: EarningsPage,
})

function EarningsPage() {
  const [filters, setFilters] = React.useState<EarningsFilters>({
    status: 'all',
    fromDate: '',
    toDate: '',
    opportunityType: 'all',
  })

  const { summary, payments, paymentsQuery, paymentDetails, walletQuery } = useEarnings(filters)
  const loading = paymentsQuery.loading || walletQuery.loading
  const error = paymentsQuery.error || walletQuery.error

  const failedPayments = payments.filter((payment) => payment.status === 'disputed')

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Earnings</h1>
        <p className="mt-1 text-sm text-zinc-500">Track all income from the platform.</p>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <EarningsSummary {...summary} />

        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 sm:grid-cols-4">
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(value) => setFilters((current) => ({ ...current, status: value as PaymentStatusFilter }))}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'in_escrow', label: 'In escrow' },
              { value: 'awaiting_approval', label: 'Awaiting approval' },
              { value: 'ready_for_payout', label: 'Ready for payout' },
              { value: 'paid', label: 'Paid' },
            ]}
          />
          <FilterSelect
            label="Type"
            value={filters.opportunityType}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                opportunityType: value as EarningsFilters['opportunityType'],
              }))
            }
            options={[
              { value: 'all', label: 'All types' },
              { value: 'UGC_ORDER', label: 'UGC' },
              { value: 'CPM_DEAL', label: 'CPM' },
              { value: 'CONTEST', label: 'Contest' },
            ]}
          />
          <DateFilter
            label="From"
            value={filters.fromDate}
            onChange={(value) => setFilters((current) => ({ ...current, fromDate: value }))}
          />
          <DateFilter
            label="To"
            value={filters.toDate}
            onChange={(value) => setFilters((current) => ({ ...current, toDate: value }))}
          />
        </div>

        {loading && payments.length === 0 ? <EarningsTableSkeleton /> : null}
        {error ? <ErrorState onRetry={() => void paymentsQuery.refetch()} /> : null}

        {!loading && !error && payments.length === 0 ? (
          <EmptyState
            title="No earnings yet"
            description="Submit to live opportunities and get approved to start earning on Stackd."
            action={
              <Link
                to="/dashboard/opportunities"
                className="mt-5 inline-flex h-10 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white"
              >
                Find opportunities
              </Link>
            }
          />
        ) : null}

        {payments.length > 0 ? <EarningsTable payments={payments} /> : null}

        {failedPayments.length > 0 ? (
          <section className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
            <h2 className="text-sm font-semibold text-red-900">Payment issue detected</h2>
            <p className="mt-2 text-sm text-red-800">
              One or more payments need attention. Contact support if this persists.
            </p>
          </section>
        ) : null}

        <PaymentDetailsCard
          details={paymentDetails}
          onEdit={() => {
            window.location.assign('/dashboard/settings?tab=profile')
          }}
        />
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onChange={onChange} options={options} />
    </div>
  )
}

function DateFilter({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type="date" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}

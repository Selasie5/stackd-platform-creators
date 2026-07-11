import * as React from 'react'
import { ArrowDown, ArrowUp, Megaphone, Trophy, Video } from 'lucide-react'
import type {
  CampaignEarningsRow,
  CreatorPaymentRecord,
  EarningsChartPoint,
  EarningsChartRange,
} from '@/lib/dashboard/overview'
import {
  buildEarningsChartSeries,
  computeCampaignEarningsBreakdown,
  computeEarningsTrendPercent,
} from '@/lib/dashboard/overview'
import { formatCurrency } from '@/lib/currency'
import { cn } from '@/lib/utils'

const RANGE_OPTIONS: { value: EarningsChartRange; label: string }[] = [
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: '3m', label: '3M' },
  { value: '1y', label: '1Y' },
]

const campaignIcons = {
  UGC: Video,
  CPM: Megaphone,
  Contest: Trophy,
} as const

interface EarningsChartWidgetProps {
  totalLifetime: number
  currency?: string | null
  payments: CreatorPaymentRecord[]
  locked?: boolean
}

export function EarningsChartWidget({
  totalLifetime,
  currency,
  payments,
  locked = false,
}: EarningsChartWidgetProps) {
  const [range, setRange] = React.useState<EarningsChartRange>('1w')

  const chartData = React.useMemo(
    () => (locked ? [] : buildEarningsChartSeries(payments, range)),
    [locked, payments, range],
  )
  const breakdown = React.useMemo(
    () => (locked ? [] : computeCampaignEarningsBreakdown(payments)),
    [locked, payments],
  )
  const trendPercent = React.useMemo(
    () => (locked ? 0 : computeEarningsTrendPercent(payments, range)),
    [locked, payments, range],
  )

  const trendPositive = trendPercent >= 0

  return (
    <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-zinc-500">Total Earnings</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">
              {locked ? '—' : formatCurrency(totalLifetime, currency)}
            </p>
            {!locked && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  trendPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700',
                )}
              >
                {trendPositive ? '+' : ''}
                {trendPercent}%
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
        >
          Report
        </button>
      </div>

      <div className="mt-4 grid grid-flow-col auto-cols-fr rounded-lg border border-zinc-200 bg-white">
        {RANGE_OPTIONS.map((option) => {
          const active = range === option.value
          return (
            <button
              key={option.value}
              type="button"
              disabled={locked}
              onClick={() => setRange(option.value)}
              className={cn(
                'border-r border-zinc-200 px-2 py-1.5 text-xs font-medium transition-colors last:border-r-0',
                active
                  ? 'border border-zinc-200 bg-white text-zinc-900'
                  : 'text-zinc-500 hover:bg-white',
                locked && 'cursor-not-allowed opacity-60',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        {locked ? (
          <div className="flex h-28 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm text-zinc-400">
            —
          </div>
        ) : (
          <EarningsLineChart data={chartData} />
        )}
      </div>

      <div className="mt-4 space-y-3">
        {breakdown.map((row) => (
          <CampaignBreakdownRow
            key={row.type}
            row={row}
            currency={currency}
            locked={locked}
          />
        ))}
      </div>
    </div>
  )
}

function CampaignBreakdownRow({
  row,
  currency,
  locked,
}: {
  row: CampaignEarningsRow
  currency?: string | null
  locked?: boolean
}) {
  const Icon = campaignIcons[row.type]
  const positive = row.changePercent >= 0

  return (
    <div className="flex items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-zinc-400" />
        <span className="truncate text-sm text-zinc-600">{row.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="min-w-16 text-right text-sm tabular-nums text-zinc-600">
          {locked ? '—' : formatCurrency(row.amount, currency)}
        </span>
        {!locked && (
          <span className="flex min-w-16 items-center justify-end gap-0.5 text-sm tabular-nums text-zinc-600">
            {positive ? (
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-rose-500" />
            )}
            {positive ? '+' : ''}
            {row.changePercent}%
          </span>
        )}
      </div>
    </div>
  )
}

function EarningsLineChart({ data }: { data: EarningsChartPoint[] }) {
  const values = data.map((point) => point.value)
  const hasData = values.some((value) => value > 0)
  const paddedValues = hasData ? values : values.map((_, index) => 20 + index * 8)

  return (
    <div className="relative h-28 overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <ChartGrid />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 112" preserveAspectRatio="none">
        <polyline
          fill="none"
          points={makePoints(paddedValues, 420, 112)}
          stroke="var(--primary)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  )
}

function ChartGrid() {
  return (
    <div className="absolute inset-0 flex flex-col justify-between">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="border-t border-dashed border-zinc-200" />
      ))}
    </div>
  )
}

function makePoints(values: number[], width: number, height: number) {
  if (values.length === 0) return ''

  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const padding = 8

  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width
      const y = height - padding - ((value - min) / range) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')
}

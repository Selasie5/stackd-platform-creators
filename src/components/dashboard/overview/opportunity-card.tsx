import { Link } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import type { LiveOpportunity } from '@/lib/dashboard/overview'
import { cn } from '@/lib/utils'

interface OpportunityCardProps {
  opportunity: LiveOpportunity
  className?: string
}

const typeStyles: Record<LiveOpportunity['type'], string> = {
  UGC: 'border-violet-200 bg-violet-50 text-violet-700',
  CPM: 'border-sky-200 bg-sky-50 text-sky-700',
  Contest: 'border-amber-200 bg-amber-50 text-amber-700',
}

function formatPayoutLine(opportunity: LiveOpportunity) {
  if (opportunity.type === 'Contest') {
    return opportunity.payoutLabel.replace(/prize pool/i, 'in payouts')
  }

  return opportunity.payoutLabel
}

function formatOpportunityDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Open deadline'
  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function OpportunityCard({ opportunity, className }: OpportunityCardProps) {
  const description =
    opportunity.shortDescription.trim() || opportunity.productName.trim() || 'No description provided.'

  return (
    <Link
      to="/dashboard/opportunities"
      className={cn(
        'group flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300',
        className,
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-900">
        <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-white">
          <Sparkles className="h-3.5 w-3.5 text-zinc-900" strokeWidth={2.25} />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold tracking-tight text-zinc-900 group-hover:text-zinc-700">
          {opportunity.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500">{description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
              typeStyles[opportunity.type],
            )}
          >
            {opportunity.type}
          </span>

          <span className="hidden h-1 w-1 rounded-full bg-zinc-300 sm:inline-block" aria-hidden />

          <span className="text-sm font-medium text-zinc-900">{formatPayoutLine(opportunity)}</span>

          <span className="hidden h-1 w-1 rounded-full bg-zinc-300 sm:inline-block" aria-hidden />

          <span className="text-sm text-zinc-500">{formatOpportunityDate(opportunity.deadline)}</span>
        </div>
      </div>
    </Link>
  )
}

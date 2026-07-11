import { Link } from '@tanstack/react-router'
import { Instagram, Youtube } from 'lucide-react'
import { CountdownBadge } from '@/components/opportunities/countdown-badge'
import { Button } from '@/components/ui/button'
import type { BrowseOpportunity } from '@/lib/opportunities/types'
import { formatPlatformLabel } from '@/lib/opportunities/utils'
import { cn } from '@/lib/utils'

interface OpportunityBrowseCardProps {
  opportunity: BrowseOpportunity
}

const typeStyles: Record<BrowseOpportunity['type'], string> = {
  UGC: 'border-violet-200 bg-violet-50 text-violet-700',
  CPM: 'border-sky-200 bg-sky-50 text-sky-700',
  Contest: 'border-amber-200 bg-amber-50 text-amber-700',
}

function PlatformIcon({ platform }: { platform: string | null }) {
  const label = formatPlatformLabel(platform)
  if (!label) return null

  return (
    <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
      {platform === 'instagram' && <Instagram className="h-3.5 w-3.5" />}
      {platform === 'youtube_shorts' && <Youtube className="h-3.5 w-3.5" />}
      {platform === 'tiktok' && <span className="text-[10px] font-bold">TT</span>}
      {label}
    </span>
  )
}

export function OpportunityBrowseCard({ opportunity }: OpportunityBrowseCardProps) {
  const canOpenDetail = opportunity.type === 'Contest' && !opportunity.isClosed

  return (
    <article className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
            typeStyles[opportunity.type],
          )}
        >
          {opportunity.type}
        </span>
        <div className="flex flex-col items-end gap-1">
          {opportunity.isClosed ? (
            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
              Closed
            </span>
          ) : (
            <CountdownBadge deadline={opportunity.deadline} />
          )}
          {opportunity.mySubmissionId && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              Submitted
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{opportunity.title}</h3>
        <p className="text-sm text-zinc-500">{opportunity.brandName}</p>
        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600">{opportunity.shortDescription}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-semibold text-zinc-900">{opportunity.payoutLabel}</span>
        <PlatformIcon platform={opportunity.platform} />
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-5">
        {opportunity.mySubmissionId ? (
          <Button asChild variant="outline" className="w-full">
            <Link to="/dashboard/overview">View submission</Link>
          </Button>
        ) : canOpenDetail ? (
          <Button asChild className="w-full">
            <Link to="/dashboard/contests/$id" params={{ id: opportunity.id }}>
              View details
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            {opportunity.isClosed ? 'Closed' : 'Details coming soon'}
          </Button>
        )}
      </div>
    </article>
  )
}

export function OpportunityBrowseCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-100" />
      <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-zinc-100" />
      <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-zinc-100" />
      <div className="mt-4 h-10 w-full animate-pulse rounded bg-zinc-100" />
      <div className="mt-5 h-9 w-full animate-pulse rounded-lg bg-zinc-100" />
    </div>
  )
}

export function OpportunitiesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <OpportunityBrowseCardSkeleton key={index} />
      ))}
    </div>
  )
}

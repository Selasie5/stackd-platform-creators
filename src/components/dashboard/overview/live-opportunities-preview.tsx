import { Link } from '@tanstack/react-router'
import { ArrowRight, Lock, Sparkles } from 'lucide-react'
import { OpportunityCard } from '@/components/dashboard/overview/opportunity-card'
import type { LiveOpportunity } from '@/lib/dashboard/overview'

interface LiveOpportunitiesPreviewProps {
  opportunities: LiveOpportunity[]
  locked?: boolean
  showSeeAll?: boolean
  hideHeader?: boolean
}

export function LiveOpportunitiesPreview({
  opportunities,
  locked = false,
  showSeeAll = true,
  hideHeader = false,
}: LiveOpportunitiesPreviewProps) {
  const showLockScreen = locked && opportunities.length === 0

  return (
    <section className="space-y-3">
      {!hideHeader && (
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-zinc-700">New opportunities</h2>
          {showSeeAll && (
            <Link
              to="/dashboard/opportunities"
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900"
            >
              See all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}

      {locked && opportunities.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
          <p>Complete verification to apply to these campaigns.</p>
        </div>
      )}

      {showLockScreen ? (
        <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-8 text-center">
          <Lock className="mb-3 h-6 w-6 text-zinc-400" />
          <p className="text-sm font-medium text-zinc-700">Opportunities locked</p>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            Complete verification to browse campaigns and start submitting.
          </p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-8 text-center">
          <Sparkles className="mb-3 h-6 w-6 text-zinc-400" />
          <p className="text-sm font-medium text-zinc-700">No live opportunities right now</p>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            New brand campaigns appear here as they go live. Check back soon.
          </p>
          <Link
            to="/dashboard/opportunities"
            className="mt-4 text-sm font-medium text-zinc-900 underline underline-offset-2"
          >
            Browse opportunities
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={`${opportunity.type}-${opportunity.id}`}
              opportunity={opportunity}
            />
          ))}
        </div>
      )}
    </section>
  )
}

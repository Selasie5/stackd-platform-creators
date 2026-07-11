import { createFileRoute } from '@tanstack/react-router'
import { EarningsSummaryCard } from '@/components/dashboard/overview/earnings-summary-card'
import { LeaderboardPositionList } from '@/components/dashboard/overview/leaderboard-position-list'
import { LiveOpportunitiesPreview } from '@/components/dashboard/overview/live-opportunities-preview'
import { NewCreatorBanner } from '@/components/dashboard/overview/new-creator-banner'
import { RecentActivityList } from '@/components/dashboard/overview/recent-activity-list'
import { StatsRow } from '@/components/dashboard/overview/stats-row'
import { useDashboardOverview } from '@/hooks/use-dashboard-overview'
import { requiresVerification } from '@/lib/kyc'

export const Route = createFileRoute('/dashboard/overview')({
  component: OverviewRoute,
})

function OverviewRoute() {
  const {
    loading,
    kycStatus,
    kycApproved,
    isNewCreator,
    earnings,
    stats,
    leaderboard,
    opportunities,
    recentActivity,
    payments,
  } = useDashboardOverview()

  const locked = requiresVerification(kycStatus)

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 text-sm text-zinc-500">
        Loading your overview…
      </div>
    )
  }

  return (
    <div className="px-5 py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {isNewCreator && kycApproved && <NewCreatorBanner />}

        <StatsRow
          activeSubmissions={stats.activeSubmissions}
          contestsEntered={stats.contestsEntered}
          shortlistedCount={stats.shortlistedCount}
          winRatePercent={stats.winRatePercent}
          locked={locked}
        />

        <EarningsSummaryCard
          totalLifetime={earnings.totalLifetime}
          pendingPayout={earnings.pendingPayout}
          paidOut={earnings.paidOut}
          currency={earnings.currency}
          payments={payments}
          payoutDelayed={earnings.payoutDelayed}
          locked={locked}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col gap-8">
            <LeaderboardPositionList entries={leaderboard} locked={locked} />
            <LiveOpportunitiesPreview opportunities={opportunities} locked={locked} />
          </div>

          <RecentActivityList items={recentActivity} locked={locked} className="min-h-full" />
        </div>
      </div>
    </div>
  )
}

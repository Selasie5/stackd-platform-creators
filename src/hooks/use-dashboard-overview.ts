import { useQuery } from '@apollo/client/react'
import {
  MY_NOTIFICATIONS_QUERY,
  MY_PAYMENTS_QUERY,
  MY_SUBMISSIONS_OVERVIEW_QUERY,
  MY_WITHDRAWALS_QUERY,
} from '@/graphql/dashboard'
import { MY_CREATOR_WALLET_QUERY } from '@/graphql/wallet'
import { useMe } from '@/hooks/use-auth'
import { useLiveOpportunities } from '@/hooks/use-live-opportunities'
import type { CreatorWallet } from '@/hooks/use-wallet'
import {
  buildLeaderboardEntries,
  computeDashboardStats,
  computePendingPayout,
  filterRecentActivity,
  hasDelayedPayout,
  totalSubmissionCount,
  type ContestSubmissionRecord,
  type CreatorPaymentRecord,
  type LeaderboardEntry,
  type RecentActivityItem,
  type SubmissionRecord,
  type WithdrawalRecord,
} from '@/lib/dashboard/overview'
import { isKycApproved, isKycPendingReview } from '@/lib/kyc'
import { resolveCreatorCurrency } from '@/lib/country-currency'
import { parseWalletAmount } from '@/lib/currency'

export function useDashboardOverview() {
  const { data: meData, loading: meLoading } = useMe()
  const kycStatus = meData?.me?.creator?.kycStatus
  const kycApproved = isKycApproved(kycStatus)
  const kycPending = isKycPendingReview(kycStatus)
  const skipData = !kycApproved

  const walletQuery = useQuery<{ myCreatorWallet: CreatorWallet }>(MY_CREATOR_WALLET_QUERY, {
    skip: skipData,
    errorPolicy: 'ignore',
  })

  const withdrawalsQuery = useQuery<{ myWithdrawals: WithdrawalRecord[] }>(MY_WITHDRAWALS_QUERY, {
    skip: skipData,
    errorPolicy: 'ignore',
  })

  const paymentsQuery = useQuery<{ myPayments: CreatorPaymentRecord[] }>(MY_PAYMENTS_QUERY, {
    skip: skipData,
    errorPolicy: 'ignore',
  })

  const submissionsQuery = useQuery<{
    myUgcSubmissions: SubmissionRecord[]
    myCpmSubmissions: SubmissionRecord[]
    myContestSubmissions: ContestSubmissionRecord[]
  }>(MY_SUBMISSIONS_OVERVIEW_QUERY, {
    skip: skipData,
    errorPolicy: 'ignore',
  })

  const {
    allOpportunities,
    opportunities,
    loading: opportunitiesLoading,
  } = useLiveOpportunities()

  const notificationsQuery = useQuery<{ myNotifications: RecentActivityItem[] }>(
    MY_NOTIFICATIONS_QUERY,
    {
      errorPolicy: 'ignore',
    },
  )

  const wallet = walletQuery.data?.myCreatorWallet
  const withdrawals = withdrawalsQuery.data?.myWithdrawals ?? []
  const payments = paymentsQuery.data?.myPayments ?? []
  const ugcSubmissions = submissionsQuery.data?.myUgcSubmissions ?? []
  const cpmSubmissions = submissionsQuery.data?.myCpmSubmissions ?? []
  const contestSubmissions = submissionsQuery.data?.myContestSubmissions ?? []

  const stats = computeDashboardStats(ugcSubmissions, cpmSubmissions, contestSubmissions)
  const submissionCount = totalSubmissionCount(ugcSubmissions, cpmSubmissions, contestSubmissions)
  const isNewCreator = kycApproved && submissionCount === 0

  const contestTitles = new Map<string, string>()
  for (const contest of allOpportunities.filter((item) => item.type === 'Contest')) {
    contestTitles.set(contest.id, contest.title)
  }

  const leaderboard: LeaderboardEntry[] = buildLeaderboardEntries(contestSubmissions, contestTitles)

  const recentActivity = filterRecentActivity(notificationsQuery.data?.myNotifications ?? [])

  const earnings = {
    totalLifetime: parseWalletAmount(wallet?.totalEarned),
    pendingPayout: computePendingPayout(payments, withdrawals),
    paidOut: parseWalletAmount(wallet?.totalWithdrawn),
    currency: resolveCreatorCurrency(wallet?.currency, meData?.me?.creator?.country),
    payoutDelayed: hasDelayedPayout(withdrawals),
  }

  const loading =
    meLoading ||
    opportunitiesLoading ||
    (kycApproved &&
      (walletQuery.loading ||
        withdrawalsQuery.loading ||
        paymentsQuery.loading ||
        submissionsQuery.loading))

  return {
    loading,
    kycStatus,
    kycApproved,
    kycPending,
    isNewCreator,
    earnings,
    stats,
    leaderboard,
    opportunities,
    allOpportunities,
    recentActivity,
    payments,
  }
}

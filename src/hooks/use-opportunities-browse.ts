import { useMutation, useQuery } from '@apollo/client/react'
import {
  CONTEST_DETAIL_QUERY,
  LIVE_OPPORTUNITIES_BROWSE_QUERY,
  MY_CONTEST_SUBMISSIONS_IDS_QUERY,
  SUBMIT_CONTEST_SUBMISSION_MUTATION,
} from '@/graphql/opportunities'
import { useMe } from '@/hooks/use-auth'
import { mergeBrowseOpportunities } from '@/lib/opportunities/merge'
import type { BrowseOpportunity } from '@/lib/opportunities/types'
import { isKycApproved } from '@/lib/kyc'

type BrowseQueryResult = {
  liveUgcOrders: Array<Record<string, string | null | undefined>>
  liveCpmDeals: Array<Record<string, string | null | undefined>>
  liveContests: Array<Record<string, string | null | undefined>>
}

export function useOpportunitiesBrowse() {
  const { data: meData, loading: meLoading } = useMe()
  const isCreator = meData?.me?.role === 'creator'
  const kycApproved = isKycApproved(meData?.me?.creator?.kycStatus)

  const query = useQuery<BrowseQueryResult>(LIVE_OPPORTUNITIES_BROWSE_QUERY, {
    skip: meLoading || !isCreator,
    fetchPolicy: 'cache-and-network',
  })

  const submissionsQuery = useQuery<{ myContestSubmissions: Array<{ id: string; contestId: string }> }>(
    MY_CONTEST_SUBMISSIONS_IDS_QUERY,
    {
      skip: meLoading || !isCreator || !kycApproved,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
  )

  const submissionMap = new Map<string, string>()
  for (const submission of submissionsQuery.data?.myContestSubmissions ?? []) {
    submissionMap.set(submission.contestId, submission.id)
  }

  const opportunities: BrowseOpportunity[] = mergeBrowseOpportunities({
    ugc: (query.data?.liveUgcOrders ?? []) as never,
    cpm: (query.data?.liveCpmDeals ?? []) as never,
    contests: (query.data?.liveContests ?? []) as never,
    contestSubmissions: submissionMap,
  })

  return {
    opportunities,
    loading: meLoading || query.loading,
    error: query.error,
    refetch: query.refetch,
    kycApproved,
    emailVerified: meData?.me?.emailVerified ?? false,
  }
}

export type ContestDetail = {
  id: string
  brandId: string
  brandName?: string | null
  title: string
  productName: string
  shortDescription: string
  fullDescription: string
  externalBriefLink?: string | null
  currency: string
  status: string
  category?: string | null
  videoType?: string | null
  videoLengthSeconds?: number | null
  targetPlatform: string
  requiredHashtags?: string | null
  requiredCaption?: string | null
  requiredBrandTag?: string | null
  postingRequired: boolean
  contestRules?: string | null
  eligibilityRules?: string | null
  usageRightsPackage: string
  productDeliveryDetails?: string | null
  totalContestBudget: string
  cpmBudget?: string | null
  payPer1000Views?: string | null
  maxPayableViewsPerCreator?: number | null
  minimumWinners: number
  submissionDeadline: string
  winnerAnnouncementDate: string
  createdAt: string
  referenceLinks: Array<{
    id: string
    url: string
    label?: string | null
    isInspiration: boolean
  }>
  rewards: Array<{
    id: string
    placement: number
    label?: string | null
    amount: string
    currency: string
  }>
}

export type ContestLeaderboardEntry = {
  rank: number
  submissionId: string
  leaderboardScore: number
  thumbnailUrl?: string | null
  placement?: number | null
  creatorDisplayName: string
  status: string
  createdAt: string
}

export function useContestDetail(contestId: string) {
  const { data: meData } = useMe()
  const kycApproved = isKycApproved(meData?.me?.creator?.kycStatus)

  const query = useQuery<{
    liveContest: ContestDetail
    contestSubmissionCount: number
    contestPublicLeaderboard: ContestLeaderboardEntry[]
  }>(CONTEST_DETAIL_QUERY, {
    variables: { id: contestId },
    skip: !contestId,
    fetchPolicy: 'cache-and-network',
  })

  const submissionsQuery = useQuery<{
    myContestSubmissions: Array<{
      id: string
      contestId: string
      status: string
      placement?: number | null
      leaderboardScore: number
      createdAt: string
    }>
  }>(MY_CONTEST_SUBMISSIONS_IDS_QUERY, {
    skip: !contestId || !kycApproved,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const mySubmission =
    submissionsQuery.data?.myContestSubmissions.find((item) => item.contestId === contestId) ?? null

  return {
    contest: query.data?.liveContest,
    submissionCount: query.data?.contestSubmissionCount ?? 0,
    leaderboard: query.data?.contestPublicLeaderboard ?? [],
    mySubmission,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
    kycApproved,
  }
}

export function useSubmitContestSubmission() {
  const [mutate, state] = useMutation(SUBMIT_CONTEST_SUBMISSION_MUTATION, {
    refetchQueries: ['LiveOpportunitiesBrowse', 'ContestDetail', 'MySubmissionsOverview'],
  })

  return { submitContestSubmission: mutate, ...state }
}

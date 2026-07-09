import { useQuery } from '@apollo/client/react'
import { LIVE_OPPORTUNITIES_QUERY } from '@/graphql/dashboard'
import { useMe } from '@/hooks/use-auth'
import { mergeLiveOpportunities, type LiveOpportunity } from '@/lib/dashboard/overview'

type LiveOpportunitiesQueryResult = {
  liveUgcOrders: Array<{
    id: string
    title: string
    productName: string
    shortDescription: string
    currency: string
    flatRatePerCreator: string
    deadline: string
    createdAt: string
  }>
  liveCpmDeals: Array<{
    id: string
    title: string
    productName: string
    shortDescription: string
    currency: string
    payPer1000Views: string
    postingDeadline: string
    createdAt: string
  }>
  liveContests: Array<{
    id: string
    title: string
    productName: string
    shortDescription: string
    currency: string
    totalContestBudget: string
    submissionDeadline: string
    createdAt: string
  }>
}

export function useLiveOpportunities(options?: { previewLimit?: number }) {
  const { data: meData, loading: meLoading } = useMe()
  const isCreator = meData?.me?.role === 'creator'

  const query = useQuery<LiveOpportunitiesQueryResult>(LIVE_OPPORTUNITIES_QUERY, {
    skip: meLoading || !isCreator,
    fetchPolicy: 'cache-and-network',
  })

  const allOpportunities: LiveOpportunity[] = mergeLiveOpportunities({
    ugc: query.data?.liveUgcOrders ?? [],
    cpm: query.data?.liveCpmDeals ?? [],
    contests: query.data?.liveContests ?? [],
  })

  const previewLimit = options?.previewLimit ?? 4

  return {
    allOpportunities,
    opportunities: allOpportunities.slice(0, previewLimit),
    loading: meLoading || query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

export type OpportunityTypeFilter = 'All' | 'UGC' | 'CPM' | 'Contest'

export type PlatformFilter = 'All' | 'tiktok' | 'instagram' | 'youtube_shorts' | 'any'

export type DeadlineFilter = 'All' | 'this_week' | 'this_month'

export type SortOption = 'newest' | 'highest_payout' | 'ending_soonest'

export interface BrowseOpportunity {
  id: string
  type: 'UGC' | 'CPM' | 'Contest'
  title: string
  brandName: string
  productName: string
  shortDescription: string
  currency: string
  payoutAmount: number
  payoutLabel: string
  deadline: string
  createdAt: string
  platform: string | null
  category: string | null
  status: string
  isClosed: boolean
  mySubmissionId?: string | null
}

export interface OpportunityFilters {
  type: OpportunityTypeFilter
  minPayout: number | null
  platform: PlatformFilter
  category: string
  deadline: DeadlineFilter
}

export const DEFAULT_OPPORTUNITY_FILTERS: OpportunityFilters = {
  type: 'All',
  minPayout: null,
  platform: 'All',
  category: '',
  deadline: 'All',
}

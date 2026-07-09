import type { BrowseOpportunity, SortOption } from '@/lib/opportunities/types'

export function sortOpportunities(items: BrowseOpportunity[], sort: SortOption) {
  const copy = [...items]

  switch (sort) {
    case 'highest_payout':
      return copy.sort((a, b) => b.payoutAmount - a.payoutAmount)
    case 'ending_soonest':
      return copy.sort(
        (a, b) => Date.parse(a.deadline) - Date.parse(b.deadline) || b.payoutAmount - a.payoutAmount,
      )
    case 'newest':
    default:
      return copy.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  }
}

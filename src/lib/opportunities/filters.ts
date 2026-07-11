import type { BrowseOpportunity, OpportunityFilters } from '@/lib/opportunities/types'

function startOfWeek(date: Date) {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function endOfWeek(date: Date) {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return end
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

export function filterOpportunities(
  items: BrowseOpportunity[],
  filters: OpportunityFilters,
  now = Date.now(),
) {
  return items.filter((item) => {
    if (filters.type !== 'All' && item.type !== filters.type) return false

    if (filters.minPayout != null && item.payoutAmount < filters.minPayout) return false

    if (filters.platform !== 'All') {
      if (!item.platform || (item.platform !== filters.platform && item.platform !== 'any')) {
        return false
      }
    }

    if (filters.category.trim()) {
      const category = item.category?.toLowerCase() ?? ''
      if (!category.includes(filters.category.trim().toLowerCase())) return false
    }

    if (filters.deadline !== 'All') {
      const deadline = Date.parse(item.deadline)
      if (!Number.isFinite(deadline)) return false
      const date = new Date(deadline)

      if (filters.deadline === 'this_week') {
        if (deadline < now || deadline > endOfWeek(new Date(now)).getTime()) return false
      }

      if (filters.deadline === 'this_month') {
        if (deadline < now || deadline > endOfMonth(new Date(now)).getTime()) return false
      }
    }

    return true
  })
}

export function hasActiveFilters(filters: OpportunityFilters) {
  return (
    filters.type !== 'All' ||
    filters.minPayout != null ||
    filters.platform !== 'All' ||
    filters.category.trim().length > 0 ||
    filters.deadline !== 'All'
  )
}

export function collectCategories(items: BrowseOpportunity[]) {
  const values = new Set<string>()
  for (const item of items) {
    if (item.category?.trim()) values.add(item.category.trim())
  }
  return [...values].sort((a, b) => a.localeCompare(b))
}

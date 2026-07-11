import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SlidersHorizontal } from 'lucide-react'
import {
  DEFAULT_OPPORTUNITY_FILTERS,
  OpportunityFilterSidebar,
} from '@/components/opportunities/opportunity-filter-sidebar'
import {
  OpportunityBrowseCard,
  OpportunitiesGridSkeleton,
} from '@/components/opportunities/opportunity-browse-card'
import { SortBar } from '@/components/opportunities/sort-bar'
import { Button } from '@/components/ui/button'
import { useOpportunitiesBrowse } from '@/hooks/use-opportunities-browse'
import { collectCategories, filterOpportunities, hasActiveFilters } from '@/lib/opportunities/filters'
import { sortOpportunities } from '@/lib/opportunities/sort'
import type { OpportunityFilters, SortOption } from '@/lib/opportunities/types'

export const Route = createFileRoute('/dashboard/opportunities')({
  component: OpportunitiesRoute,
})

function OpportunitiesRoute() {
  const { opportunities, loading, refetch } = useOpportunitiesBrowse()
  const [filters, setFilters] = React.useState<OpportunityFilters>(DEFAULT_OPPORTUNITY_FILTERS)
  const [sort, setSort] = React.useState<SortOption>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)

  const categories = React.useMemo(() => collectCategories(opportunities), [opportunities])
  const filtered = React.useMemo(
    () => sortOpportunities(filterOpportunities(opportunities, filters), sort),
    [filters, opportunities, sort],
  )
  const filtersActive = hasActiveFilters(filters)

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Opportunities</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Browse live campaigns from brands and submit your work.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="lg:hidden"
          onClick={() => setMobileFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {filtersActive && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-sm text-zinc-700">Filters are active.</p>
          <Button type="button" variant="ghost" size="sm" onClick={() => setFilters(DEFAULT_OPPORTUNITY_FILTERS)}>
            Clear filters
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className={mobileFiltersOpen ? 'block' : 'hidden lg:block'}>
          <OpportunityFilterSidebar
            filters={filters}
            categories={categories}
            onChange={setFilters}
            onClear={() => setFilters(DEFAULT_OPPORTUNITY_FILTERS)}
            showClear={filtersActive}
          />
        </div>

        <div className="space-y-5">
          <SortBar value={sort} onChange={setSort} resultCount={filtered.length} />

          {loading ? (
            <OpportunitiesGridSkeleton />
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-16 text-center">
              <p className="text-sm font-medium text-zinc-700">No opportunities matching your filters</p>
              <p className="mt-1 text-sm text-zinc-500">
                Try clearing filters or check back later for new campaigns.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {filtersActive && (
                  <Button type="button" variant="outline" onClick={() => setFilters(DEFAULT_OPPORTUNITY_FILTERS)}>
                    Clear filters
                  </Button>
                )}
                <Button type="button" variant="ghost" onClick={() => void refetch()}>
                  Refresh
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filtered.map((opportunity) => (
                <OpportunityBrowseCard key={`${opportunity.type}-${opportunity.id}`} opportunity={opportunity} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import * as React from 'react'
import { Button, primaryButtonClasses } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DEFAULT_OPPORTUNITY_FILTERS,
  type DeadlineFilter,
  type OpportunityFilters,
  type OpportunityTypeFilter,
  type PlatformFilter,
} from '@/lib/opportunities/types'
import { cn } from '@/lib/utils'

interface OpportunityFilterSidebarProps {
  filters: OpportunityFilters
  categories: string[]
  onChange: (filters: OpportunityFilters) => void
  onClear: () => void
  showClear: boolean
  className?: string
}

const TYPE_OPTIONS: OpportunityTypeFilter[] = ['All', 'UGC', 'CPM', 'Contest']
const PLATFORM_OPTIONS: Array<{ value: PlatformFilter; label: string }> = [
  { value: 'All', label: 'All platforms' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube_shorts', label: 'YouTube' },
]
const DEADLINE_OPTIONS: Array<{ value: DeadlineFilter; label: string }> = [
  { value: 'All', label: 'Any time' },
  { value: 'this_week', label: 'This week' },
  { value: 'this_month', label: 'This month' },
]

export function OpportunityFilterSidebar({
  filters,
  categories,
  onChange,
  onClear,
  showClear,
  className,
}: OpportunityFilterSidebarProps) {
  return (
    <aside className={cn('space-y-6 rounded-xl border border-zinc-200 bg-white p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-900">Filters</h2>
        {showClear && (
          <Button type="button" variant="ghost" size="sm" onClick={onClear} className="h-8 px-2 text-xs">
            Clear all
          </Button>
        )}
      </div>

      <FilterSection title="Opportunity type">
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((option) => (
            <FilterChip
              key={option}
              active={filters.type === option}
              onClick={() => onChange({ ...filters, type: option })}
              label={option}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Minimum payout">
        <Input
          type="number"
          min={0}
          placeholder="e.g. 5000"
          value={filters.minPayout ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              minPayout: event.target.value ? Number(event.target.value) : null,
            })
          }
        />
      </FilterSection>

      <FilterSection title="Platform">
        <div className="flex flex-col gap-2">
          {PLATFORM_OPTIONS.map((option) => (
            <FilterChip
              key={option.value}
              active={filters.platform === option.value}
              onClick={() => onChange({ ...filters, platform: option.value })}
              label={option.label}
              fullWidth
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Industry / category">
        <Input
          list="opportunity-categories"
          placeholder="Search category"
          value={filters.category}
          onChange={(event) => onChange({ ...filters, category: event.target.value })}
        />
        <datalist id="opportunity-categories">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
      </FilterSection>

      <FilterSection title="Deadline">
        <div className="flex flex-col gap-2">
          {DEADLINE_OPTIONS.map((option) => (
            <FilterChip
              key={option.value}
              active={filters.deadline === option.value}
              onClick={() => onChange({ ...filters, deadline: option.value })}
              label={option.label}
              fullWidth
            />
          ))}
        </div>
      </FilterSection>

      {showClear && (
        <Button type="button" variant="outline" className="w-full" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </aside>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      {children}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
  fullWidth = false,
}: {
  label: string
  active: boolean
  onClick: () => void
  fullWidth?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-colors',
        fullWidth && 'w-full',
        active
          ? cn('border-primary', primaryButtonClasses)
          : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
      )}
    >
      {label}
    </button>
  )
}

export { DEFAULT_OPPORTUNITY_FILTERS }

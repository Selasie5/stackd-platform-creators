import type { SortOption } from '@/lib/opportunities/types'
import { primaryButtonClasses } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'highest_payout', label: 'Highest payout' },
  { value: 'ending_soonest', label: 'Ending soonest' },
]

interface SortBarProps {
  value: SortOption
  onChange: (value: SortOption) => void
  resultCount: number
}

export function SortBar({ value, onChange, resultCount }: SortBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-500">
        {resultCount} {resultCount === 1 ? 'opportunity' : 'opportunities'}
      </p>
      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              value === option.value
                ? cn('border-primary', primaryButtonClasses)
                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

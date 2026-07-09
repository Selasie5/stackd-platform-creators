import { cn } from '@/lib/utils'
import type { SubmissionTab } from '@/lib/submissions/types'

const tabs: { id: SubmissionTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'contests', label: 'Contests' },
  { id: 'ugc', label: 'UGC Orders' },
  { id: 'cpm', label: 'CPM Deals' },
]

export function SubmissionTabs({
  value,
  onChange,
}: {
  value: SubmissionTab
  onChange: (tab: SubmissionTab) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            value === tab.id
              ? 'bg-zinc-900 text-white'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

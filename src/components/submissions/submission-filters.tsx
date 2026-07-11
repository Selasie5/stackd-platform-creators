import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type { SubmissionFilters, SubmissionStatus } from '@/lib/submissions/types'
import { SUBMISSION_STATUS_CONFIG } from '@/lib/submissions/status-config'

const statusOptions: Array<{ value: SubmissionStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All statuses' },
  ...Object.entries(SUBMISSION_STATUS_CONFIG).map(([value, config]) => ({
    value: value as SubmissionStatus,
    label: config.label,
  })),
]

export function SubmissionFiltersBar({
  filters,
  onChange,
}: {
  filters: SubmissionFilters
  onChange: (next: SubmissionFilters) => void
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="submission-status">Status</Label>
        <Select
          id="submission-status"
          value={filters.status}
          onChange={(value) =>
            onChange({ ...filters, status: value as SubmissionFilters['status'] })
          }
          options={statusOptions}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="submission-from">From</Label>
        <Input
          id="submission-from"
          type="date"
          value={filters.fromDate}
          onChange={(event) => onChange({ ...filters, fromDate: event.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="submission-to">To</Label>
        <Input
          id="submission-to"
          type="date"
          value={filters.toDate}
          onChange={(event) => onChange({ ...filters, toDate: event.target.value })}
        />
      </div>
    </div>
  )
}

import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SubmissionFiltersBar } from '@/components/submissions/submission-filters'
import { SubmissionListItem } from '@/components/submissions/submission-list-item'
import { SubmissionTabs } from '@/components/submissions/submission-tabs'
import { EmptyState, ErrorState } from '@/components/ui/empty-state'
import { SubmissionListSkeleton } from '@/components/ui/skeleton'
import { useFilteredSubmissions } from '@/hooks/use-submissions'
import type { SubmissionFilters, SubmissionTab } from '@/lib/submissions/types'

export const Route = createFileRoute('/dashboard/submissions')({
  component: SubmissionsPage,
})

function SubmissionsPage() {
  const [tab, setTab] = React.useState<SubmissionTab>('all')
  const [filters, setFilters] = React.useState<SubmissionFilters>({
    status: 'all',
    fromDate: '',
    toDate: '',
  })

  const { submissions, loading, error, refetch } = useFilteredSubmissions(tab, filters)

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">My submissions</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track every submission across contests, UGC orders, and CPM deals.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <SubmissionTabs value={tab} onChange={setTab} />
        <SubmissionFiltersBar filters={filters} onChange={setFilters} />

        {loading && !submissions.length ? <SubmissionListSkeleton /> : null}
        {error ? <ErrorState onRetry={() => void refetch()} /> : null}

        {!loading && !error && submissions.length === 0 ? (
          <EmptyState
            title="No submissions yet"
            description="Browse live opportunities and submit your first video to start tracking progress here."
            actionLabel="Browse opportunities"
            onAction={() => {}}
            action={
              <Link
                to="/dashboard/opportunities"
                className="mt-5 inline-flex h-10 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white"
              >
                Browse opportunities
              </Link>
            }
          />
        ) : null}

        <div className="space-y-3">
          {submissions.map((submission) => (
            <SubmissionListItem key={submission.id} submission={submission} />
          ))}
        </div>
      </div>
    </div>
  )
}

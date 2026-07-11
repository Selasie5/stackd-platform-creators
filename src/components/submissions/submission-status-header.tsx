import { StatusBadge } from '@/components/ui/status-badge'
import type { UnifiedSubmission } from '@/lib/submissions/types'

const STATUS_MESSAGES: Partial<Record<UnifiedSubmission['status'], string>> = {
  submitted: 'Your submission has been received and is waiting for the brand to review it.',
  under_review: 'The brand is currently reviewing your submission.',
  revision_requested: 'The brand has requested changes. Please review their feedback and resubmit.',
  resubmitted: 'Your revised submission is waiting for review.',
  shortlisted: 'Great news — you have been shortlisted. Final selection is still in progress.',
  winner: 'Congratulations! You were selected as a winner for this campaign.',
  approved: 'Your submission has been approved.',
  rejected: 'This submission was not accepted.',
  disqualified: 'This submission was disqualified from the campaign.',
  paid: 'Payment for this submission has been confirmed.',
}

export function SubmissionStatusHeader({ submission }: { submission: UnifiedSubmission }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Current status</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            {submission.opportunityTitle}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{submission.brandName ?? 'Brand'}</p>
        </div>
        <StatusBadge status={submission.status} prominent={submission.status === 'revision_requested'} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-zinc-600">
        {STATUS_MESSAGES[submission.status] ?? 'Track your submission status here.'}
      </p>
    </section>
  )
}

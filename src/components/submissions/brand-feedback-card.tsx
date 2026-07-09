import type { UnifiedSubmission } from '@/lib/submissions/types'

export function BrandFeedbackCard({ submission }: { submission: UnifiedSubmission }) {
  if (submission.status === 'revision_requested' && submission.revisionNote) {
    return (
      <section className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
        <h2 className="text-sm font-semibold text-orange-900">Revision requested</h2>
        <p className="mt-2 text-sm leading-relaxed text-orange-900/90">{submission.revisionNote}</p>
      </section>
    )
  }

  if (submission.status === 'approved' || submission.status === 'winner') {
    return (
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
        <h2 className="text-sm font-semibold text-emerald-900">Approved</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/90">
          The brand has approved your submission. Payout details will appear below when available.
        </p>
      </section>
    )
  }

  if (submission.status === 'rejected' || submission.status === 'disqualified') {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
        <h2 className="text-sm font-semibold text-red-900">
          {submission.status === 'disqualified' ? 'Disqualified' : 'Rejected'}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-red-900/90">
          {submission.revisionNote ??
            'The brand did not accept this submission. You can explore other opportunities to keep creating.'}
        </p>
      </section>
    )
  }

  return null
}

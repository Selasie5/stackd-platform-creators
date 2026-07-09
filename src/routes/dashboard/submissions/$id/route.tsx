import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { BrandFeedbackCard } from '@/components/submissions/brand-feedback-card'
import { PayoutStatusCard } from '@/components/submissions/payout-status-card'
import { ResubmitForm } from '@/components/submissions/resubmit-form'
import { SubmissionStatusHeader } from '@/components/submissions/submission-status-header'
import { Button } from '@/components/ui/button'
import { EmptyState, ErrorState } from '@/components/ui/empty-state'
import { SubmissionListSkeleton } from '@/components/ui/skeleton'
import { findSubmission, kindLabel } from '@/lib/submissions/normalize'
import { useMySubmissions } from '@/hooks/use-submissions'

const searchSchema = z.object({
  kind: z.enum(['ugc', 'cpm', 'contest']).optional(),
})

export const Route = createFileRoute('/dashboard/submissions/$id')({
  validateSearch: searchSchema,
  component: SubmissionDetailPage,
})

function SubmissionDetailPage() {
  const { id } = Route.useParams()
  const { kind } = Route.useSearch()
  const { allSubmissions, loading, error, refetch } = useMySubmissions()

  const submission = findSubmission(allSubmissions, id)

  if (loading && !submission) return <SubmissionListSkeleton />
  if (error) return <ErrorState onRetry={() => void refetch()} />

  if (!submission) {
    return (
      <div className="p-6 sm:p-8">
        <EmptyState
          title="Submission not found"
          description="This submission may have been removed or you no longer have access."
          action={
            <Button asChild>
              <Link to="/dashboard/submissions">Back to submissions</Link>
            </Button>
          }
        />
      </div>
    )
  }

  if (kind && submission.kind !== kind) {
    // still show if found by id
  }

  const videoSrc =
    submission.videoUrl ?? submission.videoLink ?? submission.postedVideoLink ?? undefined

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard/submissions">← Back to submissions</Link>
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <SubmissionStatusHeader submission={submission} />
        <BrandFeedbackCard submission={submission} />

        {videoSrc ? (
          <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-black">
            <video controls className="aspect-video w-full bg-black" poster={submission.thumbnailUrl ?? undefined}>
              <source src={videoSrc} />
            </video>
          </section>
        ) : null}

        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-900">Submission details</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Detail label="Type" value={kindLabel(submission.kind)} />
            <Detail
              label="Submitted"
              value={new Date(submission.createdAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            />
            {submission.platform ? <Detail label="Platform" value={submission.platform} /> : null}
            {submission.submittedViews != null ? (
              <Detail label="Views submitted" value={String(submission.submittedViews)} />
            ) : null}
            {submission.leaderboardScore != null ? (
              <Detail label="Leaderboard score" value={String(submission.leaderboardScore)} />
            ) : null}
            {submission.placement != null ? (
              <Detail label="Leaderboard position" value={`#${submission.placement}`} />
            ) : null}
            {submission.submissionNote ? (
              <div className="sm:col-span-2">
                <Detail label="Your note" value={submission.submissionNote} />
              </div>
            ) : null}
          </dl>
        </section>

        {submission.kind === 'contest' && submission.placement != null ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <h2 className="text-sm font-semibold text-amber-900">Leaderboard position</h2>
            <p className="mt-2 text-3xl font-semibold text-amber-950">#{submission.placement}</p>
          </section>
        ) : null}

        <PayoutStatusCard submission={submission} />

        {submission.status === 'revision_requested' && submission.kind === 'ugc' ? (
          <ResubmitForm submissionId={submission.id} />
        ) : null}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm text-zinc-900">{value}</dd>
    </div>
  )
}

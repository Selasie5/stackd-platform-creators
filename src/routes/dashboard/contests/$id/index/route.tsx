import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ContestBoardPreview,
  ContestCountdown,
  ContestHeader,
  ContestLeaderboard,
  ContestSection,
  InspirationReel,
  PrizeBreakdown,
  StickySubmitButton,
} from '@/components/contests/contest-detail-sections'
import { Button } from '@/components/ui/button'
import { useContestDetail } from '@/hooks/use-opportunities-browse'
import { isOpportunityClosed } from '@/lib/opportunities/utils'

export const Route = createFileRoute('/dashboard/contests/$id/')({
  component: ContestDetailRoute,
})

function ContestDetailRoute() {
  const { id } = Route.useParams()
  const { contest, submissionCount, leaderboard, mySubmission, loading, error, kycApproved } =
    useContestDetail(id)

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 text-sm text-zinc-500">
        Loading contest…
      </div>
    )
  }

  if (error || !contest) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-sm text-zinc-500">This contest could not be loaded.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard/opportunities">Back to opportunities</Link>
        </Button>
      </div>
    )
  }

  const closed = isOpportunityClosed(contest.submissionDeadline, contest.status)

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 pb-28 lg:pb-6">
      <div className="mb-6">
        <Link to="/dashboard/opportunities" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">
          ← Back to opportunities
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <ContestHeader contest={contest} closed={closed} />

          <ContestSection title="About this contest">
            <p>{contest.fullDescription}</p>
          </ContestSection>

          <ContestSection title="What to create">
            <ul className="list-disc space-y-2 pl-5">
              {contest.videoType && <li>Video type: {contest.videoType.replace(/_/g, ' ')}</li>}
              {contest.videoLengthSeconds && <li>Length: up to {contest.videoLengthSeconds} seconds</li>}
              {contest.productDeliveryDetails && <li>{contest.productDeliveryDetails}</li>}
            </ul>
          </ContestSection>

          {(contest.requiredHashtags || contest.requiredCaption || contest.requiredBrandTag) && (
            <ContestSection title="What to say / avoid">
              {contest.requiredHashtags && <p>Required hashtags: {contest.requiredHashtags}</p>}
              {contest.requiredCaption && <p>Required caption: {contest.requiredCaption}</p>}
              {contest.requiredBrandTag && <p>Brand tag: {contest.requiredBrandTag}</p>}
            </ContestSection>
          )}

          {contest.postingRequired && (
            <ContestSection title="Posting instructions">
              <p>Posting is required for this contest. Include your live post link when submitting.</p>
            </ContestSection>
          )}

          <ContestSection title="Inspiration">
            <InspirationReel links={contest.referenceLinks} />
          </ContestSection>

          {contest.contestRules && (
            <ContestSection title="Contest rules">
              <p>{contest.contestRules}</p>
            </ContestSection>
          )}

          {contest.eligibilityRules && (
            <ContestSection title="Eligibility rules">
              <p>{contest.eligibilityRules}</p>
            </ContestSection>
          )}

          <ContestSection title="Live leaderboard">
            <ContestLeaderboard entries={leaderboard} />
          </ContestSection>

          <ContestSection title="Contest board preview">
            <ContestBoardPreview entries={leaderboard} />
          </ContestSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-900">Prize breakdown</h2>
            <div className="mt-4">
              <PrizeBreakdown contest={contest} />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <ContestCountdown contest={contest} closed={closed} />
            <p className="mt-4 text-sm text-zinc-500">
              {submissionCount} {submissionCount === 1 ? 'submission' : 'submissions'} so far
            </p>
          </div>

          <StickySubmitButton
            closed={closed}
            kycApproved={kycApproved}
            mySubmissionId={mySubmission?.id}
            contestId={contest.id}
          />
        </aside>
      </div>
    </div>
  )
}

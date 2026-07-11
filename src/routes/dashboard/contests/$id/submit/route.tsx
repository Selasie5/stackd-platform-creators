import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  BriefReminder,
  PostingDetailsSection,
  SubmissionConfirmations,
  VideoUploadToggle,
} from '@/components/contests/contest-submit-form'
import { Button } from '@/components/ui/button'
import { useContestDetail, useSubmitContestSubmission } from '@/hooks/use-opportunities-browse'
import { extractGqlError } from '@/lib/gql-error'
import { isOpportunityClosed } from '@/lib/opportunities/utils'

export const Route = createFileRoute('/dashboard/contests/$id/submit')({
  component: ContestSubmitRoute,
})

function ContestSubmitRoute() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { contest, mySubmission, loading, kycApproved } = useContestDetail(id)
  const { submitContestSubmission, loading: submitting } = useSubmitContestSubmission()

  const [mode, setMode] = React.useState<'file' | 'link'>('link')
  const [videoUrl, setVideoUrl] = React.useState('')
  const [videoLink, setVideoLink] = React.useState('')
  const [submissionNote, setSubmissionNote] = React.useState('')
  const [postedVideoLink, setPostedVideoLink] = React.useState('')
  const [platform, setPlatform] = React.useState('tiktok')
  const [submittedViews, setSubmittedViews] = React.useState('0')
  const [engagementCount, setEngagementCount] = React.useState('0')
  const [confirmations, setConfirmations] = React.useState({
    confirmedFollowsBrief: false,
    confirmedOriginal: false,
    confirmedNoFakeEngagement: false,
    agreedToUsageRights: false,
  })
  const [formMessage, setFormMessage] = React.useState<{ type: 'error' | 'success'; text: string } | null>(
    null,
  )
  const [submitted, setSubmitted] = React.useState(false)

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 text-sm text-zinc-500">
        Loading submission form…
      </div>
    )
  }

  if (!contest) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-sm text-zinc-500">Contest not found.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard/opportunities">Back to opportunities</Link>
        </Button>
      </div>
    )
  }

  if (!kycApproved) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-sm text-zinc-500">Verify your student status before submitting to contests.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard/settings">Complete verification</Link>
        </Button>
      </div>
    )
  }

  if (mySubmission) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-sm font-medium text-zinc-700">You have already submitted to this contest.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard/overview">View my submission</Link>
        </Button>
      </div>
    )
  }

  const closed = isOpportunityClosed(contest.submissionDeadline, contest.status)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormMessage(null)

    if (closed) {
      const message = 'The submission deadline has passed.'
      setFormMessage({ type: 'error', text: message })
      toast.error(message)
      return
    }

    if (!Object.values(confirmations).every(Boolean)) {
      const message = 'Please confirm all required checkboxes.'
      setFormMessage({ type: 'error', text: message })
      toast.error(message)
      return
    }

    const resolvedVideoLink = mode === 'link' ? videoLink.trim() : undefined
    const resolvedVideoUrl = mode === 'file' ? videoUrl.trim() : undefined

    if (!resolvedVideoLink && !resolvedVideoUrl) {
      const message = 'Add a video link or upload URL before submitting.'
      setFormMessage({ type: 'error', text: message })
      toast.error(message)
      return
    }

    try {
      const result = await submitContestSubmission({
        variables: {
          input: {
            contestId: id,
            videoUrl: resolvedVideoUrl,
            videoLink: resolvedVideoLink,
            submissionNote: submissionNote || undefined,
            postedVideoLink: contest.postingRequired ? postedVideoLink || undefined : undefined,
            platform: contest.postingRequired ? platform : undefined,
            submittedViews: contest.postingRequired ? Number(submittedViews) : undefined,
            engagementCount: contest.postingRequired ? Number(engagementCount) : undefined,
            ...confirmations,
          },
        },
      })

      if (!result.data?.submitContestSubmission) {
        throw new Error('Submission did not complete. Please try again.')
      }

      setSubmitted(true)
      setFormMessage({ type: 'success', text: 'Your contest entry was submitted successfully.' })
      toast.success('Contest entry submitted successfully.')
      window.setTimeout(() => {
        navigate({ to: '/dashboard/contests/$id', params: { id } })
      }, 1200)
    } catch (error) {
      const message = extractGqlError(error)
      setFormMessage({ type: 'error', text: message })
      toast.error(message)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          ✓
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900">Entry submitted</h1>
        <p className="mt-2 text-sm text-zinc-500">Redirecting you back to the contest…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-6">
        <Link to="/dashboard/contests/$id" params={{ id }} className="text-sm font-medium text-zinc-500 hover:text-zinc-900">
          ← Back to contest
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Submit your entry</h1>
        <p className="mt-1 text-sm text-zinc-500">{contest.title}</p>
      </div>

      <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
        {formMessage && (
          <div
            className={
              formMessage.type === 'error'
                ? 'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'
                : 'rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800'
            }
          >
            {formMessage.text}
          </div>
        )}

        <BriefReminder contest={contest} />

        <VideoUploadToggle
          mode={mode}
          onModeChange={setMode}
          videoUrl={videoUrl}
          videoLink={videoLink}
          onVideoUrlChange={setVideoUrl}
          onVideoLinkChange={setVideoLink}
        />

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-zinc-700">Submission note (optional)</span>
          <textarea
            value={submissionNote}
            onChange={(event) => setSubmissionNote(event.target.value)}
            className="min-h-24 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            placeholder="Anything you want the brand to know"
          />
        </label>

        <PostingDetailsSection
          postingRequired={contest.postingRequired}
          postedVideoLink={postedVideoLink}
          platform={platform}
          submittedViews={submittedViews}
          engagementCount={engagementCount}
          onPostedVideoLinkChange={setPostedVideoLink}
          onPlatformChange={setPlatform}
          onSubmittedViewsChange={setSubmittedViews}
          onEngagementCountChange={setEngagementCount}
        />

        <SubmissionConfirmations
          values={confirmations}
          onChange={(key, value) => setConfirmations((current) => ({ ...current, [key]: value }))}
        />

        <Button type="submit" className="w-full" isLoading={submitting} disabled={closed}>
          {closed ? 'Submissions closed' : 'Submit entry'}
        </Button>
      </form>
    </div>
  )
}

import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { CountdownBadge } from '@/components/opportunities/countdown-badge'
import type { ContestDetail } from '@/hooks/use-opportunities-browse'
import { formatPlatformLabel } from '@/lib/opportunities/utils'
import { cn } from '@/lib/utils'

interface ContestHeaderProps {
  contest: ContestDetail
  closed: boolean
}

export function ContestHeader({ contest, closed }: ContestHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
            closed
              ? 'border-zinc-200 bg-zinc-100 text-zinc-600'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700',
          )}
        >
          {closed ? 'Closed' : contest.status}
        </span>
        {contest.category && (
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600">
            {contest.category}
          </span>
        )}
        {formatPlatformLabel(contest.targetPlatform) && (
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600">
            {formatPlatformLabel(contest.targetPlatform)}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-500">{contest.brandName ?? contest.productName}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">{contest.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600">{contest.shortDescription}</p>
      </div>

      <CountdownBadge deadline={contest.submissionDeadline} closed={closed} />
    </header>
  )
}

export function ContestSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
      <div className="text-sm leading-relaxed text-zinc-600">{children}</div>
    </section>
  )
}

export function InspirationReel({
  links,
}: {
  links: ContestDetail['referenceLinks']
}) {
  const items = links.filter((link) => link.isInspiration || link.url)

  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">No inspiration links provided yet.</p>
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {items.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="min-w-[220px] rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:border-zinc-300"
        >
          <p className="text-sm font-medium text-zinc-900">{link.label ?? 'Reference video'}</p>
          <p className="mt-1 truncate text-xs text-zinc-500">{link.url}</p>
        </a>
      ))}
    </div>
  )
}

export function PrizeBreakdown({ contest }: { contest: ContestDetail }) {
  return (
    <div className="space-y-3">
      {contest.rewards
        .slice()
        .sort((a, b) => a.placement - b.placement)
        .map((reward) => (
          <div key={reward.id} className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2">
            <span className="text-sm text-zinc-600">
              {reward.label ?? `#${reward.placement}`}
            </span>
            <span className="text-sm font-semibold text-zinc-900">
              {reward.currency} {reward.amount}
            </span>
          </div>
        ))}
      {contest.payPer1000Views && (
        <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-2 text-sm text-zinc-600">
          CPM bonus: {contest.currency} {contest.payPer1000Views} / 1k views
        </div>
      )}
    </div>
  )
}

export function ContestCountdown({
  contest,
  closed,
}: {
  contest: ContestDetail
  closed: boolean
}) {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="text-zinc-500">Submission deadline</p>
        <div className="mt-1">
          <CountdownBadge deadline={contest.submissionDeadline} closed={closed} />
        </div>
      </div>
      <div>
        <p className="text-zinc-500">Winners announced</p>
        <p className="mt-1 font-medium text-zinc-900">
          {new Date(contest.winnerAnnouncementDate).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  )
}

export function ContestLeaderboard({
  entries,
}: {
  entries: Array<{
    rank: number
    creatorDisplayName: string
    leaderboardScore: number
    placement?: number | null
  }>
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-10 text-center">
        <p className="text-sm font-medium text-zinc-700">No submissions yet</p>
        <p className="mt-1 text-sm text-zinc-500">Be the first creator to enter this contest.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Creator</th>
            <th className="px-4 py-3">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.rank} className="border-t border-zinc-100">
              <td className="px-4 py-3 font-medium text-zinc-900">#{entry.rank}</td>
              <td className="px-4 py-3 text-zinc-600">{entry.creatorDisplayName}</td>
              <td className="px-4 py-3 tabular-nums text-zinc-900">{entry.leaderboardScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ContestBoardPreview({
  entries,
}: {
  entries: Array<{ submissionId: string; thumbnailUrl?: string | null; creatorDisplayName: string }>
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-10 text-center">
        <p className="text-sm text-zinc-500">Contest board will appear here once submissions roll in.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {entries.slice(0, 8).map((entry) => (
        <div key={entry.submissionId} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="aspect-[9/16] rounded-lg bg-zinc-200" />
          <p className="mt-2 truncate text-xs font-medium text-zinc-700">{entry.creatorDisplayName}</p>
        </div>
      ))}
    </div>
  )
}

interface StickySubmitButtonProps {
  closed: boolean
  kycApproved: boolean
  mySubmissionId?: string | null
  contestId: string
}

export function StickySubmitButton({
  closed,
  kycApproved,
  mySubmissionId,
  contestId,
}: StickySubmitButtonProps) {
  let content

  if (mySubmissionId) {
    content = (
      <Button asChild variant="outline" className="w-full">
        <Link to="/dashboard/overview">View my submission</Link>
      </Button>
    )
  } else if (closed) {
    content = (
      <Button disabled className="w-full">
        Submissions closed
      </Button>
    )
  } else if (!kycApproved) {
    content = (
      <Button asChild variant="outline" className="w-full">
        <Link to="/dashboard/settings">Verify your student status to enter</Link>
      </Button>
    )
  } else {
    content = (
      <Button asChild className="w-full">
        <Link to="/dashboard/contests/$id/submit" params={{ id: contestId }}>
          Submit entry
        </Link>
      </Button>
    )
  }

  return (
    <>
      <div className="hidden lg:block">{content}</div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white p-4 lg:hidden">{content}</div>
    </>
  )
}

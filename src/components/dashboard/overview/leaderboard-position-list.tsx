import { Trophy } from 'lucide-react'
import type { LeaderboardEntry } from '@/lib/dashboard/overview'
import { cn } from '@/lib/utils'

interface LeaderboardPositionListProps {
  entries: LeaderboardEntry[]
  locked?: boolean
}

export function LeaderboardPositionList({ entries, locked = false }: LeaderboardPositionListProps) {
  const showPlaceholder = locked || entries.length === 0

  return (
    <section className={cn('space-y-3', locked && 'opacity-60')}>
      <h2 className="text-sm font-medium text-zinc-700">Leaderboard</h2>

      {showPlaceholder ? (
        <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-8 text-center">
          <Trophy className="mb-3 h-6 w-6 text-zinc-400" />
          <p className="text-sm text-zinc-500">
            {locked
              ? 'Rankings unlock after verification.'
              : 'Enter a contest to see your leaderboard position here.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <ul className="divide-y divide-zinc-100">
            {entries.map((entry) => (
              <li key={entry.contestId} className="flex items-center gap-4 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
                  {entry.position != null ? `#${entry.position}` : '—'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">{entry.contestName}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">Contest</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-900 tabular-nums">{entry.score}</p>
                  <p className="text-xs text-zinc-500">Score</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

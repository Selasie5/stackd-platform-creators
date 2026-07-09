import { cn } from '@/lib/utils'

interface StatsRowProps {
  activeSubmissions: number
  contestsEntered: number
  shortlistedCount: number
  winRatePercent: number
  locked?: boolean
}

const stats = [
  { key: 'active', label: 'Active submissions' },
  { key: 'contests', label: 'Contests entered' },
  { key: 'shortlisted', label: 'Shortlisted' },
] as const

export function StatsRow({
  activeSubmissions,
  contestsEntered,
  shortlistedCount,
  winRatePercent,
  locked = false,
}: StatsRowProps) {
  const values = {
    active: activeSubmissions,
    contests: contestsEntered,
    shortlisted: shortlistedCount,
    winRate: `${winRatePercent}%`,
  }

  return (
    <section className={cn('space-y-3', locked && 'opacity-60')}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const value = values[stat.key]

          return (
            <div
              key={stat.key}
              className="flex min-h-[108px] flex-col justify-end rounded-lg border border-zinc-200 bg-white p-5"
            >
              <p className="text-xs font-medium text-zinc-500">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">
                {locked ? '—' : value}
              </p>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-zinc-500">
        Win rate:{' '}
        <span className="font-medium text-zinc-700">{locked ? '—' : values.winRate}</span>
      </p>
    </section>
  )
}

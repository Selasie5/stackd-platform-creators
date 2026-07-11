import {
  BadgeCheck,
  Banknote,
  Bell,
  ListChecks,
  RefreshCw,
  Star,
} from 'lucide-react'
import type { RecentActivityItem } from '@/lib/dashboard/overview'
import { cn } from '@/lib/utils'

interface RecentActivityListProps {
  items: RecentActivityItem[]
  locked?: boolean
  className?: string
}

const activityMeta: Record<
  string,
  { label: string; icon: typeof Bell; tone: string }
> = {
  video_approved: { label: 'Submission approved', icon: BadgeCheck, tone: 'text-emerald-700 bg-emerald-50' },
  shortlisted: { label: 'Shortlisted', icon: Star, tone: 'text-violet-700 bg-violet-50' },
  revision_requested: { label: 'Revision requested', icon: RefreshCw, tone: 'text-amber-700 bg-amber-50' },
  payment_paid: { label: 'Payment received', icon: Banknote, tone: 'text-sky-700 bg-sky-50' },
  payment_ready: { label: 'Payment ready', icon: Banknote, tone: 'text-sky-700 bg-sky-50' },
  winner_selected: { label: 'Winner selected', icon: ListChecks, tone: 'text-fuchsia-700 bg-fuchsia-50' },
}

function formatWhen(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function RecentActivityList({ items, locked = false, className }: RecentActivityListProps) {
  const showPlaceholder = locked || items.length === 0

  return (
    <section className={cn('flex min-h-0 flex-col space-y-3', className, locked && 'opacity-60')}>
      <h2 className="text-sm font-medium text-zinc-700">Recent Activity</h2>

      <div
        className={cn(
          'flex min-h-[420px] flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white',
          showPlaceholder && 'items-center justify-center',
        )}
      >
        {locked ? (
          <EmptyActivity message="Activity will appear here once you are verified and start submitting." />
        ) : items.length === 0 ? (
          <EmptyActivity message="Submission updates and payments will show up here." />
        ) : (
          <ul className="min-h-0 flex-1 divide-y divide-zinc-100 overflow-auto">
            {items.map((item) => {
              const meta = activityMeta[item.type] ?? {
                label: item.title,
                icon: Bell,
                tone: 'text-zinc-700 bg-zinc-100',
              }
              const Icon = meta.icon

              return (
                <li key={item.id} className="flex items-start gap-4 px-4 py-4">
                  <span
                    className={cn(
                      'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      meta.tone,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900">{meta.label}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-zinc-500">{item.body || item.title}</p>
                  </div>
                  <time className="shrink-0 text-xs text-zinc-400">{formatWhen(item.createdAt)}</time>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

function EmptyActivity({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-400">
        <Bell className="h-6 w-6" />
      </div>
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  )
}

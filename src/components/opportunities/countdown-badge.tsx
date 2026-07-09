import { useEffect, useState } from 'react'
import { formatCountdown, isDeadlineUrgent } from '@/lib/opportunities/utils'
import { cn } from '@/lib/utils'

interface CountdownBadgeProps {
  deadline: string
  closed?: boolean
  className?: string
}

export function CountdownBadge({ deadline, closed = false, className }: CountdownBadgeProps) {
  const [label, setLabel] = useState(() => formatCountdown(deadline))
  const urgent = !closed && isDeadlineUrgent(deadline)

  useEffect(() => {
    setLabel(formatCountdown(deadline))
    const timer = window.setInterval(() => setLabel(formatCountdown(deadline)), 60_000)
    return () => window.clearInterval(timer)
  }, [deadline])

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        closed
          ? 'border-zinc-200 bg-zinc-100 text-zinc-600'
          : urgent
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-amber-200 bg-amber-50 text-amber-800',
        className,
      )}
    >
      {closed ? 'Closed' : label}
    </span>
  )
}

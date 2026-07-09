import { Check, Star } from 'lucide-react'
import { PAYMENT_STATUS_CONFIG, SUBMISSION_STATUS_CONFIG } from '@/lib/submissions/status-config'
import type { SubmissionStatus } from '@/lib/submissions/types'
import { cn } from '@/lib/utils'

export function StatusBadge({
  status,
  prominent = false,
  className,
}: {
  status: SubmissionStatus
  prominent?: boolean
  className?: string
}) {
  const config = SUBMISSION_STATUS_CONFIG[status]
  const Icon = config.icon === 'star' ? Star : config.icon === 'check' ? Check : null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        config.className,
        prominent && status === 'revision_requested' && 'ring-2 ring-orange-300',
        className,
      )}
    >
      {prominent && status === 'revision_requested' && (
        <span className="size-1.5 rounded-full bg-orange-500" aria-hidden />
      )}
      {Icon ? <Icon className="size-3 shrink-0" aria-hidden /> : null}
      {config.label}
    </span>
  )
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const config =
    PAYMENT_STATUS_CONFIG[status] ?? {
      label: status.replace(/_/g, ' '),
      className: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
    }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

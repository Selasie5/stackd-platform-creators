import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  action,
  className,
}: {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 px-6 py-12 text-center',
        className,
      )}
    >
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-zinc-500">{description}</p> : null}
      {action ?? (actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null)}
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      actionLabel={onRetry ? 'Retry' : undefined}
      onAction={onRetry}
      className="border-red-200 bg-red-50/40"
    />
  )
}

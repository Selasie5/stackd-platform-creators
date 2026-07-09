import { Link } from '@tanstack/react-router'
import { Globe, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardEmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionTo?: string
}

export function DashboardEmptyState({
  title = 'Kick off your creator journey 💸',
  description = 'Discover top-paying campaigns, create content for brands, and earn when your work performs.',
  actionLabel = 'Discover opportunities',
  actionTo = '/dashboard/opportunities',
}: DashboardEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-violet-100 to-fuchsia-50" />
        <div className="relative flex flex-col items-center">
          <div className="flex h-20 w-16 items-end justify-center">
            <div className="h-3 w-20 rounded-full bg-zinc-300/80" />
          </div>
          <div className="-mt-14 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
            <Rocket className="h-8 w-8 -rotate-45" />
          </div>
        </div>
      </div>

      <h2 className="max-w-md text-2xl font-semibold tracking-tight text-zinc-900">{title}</h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-500">{description}</p>

      <Button asChild size="auth" className="mt-8 w-auto gap-2 rounded-full px-8">
        <Link to={actionTo}>
          <Globe className="h-4 w-4" />
          {actionLabel}
        </Link>
      </Button>
    </div>
  )
}

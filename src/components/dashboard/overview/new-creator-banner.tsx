import { Link } from '@tanstack/react-router'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NewCreatorBanner() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-violet-200 bg-linear-to-r from-violet-50 to-fuchsia-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-zinc-900">Ready to earn?</p>
        <p className="mt-1 text-sm text-zinc-600">
          You have not submitted any work yet. Browse live opportunities and send your first
          submission.
        </p>
      </div>
      <Button asChild size="default" className="h-10 w-auto shrink-0 gap-2 rounded-full px-4 text-sm font-semibold">
        <Link to="/dashboard/opportunities">
          <Globe className="h-4 w-4" />
          Browse opportunities
        </Link>
      </Button>
    </div>
  )
}

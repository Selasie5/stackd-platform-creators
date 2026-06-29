import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/opportunities')({
  component: OpportunitiesRoute,
})

function OpportunitiesRoute() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-10 text-center">
      <h1 className="text-xl font-semibold text-zinc-900">Opportunities</h1>
      <p className="mt-2 text-sm text-zinc-500">Browse and apply to brand campaigns — coming soon.</p>
    </div>
  )
}

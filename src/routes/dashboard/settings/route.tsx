import { createFileRoute } from '@tanstack/react-router'
import { useMe } from '@/hooks/use-auth'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsRoute,
})

function SettingsRoute() {
  const { data } = useMe()
  const creator = data?.me?.creator

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your creator account details.</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Name</dt>
            <dd className="mt-1 text-sm text-zinc-900">{creator?.fullName ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Email</dt>
            <dd className="mt-1 text-sm text-zinc-900">{data?.me?.email ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">School</dt>
            <dd className="mt-1 text-sm text-zinc-900">{creator?.school ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Location</dt>
            <dd className="mt-1 text-sm text-zinc-900">
              {[creator?.city, creator?.country].filter(Boolean).join(', ') || '—'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

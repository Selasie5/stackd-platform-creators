import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/contests/$id')({
  component: ContestLayoutRoute,
})

function ContestLayoutRoute() {
  return <Outlet />
}

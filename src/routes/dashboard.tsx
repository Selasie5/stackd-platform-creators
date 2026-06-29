import * as React from 'react'
import { Outlet, createFileRoute, Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Briefcase, LayoutDashboard, LogOut, Settings, Wallet } from 'lucide-react'
import { WalletPill } from '@/components/dashboard/wallet-pill'
import { useMe, useLogout } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

const navItems = [
  { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'Opportunities', path: '/dashboard/opportunities', icon: Briefcase },
  { name: 'Wallet', path: '/dashboard/wallet', icon: Wallet },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
]

function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data, loading } = useMe()
  const { logout } = useLogout()
  const user = data?.me

  React.useEffect(() => {
    if (loading) return
    if (!user) {
      navigate({ to: '/signin' })
      return
    }
    if (user.creator && !user.creator.isProfileComplete) {
      navigate({ to: '/onboarding/creator', search: { step: 1 } })
    }
  }, [loading, navigate, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F8] text-sm text-zinc-500">
        Loading your dashboard…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link to="/dashboard/overview" className="flex shrink-0 items-center gap-2">
            <img src="/favicon.svg" alt="Stackd" className="h-8 w-8" />
          </Link>

          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <WalletPill />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-zinc-900">
                {user.creator?.fullName ?? user.email}
              </p>
              <p className="text-xs text-zinc-500">Creator</p>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-zinc-100 px-4 py-2 md:hidden">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
                  active ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}

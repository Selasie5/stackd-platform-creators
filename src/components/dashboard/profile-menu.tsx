import { Link, useLocation } from '@tanstack/react-router'
import * as React from 'react'
import { Gift, LayoutGrid, LogOut, MessageSquare, Settings, Sparkles, TrendingUp, UserRound, Video } from 'lucide-react'
import * as Avatar from '@/components/ui/avatar'
import * as Popover from '@/components/ui/popover'
import type { User } from '@/hooks/use-auth'
import { useLogout } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

interface ProfileMenuProps {
  user: User
}

const navItems = [
  { to: '/dashboard/overview', icon: LayoutGrid, label: 'Overview' },
  { to: '/dashboard/opportunities', icon: Sparkles, label: 'Opportunities' },
  { to: '/dashboard/submissions', icon: Video, label: 'Submissions' },
  { to: '/dashboard/earnings', icon: TrendingUp, label: 'Earnings' },
  { to: '/dashboard/wallet', icon: Gift, label: 'Wallet' },
  { to: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/dashboard/profile', icon: UserRound, label: 'Profile' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
] as const

function ProfileMenuItem({
  to,
  icon: Icon,
  label,
  active,
  onSelect,
}: {
  to: string
  icon: typeof LayoutGrid
  label: string
  active: boolean
  onSelect: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors',
        active
          ? 'bg-zinc-100 font-medium text-zinc-900'
          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
      )}
    >
      <Icon className="size-4 shrink-0" strokeWidth={1.75} />
      {label}
    </Link>
  )
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const { pathname } = useLocation()
  const { logout, loading } = useLogout()
  const [open, setOpen] = React.useState(false)
  const displayName = user.creator?.fullName ?? user.email.split('@')[0]

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="rounded-full ring-2 ring-transparent transition-all hover:ring-violet-200 focus-visible:outline-none focus-visible:ring-violet-300"
          aria-label="Open profile menu"
        >
          <Avatar.Root size="40" color="blue" src={user.creator?.profileImage} />
        </button>
      </Popover.Trigger>

      <Popover.Content side="bottom" align="end" className="w-72 p-0" showArrow>
        <div className="border-b border-zinc-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar.Root size="48" color="blue" src={user.creator?.profileImage} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900">{displayName}</p>
              <p className="truncate text-xs text-zinc-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <div className="md:hidden">
            {navItems.map((item) => (
              <ProfileMenuItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={pathname === item.to}
                onSelect={() => setOpen(false)}
              />
            ))}
            <div className="my-1 h-px bg-zinc-100" />
          </div>

          <div className="hidden md:block">
            <ProfileMenuItem
              to="/dashboard/profile"
              icon={UserRound}
              label="Profile"
              active={pathname === '/dashboard/profile'}
              onSelect={() => setOpen(false)}
            />
            <ProfileMenuItem
              to="/dashboard/settings"
              icon={Settings}
              label="Settings"
              active={pathname === '/dashboard/settings'}
              onSelect={() => setOpen(false)}
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setOpen(false)
              void logout()
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50"
          >
            <LogOut className="size-4 shrink-0" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}

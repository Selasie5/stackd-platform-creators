import { Link, useLocation } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Gift,
  LayoutGrid,
  MessageSquare,
  Settings,
  Sparkles,
  TrendingUp,
  Video,
} from 'lucide-react'
import { primaryButtonClasses } from '@/components/ui/button'
import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/dashboard/overview', icon: LayoutGrid, label: 'Overview' },
  { path: '/dashboard/opportunities', icon: Sparkles, label: 'Opportunities' },
  { path: '/dashboard/submissions', icon: Video, label: 'Submissions' },
  { path: '/dashboard/earnings', icon: TrendingUp, label: 'Earnings' },
  { path: '/dashboard/wallet', icon: Gift, label: 'Wallet' },
  { path: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
] as const

function isActiveRoute(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`)
}

function SidebarNavItem({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string
  icon: LucideIcon
  label: string
  active: boolean
}) {
  return (
    <TooltipRoot delayDuration={120}>
      <TooltipTrigger asChild>
        <Link
          to={to}
          aria-current={active ? 'page' : undefined}
          aria-label={label}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150',
            active
              ? cn(primaryButtonClasses, 'text-white [&_svg]:text-white')
              : 'text-zinc-500 hover:bg-zinc-200/90 hover:text-zinc-900 active:scale-95',
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={active ? 2.25 : 1.75} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10} size="xsmall">
        {label}
      </TooltipContent>
    </TooltipRoot>
  )
}

export function DashboardSidebar() {
  const { pathname } = useLocation()

  return (
    <TooltipProvider delayDuration={120} skipDelayDuration={0}>
      <aside className="flex w-[64px] shrink-0 flex-col items-center border-r-0 bg-sidebar py-4">
        <Link
          to="/dashboard/overview"
          className="mb-5 flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80 active:scale-95"
        >
          <img src="/favicon.svg" alt="Stackd" className="h-7 w-7" />
        </Link>

        <nav className="flex flex-1 flex-col items-center gap-1.5">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              active={isActiveRoute(pathname, item.path)}
            />
          ))}
        </nav>

        <SidebarNavItem
          to="/dashboard/settings"
          icon={Settings}
          label="Settings"
          active={isActiveRoute(pathname, '/dashboard/settings')}
        />
      </aside>
    </TooltipProvider>
  )
}

export { navItems as dashboardNavItems, isActiveRoute }

import { Link, useLocation } from '@tanstack/react-router'
import { LayoutGrid, MessageSquare, Sparkles, UserRound, Video } from 'lucide-react'
import { isActiveRoute } from '@/components/dashboard/dashboard-sidebar'
import { primaryButtonClasses } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const mobileTabs = [
  { path: '/dashboard/overview', icon: LayoutGrid, label: 'Home' },
  { path: '/dashboard/opportunities', icon: Sparkles, label: 'Jobs' },
  { path: '/dashboard/submissions', icon: Video, label: 'Submissions' },
  { path: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
  { path: '/dashboard/profile', icon: UserRound, label: 'Profile' },
] as const

export function MobileBottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5 gap-1">
        {mobileTabs.map((item) => {
          const Icon = item.icon
          const active = isActiveRoute(pathname, item.path)

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition-colors',
                  active
                    ? cn(primaryButtonClasses, 'text-white [&_svg]:text-white')
                    : 'text-zinc-500 hover:text-zinc-900',
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={active ? 2.25 : 1.75} />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

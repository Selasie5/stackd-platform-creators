import { Search } from 'lucide-react'
import { ProfileMenu } from '@/components/dashboard/profile-menu'
import { WalletPill } from '@/components/dashboard/wallet-pill'
import type { User } from '@/hooks/use-auth'

interface DashboardTopBarProps {
  user: User
}

export function DashboardTopBar({ user }: DashboardTopBarProps) {
  return (
    <header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-dashed border-border/60 bg-background px-5">
      <div className="relative min-w-0 flex-1 max-w-2xl">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          placeholder="Search"
          className="h-11 w-full rounded-full border border-zinc-200 bg-[#F7F7F7] pl-11 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200/60"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <WalletPill showAdd />
        <ProfileMenu user={user} />
      </div>
    </header>
  )
}

import { Link } from '@tanstack/react-router'
import { Plus, Wallet } from 'lucide-react'
import { useMe } from '@/hooks/use-auth'
import { useMyCreatorWallet } from '@/hooks/use-wallet'
import { resolveCreatorCurrency } from '@/lib/country-currency'
import { formatCurrency, parseWalletAmount } from '@/lib/currency'
import { cn } from '@/lib/utils'

interface WalletPillProps {
  className?: string
  showAdd?: boolean
}

export function WalletPill({ className, showAdd = false }: WalletPillProps) {
  const { data: meData } = useMe()
  const { data, loading } = useMyCreatorWallet()
  const wallet = data?.myCreatorWallet
  const balance = parseWalletAmount(wallet?.availableBalance)
  const currency = resolveCreatorCurrency(wallet?.currency, meData?.me?.creator?.country)
  const isFrozen = wallet?.status === 'frozen'

  return (
    <Link
      to="/dashboard/wallet"
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all active:scale-[0.98]',
        isFrozen
          ? 'bg-amber-50 text-amber-900 hover:bg-amber-100'
          : 'bg-sky-50 text-sky-900 hover:bg-sky-100',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          isFrozen ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700',
        )}
      >
        <Wallet className="h-4 w-4" />
      </span>
      <span className="font-semibold tabular-nums">
        {loading ? '—' : formatCurrency(balance, currency, { maximumFractionDigits: 0 })}
      </span>
      {showAdd && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-sky-700 shadow-sm">
          <Plus className="h-3.5 w-3.5" />
        </span>
      )}
    </Link>
  )
}

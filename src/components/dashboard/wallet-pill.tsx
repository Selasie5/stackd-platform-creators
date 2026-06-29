import { Link } from '@tanstack/react-router'
import { Wallet } from 'lucide-react'
import { useMyCreatorWallet } from '@/hooks/use-wallet'
import { formatCurrency, parseWalletAmount } from '@/lib/currency'
import { cn } from '@/lib/utils'

interface WalletPillProps {
  className?: string
}

export function WalletPill({ className }: WalletPillProps) {
  const { data, loading } = useMyCreatorWallet()
  const wallet = data?.myCreatorWallet
  const balance = parseWalletAmount(wallet?.availableBalance)
  const isFrozen = wallet?.status === 'frozen'

  return (
    <Link
      to="/dashboard/wallet"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50',
        isFrozen && 'border-amber-200 bg-amber-50 text-amber-800',
        className,
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Wallet className="h-4 w-4" />
      </span>
      <span className="hidden sm:inline text-xs text-zinc-500">
        {isFrozen ? 'Wallet frozen' : 'Balance'}
      </span>
      <span className="font-semibold text-zinc-900">
        {loading
          ? '—'
          : formatCurrency(balance, wallet?.currency, { maximumFractionDigits: 0 })}
      </span>
    </Link>
  )
}

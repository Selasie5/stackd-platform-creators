import { createFileRoute } from '@tanstack/react-router'
import { WalletPill } from '@/components/dashboard/wallet-pill'
import { useMyCreatorWallet } from '@/hooks/use-wallet'
import { formatCurrency, parseWalletAmount } from '@/lib/currency'

export const Route = createFileRoute('/dashboard/wallet')({
  component: WalletRoute,
})

function WalletRoute() {
  const { data, loading } = useMyCreatorWallet()
  const wallet = data?.myCreatorWallet

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Wallet</h1>
          <p className="mt-1 text-sm text-zinc-500">
            View your earnings and withdrawal balance.
          </p>
        </div>
        <WalletPill />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Available balance</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {loading
              ? '—'
              : formatCurrency(parseWalletAmount(wallet?.availableBalance), wallet?.currency)}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Total withdrawn</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {loading
              ? '—'
              : formatCurrency(parseWalletAmount(wallet?.totalWithdrawn), wallet?.currency)}
          </p>
        </div>
      </div>

      {wallet?.status === 'frozen' && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          Your wallet is frozen until KYC is approved. Complete verification to unlock withdrawals.
        </div>
      )}
    </div>
  )
}

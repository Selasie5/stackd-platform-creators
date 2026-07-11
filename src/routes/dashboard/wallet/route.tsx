import { createFileRoute } from '@tanstack/react-router'
import { useMe } from '@/hooks/use-auth'
import { useMyCreatorWallet } from '@/hooks/use-wallet'
import { resolveCreatorCurrency } from '@/lib/country-currency'
import { formatCurrency, parseWalletAmount } from '@/lib/currency'

export const Route = createFileRoute('/dashboard/wallet')({
  component: WalletRoute,
})

function WalletRoute() {
  const { data: meData } = useMe()
  const { data, loading } = useMyCreatorWallet()
  const wallet = data?.myCreatorWallet
  const currency = resolveCreatorCurrency(wallet?.currency, meData?.me?.creator?.country)

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Wallet</h1>
        <p className="mt-1 text-sm text-zinc-500">Your earnings and withdrawal balance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <p className="text-sm text-zinc-500">Available balance</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-900">
            {loading
              ? '—'
              : formatCurrency(parseWalletAmount(wallet?.availableBalance), currency)}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <p className="text-sm text-zinc-500">Total earned</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-900">
            {loading
              ? '—'
              : formatCurrency(parseWalletAmount(wallet?.totalEarned), currency)}
          </p>
        </div>
      </div>

      {wallet?.status === 'frozen' && (
        <div className="mt-6 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          Your wallet is frozen until KYC is approved. Complete verification to unlock withdrawals.
        </div>
      )}
    </div>
  )
}

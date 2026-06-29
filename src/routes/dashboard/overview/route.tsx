import { createFileRoute } from '@tanstack/react-router'
import { useMe } from '@/hooks/use-auth'
import { useMyCreatorWallet } from '@/hooks/use-wallet'
import { formatCurrency, parseWalletAmount } from '@/lib/currency'

export const Route = createFileRoute('/dashboard/overview')({
  component: OverviewRoute,
})

function OverviewRoute() {
  const { data: meData } = useMe()
  const { data: walletData } = useMyCreatorWallet()
  const creator = meData?.me?.creator
  const wallet = walletData?.myCreatorWallet

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Welcome back{creator?.fullName ? `, ${creator.fullName.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track your earnings, discover opportunities, and manage your creator profile.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Available balance
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {formatCurrency(parseWalletAmount(wallet?.availableBalance), wallet?.currency)}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {wallet?.status === 'frozen' ? 'Complete KYC to unlock withdrawals' : 'Ready to withdraw'}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total earned</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {formatCurrency(parseWalletAmount(wallet?.totalEarned), wallet?.currency)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">KYC status</p>
          <p className="mt-2 text-2xl font-semibold capitalize text-zinc-900">
            {creator?.kycStatus?.replace(/_/g, ' ') ?? 'Not started'}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-8 text-center">
        <p className="text-sm font-medium text-zinc-700">Opportunities coming soon</p>
        <p className="mt-1 text-sm text-zinc-500">
          Paid campaigns and brand briefs will appear here once you are verified.
        </p>
      </div>
    </div>
  )
}

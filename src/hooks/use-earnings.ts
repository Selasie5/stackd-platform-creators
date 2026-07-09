import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import {
  MY_CREATOR_WALLET_SUMMARY_QUERY,
  MY_PAYMENTS_FULL_QUERY,
  MY_PAYMENT_DETAILS_QUERY,
} from '@/graphql/earnings'
import { formatCurrency, parseWalletAmount } from '@/lib/currency'

export type PaymentStatusFilter =
  | 'all'
  | 'in_escrow'
  | 'awaiting_approval'
  | 'ready_for_payout'
  | 'paid'
  | 'disputed'
  | 'refunded'

export interface EarningsFilters {
  status: PaymentStatusFilter
  fromDate: string
  toDate: string
  opportunityType: 'all' | 'UGC_ORDER' | 'CPM_DEAL' | 'CONTEST'
}

interface CreatorPayment {
  id: string
  amount: string
  currency: string
  status: string
  opportunityType?: string | null
  opportunityTitle?: string | null
  brandName?: string | null
  createdAt: string
  updatedAt: string
}

export function useEarnings(filters: EarningsFilters) {
  const walletQuery = useQuery<{ myCreatorWallet: { currency: string; totalEarned: string; totalWithdrawn: string } | null }>(
    MY_CREATOR_WALLET_SUMMARY_QUERY,
  )
  const paymentsQuery = useQuery<{ myPayments: CreatorPayment[] }>(MY_PAYMENTS_FULL_QUERY, {
    variables: filters.status === 'all' ? {} : { status: filters.status },
    fetchPolicy: 'cache-and-network',
  })
  const paymentDetailsQuery = useQuery<{ myPaymentDetails: Record<string, string | boolean | null> | null }>(
    MY_PAYMENT_DETAILS_QUERY,
  )

  const payments = paymentsQuery.data?.myPayments ?? []
  const currency = walletQuery.data?.myCreatorWallet?.currency ?? payments[0]?.currency ?? 'NGN'

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      if (filters.opportunityType !== 'all' && payment.opportunityType !== filters.opportunityType) {
        return false
      }

      const created = new Date(payment.createdAt)
      if (filters.fromDate && created < new Date(filters.fromDate)) return false
      if (filters.toDate) {
        const end = new Date(filters.toDate)
        end.setHours(23, 59, 59, 999)
        if (created > end) return false
      }

      return true
    })
  }, [filters.fromDate, filters.opportunityType, filters.toDate, payments])

  const totalEarned = walletQuery.data?.myCreatorWallet?.totalEarned ?? '0'
  const pendingPayout = payments
    .filter((payment) => ['in_escrow', 'awaiting_approval', 'ready_for_payout'].includes(payment.status))
    .reduce((sum, payment) => sum + parseWalletAmount(payment.amount), 0)
  const paidOut = walletQuery.data?.myCreatorWallet?.totalWithdrawn ?? '0'

  return {
    walletQuery,
    paymentsQuery,
    paymentDetailsQuery,
    payments: filteredPayments,
    summary: {
      totalEarned: formatCurrency(parseWalletAmount(totalEarned), currency),
      pendingPayout: formatCurrency(pendingPayout, currency),
      paidOut: formatCurrency(parseWalletAmount(paidOut), currency),
      currency,
    },
    paymentDetails: paymentDetailsQuery.data?.myPaymentDetails ?? null,
  }
}

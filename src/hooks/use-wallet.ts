import { useQuery } from '@apollo/client/react'
import { MY_CREATOR_WALLET_QUERY } from '@/graphql/wallet'

export interface CreatorWallet {
  id: string
  creatorId: string
  currency: string
  availableBalance: string
  totalEarned: string
  totalWithdrawn: string
  status: string
  createdAt: string
  updatedAt: string
}

export function useMyCreatorWallet(options?: { skip?: boolean }) {
  return useQuery<{ myCreatorWallet: CreatorWallet }>(MY_CREATOR_WALLET_QUERY, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
    skip: options?.skip,
  })
}

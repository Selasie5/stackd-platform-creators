import { gql } from '@apollo/client'

export const MY_CREATOR_WALLET_QUERY = gql`
  query MyCreatorWallet {
    myCreatorWallet {
      id
      creatorId
      currency
      availableBalance
      totalEarned
      totalWithdrawn
      status
      createdAt
      updatedAt
    }
  }
`

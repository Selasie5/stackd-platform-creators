import { gql } from '@apollo/client'

export const MY_PAYMENTS_FULL_QUERY = gql`
  query MyPaymentsFull($status: PaymentStatus) {
    myPayments(status: $status) {
      id
      amount
      currency
      status
      opportunityType
      opportunityTitle
      brandName
      referenceType
      referenceId
      processedAt
      createdAt
      updatedAt
    }
  }
`

export const MY_PAYMENT_DETAILS_QUERY = gql`
  query MyPaymentDetails {
    myPaymentDetails {
      method
      bankName
      accountNumber
      accountName
      mobileMoneyNumber
      mobileMoneyProvider
      hasPaystackRecipient
    }
  }
`

export const MY_CREATOR_WALLET_SUMMARY_QUERY = gql`
  query MyCreatorWalletSummary {
    myCreatorWallet {
      currency
      availableBalance
      totalEarned
      totalWithdrawn
    }
  }
`

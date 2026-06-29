import { gql } from '@apollo/client'

export const UPDATE_CREATOR_PROFILE_MUTATION = gql`
  mutation UpdateCreatorProfile($input: UpdateCreatorProfileInput!) {
    updateCreatorProfile(input: $input) {
      id
      fullName
      isProfileComplete
      kycStatus
    }
  }
`

export const UPDATE_PAYMENT_DETAILS_MUTATION = gql`
  mutation UpdatePaymentDetails($input: UpdatePaymentDetailsInput!) {
    updatePaymentDetails(input: $input) {
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

import { gql } from '@apollo/client'

export interface CheckSocialHandleResult {
  valid: boolean
  platform: string
  displayName?: string | null
  avatarUrl?: string | null
  followerCount?: number | null
  error?: string | null
}

export interface CheckSocialHandleQuery {
  checkSocialHandle: CheckSocialHandleResult
}

export const CHECK_SOCIAL_HANDLE_QUERY = gql`
  query CheckSocialHandle($platform: String!, $handle: String!) {
    checkSocialHandle(platform: $platform, handle: $handle) {
      valid
      platform
      displayName
      avatarUrl
      followerCount
      error
    }
  }
`

export const UPDATE_CREATOR_PROFILE_MUTATION = gql`
  mutation UpdateCreatorProfile($input: UpdateCreatorProfileInput!) {
    updateCreatorProfile(input: $input) {
      id
      fullName
      profileImage
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

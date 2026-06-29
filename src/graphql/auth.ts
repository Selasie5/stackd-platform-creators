import { gql } from '@apollo/client'

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      role
      status
      emailVerified
      creator {
        id
        fullName
        school
        country
        city
        phone
        bio
        mainNiche
        isProfileComplete
        kycStatus
      }
    }
  }
`

export const REGISTER_CREATOR_MUTATION = gql`
  mutation RegisterCreator($input: RegisterCreatorInput!) {
    registerCreator(input: $input) {
      message
      user {
        id
        email
        role
        status
        emailVerified
      }
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        role
        status
        emailVerified
        creator {
          id
          fullName
          isProfileComplete
          kycStatus
        }
      }
    }
  }
`

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`

export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email)
  }
`

export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($email: String!, $otp: String!, $newPassword: String!) {
    resetPassword(email: $email, otp: $otp, newPassword: $newPassword)
  }
`

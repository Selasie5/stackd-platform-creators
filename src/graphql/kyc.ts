import { gql } from '@apollo/client'

export const SUBMIT_KYC_MUTATION = gql`
  mutation SubmitKyc($input: SubmitKycInput!) {
    submitKyc(input: $input) {
      id
      status
      attemptNumber
    }
  }
`

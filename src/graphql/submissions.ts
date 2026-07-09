import { gql } from '@apollo/client'

const submissionMetaFields = `
  opportunityTitle
  brandName
  potentialPayout
  currency
  paymentAmount
  paymentDate
  paymentStatus
`

export const MY_SUBMISSIONS_QUERY = gql`
  query MySubmissions {
    myUgcSubmissions {
      id
      ugcOrderId
      status
      createdAt
      updatedAt
      videoUrl
      thumbnailUrl
      revisionNote
      submissionNote
      postedVideoLink
      ${submissionMetaFields}
    }
    myCpmSubmissions {
      id
      cpmDealId
      status
      createdAt
      updatedAt
      postedVideoLink
      platform
      submittedViews
      approvedViews
      engagementCount
      calculatedPayout
      submissionNote
      ${submissionMetaFields}
    }
    myContestSubmissions {
      id
      contestId
      status
      createdAt
      updatedAt
      videoUrl
      videoLink
      thumbnailUrl
      postedVideoLink
      platform
      submittedViews
      approvedViews
      engagementCount
      leaderboardScore
      placement
      rewardAmount
      submissionNote
      ${submissionMetaFields}
    }
  }
`

export const RESUBMIT_UGC_SUBMISSION_MUTATION = gql`
  mutation ResubmitUgcSubmission($input: ResubmitUgcSubmissionInput!) {
    resubmitUgcSubmission(input: $input) {
      id
      status
      updatedAt
    }
  }
`

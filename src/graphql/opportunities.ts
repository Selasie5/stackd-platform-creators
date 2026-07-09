import { gql } from '@apollo/client'

const browseOpportunityFields = `
  id
  title
  productName
  shortDescription
  currency
  status
  createdAt
`

export const LIVE_OPPORTUNITIES_BROWSE_QUERY = gql`
  query LiveOpportunitiesBrowse {
    liveUgcOrders {
      ${browseOpportunityFields}
      flatRatePerCreator
      deadline
      targetPlatform
    }
    liveCpmDeals {
      ${browseOpportunityFields}
      payPer1000Views
      maxCampaignBudget
      postingDeadline
      targetPlatform
    }
    liveContests {
      ${browseOpportunityFields}
      totalContestBudget
      submissionDeadline
      targetPlatform
      category
      brandName
    }
  }
`

export const MY_CONTEST_SUBMISSIONS_IDS_QUERY = gql`
  query MyContestSubmissionIds {
    myContestSubmissions {
      id
      contestId
      status
      placement
      leaderboardScore
      createdAt
    }
  }
`

export const CONTEST_DETAIL_QUERY = gql`
  query ContestDetail($id: ID!) {
    liveContest(id: $id) {
      id
      brandId
      brandName
      title
      productName
      shortDescription
      fullDescription
      externalBriefLink
      currency
      status
      category
      videoType
      videoLengthSeconds
      targetPlatform
      requiredHashtags
      requiredCaption
      requiredBrandTag
      postingRequired
      contestRules
      eligibilityRules
      usageRightsPackage
      productDeliveryDetails
      totalContestBudget
      cpmBudget
      payPer1000Views
      maxPayableViewsPerCreator
      minimumWinners
      submissionDeadline
      winnerAnnouncementDate
      createdAt
      referenceLinks {
        id
        url
        label
        isInspiration
      }
      rewards {
        id
        placement
        label
        amount
        currency
      }
    }
    contestSubmissionCount(contestId: $id)
    contestPublicLeaderboard(contestId: $id, limit: 20) {
      rank
      submissionId
      leaderboardScore
      thumbnailUrl
      placement
      creatorDisplayName
      status
      createdAt
    }
  }
`

export const SUBMIT_CONTEST_SUBMISSION_MUTATION = gql`
  mutation SubmitContestSubmission($input: SubmitContestSubmissionInput!) {
    submitContestSubmission(input: $input) {
      id
      contestId
      status
      createdAt
    }
  }
`

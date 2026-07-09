import { gql } from '@apollo/client'

export const MY_WITHDRAWALS_QUERY = gql`
  query MyWithdrawals($status: WithdrawalStatus) {
    myWithdrawals(status: $status) {
      id
      amount
      currency
      status
      createdAt
      updatedAt
    }
  }
`

export const MY_PAYMENTS_QUERY = gql`
  query MyPayments($status: PaymentStatus) {
    myPayments(status: $status) {
      id
      amount
      currency
      status
      opportunityType
      opportunityTitle
      createdAt
      updatedAt
    }
  }
`

export const MY_SUBMISSIONS_OVERVIEW_QUERY = gql`
  query MySubmissionsOverview {
    myUgcSubmissions {
      id
      status
      createdAt
      updatedAt
    }
    myCpmSubmissions {
      id
      status
      createdAt
      updatedAt
    }
    myContestSubmissions {
      id
      contestId
      status
      placement
      leaderboardScore
      createdAt
      updatedAt
    }
  }
`

export const LIVE_OPPORTUNITIES_QUERY = gql`
  query LiveOpportunities {
    liveUgcOrders {
      id
      title
      productName
      shortDescription
      currency
      flatRatePerCreator
      deadline
      createdAt
    }
    liveCpmDeals {
      id
      title
      productName
      shortDescription
      currency
      payPer1000Views
      postingDeadline
      createdAt
    }
    liveContests {
      id
      title
      productName
      shortDescription
      currency
      totalContestBudget
      submissionDeadline
      createdAt
    }
  }
`

export const MY_NOTIFICATIONS_QUERY = gql`
  query MyNotifications {
    myNotifications {
      id
      type
      title
      body
      createdAt
    }
  }
`

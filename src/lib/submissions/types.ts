export type SubmissionStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'revision_requested'
  | 'resubmitted'
  | 'winner'
  | 'approved'
  | 'rejected'
  | 'disqualified'
  | 'paid'

export type SubmissionKind = 'ugc' | 'cpm' | 'contest'

export type SubmissionTab = 'all' | 'contests' | 'ugc' | 'cpm'

export interface UnifiedSubmission {
  id: string
  kind: SubmissionKind
  opportunityId: string
  opportunityTitle: string
  brandName: string | null
  status: SubmissionStatus
  createdAt: string
  updatedAt: string
  potentialPayout: string | null
  currency: string | null
  paymentAmount: string | null
  paymentDate: string | null
  paymentStatus: string | null
  revisionNote?: string | null
  submissionNote?: string | null
  videoUrl?: string | null
  videoLink?: string | null
  thumbnailUrl?: string | null
  postedVideoLink?: string | null
  platform?: string | null
  submittedViews?: number
  approvedViews?: number | null
  engagementCount?: number
  leaderboardScore?: number
  placement?: number | null
  rewardAmount?: string | null
}

export interface SubmissionFilters {
  status: SubmissionStatus | 'all'
  fromDate: string
  toDate: string
}

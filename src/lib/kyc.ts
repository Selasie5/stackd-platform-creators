export type CreatorKycStatus =
  | 'not_started'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'needs_more_info'

export function normalizeKycStatus(status?: string | null): CreatorKycStatus {
  const value = status ?? 'not_started'
  if (
    value === 'pending_review' ||
    value === 'approved' ||
    value === 'rejected' ||
    value === 'needs_more_info'
  ) {
    return value
  }
  return 'not_started'
}

export function isKycApproved(status?: string | null) {
  return normalizeKycStatus(status) === 'approved'
}

export function isKycPendingReview(status?: string | null) {
  return normalizeKycStatus(status) === 'pending_review'
}

export function requiresVerification(status?: string | null) {
  return !isKycApproved(status)
}

export const CREATOR_KYC_STATUS_LABELS: Record<CreatorKycStatus, string> = {
  not_started: 'Not started',
  pending_review: 'Under review',
  approved: 'Verified',
  rejected: 'Rejected',
  needs_more_info: 'More info needed',
}

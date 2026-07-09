import type { SubmissionKind, SubmissionStatus, SubmissionTab, UnifiedSubmission } from '@/lib/submissions/types'

interface RawSubmissionBase {
  id: string
  status: SubmissionStatus
  createdAt: string
  updatedAt: string
  opportunityTitle?: string | null
  brandName?: string | null
  potentialPayout?: string | null
  currency?: string | null
  paymentAmount?: string | null
  paymentDate?: string | null
  paymentStatus?: string | null
  submissionNote?: string | null
}

export interface RawUgcSubmission extends RawSubmissionBase {
  ugcOrderId: string
  videoUrl?: string | null
  thumbnailUrl?: string | null
  revisionNote?: string | null
  postedVideoLink?: string | null
}

export interface RawCpmSubmission extends RawSubmissionBase {
  cpmDealId: string
  postedVideoLink: string
  platform: string
  submittedViews: number
  approvedViews?: number | null
  engagementCount: number
  calculatedPayout?: string | null
}

export interface RawContestSubmission extends RawSubmissionBase {
  contestId: string
  videoUrl?: string | null
  videoLink?: string | null
  thumbnailUrl?: string | null
  postedVideoLink?: string | null
  platform?: string | null
  submittedViews: number
  approvedViews?: number | null
  engagementCount: number
  leaderboardScore: number
  placement?: number | null
  rewardAmount?: string | null
}

export function normalizeUgcSubmission(row: RawUgcSubmission): UnifiedSubmission {
  return {
    id: row.id,
    kind: 'ugc',
    opportunityId: row.ugcOrderId,
    opportunityTitle: row.opportunityTitle ?? 'UGC order',
    brandName: row.brandName ?? null,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    potentialPayout: row.potentialPayout ?? null,
    currency: row.currency ?? null,
    paymentAmount: row.paymentAmount ?? null,
    paymentDate: row.paymentDate ?? null,
    paymentStatus: row.paymentStatus ?? null,
    revisionNote: row.revisionNote,
    submissionNote: row.submissionNote,
    videoUrl: row.videoUrl,
    thumbnailUrl: row.thumbnailUrl,
    postedVideoLink: row.postedVideoLink,
  }
}

export function normalizeCpmSubmission(row: RawCpmSubmission): UnifiedSubmission {
  return {
    id: row.id,
    kind: 'cpm',
    opportunityId: row.cpmDealId,
    opportunityTitle: row.opportunityTitle ?? 'CPM deal',
    brandName: row.brandName ?? null,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    potentialPayout: row.calculatedPayout ?? row.potentialPayout ?? null,
    currency: row.currency ?? null,
    paymentAmount: row.paymentAmount ?? null,
    paymentDate: row.paymentDate ?? null,
    paymentStatus: row.paymentStatus ?? null,
    submissionNote: row.submissionNote,
    postedVideoLink: row.postedVideoLink,
    platform: row.platform,
    submittedViews: row.submittedViews,
    approvedViews: row.approvedViews,
    engagementCount: row.engagementCount,
  }
}

export function normalizeContestSubmission(row: RawContestSubmission): UnifiedSubmission {
  return {
    id: row.id,
    kind: 'contest',
    opportunityId: row.contestId,
    opportunityTitle: row.opportunityTitle ?? 'Contest',
    brandName: row.brandName ?? null,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    potentialPayout: row.rewardAmount ?? row.potentialPayout ?? null,
    currency: row.currency ?? null,
    paymentAmount: row.paymentAmount ?? null,
    paymentDate: row.paymentDate ?? null,
    paymentStatus: row.paymentStatus ?? null,
    submissionNote: row.submissionNote,
    videoUrl: row.videoUrl,
    videoLink: row.videoLink,
    thumbnailUrl: row.thumbnailUrl,
    postedVideoLink: row.postedVideoLink,
    platform: row.platform,
    submittedViews: row.submittedViews,
    approvedViews: row.approvedViews,
    engagementCount: row.engagementCount,
    leaderboardScore: row.leaderboardScore,
    placement: row.placement,
    rewardAmount: row.rewardAmount,
  }
}

export function mergeSubmissions(input: {
  ugc: RawUgcSubmission[]
  cpm: RawCpmSubmission[]
  contest: RawContestSubmission[]
}): UnifiedSubmission[] {
  return [
    ...input.ugc.map(normalizeUgcSubmission),
    ...input.cpm.map(normalizeCpmSubmission),
    ...input.contest.map(normalizeContestSubmission),
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function filterSubmissions(
  items: UnifiedSubmission[],
  tab: SubmissionTab,
  status: SubmissionStatus | 'all',
  fromDate: string,
  toDate: string,
): UnifiedSubmission[] {
  return items.filter((item) => {
    if (tab === 'contests' && item.kind !== 'contest') return false
    if (tab === 'ugc' && item.kind !== 'ugc') return false
    if (tab === 'cpm' && item.kind !== 'cpm') return false
    if (status !== 'all' && item.status !== status) return false

    const updated = new Date(item.updatedAt)
    if (fromDate && updated < new Date(fromDate)) return false
    if (toDate) {
      const end = new Date(toDate)
      end.setHours(23, 59, 59, 999)
      if (updated > end) return false
    }

    return true
  })
}

export function kindLabel(kind: SubmissionKind) {
  switch (kind) {
    case 'ugc':
      return 'UGC order'
    case 'cpm':
      return 'CPM deal'
    case 'contest':
      return 'Contest'
  }
}

export function findSubmission(items: UnifiedSubmission[], id: string) {
  return items.find((item) => item.id === id)
}

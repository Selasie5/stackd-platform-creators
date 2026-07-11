import { parseWalletAmount } from '@/lib/currency'

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

export interface SubmissionRecord {
  id: string
  status: SubmissionStatus
  createdAt: string
  updatedAt: string
}

export interface ContestSubmissionRecord extends SubmissionRecord {
  contestId: string
  placement?: number | null
  leaderboardScore: number
}

export interface CreatorPaymentRecord {
  id: string
  amount: string
  currency: string
  status: string
  opportunityType?: string | null
  createdAt: string
  updatedAt: string
}

export interface WithdrawalRecord {
  id: string
  amount: string
  currency: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface LiveOpportunity {
  id: string
  type: 'UGC' | 'CPM' | 'Contest'
  title: string
  productName: string
  shortDescription: string
  currency: string
  payoutLabel: string
  deadline: string
  createdAt: string
}

export interface LeaderboardEntry {
  contestId: string
  contestName: string
  position: number | null
  score: number
}

export interface DashboardStats {
  activeSubmissions: number
  contestsEntered: number
  shortlistedCount: number
  winRatePercent: number
}

export interface RecentActivityItem {
  id: string
  type: string
  title: string
  body: string
  createdAt: string
}

const TERMINAL_STATUSES = new Set<SubmissionStatus>(['rejected', 'disqualified', 'paid'])
const ACTIVE_STATUSES = new Set<SubmissionStatus>([
  'submitted',
  'under_review',
  'shortlisted',
  'revision_requested',
  'resubmitted',
  'approved',
  'winner',
])

const ACTIVITY_TYPES = new Set([
  'video_approved',
  'shortlisted',
  'revision_requested',
  'payment_paid',
  'payment_ready',
  'winner_selected',
])

const PAYOUT_PENDING_STATUSES = new Set(['ready_for_payout', 'in_escrow', 'awaiting_approval'])
const WITHDRAWAL_PENDING_STATUSES = new Set(['pending', 'processing'])

const PAYOUT_DELAY_MS = 7 * 24 * 60 * 60 * 1000

export function computeDashboardStats(
  ugc: SubmissionRecord[],
  cpm: SubmissionRecord[],
  contests: ContestSubmissionRecord[],
): DashboardStats {
  const all = [...ugc, ...cpm, ...contests]
  const activeSubmissions = all.filter((item) => ACTIVE_STATUSES.has(item.status)).length
  const contestIds = new Set(contests.map((item) => item.contestId))
  const contestsEntered = contestIds.size
  const shortlistedCount = all.filter((item) => item.status === 'shortlisted').length
  const wins = all.filter((item) => item.status === 'winner' || item.status === 'paid').length
  const winRatePercent =
    all.length === 0 ? 0 : Math.round((wins / all.filter((item) => !TERMINAL_STATUSES.has(item.status) || item.status === 'paid').length) * 100) || 0

  const resolvedContests = contests.filter(
    (item) => item.status === 'winner' || item.status === 'rejected' || item.status === 'paid',
  )
  const contestWins = resolvedContests.filter((item) => item.status === 'winner' || item.status === 'paid').length
  const contestWinRate =
    resolvedContests.length === 0 ? 0 : Math.round((contestWins / resolvedContests.length) * 100)

  return {
    activeSubmissions,
    contestsEntered,
    shortlistedCount,
    winRatePercent: contestsEntered > 0 ? contestWinRate : winRatePercent,
  }
}

export function computePendingPayout(
  payments: CreatorPaymentRecord[],
  withdrawals: WithdrawalRecord[],
) {
  const pendingPayments = payments
    .filter((payment) => PAYOUT_PENDING_STATUSES.has(payment.status))
    .reduce((sum, payment) => sum + parseWalletAmount(payment.amount), 0)

  const pendingWithdrawals = withdrawals
    .filter((withdrawal) => WITHDRAWAL_PENDING_STATUSES.has(withdrawal.status))
    .reduce((sum, withdrawal) => sum + parseWalletAmount(withdrawal.amount), 0)

  return pendingPayments + pendingWithdrawals
}

export function hasDelayedPayout(withdrawals: WithdrawalRecord[], now = Date.now()) {
  return withdrawals.some((withdrawal) => {
    if (!WITHDRAWAL_PENDING_STATUSES.has(withdrawal.status)) return false
    const created = Date.parse(withdrawal.createdAt)
    return Number.isFinite(created) && now - created > PAYOUT_DELAY_MS
  })
}

export function buildLeaderboardEntries(
  contests: ContestSubmissionRecord[],
  contestTitles: Map<string, string>,
): LeaderboardEntry[] {
  const byContest = new Map<string, ContestSubmissionRecord>()

  for (const submission of contests) {
    if (!ACTIVE_STATUSES.has(submission.status) && submission.status !== 'winner') continue
    const existing = byContest.get(submission.contestId)
    if (!existing || submission.leaderboardScore > existing.leaderboardScore) {
      byContest.set(submission.contestId, submission)
    }
  }

  return [...byContest.values()]
    .map((submission) => ({
      contestId: submission.contestId,
      contestName: contestTitles.get(submission.contestId) ?? 'Contest',
      position: submission.placement ?? null,
      score: submission.leaderboardScore,
    }))
    .sort((a, b) => {
      if (a.position != null && b.position != null) return a.position - b.position
      return b.score - a.score
    })
}

export function mergeLiveOpportunities(input: {
  ugc: Array<{
    id: string
    title: string
    productName: string
    shortDescription: string
    currency: string
    flatRatePerCreator: string
    deadline: string
    createdAt: string
  }>
  cpm: Array<{
    id: string
    title: string
    productName: string
    shortDescription: string
    currency: string
    payPer1000Views: string
    postingDeadline: string
    createdAt: string
  }>
  contests: Array<{
    id: string
    title: string
    productName: string
    shortDescription: string
    currency: string
    totalContestBudget: string
    submissionDeadline: string
    createdAt: string
  }>
}): LiveOpportunity[] {
  const ugc = input.ugc.map((item) => ({
    id: item.id,
    type: 'UGC' as const,
    title: item.title,
    productName: item.productName,
    shortDescription: item.shortDescription,
    currency: item.currency,
    payoutLabel: `${item.currency} ${item.flatRatePerCreator} per creator`,
    deadline: item.deadline,
    createdAt: item.createdAt,
  }))

  const cpm = input.cpm.map((item) => ({
    id: item.id,
    type: 'CPM' as const,
    title: item.title,
    productName: item.productName,
    shortDescription: item.shortDescription,
    currency: item.currency,
    payoutLabel: `${item.currency} ${item.payPer1000Views} / 1k views`,
    deadline: item.postingDeadline,
    createdAt: item.createdAt,
  }))

  const contests = input.contests.map((item) => ({
    id: item.id,
    type: 'Contest' as const,
    title: item.title,
    productName: item.productName,
    shortDescription: item.shortDescription,
    currency: item.currency,
    payoutLabel: `${item.currency} ${item.totalContestBudget} prize pool`,
    deadline: item.submissionDeadline,
    createdAt: item.createdAt,
  }))

  return [...ugc, ...cpm, ...contests].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  )
}

export function filterRecentActivity(notifications: RecentActivityItem[]) {
  return notifications
    .filter((item) => ACTIVITY_TYPES.has(item.type))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 8)
}

export function totalSubmissionCount(
  ugc: SubmissionRecord[],
  cpm: SubmissionRecord[],
  contests: ContestSubmissionRecord[],
) {
  return ugc.length + cpm.length + contests.length
}

export type EarningsChartRange = '1d' | '1w' | '1m' | '3m' | '1y'

export interface EarningsChartPoint {
  date: string
  value: number
}

export interface CampaignEarningsRow {
  type: 'UGC' | 'CPM' | 'Contest'
  label: string
  amount: number
  changePercent: number
}

const PAID_STATUSES = new Set(['paid'])

const RANGE_CONFIG: Record<
  EarningsChartRange,
  { days: number; bucketMs: number; points: number }
> = {
  '1d': { days: 1, bucketMs: 60 * 60 * 1000, points: 24 },
  '1w': { days: 7, bucketMs: 24 * 60 * 60 * 1000, points: 7 },
  '1m': { days: 30, bucketMs: 24 * 60 * 60 * 1000, points: 30 },
  '3m': { days: 90, bucketMs: 7 * 24 * 60 * 60 * 1000, points: 13 },
  '1y': { days: 365, bucketMs: 30 * 24 * 60 * 60 * 1000, points: 12 },
}

const CAMPAIGN_LABELS: Record<CampaignEarningsRow['type'], string> = {
  UGC: 'UGC campaigns',
  CPM: 'CPM campaigns',
  Contest: 'Contests',
}

function normalizeCampaignType(value?: string | null): CampaignEarningsRow['type'] | null {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) return null
  if (normalized === 'ugc' || normalized === 'ugc_order') return 'UGC'
  if (normalized === 'cpm' || normalized === 'cpm_deal') return 'CPM'
  if (normalized === 'contest') return 'Contest'
  return null
}

function paidPayments(payments: CreatorPaymentRecord[]) {
  return payments.filter((payment) => PAID_STATUSES.has(payment.status))
}

function sumPayments(payments: CreatorPaymentRecord[]) {
  return payments.reduce((sum, payment) => sum + parseWalletAmount(payment.amount), 0)
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

export function buildEarningsChartSeries(
  payments: CreatorPaymentRecord[],
  range: EarningsChartRange,
  now = Date.now(),
): EarningsChartPoint[] {
  const config = RANGE_CONFIG[range]
  const start = now - config.days * 24 * 60 * 60 * 1000
  const paid = paidPayments(payments).filter((payment) => {
    const created = Date.parse(payment.createdAt)
    return Number.isFinite(created) && created >= start
  })

  const buckets = Array.from({ length: config.points }, (_, index) => {
    const bucketStart = start + index * config.bucketMs
    const bucketEnd = bucketStart + config.bucketMs
    const value = paid
      .filter((payment) => {
        const created = Date.parse(payment.createdAt)
        return created >= bucketStart && created < bucketEnd
      })
      .reduce((sum, payment) => sum + parseWalletAmount(payment.amount), 0)

    return {
      date: new Date(bucketStart).toISOString(),
      value,
    }
  })

  return buckets
}

export function computeCampaignEarningsBreakdown(
  payments: CreatorPaymentRecord[],
  now = Date.now(),
): CampaignEarningsRow[] {
  const paid = paidPayments(payments)
  const currentStart = now - 30 * 24 * 60 * 60 * 1000
  const previousStart = now - 60 * 24 * 60 * 60 * 1000

  const types: CampaignEarningsRow['type'][] = ['UGC', 'CPM', 'Contest']

  return types.map((type) => {
    const matches = paid.filter((payment) => normalizeCampaignType(payment.opportunityType) === type)
    const current = sumPayments(
      matches.filter((payment) => Date.parse(payment.createdAt) >= currentStart),
    )
    const previous = sumPayments(
      matches.filter((payment) => {
        const created = Date.parse(payment.createdAt)
        return created >= previousStart && created < currentStart
      }),
    )

    return {
      type,
      label: CAMPAIGN_LABELS[type],
      amount: sumPayments(matches),
      changePercent: percentChange(current, previous),
    }
  })
}

export function computeEarningsTrendPercent(
  payments: CreatorPaymentRecord[],
  range: EarningsChartRange,
  now = Date.now(),
) {
  const config = RANGE_CONFIG[range]
  const currentStart = now - config.days * 24 * 60 * 60 * 1000
  const previousStart = currentStart - config.days * 24 * 60 * 60 * 1000
  const paid = paidPayments(payments)

  const current = sumPayments(
    paid.filter((payment) => Date.parse(payment.createdAt) >= currentStart),
  )
  const previous = sumPayments(
    paid.filter((payment) => {
      const created = Date.parse(payment.createdAt)
      return created >= previousStart && created < currentStart
    }),
  )

  return percentChange(current, previous)
}


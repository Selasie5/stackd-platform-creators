import type { BrowseOpportunity } from '@/lib/opportunities/types'
import { isOpportunityClosed, parsePayoutAmount } from '@/lib/opportunities/utils'

type SubmissionMap = Map<string, string>

export function mergeBrowseOpportunities(input: {
  ugc: Array<{
    id: string
    title: string
    productName: string
    shortDescription: string
    currency: string
    flatRatePerCreator: string
    deadline: string
    createdAt: string
    targetPlatform?: string | null
    status?: string | null
  }>
  cpm: Array<{
    id: string
    title: string
    productName: string
    shortDescription: string
    currency: string
    payPer1000Views: string
    maxCampaignBudget?: string | null
    postingDeadline: string
    createdAt: string
    targetPlatform?: string | null
    status?: string | null
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
    targetPlatform?: string | null
    category?: string | null
    status?: string | null
    brandName?: string | null
  }>
  contestSubmissions?: SubmissionMap
}): BrowseOpportunity[] {
  const submissions = input.contestSubmissions ?? new Map<string, string>()

  const ugc = input.ugc.map((item) => {
    const payoutAmount = parsePayoutAmount(item.flatRatePerCreator)
    return {
      id: item.id,
      type: 'UGC' as const,
      title: item.title,
      brandName: item.productName,
      productName: item.productName,
      shortDescription: item.shortDescription,
      currency: item.currency,
      payoutAmount,
      payoutLabel: `${item.currency} ${item.flatRatePerCreator} per creator`,
      deadline: item.deadline,
      createdAt: item.createdAt,
      platform: item.targetPlatform ?? null,
      category: null,
      status: item.status ?? 'live',
      isClosed: isOpportunityClosed(item.deadline, item.status),
    }
  })

  const cpm = input.cpm.map((item) => {
    const payoutAmount = parsePayoutAmount(item.maxCampaignBudget ?? item.payPer1000Views)
    return {
      id: item.id,
      type: 'CPM' as const,
      title: item.title,
      brandName: item.productName,
      productName: item.productName,
      shortDescription: item.shortDescription,
      currency: item.currency,
      payoutAmount,
      payoutLabel: `${item.currency} ${item.payPer1000Views} / 1k views`,
      deadline: item.postingDeadline,
      createdAt: item.createdAt,
      platform: item.targetPlatform ?? null,
      category: null,
      status: item.status ?? 'live',
      isClosed: isOpportunityClosed(item.postingDeadline, item.status),
    }
  })

  const contests = input.contests.map((item) => {
    const payoutAmount = parsePayoutAmount(item.totalContestBudget)
    return {
      id: item.id,
      type: 'Contest' as const,
      title: item.title,
      brandName: item.brandName?.trim() || item.productName,
      productName: item.productName,
      shortDescription: item.shortDescription,
      currency: item.currency,
      payoutAmount,
      payoutLabel: `${item.currency} ${item.totalContestBudget} prize pool`,
      deadline: item.submissionDeadline,
      createdAt: item.createdAt,
      platform: item.targetPlatform ?? null,
      category: item.category ?? null,
      status: item.status ?? 'live',
      isClosed: isOpportunityClosed(item.submissionDeadline, item.status),
      mySubmissionId: submissions.get(item.id) ?? null,
    }
  })

  return [...ugc, ...cpm, ...contests]
}

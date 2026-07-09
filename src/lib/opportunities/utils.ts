import { parseWalletAmount } from '@/lib/currency'
import type { BrowseOpportunity } from '@/lib/opportunities/types'

export function parsePayoutAmount(value: string | number | null | undefined) {
  if (typeof value === 'number') return value
  if (!value) return 0
  return parseWalletAmount(String(value))
}

export function isOpportunityClosed(deadline: string, status?: string | null) {
  if (status && status !== 'live') return true
  const end = Date.parse(deadline)
  return Number.isFinite(end) && end <= Date.now()
}

export function formatCountdown(deadline: string, now = Date.now()) {
  const end = Date.parse(deadline)
  if (!Number.isFinite(end)) return 'Open deadline'
  const diff = end - now
  if (diff <= 0) return 'Closed'

  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))

  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}

export function isDeadlineUrgent(deadline: string, now = Date.now()) {
  const end = Date.parse(deadline)
  if (!Number.isFinite(end)) return false
  return end - now > 0 && end - now <= 24 * 60 * 60 * 1000
}

export function formatPlatformLabel(platform: string | null | undefined) {
  switch (platform) {
    case 'tiktok':
      return 'TikTok'
    case 'instagram':
      return 'Instagram'
    case 'youtube_shorts':
      return 'YouTube'
    case 'any':
      return 'Any platform'
    default:
      return null
  }
}

export function getOpportunityDetailPath(opportunity: Pick<BrowseOpportunity, 'id' | 'type'>) {
  if (opportunity.type === 'Contest') {
    return `/dashboard/contests/${opportunity.id}` as const
  }
  return `/dashboard/opportunities` as const
}

export function formatCurrencyAmount(currency: string, amount: number) {
  return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

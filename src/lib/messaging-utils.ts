export type MessageReferenceType = 'ugc_order' | 'cpm_deal' | 'contest' | 'dispute'

export type Message = {
  id: string
  senderId: string
  recipientId: string
  referenceType: MessageReferenceType | null
  referenceId: string | null
  body: string
  attachmentUrl: string | null
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export type ThreadMessage = Message & {
  clientId?: string
  status?: 'sending' | 'sent' | 'failed'
}

export type ConversationPreview = {
  id: string
  brandId: string
  brandName: string
  referenceType: MessageReferenceType
  referenceId: string
  campaignTitle: string
  lastMessagePreview: string
  lastMessageAt: string
  unreadCount: number
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatMessageTimestamp(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatReferenceLabel(referenceType: MessageReferenceType) {
  switch (referenceType) {
    case 'ugc_order':
      return 'UGC campaign'
    case 'cpm_deal':
      return 'CPM deal'
    case 'contest':
      return 'Contest'
    case 'dispute':
      return 'Dispute'
    default:
      return 'Campaign'
  }
}

/** Demo previews until a conversations list API is available. */
export const DEMO_CONVERSATIONS: ConversationPreview[] = [
  {
    id: 'conv-1',
    brandId: '00000000-0000-4000-8000-000000000001',
    brandName: 'Glow Beauty Co.',
    referenceType: 'ugc_order',
    referenceId: '00000000-0000-4000-8000-000000000101',
    campaignTitle: 'Summer product launch UGC',
    lastMessagePreview: 'Please resubmit with the updated hook in the first 3 seconds.',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'conv-2',
    brandId: '00000000-0000-4000-8000-000000000002',
    brandName: 'FreshFit',
    referenceType: 'contest',
    referenceId: '00000000-0000-4000-8000-000000000103',
    campaignTitle: 'Best unboxing video contest',
    lastMessagePreview: 'Congrats on being shortlisted!',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    unreadCount: 0,
  },
]

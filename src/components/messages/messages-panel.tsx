import { useEffect, useMemo, useState } from 'react'
import { ConversationList } from '@/components/messages/conversation-list'
import { ConversationThread } from '@/components/messages/conversation-thread'
import { EmptyState } from '@/components/ui/empty-state'
import { useMe } from '@/hooks/use-auth'
import { useConversation, useMarkMessagesRead, useSendMessage } from '@/hooks/use-messaging'
import {
  DEMO_CONVERSATIONS,
  type ConversationPreview,
  type ThreadMessage,
} from '@/lib/messaging-utils'

export function MessagesPanel() {
  const { data: meData } = useMe()
  const currentUserId = meData?.me?.id
  const [conversations] = useState(DEMO_CONVERSATIONS)
  const [selected, setSelected] = useState<ConversationPreview | undefined>(DEMO_CONVERSATIONS[0])
  const [draft, setDraft] = useState('')
  const [optimisticMessages, setOptimisticMessages] = useState<ThreadMessage[]>([])

  const { data, loading, refetch } = useConversation(
    selected?.referenceType,
    selected?.referenceId,
    { skip: !selected },
  )
  const { sendMessage, loading: sending } = useSendMessage()
  const { markRead } = useMarkMessagesRead()

  useEffect(() => {
    if (!selected) return
    void markRead(selected.referenceType, selected.referenceId)
  }, [selected, markRead])

  const serverMessages = useMemo(
    () => (data?.conversation ?? []).map((message) => ({ ...message, status: 'sent' as const })),
    [data?.conversation],
  )

  const threadMessages = useMemo(() => {
    const serverIds = new Set(serverMessages.map((message) => message.id))
    const pending = optimisticMessages.filter(
      (message) => message.clientId && !serverIds.has(message.id) && message.status !== 'sent',
    )
    return [...serverMessages, ...pending].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  }, [optimisticMessages, serverMessages])

  const handleSend = async () => {
    const body = draft.trim()
    if (!body || !selected || !currentUserId) return

    const clientId = crypto.randomUUID()
    setDraft('')
    setOptimisticMessages((current) => [
      ...current,
      {
        id: clientId,
        clientId,
        senderId: currentUserId,
        recipientId: selected.brandId,
        referenceType: selected.referenceType,
        referenceId: selected.referenceId,
        body,
        attachmentUrl: null,
        isRead: true,
        readAt: null,
        createdAt: new Date().toISOString(),
        status: 'sending',
      },
    ])

    const result = await sendMessage({
      recipientId: selected.brandId,
      body,
      referenceType: selected.referenceType,
      referenceId: selected.referenceId,
    })

    if (result) {
      setOptimisticMessages((current) => current.filter((message) => message.clientId !== clientId))
      void refetch()
      return
    }

    setOptimisticMessages((current) =>
      current.map((message) =>
        message.clientId === clientId ? { ...message, status: 'failed' } : message,
      ),
    )
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        title="No conversations yet"
        description="After you submit to a campaign, you can message the brand about that submission here."
      />
    )
  }

  return (
    <div className="flex min-h-[calc(100svh-12rem)] flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="hidden w-80 shrink-0 border-r border-zinc-200/70 md:flex md:flex-col">
        <ConversationList
          conversations={conversations}
          selectedId={selected?.id}
          onSelect={setSelected}
        />
      </div>
      <ConversationThread
        conversation={selected}
        messages={threadMessages}
        currentUserId={currentUserId}
        loading={loading}
        draft={draft}
        onDraftChange={setDraft}
        onSend={() => void handleSend()}
        sending={sending}
      />
    </div>
  )
}

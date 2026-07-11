import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import {
  CONVERSATION_QUERY,
  MARK_MESSAGES_READ_MUTATION,
  SEND_MESSAGE_MUTATION,
} from '@/graphql/messaging'
import type { Message } from '@/lib/messaging-utils'
import { extractGqlError } from '@/lib/gql-error'

export function useConversation(
  referenceType?: string,
  referenceId?: string,
  options?: { skip?: boolean },
) {
  return useQuery<{ conversation: Message[] }>(CONVERSATION_QUERY, {
    variables: { referenceType, referenceId, limit: 100 },
    skip: options?.skip || !referenceType || !referenceId,
  })
}

export function useSendMessage() {
  const [mutate, state] = useMutation<{ sendMessage: Message }, { input: Record<string, string> }>(
    SEND_MESSAGE_MUTATION,
  )

  const sendMessage = async (input: {
    recipientId: string
    body: string
    referenceType?: string
    referenceId?: string
  }) => {
    try {
      const { data } = await mutate({ variables: { input } })
      return data?.sendMessage ?? null
    } catch (error) {
      toast.error(extractGqlError(error))
      return null
    }
  }

  return { sendMessage, ...state }
}

export function useMarkMessagesRead() {
  const [mutate] = useMutation(MARK_MESSAGES_READ_MUTATION)

  const markRead = async (referenceType: string, referenceId: string) => {
    try {
      await mutate({ variables: { referenceType, referenceId } })
    } catch {
      // non-blocking
    }
  }

  return { markRead }
}

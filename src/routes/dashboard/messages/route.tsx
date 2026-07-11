import { createFileRoute } from '@tanstack/react-router'
import { MessagesPanel } from '@/components/messages/messages-panel'

export const Route = createFileRoute('/dashboard/messages')({
  component: MessagesPage,
})

function MessagesPage() {
  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-6">
      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Messages</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Chat with brands about specific campaigns you have submitted to.
        </p>
      </div>
      <MessagesPanel />
    </div>
  )
}

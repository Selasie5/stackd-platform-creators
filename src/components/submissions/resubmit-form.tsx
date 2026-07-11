import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useResubmitUgcSubmission } from '@/hooks/use-submissions'

export function ResubmitForm({ submissionId }: { submissionId: string }) {
  const { resubmit, loading } = useResubmitUgcSubmission()
  const [videoUrl, setVideoUrl] = React.useState('')
  const [note, setNote] = React.useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await resubmit({
      submissionId,
      videoUrl: videoUrl || undefined,
      submissionNote: note || undefined,
    })
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-zinc-900">Submit revision</h2>
      <p className="mt-1 text-sm text-zinc-500">Upload your revised video and add a note for the brand.</p>

      <form onSubmit={(event) => void handleSubmit(event)} className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="revision-video-url">New video URL</Label>
          <Input
            id="revision-video-url"
            type="url"
            placeholder="https://..."
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="revision-note">Resubmission note</Label>
          <Textarea
            id="revision-note"
            rows={4}
            placeholder="Describe what you changed..."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
        <Button type="submit" isLoading={loading} disabled={!videoUrl || loading}>
          Submit revision
        </Button>
      </form>
    </section>
  )
}

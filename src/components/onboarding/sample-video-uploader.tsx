import * as React from 'react'
import { Plus, Trash2, Upload, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { MAX_SAMPLES, SAMPLE_CATEGORIES } from '@/lib/onboarding/constants'
import { createId, validateVideoFile } from '@/lib/onboarding/storage'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { SampleVideoDraft } from '@/lib/onboarding/types'

interface SampleVideoUploaderProps {
  samples: SampleVideoDraft[]
  onChange: (samples: SampleVideoDraft[]) => void
  fileMapRef: React.MutableRefObject<Map<string, File>>
}

export function SampleVideoUploader({ samples, onChange, fileMapRef }: SampleVideoUploaderProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [uploadingId, setUploadingId] = React.useState<string | null>(null)

  const addSample = () => {
    if (samples.length >= MAX_SAMPLES) return
    onChange([
      ...samples,
      { id: createId(), title: '', category: '', externalLink: '', note: '' },
    ])
  }

  const updateSample = (id: string, patch: Partial<SampleVideoDraft>) => {
    onChange(samples.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const removeSample = (id: string) => {
    fileMapRef.current.delete(id)
    onChange(samples.filter((s) => s.id !== id))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const handleFile = async (id: string, file: File | undefined) => {
    if (!file) return
    const error = validateVideoFile(file)
    if (error) {
      setErrors((prev) => ({ ...prev, [id]: error }))
      return
    }

    setUploadingId(id)
    setErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

    try {
      const videoUrl = await uploadToCloudinary(file)
      fileMapRef.current.delete(id)
      updateSample(id, {
        fileName: file.name,
        fileSize: file.size,
        videoUrl,
        externalLink: '',
      })
    } catch {
      setErrors((prev) => ({ ...prev, [id]: 'Upload failed. Please try again.' }))
    } finally {
      setUploadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        Upload at least one sample video. You can add up to {MAX_SAMPLES} during onboarding.
      </p>

      {samples.map((sample, index) => (
        <div
          key={sample.id}
          className="space-y-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Sample {index + 1}
            </p>
            {samples.length > 1 && (
              <button
                type="button"
                onClick={() => removeSample(sample.id)}
                className="text-zinc-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={sample.title}
              onChange={(e) => updateSample(sample.id, { title: e.target.value })}
              placeholder="e.g. Skincare routine UGC"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={sample.category}
              onChange={(val) => updateSample(sample.id, { category: val })}
              placeholder="Select category"
              options={SAMPLE_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Video file</Label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-zinc-300 px-4 py-3 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
              <Upload className="h-4 w-4 text-zinc-400" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {uploadingId === sample.id
                  ? 'Uploading…'
                  : sample.fileName ?? 'Upload MP4, MOV, or WebM (max 100MB)'}
              </span>
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={(e) => void handleFile(sample.id, e.target.files?.[0])}
              />
            </label>
            {errors[sample.id] && (
              <p className="text-xs text-red-600">{errors[sample.id]}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-zinc-400 dark:bg-zinc-950">or external link</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5" />
              External link
            </Label>
            <Input
              value={sample.externalLink}
              onChange={(e) =>
                updateSample(sample.id, {
                  externalLink: e.target.value,
                  fileName: e.target.value ? undefined : sample.fileName,
                  videoUrl: e.target.value ? undefined : sample.videoUrl,
                })
              }
              placeholder="https://tiktok.com/…"
            />
          </div>

          <div className="space-y-2">
            <Label>Short note</Label>
            <Textarea
              value={sample.note}
              onChange={(e) => updateSample(sample.id, { note: e.target.value })}
              placeholder="Brief context about this sample"
              rows={2}
            />
          </div>
        </div>
      ))}

      {samples.length < MAX_SAMPLES && (
        <Button type="button" variant="outline" onClick={addSample} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add another sample
        </Button>
      )}
    </div>
  )
}

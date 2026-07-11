import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import type { ContestDetail } from '@/hooks/use-opportunities-browse'
import { primaryButtonClasses } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function BriefReminder({ contest }: { contest: ContestDetail }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-zinc-900">Campaign brief reminder</span>
        <ChevronDown className={cn('h-4 w-4 text-zinc-500 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="space-y-3 border-t border-zinc-200 px-4 py-4 text-sm text-zinc-600">
          <p>{contest.shortDescription}</p>
          {contest.fullDescription && <p>{contest.fullDescription}</p>}
          {contest.requiredHashtags && <p>Required hashtags: {contest.requiredHashtags}</p>}
          {contest.requiredCaption && <p>Required caption: {contest.requiredCaption}</p>}
        </div>
      )}
    </div>
  )
}

export function VideoUploadToggle({
  mode,
  onModeChange,
  videoUrl,
  videoLink,
  onVideoUrlChange,
  onVideoLinkChange,
}: {
  mode: 'file' | 'link'
  onModeChange: (mode: 'file' | 'link') => void
  videoUrl: string
  videoLink: string
  onVideoUrlChange: (value: string) => void
  onVideoLinkChange: (value: string) => void
}) {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex gap-2">
        <ToggleButton active={mode === 'file'} onClick={() => onModeChange('file')} label="Upload URL" />
        <ToggleButton active={mode === 'link'} onClick={() => onModeChange('link')} label="External link" />
      </div>
      {mode === 'file' ? (
        <Field label="Hosted video URL" value={videoUrl} onChange={onVideoUrlChange} placeholder="https://..." />
      ) : (
        <Field label="Posted video link" value={videoLink} onChange={onVideoLinkChange} placeholder="https://..." />
      )}
      <Field
        label="Thumbnail URL (optional)"
        value=""
        onChange={() => undefined}
        placeholder="Optional thumbnail"
        disabled
      />
    </div>
  )
}

export function PostingDetailsSection({
  postingRequired,
  postedVideoLink,
  platform,
  submittedViews,
  engagementCount,
  onPostedVideoLinkChange,
  onPlatformChange,
  onSubmittedViewsChange,
  onEngagementCountChange,
}: {
  postingRequired: boolean
  postedVideoLink: string
  platform: string
  submittedViews: string
  engagementCount: string
  onPostedVideoLinkChange: (value: string) => void
  onPlatformChange: (value: string) => void
  onSubmittedViewsChange: (value: string) => void
  onEngagementCountChange: (value: string) => void
}) {
  if (!postingRequired) return null

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-base font-semibold text-zinc-900">Posting details</h2>
      <Field label="Posted video link" value={postedVideoLink} onChange={onPostedVideoLinkChange} />
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-zinc-700">Platform</span>
        <select
          value={platform}
          onChange={(event) => onPlatformChange(event.target.value)}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2"
        >
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
          <option value="youtube_shorts">YouTube Shorts</option>
          <option value="any">Any</option>
        </select>
      </label>
      <Field label="Current view count" value={submittedViews} onChange={onSubmittedViewsChange} />
      <Field label="Current engagement count" value={engagementCount} onChange={onEngagementCountChange} />
    </div>
  )
}

export function SubmissionConfirmations({
  values,
  onChange,
}: {
  values: {
    confirmedFollowsBrief: boolean
    confirmedOriginal: boolean
    confirmedNoFakeEngagement: boolean
    agreedToUsageRights: boolean
  }
  onChange: (key: keyof typeof values, value: boolean) => void
}) {
  const items = [
    ['confirmedFollowsBrief', 'I confirm this content follows the campaign brief'],
    ['confirmedOriginal', 'I confirm this is my original content'],
    ['confirmedNoFakeEngagement', 'I confirm no fake or purchased engagement has been used'],
    ['agreedToUsageRights', 'I agree to the usage rights terms for this contest'],
  ] as const

  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-base font-semibold text-zinc-900">Confirmations</h2>
      {items.map(([key, label]) => (
        <label key={key} className="flex items-start gap-3 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={values[key]}
            onChange={(event) => onChange(key, event.target.checked)}
            className="mt-1"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  )
}

function ToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium',
        active ? cn('border-primary', primaryButtonClasses) : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
      )}
    >
      {label}
    </button>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-zinc-200 px-3 py-2"
      />
    </label>
  )
}

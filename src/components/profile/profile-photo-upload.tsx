import * as React from 'react'
import { Camera, Trash2 } from 'lucide-react'
import * as Avatar from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useUpdateCreatorProfile } from '@/hooks/use-settings'
import { uploadToCloudinary } from '@/lib/cloudinary'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function validateProfileImage(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Please choose a JPG, PNG, WebP, or GIF image.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image must be 5 MB or smaller.'
  }
  return null
}

export function ProfilePhotoUpload({
  name,
  profileImage,
}: {
  name: string
  profileImage?: string | null
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { updateProfile, loading } = useUpdateCreatorProfile()
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const busy = loading || uploading
  const hasCustomPhoto = Boolean(profileImage)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const validationError = validateProfileImage(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setUploading(true)

    try {
      const url = await uploadToCloudinary(file)
      await updateProfile({ profileImage: url })
    } catch {
      setError('Could not upload your photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    setError(null)
    await updateProfile({ profileImage: null })
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-zinc-900">Profile photo</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Brands see this on your creator profile. Use a clear photo of yourself.
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar.Root size="48" color="blue" src={profileImage} />
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-black/5" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">{name}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {hasCustomPhoto ? 'Custom photo uploaded' : 'Using default illustration'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            className="hidden"
            onChange={(event) => void handleFileChange(event)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            isLoading={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            {hasCustomPhoto ? 'Change photo' : 'Upload photo'}
          </Button>
          {hasCustomPhoto ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              isLoading={loading && !uploading}
              onClick={() => void handleRemove()}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </section>
  )
}

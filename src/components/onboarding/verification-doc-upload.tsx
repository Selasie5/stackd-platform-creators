import * as React from 'react'
import { Upload, FileText, Trash2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { createId, validateDocFile } from '@/lib/onboarding/storage'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { VerificationDocDraft, VerificationDocType } from '@/lib/onboarding/types'

const DOC_TYPES: { id: VerificationDocType; label: string; description: string }[] = [
  { id: 'student_id', label: 'Student ID', description: 'Photo of your valid student ID card' },
  {
    id: 'admission_letter',
    label: 'Admission letter',
    description: 'Official letter from your institution',
  },
  {
    id: 'school_email',
    label: 'School email',
    description: 'Use your .edu or institutional email address',
  },
  { id: 'other', label: 'Other document', description: 'Any other proof of student status' },
]

interface VerificationDocUploadProps {
  docs: VerificationDocDraft[]
  schoolEmail: string
  otherDocNote: string
  onDocsChange: (docs: VerificationDocDraft[]) => void
  onSchoolEmailChange: (value: string) => void
  onOtherDocNoteChange: (value: string) => void
  fileMapRef: React.MutableRefObject<Map<string, File>>
}

export function VerificationDocUpload({
  docs,
  schoolEmail,
  otherDocNote,
  onDocsChange,
  onSchoolEmailChange,
  onOtherDocNoteChange,
  fileMapRef,
}: VerificationDocUploadProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [uploadingId, setUploadingId] = React.useState<string | null>(null)

  const getDoc = (type: VerificationDocType) => docs.find((d) => d.type === type)

  const handleUpload = async (type: VerificationDocType, file: File | undefined) => {
    if (!file) return
    const error = validateDocFile(file)
    if (error) {
      setErrors((prev) => ({ ...prev, [type]: error }))
      return
    }

    setUploadingId(type)
    setErrors((prev) => {
      const next = { ...prev }
      delete next[type]
      return next
    })

    try {
      const fileUrl = await uploadToCloudinary(file)
      const id = getDoc(type)?.id ?? createId()
      fileMapRef.current.delete(id)
      const nextDoc: VerificationDocDraft = {
        id,
        type,
        fileName: file.name,
        fileSize: file.size,
        fileUrl,
      }
      onDocsChange([...docs.filter((d) => d.type !== type), nextDoc])
    } catch {
      setErrors((prev) => ({ ...prev, [type]: 'Upload failed. Please try again.' }))
    } finally {
      setUploadingId(null)
    }
  }

  const removeDoc = (type: VerificationDocType) => {
    const doc = getDoc(type)
    if (doc) fileMapRef.current.delete(doc.id)
    onDocsChange(docs.filter((d) => d.type !== type))
  }

  return (
    <div className="space-y-3">
        {DOC_TYPES.map((docType) => {
          const existing = getDoc(docType.id)
          const isSchoolEmail = docType.id === 'school_email'

          return (
            <div
              key={docType.id}
              className={cn(
                'rounded-xl border p-4 transition-colors',
                existing || (isSchoolEmail && schoolEmail)
                  ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20'
                  : 'border-zinc-200 dark:border-zinc-800',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {docType.label}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">{docType.description}</p>
                </div>
                {(existing || (isSchoolEmail && schoolEmail)) && !isSchoolEmail && (
                  <button
                    type="button"
                    onClick={() => removeDoc(docType.id)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isSchoolEmail ? (
                <div className="mt-3 space-y-2">
                  <Label htmlFor="schoolEmail">Institutional email</Label>
                  <Input
                    id="schoolEmail"
                    type="email"
                    value={schoolEmail}
                    onChange={(e) => onSchoolEmailChange(e.target.value)}
                    placeholder="you@university.edu"
                  />
                </div>
              ) : (
                <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-zinc-300 px-3 py-2.5 hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900">
                  {existing ? (
                    <FileText className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Upload className="h-4 w-4 text-zinc-400" />
                  )}
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    {uploadingId === docType.id
                      ? 'Uploading…'
                      : existing?.fileName ?? 'Upload JPG, PNG, or PDF (max 10MB)'}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => void handleUpload(docType.id, e.target.files?.[0])}
                  />
                </label>
              )}

              {errors[docType.id] && (
                <p className="mt-1 text-xs text-red-600">{errors[docType.id]}</p>
              )}
            </div>
          )
        })}
      {getDoc('other') && (
        <div className="space-y-2">
          <Label htmlFor="otherDocNote">Note about other document</Label>
          <Textarea
            id="otherDocNote"
            value={otherDocNote}
            onChange={(e) => onOtherDocNoteChange(e.target.value)}
            placeholder="Briefly describe what you uploaded"
            rows={2}
          />
        </div>
      )}
    </div>
  )
}

import * as React from 'react'
import {
  ACCEPTED_DOC_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MAX_DOC_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
} from './constants'

export function validateVideoFile(file: File): string | null {
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    return 'Upload MP4, MOV, or WebM video files only.'
  }
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return 'Video must be 100MB or less.'
  }
  return null
}

export function validateDocFile(file: File): string | null {
  if (!ACCEPTED_DOC_TYPES.includes(file.type)) {
    return 'Upload JPG, PNG, WebP, or PDF files only.'
  }
  if (file.size > MAX_DOC_SIZE_BYTES) {
    return 'Document must be 10MB or less.'
  }
  return null
}

export function usePersistedState<T>(key: string, initial: T) {
  const [state, setState] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = localStorage.getItem(key)
      return raw ? ({ ...initial, ...JSON.parse(raw) } as T) : initial
    } catch {
      return initial
    }
  })

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [key, state])

  return [state, setState] as const
}

export function createId() {
  return crypto.randomUUID()
}

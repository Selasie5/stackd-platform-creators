import { useEffect, useRef, useState } from 'react'
import { useLazyQuery } from '@apollo/client/react'
import { AlertCircle, CheckCircle2, HelpCircle, Loader2, XCircle } from 'lucide-react'
import { CHECK_SOCIAL_HANDLE_QUERY, type CheckSocialHandleQuery } from '@/graphql/creator'
import { Input } from '@/components/ui/input'
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: '@username',
  instagram: '@username',
  youtube: '@channel',
}

const PLATFORM_PATTERNS: Record<string, RegExp> = {
  tiktok: /^[a-zA-Z0-9_.]{2,24}$/,
  instagram: /^[a-zA-Z0-9._]{1,30}$/,
  youtube: /^[a-zA-Z0-9_-]{2,30}$/,
}

interface CheckResult {
  valid: boolean
  displayName?: string | null
  followerCount?: number | null
  error?: string | null
}

function extractHandle(input: string): string {
  let handle = input.trim()
  if (handle.startsWith('@')) handle = handle.slice(1)
  if (handle.startsWith('http://') || handle.startsWith('https://')) {
    const parts = handle.replace(/\/+$/, '').split('/')
    handle = parts[parts.length - 1] ?? ''
    if (handle.startsWith('@')) handle = handle.slice(1)
  }
  return handle
}

function validateFormat(handle: string, platform: string): string | null {
  if (!handle) return null
  const pattern = PLATFORM_PATTERNS[platform]
  if (!pattern) return null
  if (!pattern.test(handle)) return 'Invalid handle format'
  return null
}

export function SocialHandleInput({
  platform,
  value,
  onChange,
  placeholder,
  onValidationResult,
}: {
  platform: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onValidationResult?: (result: CheckResult | null) => void
}) {
  const [result, setResult] = useState<CheckResult | null>(null)
  const [checking, setChecking] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const seqRef = useRef(0)

  const [checkHandle] = useLazyQuery<CheckSocialHandleQuery>(CHECK_SOCIAL_HANDLE_QUERY, {
    fetchPolicy: 'no-cache',
  })

  const onValidationResultRef = useRef(onValidationResult)
  onValidationResultRef.current = onValidationResult

  const trimmed = value.trim()
  const extracted = extractHandle(value)
  const formatError = validateFormat(extracted, platform)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!trimmed || formatError) {
      setResult(null)
      setChecking(false)
      seqRef.current += 1
      return
    }

    setChecking(true)
    const seq = ++seqRef.current

    timerRef.current = setTimeout(async () => {
      try {
        const { data } = await checkHandle({ variables: { platform, handle: trimmed } })
        if (seq === seqRef.current && data?.checkSocialHandle) {
          setResult(data.checkSocialHandle)
        }
      } catch {
        if (seq === seqRef.current) {
          setResult({ valid: false, error: 'Check failed' })
        }
      } finally {
        if (seq === seqRef.current) {
          setChecking(false)
        }
      }
    }, 600)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, platform, checkHandle, trimmed, formatError])

  useEffect(() => {
    if (!trimmed) {
      onValidationResultRef.current?.(null)
    } else if (formatError) {
      onValidationResultRef.current?.({ valid: false, error: formatError })
    } else {
      onValidationResultRef.current?.({ valid: true })
    }
  }, [trimmed, formatError])

  const showIcon = !!(trimmed && (formatError || checking || result))

  function iconAndTooltip() {
    if (!showIcon) return null

    let icon: React.ReactNode
    let tooltip: string | null = null

    if (formatError) {
      icon = <XCircle className="h-4 w-4 text-red-400" />
      tooltip = 'Invalid handle format'
    } else if (checking) {
      icon = <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
    } else if (result?.valid) {
      icon = <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      const parts = [result.displayName].filter(Boolean)
      if (result.followerCount != null) {
        parts.push(`${result.followerCount.toLocaleString()} followers`)
      }
      tooltip = parts.length > 0 ? parts.join(' · ') : 'Verified'
    } else {
      const errMsg = result?.error ?? ''
      if (errMsg.toLowerCase().includes('not found')) {
        icon = <AlertCircle className="h-4 w-4 text-amber-500" />
        tooltip = `Could not confirm this ${platform} account exists`
      } else {
        icon = <HelpCircle className="h-4 w-4 text-zinc-400" />
        tooltip = 'Verification temporarily unavailable'
      }
    }

    const iconEl = <span className="flex items-center">{icon}</span>

    if (!tooltip) return iconEl

    return (
      <TooltipRoot>
        <TooltipTrigger asChild>{iconEl}</TooltipTrigger>
        <TooltipContent side="top" align="end" size="xsmall">
          {tooltip}
        </TooltipContent>
      </TooltipRoot>
    )
  }

  return (
    <TooltipProvider>
      <div className="relative">
        <Input
          value={value}
          placeholder={placeholder ?? PLATFORM_LABELS[platform] ?? '@handle'}
          onChange={(e) => onChange(e.target.value)}
          className="pr-9"
        />
        <div className="absolute right-3 inset-y-0 flex items-center">
          {iconAndTooltip()}
        </div>
      </div>
    </TooltipProvider>
  )
}

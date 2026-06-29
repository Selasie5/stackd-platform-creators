import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthShellProps {
  title: string
  subtitle?: string
  topRightText?: string
  topRightLinkText?: string
  topRightLinkTo?: string
  bannerText?: string | null
  onBack?: () => void
  backLabel?: string
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function AuthBackLink({
  label,
  onClick,
  className,
}: {
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
        className,
      )}
    >
      <ChevronLeft className="h-3 w-3" />
      {label}
    </button>
  )
}

export function AuthShell({
  title,
  subtitle,
  topRightText,
  topRightLinkText,
  topRightLinkTo = '/',
  bannerText,
  onBack,
  backLabel = 'Back',
  footer,
  children,
  className,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f4f4f5]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.03) 40%, rgba(0,0,0,0.03) 41%, transparent 41%),
            linear-gradient(225deg, transparent 40%, rgba(0,0,0,0.03) 40%, rgba(0,0,0,0.03) 41%, transparent 41%),
            linear-gradient(45deg, transparent 48%, rgba(0,0,0,0.02) 48%, rgba(0,0,0,0.02) 52%, transparent 52%)
          `,
          backgroundSize: '120px 120px, 160px 160px, 200px 200px',
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-6">
        <div
          className={cn(
            'w-full max-w-[560px] rounded-2xl border border-zinc-200/80 bg-white px-8 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-950',
            className,
          )}
        >
          {bannerText && (
            <div className="mb-6 rounded-lg bg-lime-50 px-4 py-2.5 text-center text-xs font-medium text-lime-900 dark:bg-lime-950 dark:text-lime-200">
              {bannerText}
            </div>
          )}

          {onBack && (
            <div className="mb-5">
              <AuthBackLink label={backLabel} onClick={onBack} />
            </div>
          )}

          <header className="mb-5 flex items-center justify-between">
            <img src="/favicon.svg" alt="Stackd" className="h-9 w-9" />
            {topRightLinkText && (
              <div className="text-sm">
                {topRightText && <span className="mr-1 text-zinc-400">{topRightText}</span>}
                <Link
                  to={topRightLinkTo}
                  className="font-semibold text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
                >
                  {topRightLinkText}
                </Link>
              </div>
            )}
          </header>

          <div className="mb-5 text-center">
            <h1 className="text-[1.5rem] font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </h1>
            {subtitle && (
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>

          <main>{children}</main>

          {footer ?? (
            <p className="mt-5 text-center text-xs leading-relaxed text-zinc-500">
              By continuing, you agree to Stackd&apos;s{' '}
              <Link to="/" className="text-blue-600 underline underline-offset-2">
                Terms of Service
              </Link>{' '}
              &amp;{' '}
              <Link to="/" className="text-blue-600 underline underline-offset-2">
                Privacy Policy
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

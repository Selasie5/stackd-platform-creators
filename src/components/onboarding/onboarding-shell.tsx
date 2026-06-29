import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { ONBOARDING_STEPS } from '@/lib/onboarding/constants'
import { AuthBackLink } from '@/components/auth-shell'

interface OnboardingShellProps {
  step: number
  title: string
  subtitle?: string
  onBack?: () => void
  backLabel?: string
  children: React.ReactNode
}

export function OnboardingShell({
  step,
  title,
  subtitle,
  onBack,
  backLabel = 'Back',
  children,
}: OnboardingShellProps) {
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
        <div className="w-full max-w-[640px] rounded-2xl border border-zinc-200/80 bg-white px-8 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-950">
          {onBack && (
            <div className="mb-5">
              <AuthBackLink label={backLabel} onClick={onBack} />
            </div>
          )}

          <header className="mb-5 flex items-center justify-between">
            <img src="/favicon.svg" alt="Stackd" className="h-9 w-9" />
            <div className="text-sm">
              <span className="mr-1 text-zinc-400">Already have an account?</span>
              <Link
                to="/signin"
                className="font-semibold text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
              >
                Sign In
              </Link>
            </div>
          </header>

          <div className="mb-4 flex items-center gap-2">
            {ONBOARDING_STEPS.map((s) => (
              <div
                key={s.id}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  s.id <= step ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800',
                )}
              />
            ))}
          </div>

          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Step {step} of {ONBOARDING_STEPS.length} · {ONBOARDING_STEPS[step - 1]?.label}
          </p>

          <div className="mb-6">
            <h1 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>

          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}

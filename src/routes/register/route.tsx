import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'
import { AuthShell } from '@/components/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { EMPTY_SIGNUP, type SignupDraft } from '@/lib/onboarding/types'
import { usePersistedState } from '@/lib/onboarding/storage'

const registerSearchSchema = z.object({
  step: z.coerce.number().int().min(1).max(2).optional(),
})

export const Route = createFileRoute('/register')({
  validateSearch: registerSearchSchema,
  component: RegisterRoute,
})

function RegisterRoute() {
  const { step = 1 } = Route.useSearch()
  const navigate = useNavigate()
  const [form, setForm] = usePersistedState<SignupDraft>('creator-signup-draft', EMPTY_SIGNUP)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const setStep = (newStep: number) => {
    navigate({ to: '/register', search: { step: newStep } })
  }

  const update = (patch: Partial<SignupDraft>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsSubmitting(false)
    localStorage.removeItem('creator-signup-draft')
    toast.success('Account created! Complete your creator profile.')
    navigate({ to: '/onboarding/creator', search: { step: 1 } })
  }

  return (
    <AuthShell
      title="Let's turn those ideas into income"
      subtitle="Join Stackd as a creator and start earning from your content."
      topRightText="Already have an account?"
      topRightLinkText="Sign In"
      topRightLinkTo="/signin"
      footer={step === 1 ? undefined : null}
      onBack={step === 2 ? () => setStep(1) : undefined}
      backLabel="Back to email"
    >
      <form className="space-y-4" onSubmit={step === 1 ? handleStep1 : handleStep2}>
        {step === 1 ? (
          <div className="animate-in fade-in space-y-4 duration-200">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>

            <Button type="submit" variant="auth" size="auth">
              Continue
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-4 duration-200">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => update({ fullName: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                value={form.password}
                onChange={(e) => update({ password: e.target.value })}
                placeholder="Create a password (min. 8 characters)"
                minLength={8}
                required
              />
            </div>

            <p className="text-xs leading-relaxed text-zinc-500">
              By creating a creator account, you agree to our{' '}
              <Link to="/" className="text-zinc-900 underline underline-offset-4">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/" className="text-zinc-900 underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>

            <Button type="submit" variant="auth" size="auth" isLoading={isSubmitting}>
              Create account
            </Button>
          </div>
        )}
      </form>
    </AuthShell>
  )
}

import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'
import { AuthShell } from '@/components/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'

const searchSchema = z.object({
  action: z.enum(['forgot-password', 'check-email', 'reset-password']).optional(),
  email: z.string().email().optional(),
})

export const Route = createFileRoute('/signin')({
  validateSearch: searchSchema,
  component: SignInRoute,
})

function SignInRoute() {
  const { action, email: emailFromSearch } = Route.useSearch()
  const navigate = useNavigate()

  const [email, setEmail] = React.useState(emailFromSearch ?? '')
  const [password, setPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [otp, setOtp] = React.useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const otpInputRefs = React.useRef<Array<HTMLInputElement | null>>([])

  React.useEffect(() => {
    if (emailFromSearch) setEmail(emailFromSearch)
  }, [emailFromSearch])

  const goTo = (newAction?: typeof action, emailOverride?: string) => {
    navigate({
      to: '/signin',
      search: {
        ...(newAction ? { action: newAction } : {}),
        ...((emailOverride ?? email) ? { email: emailOverride ?? email } : {}),
      },
    })
  }

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) value = value.slice(-1)
    const next = [...otp]
    next[index] = value
    setOtp(next)
    setOtpError('')
    if (value !== '' && index < 5) otpInputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsLoading(false)
    toast.success('Signed in!')
    navigate({ to: '/' })
  }

  if (action === 'forgot-password') {
    return (
      <AuthShell
        title="Forgot your password?"
        subtitle="Enter the email associated with your account and we'll send a verification code."
        topRightText="Remember your password?"
        topRightLinkText="Sign In"
        topRightLinkTo="/signin"
        footer={null}
        onBack={() => goTo(undefined)}
        backLabel="Back to sign in"
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            toast.success('Verification code sent.')
            goTo('check-email')
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          <Button type="submit" variant="auth" size="auth">
            Send verification code
          </Button>
        </form>
      </AuthShell>
    )
  }

  if (action === 'check-email') {
    return (
      <AuthShell
        title="Check your email"
        subtitle="We've sent a verification code to your email. Enter it below to continue."
        topRightText="Remember your password?"
        topRightLinkText="Sign In"
        topRightLinkTo="/signin"
        footer={null}
        onBack={() => goTo('forgot-password')}
        backLabel="Back"
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (otp.some((digit) => digit === '')) {
              setOtpError('Enter the full 6-digit verification code.')
              return
            }
            setOtpError('')
            goTo('reset-password')
          }}
        >
          <div className="mx-auto flex max-w-[360px] items-center justify-between py-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpInputRefs.current[index] = el
                }}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                className="h-14 w-12 rounded-xl border border-zinc-200 bg-transparent text-center text-xl font-bold outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200/60 dark:border-zinc-800"
                required
              />
            ))}
          </div>
          {otpError && <p className="text-center text-xs text-red-600">{otpError}</p>}
          <Button type="submit" variant="auth" size="auth">
            Verify code
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => toast.success('Verification code resent.')}
              className="text-xs font-semibold text-zinc-500 underline underline-offset-4 hover:text-zinc-900"
            >
              Resend verification code?
            </button>
          </div>
        </form>
      </AuthShell>
    )
  }

  if (action === 'reset-password') {
    return (
      <AuthShell
        title="Create a new password"
        subtitle="Choose a strong password to secure your account."
        topRightText="Remember your password?"
        topRightLinkText="Sign In"
        topRightLinkTo="/signin"
        footer={null}
        onBack={() => goTo('check-email')}
        backLabel="Back"
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (newPassword !== confirmPassword) {
              setPasswordError('Passwords do not match.')
              return
            }
            setPasswordError('')
            toast.success('Password reset. Please sign in.')
            goTo(undefined)
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setPasswordError('')
              }}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setPasswordError('')
              }}
              required
              minLength={8}
            />
          </div>
          {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
          <Button type="submit" variant="auth" size="auth">
            Reset password
          </Button>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Let's turn those ideas into income"
      subtitle="Sign in to your creator account and pick up where you left off."
      topRightText="Don't have an account?"
      topRightLinkText="Sign Up"
      topRightLinkTo="/register"
    >
      <form className="space-y-5" onSubmit={handleSignIn}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => goTo('forgot-password')}
              className="text-xs font-semibold text-zinc-500 underline underline-offset-4"
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" variant="auth" size="auth" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  )
}

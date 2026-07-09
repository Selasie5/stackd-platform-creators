import { useState } from 'react'
import type {
  ActiveSession,
  NotificationPreferences,
} from '@/hooks/use-settings'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import {
  Bell,
  ChevronRight,
  Lock,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import type { ElementType, ReactNode } from 'react'
import { VerificationSettingsPanel } from '@/components/dashboard/verification-settings-panel'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { Skeleton } from '@/components/ui/skeleton'
import { useMe, useLogout } from '@/hooks/use-auth'
import {
  useActiveSessions,
  useChangePassword,
  useNotificationPreferences,
  useRevokeSession,
  useUpdateNotificationPreferences,
} from '@/hooks/use-settings'
import { cn } from '@/lib/utils'

const settingsSearchSchema = z.object({
  tab: z
    .enum(['profile', 'verification', 'notifications', 'security'])
    .optional()
    .default('profile'),
})

export const Route = createFileRoute('/dashboard/settings')({
  validateSearch: settingsSearchSchema,
  component: SettingsPage,
})

type SettingsTab = 'profile' | 'verification' | 'notifications' | 'security'

const SETTINGS_GROUPS = ['ACCOUNT', 'PREFERENCES'] as const

type SettingsGroup = (typeof SETTINGS_GROUPS)[number]

const SETTINGS_TABS: Array<{
  id: SettingsTab
  label: string
  icon: ElementType
  group: SettingsGroup
}> = [
  { id: 'profile', label: 'Profile', icon: UserRound, group: 'ACCOUNT' },
  {
    id: 'verification',
    label: 'Verification',
    icon: ShieldCheck,
    group: 'ACCOUNT',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    group: 'PREFERENCES',
  },
  { id: 'security', label: 'Security', icon: Lock, group: 'PREFERENCES' },
]

function SettingsPage() {
  const { tab } = Route.useSearch()
  const navigate = useNavigate()
  const { data } = useMe()
  const kycStatus = data?.me?.creator?.kycStatus
  const activeTab =
    SETTINGS_TABS.find((item) => item.id === tab) ?? SETTINGS_TABS[0]

  const setTab = (nextTab: SettingsTab) => {
    navigate({ to: '/dashboard/settings', search: { tab: nextTab } })
  }

  const closeSettings = () => {
    navigate({ to: '/dashboard/overview' })
  }

  const renderTabButton = (
    item: (typeof SETTINGS_TABS)[number],
    mobile = false,
  ) => {
    const Icon = item.icon
    const isActive = tab === item.id

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setTab(item.id)}
        className={cn(
          'group relative flex items-center gap-2 rounded-xl px-3 text-left text-[13px] transition duration-200 ease-out',
          mobile ? 'h-10 shrink-0' : 'h-9 w-full',
          isActive
            ? 'bg-zinc-100 font-medium text-zinc-950'
            : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800',
        )}
      >
        <Icon
          className={cn(
            'h-4 w-4 shrink-0 transition-colors',
            isActive
              ? 'text-primary'
              : 'text-zinc-400 group-hover:text-zinc-600',
          )}
        />
        <span className="flex-1 whitespace-nowrap">{item.label}</span>
        {isActive && !mobile && (
          <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
        )}
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-zinc-950/45 p-4 backdrop-blur-sm sm:p-6"
      role="presentation"
      onClick={closeSettings}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
        aria-describedby="settings-dialog-description"
        className="relative mx-auto flex h-[min(760px,calc(100svh-2rem))] w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-white text-zinc-950 shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:h-[min(760px,calc(100svh-3rem))]"
        onClick={(event) => event.stopPropagation()}
      >
        <aside className="hidden w-64 shrink-0 flex-col gap-5 border-r border-zinc-200/70 p-4 md:flex">
          {SETTINGS_GROUPS.map((group, index) => (
            <div
              key={group}
              className={cn(index > 0 && 'border-t border-zinc-100 pt-5')}
            >
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                {group}
              </p>
              <nav className="space-y-1">
                {SETTINGS_TABS.filter((item) => item.group === group).map(
                  (item) => renderTabButton(item),
                )}
              </nav>
            </div>
          ))}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-zinc-50/40">
          <div className="flex items-start gap-4 border-b border-zinc-200/70 bg-white px-5 py-4 sm:px-6">
            <div className="min-w-0 flex-1">
              <h1
                id="settings-dialog-title"
                className="text-base font-semibold text-zinc-950"
              >
                {activeTab.label}
              </h1>
              <p
                id="settings-dialog-description"
                className="mt-1 text-sm text-zinc-500"
              >
                Manage your Spleenet creator settings and account preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={closeSettings}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Close settings"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="border-b border-zinc-200/70 bg-white p-4 md:hidden">
            <nav className="flex gap-2 overflow-x-auto pb-1">
              {SETTINGS_TABS.map((item) => renderTabButton(item, true))}
            </nav>
          </div>

          <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-4xl">
              {tab === 'profile' && <ProfileShortcutPanel />}
              {tab === 'verification' && (
                <VerificationSettingsPanel kycStatus={kycStatus} />
              )}
              {tab === 'notifications' && <NotificationTogglesPanel />}
              {tab === 'security' && <SecurityPanel />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
        ) : null}
      </div>
      <div className="px-5 py-5">{children}</div>
    </section>
  )
}

function ProfileShortcutPanel() {
  const { data } = useMe()
  const { logout, loading } = useLogout()
  const creator = data?.me?.creator

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Profile"
        description="Edit your creator profile, samples, and payment details."
      >
        <p className="text-sm text-zinc-600">
          Manage your full profile on the dedicated profile page, including
          sample videos and social handles.
        </p>
        <Button asChild className="mt-4" size="sm">
          <Link to="/dashboard/profile">
            Open profile
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </SettingsCard>

      <SettingsCard title="Account summary">
        <dl className="grid gap-4 sm:grid-cols-2">
          <SummaryItem label="Name" value={creator?.fullName ?? '—'} />
          <SummaryItem label="Email" value={data?.me?.email ?? '—'} />
          <SummaryItem label="School" value={creator?.school ?? '—'} />
          <SummaryItem
            label="Location"
            value={
              [creator?.city, creator?.country].filter(Boolean).join(', ') ||
              '—'
            }
          />
        </dl>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => void logout()}
          isLoading={loading}
        >
          Sign out
        </Button>
      </SettingsCard>
    </div>
  )
}

function NotificationTogglesPanel() {
  const { data, loading } = useNotificationPreferences()
  const { updatePreferences, loading: saving } =
    useUpdateNotificationPreferences()
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null)
  const current = prefs ?? data?.notificationPreferences ?? null

  const toggle = async (key: keyof NotificationPreferences) => {
    if (!current) return
    const previous = current
    const next = { ...current, [key]: !current[key] }
    setPrefs(next)
    try {
      await updatePreferences(next)
    } catch {
      setPrefs(previous)
    }
  }

  if (loading && !current)
    return <Skeleton className="h-48 w-full rounded-2xl" />

  const items: Array<{
    key: keyof NotificationPreferences
    label: string
    description: string
  }> = [
    {
      key: 'emailCampaignUpdates',
      label: 'Campaign updates',
      description: 'Submission and payout notifications by email.',
    },
    {
      key: 'emailSecurity',
      label: 'Security emails',
      description: 'Sign-in alerts and password changes.',
    },
    {
      key: 'emailMarketing',
      label: 'Marketing emails',
      description: 'Tips and product updates.',
    },
    {
      key: 'pushCampaignUpdates',
      label: 'Campaign push',
      description: 'Instant updates for campaign activity.',
    },
    {
      key: 'pushSecurity',
      label: 'Security push',
      description: 'Security alerts on your device.',
    },
    {
      key: 'pushMarketing',
      label: 'Marketing push',
      description: 'Promotional push notifications.',
    },
  ]

  return (
    <SettingsCard
      title="Notification preferences"
      description="Choose which notifications you receive."
    >
      <div className="divide-y divide-zinc-100">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-zinc-900">{item.label}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{item.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={current?.[item.key] ?? false}
              aria-label={item.label}
              disabled={saving}
              onClick={() => void toggle(item.key)}
              className={cn(
                'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors',
                current?.[item.key] ? 'bg-zinc-900' : 'bg-zinc-200',
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                  current?.[item.key] ? 'translate-x-4' : 'translate-x-0',
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </SettingsCard>
  )
}

function SecurityPanel() {
  return (
    <div className="space-y-6">
      <ChangePasswordSection />
      <SessionManagerSection />
    </div>
  )
}

function ChangePasswordSection() {
  const { changePassword, loading } = useChangePassword()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    newPassword === confirmPassword

  return (
    <SettingsCard title="Change password">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (!canSubmit) return
          void changePassword(currentPassword, newPassword).then((ok) => {
            if (ok) {
              setCurrentPassword('')
              setNewPassword('')
              setConfirmPassword('')
            }
          })
        }}
      >
        <Field label="Current password" id="current-password">
          <PasswordInput
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </Field>
        <Field label="New password" id="new-password">
          <PasswordInput
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Field>
        <Field label="Confirm new password" id="confirm-password">
          <PasswordInput
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Field>
        <Button
          type="submit"
          size="sm"
          isLoading={loading}
          disabled={!canSubmit || loading}
        >
          Update password
        </Button>
      </form>
    </SettingsCard>
  )
}

function SessionManagerSection() {
  const { data, loading } = useActiveSessions()
  const { revokeSession, loading: revoking } = useRevokeSession()
  const sessions = data?.activeSessions ?? []

  return (
    <SettingsCard
      title="Active sessions"
      description="Devices signed into your account."
    >
      {loading && sessions.length === 0 ? (
        <Skeleton className="h-20 w-full" />
      ) : sessions.length === 0 ? (
        <p className="text-sm text-zinc-500">No active sessions found.</p>
      ) : (
        <div className="divide-y divide-zinc-100">
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              onRevoke={(id) => void revokeSession(id)}
              revoking={revoking}
            />
          ))}
        </div>
      )}
    </SettingsCard>
  )
}

function SessionRow({
  session,
  onRevoke,
  revoking,
}: {
  session: ActiveSession
  onRevoke: (id: string) => void
  revoking: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-zinc-900">
          {session.deviceName}
          {session.isCurrent ? (
            <span className="ml-2 text-xs text-blue-600">Current</span>
          ) : null}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">
          {session.platform} · {session.ipAddress ?? 'Unknown IP'}
        </p>
      </div>
      {!session.isCurrent ? (
        <Button
          variant="outline"
          size="sm"
          disabled={revoking}
          onClick={() => onRevoke(session.id)}
        >
          Revoke
        </Button>
      ) : null}
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-900">{value}</dd>
    </div>
  )
}

function Field({
  label,
  id,
  children,
}: {
  label: string
  id: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-zinc-700">
        {label}
      </Label>
      {children}
    </div>
  )
}

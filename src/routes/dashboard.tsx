import * as React from 'react'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { DashboardTopBar } from '@/components/dashboard/dashboard-top-bar'
import { MainContentPanel } from '@/components/dashboard/main-content-panel'
import { MobileBottomNav } from '@/components/dashboard/mobile-bottom-nav'
import { VerificationPendingBanner } from '@/components/dashboard/overview/verification-pending-banner'
import { useMe } from '@/hooks/use-auth'
import { requiresVerification } from '@/lib/kyc'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()
  const { data, loading } = useMe()
  const user = data?.me

  React.useEffect(() => {
    if (loading) return
    if (!user) {
      navigate({ to: '/signin' })
      return
    }
    if (user.creator && !user.creator.isProfileComplete) {
      navigate({ to: '/onboarding/creator', search: { step: 1 } })
    }
  }, [loading, navigate, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shell text-sm text-muted-foreground">
        Loading your dashboard…
      </div>
    )
  }

  const kycStatus = user.creator?.kycStatus
  const showVerificationBanner = requiresVerification(kycStatus)

  return (
    <div className="flex h-svh max-h-svh flex-col overflow-hidden bg-shell">
      {showVerificationBanner && <VerificationPendingBanner kycStatus={kycStatus} />}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <DashboardSidebar />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-shell p-2 pl-1.5">
          <MainContentPanel>
            <DashboardTopBar user={user} />

            <main className="min-h-0 flex-1 overflow-y-auto bg-background pb-20 md:pb-0">
              <Outlet />
            </main>
          </MainContentPanel>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}

import { createFileRoute, redirect } from '@tanstack/react-router'
import { apolloClient } from '@/lib/apollo-client'
import { ME_QUERY } from '@/graphql/auth'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    try {
      const { data } = await apolloClient.query<{ me: { creator?: { isProfileComplete: boolean } | null } | null }>({
        query: ME_QUERY,
        fetchPolicy: 'network-only',
      })

      const user = data?.me
      if (!user) {
        throw redirect({ to: '/signin' })
      }

      if (user.creator && !user.creator.isProfileComplete) {
        throw redirect({ to: '/onboarding/creator', search: { step: 1 } })
      }

      throw redirect({ to: '/dashboard/overview' })
    } catch (error) {
      if (error && typeof error === 'object' && 'to' in error) {
        throw error
      }
      throw redirect({ to: '/signin' })
    }
  },
})

import { useMutation, useQuery, useApolloClient } from '@apollo/client/react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  REGISTER_CREATOR_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
  RESET_PASSWORD_MUTATION,
  RESEND_VERIFICATION_EMAIL_MUTATION,
} from '@/graphql/auth'
import { extractGqlError } from '@/lib/gql-error'

export interface CreatorProfile {
  id: string
  fullName: string
  school?: string | null
  country?: string | null
  city?: string | null
  phone?: string | null
  bio?: string | null
  profileImage?: string | null
  mainNiche?: string | null
  isProfileComplete: boolean
  kycStatus: string
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'brand' | 'creator'
  status: 'active' | 'suspended' | 'pending' | 'banned'
  emailVerified: boolean
  creator?: CreatorProfile | null
}

interface RegisterCreatorInput {
  email: string
  password: string
  fullName: string
  country?: string
  school?: string
}

interface LoginInput {
  email: string
  password: string
}

function postLoginPath(user: User) {
  if (user.creator && !user.creator.isProfileComplete) {
    return '/onboarding/creator' as const
  }
  return '/dashboard/overview' as const
}

export function useMe() {
  return useQuery<{ me: User | null }>(ME_QUERY, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
}

export function useLogin() {
  const navigate = useNavigate()
  const [loginMutation, { loading, error }] = useMutation<
    { login: { user: User } },
    { input: LoginInput }
  >(LOGIN_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const login = async (input: LoginInput) => {
    try {
      const { data } = await loginMutation({ variables: { input } })
      if (data?.login.user) {
        toast.success('Welcome back!')
        navigate({ to: postLoginPath(data.login.user), search: { step: 1 } })
      }
    } catch (err) {
      toast.error(extractGqlError(err))
    }
  }

  return { login, loading, error }
}

export function useRegisterCreator() {
  const navigate = useNavigate()
  const [registerMutation, { loading, error }] = useMutation<
    { registerCreator: { message: string; user: User } },
    { input: RegisterCreatorInput }
  >(REGISTER_CREATOR_MUTATION)

  const registerCreator = async (input: RegisterCreatorInput) => {
    try {
      const { data } = await registerMutation({ variables: { input } })
      if (data?.registerCreator.message) {
        toast.success(data.registerCreator.message)
        navigate({
          to: '/signin',
          search: { action: 'verify-email', email: input.email },
        })
      }
    } catch (err) {
      toast.error(extractGqlError(err))
    }
  }

  return { registerCreator, loading, error }
}

export function useLogout() {
  const navigate = useNavigate()
  const client = useApolloClient()
  const [logoutMutation, { loading }] = useMutation(LOGOUT_MUTATION)

  const logout = async () => {
    try {
      await logoutMutation()
      await client.clearStore()
      toast.success('Signed out successfully.')
      navigate({ to: '/signin' })
    } catch (err) {
      toast.error(extractGqlError(err))
    }
  }

  return { logout, loading }
}

export function useRequestPasswordReset() {
  const [mutation, { loading, error }] = useMutation(REQUEST_PASSWORD_RESET_MUTATION)

  const requestReset = async (email: string) => {
    try {
      await mutation({ variables: { email } })
      toast.success('Verification code sent to your email.')
      return true
    } catch (err) {
      toast.error(extractGqlError(err))
      return false
    }
  }

  return { requestReset, loading, error }
}

export function useResetPassword() {
  const [mutation, { loading, error }] = useMutation(RESET_PASSWORD_MUTATION)

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      await mutation({ variables: { email, otp, newPassword } })
      toast.success('Password reset successfully. Please sign in.')
      return true
    } catch (err) {
      toast.error(extractGqlError(err))
      return false
    }
  }

  return { resetPassword, loading, error }
}

export function useResendVerificationEmail() {
  const [mutation, { loading, error }] = useMutation(RESEND_VERIFICATION_EMAIL_MUTATION)

  const resendEmail = async (email: string) => {
    try {
      await mutation({ variables: { email } })
      toast.success('Verification email sent.')
      return true
    } catch (err) {
      toast.error(extractGqlError(err))
      return false
    }
  }

  return { resendEmail, loading, error }
}

export type { RegisterCreatorInput, LoginInput }

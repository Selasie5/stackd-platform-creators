import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import {
  ACTIVE_SESSIONS_QUERY,
  CHANGE_PASSWORD_MUTATION,
  CREATOR_PROFILE_QUERY,
  NOTIFICATION_PREFERENCES_QUERY,
  REVOKE_SESSION_MUTATION,
  UPDATE_NOTIFICATION_PREFERENCES_MUTATION,
} from '@/graphql/settings'
import { UPDATE_CREATOR_PROFILE_MUTATION, UPDATE_PAYMENT_DETAILS_MUTATION } from '@/graphql/creator'
import { ME_QUERY } from '@/graphql/auth'
import { extractGqlError } from '@/lib/gql-error'

export interface CreatorSample {
  id?: string
  title: string
  category: string
  videoUrl?: string | null
  externalLink?: string | null
  note?: string | null
}

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
  otherNiches: string[]
  tiktokHandle?: string | null
  instagramHandle?: string | null
  youtubeHandle?: string | null
  languagesSpoken: string[]
  equipment: string[]
  availability?: string | null
  kycStatus: string
  isProfileComplete: boolean
  createdAt: string
  samples: CreatorSample[]
}

export interface NotificationPreferences {
  emailMarketing: boolean
  emailSecurity: boolean
  emailCampaignUpdates: boolean
  pushMarketing: boolean
  pushSecurity: boolean
  pushCampaignUpdates: boolean
}

export interface ActiveSession {
  id: string
  deviceName: string
  platform: string
  ipAddress?: string | null
  lastActiveAt: string
  createdAt: string
  isCurrent: boolean
}

export function useCreatorProfile() {
  return useQuery<{ creator: CreatorProfile | null }>(CREATOR_PROFILE_QUERY, {
    fetchPolicy: 'cache-and-network',
  })
}

export function useUpdateCreatorProfile() {
  const [mutate, state] = useMutation(UPDATE_CREATOR_PROFILE_MUTATION, {
    refetchQueries: [{ query: CREATOR_PROFILE_QUERY }, { query: ME_QUERY }],
  })

  const updateProfile = async (input: Record<string, unknown>) => {
    try {
      await mutate({ variables: { input } })
      toast.success('Profile updated.')
      return true
    } catch (error) {
      toast.error(extractGqlError(error))
      return false
    }
  }

  return { updateProfile, ...state }
}

export function useUpdatePaymentDetails() {
  const [mutate, state] = useMutation(UPDATE_PAYMENT_DETAILS_MUTATION)

  const updatePaymentDetails = async (input: Record<string, unknown>) => {
    try {
      await mutate({ variables: { input } })
      toast.success('Payment details updated.')
      return true
    } catch (error) {
      toast.error(extractGqlError(error))
      return false
    }
  }

  return { updatePaymentDetails, ...state }
}

export function useChangePassword() {
  const [mutate, state] = useMutation(CHANGE_PASSWORD_MUTATION)

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await mutate({ variables: { currentPassword, newPassword } })
      toast.success('Password updated.')
      return true
    } catch (error) {
      toast.error(extractGqlError(error))
      return false
    }
  }

  return { changePassword, ...state }
}

export function useActiveSessions() {
  return useQuery<{ activeSessions: ActiveSession[] }>(ACTIVE_SESSIONS_QUERY)
}

export function useRevokeSession() {
  const [mutate, state] = useMutation(REVOKE_SESSION_MUTATION, {
    refetchQueries: [{ query: ACTIVE_SESSIONS_QUERY }],
  })

  const revokeSession = async (sessionId: string) => {
    try {
      await mutate({ variables: { sessionId } })
      toast.success('Session revoked.')
      return true
    } catch (error) {
      toast.error(extractGqlError(error))
      return false
    }
  }

  return { revokeSession, ...state }
}

export function useNotificationPreferences() {
  return useQuery<{ notificationPreferences: NotificationPreferences }>(NOTIFICATION_PREFERENCES_QUERY)
}

export function useUpdateNotificationPreferences() {
  const [mutate, state] = useMutation(UPDATE_NOTIFICATION_PREFERENCES_MUTATION, {
    refetchQueries: [{ query: NOTIFICATION_PREFERENCES_QUERY }],
  })

  const updatePreferences = async (input: NotificationPreferences) => {
    try {
      await mutate({ variables: { input } })
      toast.success('Notification preferences saved.')
      return true
    } catch (error) {
      toast.error(extractGqlError(error))
      return false
    }
  }

  return { updatePreferences, ...state }
}

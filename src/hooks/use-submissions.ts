import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import {
  MY_SUBMISSIONS_QUERY,
  RESUBMIT_UGC_SUBMISSION_MUTATION,
} from '@/graphql/submissions'
import {
  filterSubmissions,
  mergeSubmissions,
  type RawContestSubmission,
  type RawCpmSubmission,
  type RawUgcSubmission,
} from '@/lib/submissions/normalize'
import type { SubmissionFilters, SubmissionTab, UnifiedSubmission } from '@/lib/submissions/types'
import { extractGqlError } from '@/lib/gql-error'

export function useMySubmissions() {
  const query = useQuery<{
    myUgcSubmissions: RawUgcSubmission[]
    myCpmSubmissions: RawCpmSubmission[]
    myContestSubmissions: RawContestSubmission[]
  }>(MY_SUBMISSIONS_QUERY, {
    fetchPolicy: 'cache-and-network',
  })

  const allSubmissions = query.data
    ? mergeSubmissions({
        ugc: query.data.myUgcSubmissions,
        cpm: query.data.myCpmSubmissions,
        contest: query.data.myContestSubmissions,
      })
    : []

  return { ...query, allSubmissions }
}

export function useFilteredSubmissions(tab: SubmissionTab, filters: SubmissionFilters) {
  const query = useMySubmissions()
  const all = query.data
    ? mergeSubmissions({
        ugc: query.data.myUgcSubmissions,
        cpm: query.data.myCpmSubmissions,
        contest: query.data.myContestSubmissions,
      })
    : []

  return {
    ...query,
    submissions: filterSubmissions(all, tab, filters.status, filters.fromDate, filters.toDate),
    allSubmissions: all,
  }
}

export function useResubmitUgcSubmission() {
  const [mutate, state] = useMutation(RESUBMIT_UGC_SUBMISSION_MUTATION, {
    refetchQueries: [{ query: MY_SUBMISSIONS_QUERY }],
  })

  const resubmit = async (input: {
    submissionId: string
    videoUrl?: string
    submissionNote?: string
    postedVideoLink?: string
  }) => {
    try {
      await mutate({ variables: { input } })
      toast.success('Revision submitted successfully.')
      return true
    } catch (error) {
      toast.error(extractGqlError(error))
      return false
    }
  }

  return { resubmit, ...state }
}

export type { UnifiedSubmission }

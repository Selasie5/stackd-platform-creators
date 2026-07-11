import type { SubmissionStatus } from '@/lib/submissions/types'

export const SUBMISSION_STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; className: string; icon?: 'star' | 'check' }
> = {
  submitted: {
    label: 'Submitted',
    className: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
  },
  under_review: {
    label: 'Under review',
    className: 'bg-blue-50 text-blue-700 ring-blue-100',
  },
  shortlisted: {
    label: 'Shortlisted',
    className: 'bg-amber-50 text-amber-800 ring-amber-100',
  },
  revision_requested: {
    label: 'Revision requested',
    className: 'bg-orange-50 text-orange-800 ring-orange-100',
  },
  resubmitted: {
    label: 'Resubmitted',
    className: 'bg-sky-50 text-sky-800 ring-sky-100',
  },
  winner: {
    label: 'Winner',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
    icon: 'star',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 ring-red-100',
  },
  disqualified: {
    label: 'Disqualified',
    className: 'bg-red-100 text-red-900 ring-red-200',
  },
  paid: {
    label: 'Paid',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
    icon: 'check',
  },
}

export const PAYMENT_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  in_escrow: { label: 'In escrow', className: 'bg-zinc-100 text-zinc-700 ring-zinc-200' },
  awaiting_approval: {
    label: 'Awaiting approval',
    className: 'bg-blue-50 text-blue-700 ring-blue-100',
  },
  ready_for_payout: {
    label: 'Ready for payout',
    className: 'bg-amber-50 text-amber-800 ring-amber-100',
  },
  paid: { label: 'Paid', className: 'bg-emerald-50 text-emerald-800 ring-emerald-100' },
  disputed: { label: 'Disputed', className: 'bg-orange-50 text-orange-800 ring-orange-100' },
  refunded: { label: 'Refunded', className: 'bg-zinc-100 text-zinc-600 ring-zinc-200' },
}

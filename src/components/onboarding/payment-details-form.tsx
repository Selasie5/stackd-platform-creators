import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { BrandLogo } from '@/components/ui/brand-logo'
import { cn } from '@/lib/utils'
import { BANKS, MOBILE_MONEY_PROVIDERS } from '@/lib/onboarding/payment-providers'
import type { PaymentMethod } from '@/lib/onboarding/types'
import { Landmark, ShieldCheck, Smartphone, type LucideIcon } from 'lucide-react'

interface PaymentDetailsFormProps {
  paymentMethod: PaymentMethod | ''
  bankName: string
  accountNumber: string
  accountName: string
  mobileProvider: string
  mobileNumber: string
  onPaymentMethodChange: (method: PaymentMethod) => void
  onFieldChange: (field: string, value: string) => void
}

export function PaymentDetailsForm({
  paymentMethod,
  bankName,
  accountNumber,
  accountName,
  mobileProvider,
  mobileNumber,
  onPaymentMethodChange,
  onFieldChange,
}: PaymentDetailsFormProps) {
  const methods: {
    id: PaymentMethod
    label: string
    Icon: LucideIcon
  }[] = [
    {
      id: 'bank_transfer',
      label: 'Bank transfer',
      Icon: Landmark,
    },
    {
      id: 'mobile_money',
      label: 'Mobile money',
      Icon: Smartphone,
    },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {methods.map((method) => {
          const Icon = method.Icon
          const selected = paymentMethod === method.id

          return (
          <button
            key={method.id}
            type="button"
            onClick={() => onPaymentMethodChange(method.id)}
            className={cn(
              'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all',
              selected
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800',
            )}
          >
            <span
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                selected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            {method.label}
          </button>
          )
        })}
      </div>

      {paymentMethod === 'bank_transfer' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-2">
            <Label>Bank name</Label>
            <Select
              value={bankName}
              onChange={(val) => onFieldChange('bankName', val)}
              placeholder="Select bank"
              options={BANKS.map((bank) => ({
                value: bank.value,
                label: bank.label,
                icon: <BrandLogo src={bank.logo} name={bank.label} domain={bank.domain} />,
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account number</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => onFieldChange('accountNumber', e.target.value)}
              placeholder="Enter account number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountName">Account name</Label>
            <Input
              id="accountName"
              value={accountName}
              onChange={(e) => onFieldChange('accountName', e.target.value)}
              placeholder="Name on account"
              required
            />
            <p className="text-xs text-zinc-400">
              Account name will be auto-verified via Paystack lookup in a future release.
            </p>
          </div>
        </div>
      )}

      {paymentMethod === 'mobile_money' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={mobileProvider}
              onChange={(val) => onFieldChange('mobileProvider', val)}
              placeholder="Select provider"
              options={MOBILE_MONEY_PROVIDERS.map((provider) => ({
                value: provider.value,
                label: provider.label,
                icon: (
                  <BrandLogo
                    src={provider.logo}
                    name={provider.label}
                    domain={provider.domain}
                  />
                ),
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile number</Label>
            <Input
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => onFieldChange('mobileNumber', e.target.value)}
              placeholder="e.g. +233 XX XXX XXXX"
              required
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          We need your payment details to send you earnings from completed campaigns. Your
          information is encrypted and never shared with brands.
        </p>
      </div>
    </div>
  )
}

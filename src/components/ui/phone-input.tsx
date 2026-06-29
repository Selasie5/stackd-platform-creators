import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { COUNTRIES } from '@/lib/onboarding/constants'
import { cn } from '@/lib/utils'

interface PhoneInputProps {
  dialCode: string
  number: string
  onDialCodeChange: (value: string) => void
  onNumberChange: (value: string) => void
  id?: string
  required?: boolean
  className?: string
}

export function PhoneInput({
  dialCode,
  number,
  onDialCodeChange,
  onNumberChange,
  id = 'phone',
  required,
  className,
}: PhoneInputProps) {
  const dialOptions = React.useMemo(
    () =>
      COUNTRIES.map((country) => ({
        value: country.dialCode,
        label: country.dialCode,
        icon: <img src={country.flag} alt="" className="h-4 w-auto rounded-[2px]" />,
      })),
    [],
  )

  return (
    <div className={cn('flex gap-2', className)}>
      <div className="w-30 shrink-0">
        <Select
          value={dialCode}
          onChange={onDialCodeChange}
          options={dialOptions}
          placeholder="Code"
          className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800"
        />
      </div>
      <Input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={number}
        onChange={(e) => onNumberChange(e.target.value.replace(/[^\d\s-]/g, ''))}
        placeholder="XX XXX XXXX"
        required={required}
        className="min-w-0 flex-1"
      />
    </div>
  )
}

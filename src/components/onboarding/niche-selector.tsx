import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { ChipMultiSelect } from './chip-multi-select'
import { NICHES } from '@/lib/onboarding/constants'

interface NicheSelectorProps {
  mainNiche: string
  otherNiches: string[]
  onMainNicheChange: (value: string) => void
  onOtherNichesChange: (value: string[]) => void
}

export function NicheSelector({
  mainNiche,
  otherNiches,
  onMainNicheChange,
  onOtherNichesChange,
}: NicheSelectorProps) {
  const otherOptions = NICHES.filter((n) => n !== mainNiche)

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="mainNiche">Main niche</Label>
        <Select
          id="mainNiche"
          value={mainNiche}
          onChange={onMainNicheChange}
          placeholder="Select your main niche"
          options={NICHES.map((n) => ({ value: n, label: n }))}
        />
      </div>

      <ChipMultiSelect
        label="Other niches"
        options={otherOptions}
        value={otherNiches.filter((n) => n !== mainNiche)}
        onChange={onOtherNichesChange}
      />
    </div>
  )
}

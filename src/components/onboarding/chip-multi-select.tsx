import { cn } from '@/lib/utils'

interface ChipMultiSelectProps {
  options: readonly string[]
  value: string[]
  onChange: (value: string[]) => void
  label?: string
}

export function ChipMultiSelect({ options, value, onChange, label }: ChipMultiSelectProps) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                selected
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400',
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

import * as React from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchableSelectProps {
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
  allowCustom?: boolean
  disabled?: boolean
  id?: string
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Search or select…',
  allowCustom = true,
  disabled = false,
  id,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState(value)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setQuery(value)
  }, [value])

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase()),
  )
  const showCustom =
    allowCustom &&
    query.trim().length > 0 &&
    !options.some((opt) => opt.toLowerCase() === query.trim().toLowerCase())

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          id={id}
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            if (!disabled) setOpen(true)
          }}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-4 pr-10 text-sm outline-none focus:border-zinc-400 focus:ring-[3px] focus:ring-zinc-200/60 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      </div>

      {open && !disabled && (filtered.length > 0 || showCustom) && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          {filtered.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt)
                setQuery(opt)
                setOpen(false)
              }}
              className={cn(
                'flex w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900',
                value === opt && 'bg-zinc-50 font-medium dark:bg-zinc-900',
              )}
            >
              {opt}
            </button>
          ))}
          {showCustom && (
            <button
              type="button"
              onClick={() => {
                onChange(query.trim())
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            >
              <Plus className="h-4 w-4" />
              Use &quot;{query.trim()}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  )
}

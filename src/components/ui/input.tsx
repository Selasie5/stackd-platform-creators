import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-11 w-full min-w-0 rounded-xl border border-zinc-200 bg-transparent px-4 py-2 text-base transition-[color,box-shadow] outline-none placeholder:text-zinc-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-zinc-800 dark:bg-input/30',
        'focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-200/60 dark:focus-visible:ring-zinc-800',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

import * as React from 'react'
import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-24 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-3 text-base transition-[color,box-shadow] outline-none placeholder:text-zinc-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-zinc-800 dark:bg-input/30',
        'focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-200/60',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { SpleenetLoader } from './spleenet-loader'

const primaryButtonClasses =
  'bg-primary text-white shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-primary/90 hover:text-white [&_svg]:text-white hover:[&_svg]:text-white hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-black/10'

const buttonVariants = cva(
  'inline-flex w-fit min-w-fit shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: primaryButtonClasses,
        destructive: cn(
          'bg-destructive text-white shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-destructive/90 hover:text-white ring-1 ring-inset ring-black/10',
        ),
        outline:
          'border border-input bg-background text-zinc-900 shadow-sm hover:bg-zinc-50 hover:text-zinc-900',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:text-secondary-foreground',
        ghost: 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
        link: 'text-primary underline-offset-4 hover:underline',
        onInverse: cn(
          'border border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white focus-visible:text-white',
          'ring-1 ring-inset ring-white/20',
        ),
        auth: cn('w-full rounded-full', primaryButtonClasses),
        authOutline:
          'w-full rounded-full border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-10 rounded-lg px-8',
        auth: 'h-12 px-6 text-base font-semibold',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }))

    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {isLoading ? <SpleenetLoader size="sm" className="shrink-0 text-current" /> : children}
        </Slot>
      )
    }

    return (
      <button className={classes} ref={ref} disabled={disabled || isLoading} {...props}>
        {isLoading ? <SpleenetLoader size="sm" className="shrink-0 text-current" /> : children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants, primaryButtonClasses }

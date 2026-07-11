import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

/** Default profile illustration from template-finance (arthur). */
export const DEFAULT_PROFILE_AVATAR = '/images/avatar/illustration/arthur.png'

const sizeClasses = {
  '48': 'size-12 text-sm',
  '40': 'size-10 text-xs',
  '32': 'size-8 text-[11px]',
} as const

const colorClasses = {
  gray: 'bg-zinc-200 text-zinc-900',
  blue: 'bg-blue-200 text-blue-950',
  purple: 'bg-purple-200 text-purple-950',
} as const

type AvatarSize = keyof typeof sizeClasses
type AvatarColor = keyof typeof colorClasses

export type AvatarRootProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: AvatarSize
  color?: AvatarColor
  src?: string | null
}

function AvatarRoot({
  size = '40',
  color = 'blue',
  src,
  className,
  children,
  ...rest
}: AvatarRootProps) {
  const rootClassName = cn(
    'relative flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full text-center uppercase',
    sizeClasses[size],
    colorClasses[color],
    className,
  )

  if (!children) {
    return (
      <div className={rootClassName} {...rest}>
        <img
          src={src ?? DEFAULT_PROFILE_AVATAR}
          alt=""
          className="size-full rounded-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className={rootClassName} {...rest}>
      {children}
    </div>
  )
}

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  asChild?: boolean
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ asChild, className, alt = '', ...rest }, ref) => {
    const Component = asChild ? Slot : 'img'

    return (
      <Component
        ref={ref}
        alt={alt}
        className={cn('size-full rounded-full object-cover', className)}
        {...rest}
      />
    )
  },
)
AvatarImage.displayName = 'AvatarImage'

export { AvatarRoot as Root, AvatarImage as Image }

import * as React from 'react'
import { googleFavicon } from '@/lib/onboarding/payment-providers'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  src: string
  name: string
  domain?: string
  className?: string
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function BrandLogo({ src, name, domain, className }: BrandLogoProps) {
  const sources = React.useMemo(() => {
    const list = [src]
    if (domain) {
      const favicon = googleFavicon(domain)
      if (!list.includes(favicon)) list.push(favicon)
    }
    return list
  }, [src, domain])

  const [sourceIndex, setSourceIndex] = React.useState(0)

  React.useEffect(() => {
    setSourceIndex(0)
  }, [sources])

  if (sourceIndex >= sources.length) {
    return (
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[9px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
          className,
        )}
        aria-hidden
      >
        {initialsFor(name)}
      </span>
    )
  }

  const currentSrc = sources[sourceIndex]
  const isSvgBrandIcon = currentSrc.endsWith('.svg')

  return (
    <img
      src={currentSrc}
      alt=""
      className={cn(
        'h-5 w-5 shrink-0 rounded-full bg-white object-contain ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:ring-zinc-700',
        isSvgBrandIcon && 'bg-[#e60000] p-0.5',
        className,
      )}
      onError={() => setSourceIndex((index) => index + 1)}
    />
  )
}

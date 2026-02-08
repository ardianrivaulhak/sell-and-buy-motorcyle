import { useMemo } from 'react'

export type ListingImageProps = {
  sources: string[]
  alt: string
  className?: string
}

export const ListingImage = ({ sources, alt, className }: ListingImageProps) => {
  const primary = sources[0]
  const fallback = sources[1]
  const safePrimary = useMemo(() => primary ?? fallback ?? '', [primary, fallback])

  return (
    <img
      src={safePrimary}
      alt={alt}
      className={className}
      onError={(event) => {
        if (!fallback) return
        if (event.currentTarget.src.endsWith(fallback)) return
        event.currentTarget.src = fallback
      }}
    />
  )
}

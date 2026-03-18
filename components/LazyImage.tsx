'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface LazyImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallback?: string
  wrapperClassName?: string
}

export default function LazyImage({ 
  src, 
  alt, 
  fallback = '/images/placeholder.jpg',
  className,
  wrapperClassName,
  ...props 
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-gray-200 rounded-lg',
        wrapperClassName
      )}>
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      
      <Image
        src={hasError ? fallback : src}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    </div>
  )
}

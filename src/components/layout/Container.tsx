'use client'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  narrow?: boolean
}

export function Container({ children, className = '', narrow = false }: ContainerProps) {
  const maxWidth = narrow ? 'max-w-3xl' : 'max-w-5xl'

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidth} ${className}`}>
      {children}
    </div>
  )
}

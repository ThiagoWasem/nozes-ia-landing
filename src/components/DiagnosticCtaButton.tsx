import { MouseEvent, ReactNode, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type DiagnosticCtaButtonProps = {
  children?: ReactNode
  source: string
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function DiagnosticCtaButton({
  children = 'Solicitar meu diagnóstico',
  source,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
}: DiagnosticCtaButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const handlePointerMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12
    event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <button
      ref={ref}
      type={type}
      className={`diagnostic-cta ${className}`}
      onMouseMove={handlePointerMove}
      onMouseLeave={reset}
      onBlur={reset}
      onClick={() => {
        trackEvent('clique_cta', { origem: source })
        onClick?.()
      }}
      disabled={disabled}
    >
      <span>{children}</span>
      <ArrowUpRight size={17} aria-hidden="true" />
    </button>
  )
}

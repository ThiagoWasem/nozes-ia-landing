import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export function useLandingMotion() {
  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let sent50 = false
    let sent90 = false

    const render = () => {
      frame = 0
      const reduced = reducedQuery.matches
      const viewport = window.innerHeight
      const pageRange = document.documentElement.scrollHeight - viewport
      const pageProgress = pageRange > 0 ? window.scrollY / pageRange : 0

      if (!sent50 && pageProgress >= 0.5) {
        sent50 = true
        trackEvent('rolagem_50')
      }
      if (!sent90 && pageProgress >= 0.9) {
        sent90 = true
        trackEvent('rolagem_90')
      }

      // CARDS DO BENTO: Revelação suave de entrada apenas (sem travar conteúdo)
      document.querySelectorAll<HTMLElement>('[data-scroll-card]').forEach((card) => {
        const rect = card.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < viewport) {
          const progress = reduced
            ? 1
            : clamp((viewport * 0.95 - rect.top) / Math.max(viewport * 0.35, 1))
          card.style.opacity = String(Math.max(0.3, progress))
          card.style.transform = `scale(${0.98 + progress * 0.02}) translate3d(0, ${(1 - progress) * 8}px, 0)`
        }
      })
    }

    const requestRender = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }

    render()
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender)
    reducedQuery.addEventListener('change', requestRender)
    return () => {
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
      reducedQuery.removeEventListener('change', requestRender)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
}

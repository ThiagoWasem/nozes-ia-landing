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

      // Atualiza a barra de leitura global se existir
      const readingBar = document.querySelector<HTMLElement>('.reading-progress-bar')
      if (readingBar) {
        readingBar.style.setProperty('--scroll-progress', `${Math.round(pageProgress * 100)}%`)
      }

      // Animação das transições cinematográficas claro/escuro via GPU transform/opacity
      const transitionDividers = document.querySelectorAll<HTMLElement>('[data-transition-divider]')
      transitionDividers.forEach((divider) => {
        const rect = divider.getBoundingClientRect()
        // Progresso de entrada do divisor na tela (0 quando entra por baixo, 1 quando atinge o meio/topo)
        const progress = clamp((viewport - rect.top) / (viewport * 0.75), 0, 1)
        divider.style.setProperty('--transition-progress', progress.toFixed(3))
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

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

      // 1. MÉTODO GARGALO
      const method = document.querySelector<HTMLElement>('[data-method]')
      if (method) {
        const rect = method.getBoundingClientRect()
        // Executa apenas se estiver na vizinhança da viewport
        if (rect.bottom > -100 && rect.top < viewport + 100) {
          const progress = reduced
            ? 1
            : clamp((viewport * 0.78 - rect.top) / Math.max(rect.height * 0.75, 1))
          method.style.setProperty('--method-progress', String(progress))

          const nodes = method.querySelectorAll<HTMLElement>('[data-method-node]')
          const totalNodes = nodes.length
          nodes.forEach((node, index) => {
            const threshold = totalNodes <= 1 ? 0 : index / (totalNodes - 1)
            const isActive = progress + 0.05 >= threshold
            node.classList.toggle('is-active', isActive)
          })
        }
      }

      // 2. CARDS DO BENTO (animação suave em GPU transform/opacity)
      document.querySelectorAll<HTMLElement>('[data-scroll-card]').forEach((card) => {
        const rect = card.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < viewport) {
          const progress = reduced
            ? 1
            : clamp((viewport * 0.95 - rect.top) / Math.max(viewport * 0.4, 1))
          card.style.opacity = String(progress)
          card.style.transform = `scale(${0.95 + progress * 0.05}) translate3d(0, ${(1 - progress) * 14}px, 0)`
        }
      })

      // 3. STORYTELLING (Dados ilustrativos visíveis sempre, scrub suave no scroll)
      const story = document.querySelector<HTMLElement>('[data-story]')
      if (story) {
        const rect = story.getBoundingClientRect()
        if (rect.bottom > -100 && rect.top < viewport + 100) {
          const range = Math.max(rect.height - viewport, 1)
          const progress = reduced ? 1 : clamp(-rect.top / range)
          story.style.setProperty('--story-progress', String(progress))

          // Mensagens do celular fluindo
          story.querySelectorAll<HTMLElement>('[data-story-message]').forEach((message, index) => {
            const local = reduced ? 1 : clamp((progress - index * 0.18) / 0.28)
            message.style.opacity = String(Math.max(0.2, local))
            message.style.transform = `translate3d(0, ${(1 - local) * 22}px, 0)`
          })

          // Indicador de fase
          const indicator = story.querySelector<HTMLElement>('[data-story-indicator]')
          if (indicator) {
            indicator.textContent =
              progress < 0.34
                ? 'Organizando conversas'
                : progress < 0.68
                  ? 'Acompanhando contatos'
                  : 'Operação conectada'
          }

          // Contadores: base fixa visível + incremento pelo scroll
          story.querySelectorAll<HTMLElement>('[data-counter]').forEach((counter) => {
            const base = Number(counter.dataset.base || 0)
            const target = Number(counter.dataset.target || 0)
            const val = reduced ? target : Math.round(base + (target - base) * progress)
            counter.textContent = String(val)
          })

          // Gráfico crescendo
          const chart = story.querySelector<SVGPathElement>('[data-story-chart]')
          if (chart) {
            chart.style.strokeDashoffset = String(1 - clamp(progress / 0.9))
          }
        }
      }
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

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

      const method = document.querySelector<HTMLElement>('[data-method]')
      if (method) {
        const rect = method.getBoundingClientRect()
        const progress = reduced
          ? 1
          : clamp((viewport * 0.78 - rect.top) / Math.max(rect.height * 0.72, 1))
        method.style.setProperty('--method-progress', String(progress))
        method.querySelectorAll<HTMLElement>('[data-method-node]').forEach((node, index, nodes) => {
          const threshold = nodes.length <= 1 ? 0 : index / (nodes.length - 1)
          node.classList.toggle('is-active', progress + 0.02 >= threshold)
        })
      }

      document.querySelectorAll<HTMLElement>('[data-scroll-card]').forEach((card) => {
        const rect = card.getBoundingClientRect()
        const progress = reduced
          ? 1
          : clamp((viewport * 0.94 - rect.top) / Math.max(viewport * 0.46, 1))
        card.style.opacity = String(progress)
        card.style.transform = `scale(${0.94 + progress * 0.06}) translate3d(0, ${(1 - progress) * 18}px, 0)`
      })

      const featureSection = document.querySelector<HTMLElement>('[data-features]')
      const orbit = document.querySelector<HTMLElement>('[data-orbit]')
      if (featureSection && orbit) {
        const rect = featureSection.getBoundingClientRect()
        const progress = reduced
          ? 1
          : clamp((viewport - rect.top) / Math.max(rect.height + viewport * 0.2, 1))
        orbit.style.transform = `rotate(${progress * 360}deg)`
      }

      const story = document.querySelector<HTMLElement>('[data-story]')
      if (story) {
        const rect = story.getBoundingClientRect()
        const range = Math.max(rect.height - viewport, 1)
        const progress = reduced ? 1 : clamp(-rect.top / range)
        story.style.setProperty('--story-progress', String(progress))
        story.querySelectorAll<HTMLElement>('[data-story-message]').forEach((message, index) => {
          const local = clamp((progress - index * 0.16) / 0.3)
          message.style.opacity = String(local)
          message.style.transform = `translate3d(0, ${(1 - local) * 28}px, 0)`
        })
        const indicator = story.querySelector<HTMLElement>('[data-story-indicator]')
        if (indicator)
          indicator.textContent =
            progress < 0.34
              ? 'Organizando conversas'
              : progress < 0.68
                ? 'Acompanhando contatos'
                : 'Operação conectada'
        story.querySelectorAll<HTMLElement>('[data-counter]').forEach((counter) => {
          const target = Number(counter.dataset.target || 0)
          counter.textContent = String(Math.round(target * progress))
        })
        const chart = story.querySelector<SVGPathElement>('[data-story-chart]')
        if (chart) chart.style.strokeDashoffset = String(1 - clamp((progress - 0.45) / 0.45))
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

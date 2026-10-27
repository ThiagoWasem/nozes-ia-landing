import { useState, useEffect, useRef } from 'react'
import { Search, ListFilter, Wrench, LineChart, Pause, Play } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const steps = [
  {
    title: 'Diagnosticar',
    copy: 'Entender como a operação funciona hoje e onde o cliente escapa.',
    tag: 'Fase 01',
    icon: Search,
  },
  {
    title: 'Priorizar',
    copy: 'Escolher o gargalo que merece atenção primeiro para dar tração.',
    tag: 'Fase 02',
    icon: ListFilter,
  },
  {
    title: 'Implementar',
    copy: 'Construir a solução adequada ao problema real, sem excessos.',
    tag: 'Fase 03',
    icon: Wrench,
  },
  {
    title: 'Acompanhar',
    copy: 'Verificar o resultado em números e mapear o próximo avanço.',
    tag: 'Fase 04',
    icon: LineChart,
  },
]

export function MethodSection() {
  const reduced = useReducedMotion()
  const [activeStep, setActiveStep] = useState(reduced ? 3 : 0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Observer para rodar animação apenas quando a seção estiver visível
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Motor rAF contínuo acelerado para transição viva e fluida (~1,7s por fase)
  useEffect(() => {
    if (reduced || isPaused || !isVisible) return

    let lastTick = performance.now()
    let frameId: number

    const tick = (now: number) => {
      if (now - lastTick >= 1700) {
        lastTick = now
        setActiveStep((prev) => (prev + 1) % steps.length)
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [reduced, isPaused, isVisible])

  // Progresso de 0 a 1 para a linha dourada
  const lineProgress = reduced ? 1 : activeStep / (steps.length - 1)

  return (
    <section
      ref={sectionRef}
      className="section method-section"
      data-method
      aria-labelledby="method-title"
      style={{ '--method-progress': String(lineProgress) } as React.CSSProperties}
    >
      <div className="shell">
        <div className="method-header-wrapper">
          <SectionHeading
            eyebrow="Método Gargalo"
            title="Uma sequência simples. Sem pacote pronto."
            description="Cada etapa reduz a chance de construir algo que não resolve o problema real."
          />
          {!reduced && (
            <button
              type="button"
              className="method-pause-toggle-btn"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={
                isPaused
                  ? 'Retomar animação do Método Gargalo'
                  : 'Pausar animação do Método Gargalo'
              }
              title={isPaused ? 'Retomar ciclo' : 'Pausar ciclo'}
            >
              {isPaused ? (
                <Play size={13} aria-hidden="true" />
              ) : (
                <Pause size={13} aria-hidden="true" />
              )}
              <span>{isPaused ? 'Retomar' : 'Pausar'}</span>
            </button>
          )}
        </div>

        <div className="method-map">
          <div className="method-track" aria-hidden="true">
            <span style={{ transform: `scaleX(${lineProgress})` }} />
          </div>
          {steps.map(({ title, copy, tag, icon: Icon }, index) => {
            const isActive = index <= activeStep
            const isCurrent = index === activeStep
            return (
              <article
                className={`method-step ${isActive ? 'is-active' : ''} ${isCurrent ? 'is-current' : ''}`}
                data-method-node
                key={title}
                onClick={() => {
                  setActiveStep(index)
                  setIsPaused(true)
                }}
              >
                <div className="method-node-wrapper">
                  <div className="method-node">
                    <span>0{index + 1}</span>
                    <div className="method-pulse-ring" aria-hidden="true" />
                    <i />
                  </div>
                  <div className="method-icon-badge" aria-hidden="true">
                    <Icon size={14} />
                  </div>
                </div>
                <div className="method-step-content">
                  <span className="method-phase-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

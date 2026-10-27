import { useState, useEffect, useRef } from 'react'
import { Check, MessageCircle, Pause, Play } from 'lucide-react'
import { CONFIG } from '@/lib/site'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { SectionHeading } from './SectionHeading'

/* ==========================================================================
   STORYTELLING ULTRA TECH (LOOP AUTOMÁTICO INDEPENDENTE DE SCROLL)
   - Celular ilustrativo próprio da Nozes Ink (sem marcas de terceiros).
   - Animação em loop contínuo:
     Fase 1: Mensagem 1 entra + contadores base
     Fase 2: Mensagem 2 entra + contadores sobem + gráfico cresce
     Fase 3: Mensagem 3 entra + agendamento confirmado + CRM preenchido + gráfico no pico
   - Pausa / Retoma disponível ao usuário.
   - Rótulo "Dados ilustrativos" visível sempre.
   - Mobile: sequência visual viva e integrada em loop contínuo.
   ========================================================================== */

const moments = [
  ['Atendimentos automáticos', 'A mensagem entra com contexto e dúvidas são resolvidas na hora.'],
  ['Agendamentos confirmados', 'O horário é alinhado direto com a agenda sem conflito de data.'],
  ['Leads no CRM', 'O contato é registrado com todo o histórico para a equipe acompanhar.'],
]

interface StoryState {
  step: number // 1, 2, 3
  atendimentos: number
  agendamentos: number
  leads: number
  chartProgress: number // 0 a 1
  label: string
}

function PhoneStory({ step }: { step: number }) {
  return (
    <div className="story-phone" aria-label="Demonstração ilustrativa em celular">
      <div className="phone-speaker" aria-hidden="true" />
      <div className="phone-header">
        <MessageCircle size={16} aria-hidden="true" />
        <span>Atendimento Nozes Ink</span>
        <i aria-hidden="true" />
      </div>
      <div className="phone-messages">
        <div data-story-message className={`story-msg ${step >= 1 ? 'is-visible' : 'is-hidden'}`}>
          Olá! Gostaria de saber os horários para atendimento amanhã.
        </div>
        <div data-story-message className={`story-msg ${step >= 2 ? 'is-visible' : 'is-hidden'}`}>
          Olá! Temos vaga amanhã às 14h ou às 16h30. Qual prefere?
        </div>
        <div data-story-message className={`story-msg ${step >= 3 ? 'is-visible' : 'is-hidden'}`}>
          Às 14h perfeito!
          <span className="story-check-tag">
            <Check size={11} aria-hidden="true" /> Agendado e registrado no CRM
          </span>
        </div>
      </div>
      <div className="phone-input" aria-hidden="true">
        <span>Mensagem</span> <span>↗</span>
      </div>
    </div>
  )
}

function StoryIndicators({
  step,
  atendimentos,
  agendamentos,
  leads,
  chartProgress,
  label,
}: StoryState) {
  return (
    <div className="story-indicators">
      <div className="story-indicators-header">
        <span className="story-kicker">Dados ilustrativos</span>
        <span className="story-badge-live">Tempo real • Ciclo {step}/3</span>
      </div>
      <strong data-story-indicator>{label}</strong>
      <div className="indicator-grid">
        <div className="indicator-item">
          <span data-counter>{atendimentos}</span>
          <small>Atendimentos automáticos</small>
        </div>
        <div className="indicator-item">
          <span data-counter>{agendamentos}</span>
          <small>Agendamentos</small>
        </div>
        <div className="indicator-item">
          <span data-counter>{leads}</span>
          <small>Leads no CRM</small>
        </div>
      </div>
      <div className="story-chart">
        <div className="story-chart-meta">
          <span>Evolução dos atendimentos</span>
          <span className="story-chart-growth">
            {step === 1 ? '+40% fluxo' : step === 2 ? '+95% fluxo' : '+165% fluxo'}
          </span>
        </div>
        <svg viewBox="0 0 420 150" role="img" aria-label="Gráfico ilustrativo de evolução">
          <defs>
            <linearGradient id="chartGoldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            className="chart-area"
            fill="url(#chartGoldGrad)"
            d="M12 135 C70 130 86 116 132 120 S205 80 250 91 S330 36 408 21 L408 145 L12 145 Z"
            style={{ opacity: 0.3 + chartProgress * 0.7, transition: 'opacity 0.6s ease' }}
          />
          <path
            data-story-chart
            pathLength="1"
            className="chart-line"
            d="M12 135 C70 130 86 116 132 120 S205 80 250 91 S330 36 408 21"
            style={{
              strokeDashoffset: 1 - chartProgress,
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.25, 1)',
            }}
          />
        </svg>
      </div>
    </div>
  )
}

export function StorySection() {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(reduced ? 3 : 1)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Dispara animação automática quando a seção entra em tela
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Motor rAF contínuo com ritmo acelerado e fluido (~1,9s por etapa)
  useEffect(() => {
    if (reduced || isPaused || !isVisible) return

    let lastTick = performance.now()
    let frameId: number

    const tick = (now: number) => {
      if (now - lastTick >= 1900) {
        lastTick = now
        setStep((prev) => (prev >= 3 ? 1 : prev + 1))
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [reduced, isPaused, isVisible])

  if (!CONFIG.sticky_storytelling_ativo) return null

  const stateMap: Record<number, StoryState> = {
    1: {
      step: 1,
      atendimentos: 12,
      agendamentos: 4,
      leads: 6,
      chartProgress: 0.35,
      label: 'Organizando conversas',
    },
    2: {
      step: 2,
      atendimentos: 24,
      agendamentos: 9,
      leads: 13,
      chartProgress: 0.72,
      label: 'Acompanhando contatos',
    },
    3: {
      step: 3,
      atendimentos: 32,
      agendamentos: 14,
      leads: 19,
      chartProgress: 1,
      label: 'Operação conectada',
    },
  }

  const currentState = stateMap[step] || stateMap[1]

  return (
    <section ref={sectionRef} className="story-section" data-story aria-labelledby="story-title">
      <div className="story-stage shell">
        <div className="story-copy">
          <div className="story-header-flex">
            <SectionHeading
              eyebrow="Da conversa ao acompanhamento"
              title="Quando o processo se conecta, o trabalho deixa rastros úteis."
              description="Uma mensagem vira contexto, ação e acompanhamento sem transformar a operação em uma coleção confusa de ferramentas."
              light
            />
            {!reduced && (
              <button
                type="button"
                className="story-pause-btn"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? 'Retomar ciclo da história' : 'Pausar ciclo da história'}
                title={isPaused ? 'Retomar' : 'Pausar'}
              >
                {isPaused ? (
                  <Play size={14} aria-hidden="true" />
                ) : (
                  <Pause size={14} aria-hidden="true" />
                )}
                <span>{isPaused ? 'Retomar animação' : 'Pausar animação'}</span>
              </button>
            )}
          </div>

          <div className="story-moments-mobile">
            {moments.map(([title, text], index) => {
              const isActive = index + 1 === step
              return (
                <article
                  key={title}
                  className={`story-moment-card ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    setStep(index + 1)
                    setIsPaused(true)
                  }}
                >
                  <span className="moment-index">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              )
            })}
          </div>
        </div>

        <div className="story-visual">
          <PhoneStory step={step} />
          <StoryIndicators {...currentState} />
        </div>
      </div>
    </section>
  )
}

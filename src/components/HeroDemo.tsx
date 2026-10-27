import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarCheck, Check, Database, MessageCircle, Pause, Play } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { trackEvent } from '@/lib/analytics'

/* ==========================================================================
   HERO DEMO (DEMONSTRAÇÃO ILUSTRATIVA)
   1. Mensagem de cliente digitada sozinha, com indicador de digitação.
   2. Em menos de 1 segundo, a IA responde e confirma um horário.
   3. Três blocos entram em sequência:
      - "Mensagem atendida"
      - "Horário agendado"
      - "Lead registrado no CRM"
   4. Ciclo de 8 segundos, com botão visível de pausar e retomar.
   5. Mobile: versão simplificada, sem loop contínuo.
   ========================================================================== */

const CUSTOMER_MESSAGE = 'Olá! Vocês têm horário disponível para amanhã à tarde?'
const REPLY_MESSAGE = 'Sim! Horário confirmado para amanhã às 14h na nossa agenda.'
const CYCLE_DURATION = 8000

export function HeroDemo() {
  const reduced = useReducedMotion()
  const [elapsed, setElapsed] = useState(reduced ? CYCLE_DURATION : 0)
  const [manualPaused, setManualPaused] = useState(false)
  const [autoPaused, setAutoPaused] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const mobile = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches,
    [],
  )

  useEffect(() => {
    if (reduced) {
      setElapsed(CYCLE_DURATION)
      return
    }
    if (manualPaused || autoPaused) return

    const timer = window.setInterval(() => {
      setElapsed((value) => {
        const next = value + 50
        // No mobile simplificado: conclui o ciclo e para (sem loop contínuo)
        if (next >= CYCLE_DURATION) return mobile ? CYCLE_DURATION : 0
        return next
      })
    }, 50)

    return () => window.clearInterval(timer)
  }, [manualPaused, autoPaused, reduced, mobile])

  useEffect(() => {
    const visibility = () => setAutoPaused(document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => document.removeEventListener('visibilitychange', visibility)
  }, [])

  // Cronologia do ciclo de 8s:
  // 0 - 300ms: pausa inicial
  // 300ms - 2200ms: digitação do cliente
  // 2200ms - 3000ms: resposta da IA em menos de 1s
  // 3000ms - 5200ms: entrada em sequência dos 3 blocos
  // 5200ms - 8000ms: visualização final do ciclo
  const typeStart = 300
  const typingSpeed = 35
  const typedLength = Math.max(
    0,
    Math.min(CUSTOMER_MESSAGE.length, Math.floor((elapsed - typeStart) / typingSpeed)),
  )
  const replyAt = 2200
  const replyVisible = elapsed >= replyAt || reduced

  const statusCount = reduced ? 3 : elapsed < 3000 ? 0 : elapsed < 3700 ? 1 : elapsed < 4400 ? 2 : 3

  return (
    <div
      ref={rootRef}
      className="hero-demo"
      aria-label="Demonstração ilustrativa de atendimento e agendamento automatizado"
      onMouseEnter={() => setAutoPaused(true)}
      onMouseLeave={() => setAutoPaused(false)}
      onFocusCapture={() => setAutoPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setAutoPaused(false)
      }}
    >
      <span className="demo-label">Demonstração ilustrativa</span>
      <div className="chat-window">
        <div className="chat-topbar">
          <span className="generic-avatar" aria-hidden="true">
            <MessageCircle size={15} />
          </span>
          <span>
            <strong>Atendimento digital</strong>
            <small>disponível agora</small>
          </span>
          <span className="online-dot" aria-hidden="true" />
        </div>

        <div className="chat-body" aria-live="polite">
          <div className="chat-bubble customer">
            {CUSTOMER_MESSAGE.slice(0, typedLength)}
            {typedLength > 0 && typedLength < CUSTOMER_MESSAGE.length && (
              <span className="typing-caret" aria-hidden="true" />
            )}
          </div>

          <div className={`chat-bubble assistant ${replyVisible ? 'is-visible' : ''}`}>
            {REPLY_MESSAGE}
            <span className="message-check">
              <Check size={12} aria-hidden="true" /> Confirmado
            </span>
          </div>
        </div>

        <div className="chat-input" aria-hidden="true">
          <span>Mensagem</span>
          <span>↗</span>
        </div>
      </div>

      <div className="demo-statuses" aria-label="Etapas concluídas da demonstração">
        <div className={statusCount >= 1 ? 'is-visible' : ''}>
          <MessageCircle size={17} aria-hidden="true" />
          <span>Mensagem atendida</span>
          <Check size={15} aria-hidden="true" />
        </div>
        <div className={statusCount >= 2 ? 'is-visible' : ''}>
          <CalendarCheck size={17} aria-hidden="true" />
          <span>Horário agendado</span>
          <Check size={15} aria-hidden="true" />
        </div>
        <div className={statusCount >= 3 ? 'is-visible' : ''}>
          <Database size={17} aria-hidden="true" />
          <span>Lead registrado no CRM</span>
          <Check size={15} aria-hidden="true" />
        </div>
      </div>

      {!reduced && !mobile && (
        <button
          type="button"
          className="demo-control"
          onClick={() => {
            setManualPaused((value) => !value)
            trackEvent('interacao_demo', { acao: manualPaused ? 'retomar' : 'pausar' })
          }}
          aria-pressed={manualPaused}
        >
          {manualPaused ? (
            <Play size={15} aria-hidden="true" />
          ) : (
            <Pause size={15} aria-hidden="true" />
          )}
          {manualPaused ? 'Retomar' : 'Pausar demonstração'}
        </button>
      )}
    </div>
  )
}

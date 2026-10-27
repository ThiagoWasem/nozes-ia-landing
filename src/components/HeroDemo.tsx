import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarCheck, Check, Database, MessageCircle, Pause, Play } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { trackEvent } from '@/lib/analytics'

const CUSTOMER_MESSAGE = 'Olá, vocês têm horário amanhã à tarde?'
const REPLY_MESSAGE = 'Sim. Agendamento confirmado para amanhã às 14h.'
const CYCLE_DURATION = 9000

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
        const next = value + 60
        if (next >= CYCLE_DURATION) return mobile ? CYCLE_DURATION : 0
        return next
      })
    }, 60)
    return () => window.clearInterval(timer)
  }, [manualPaused, autoPaused, reduced, mobile])

  useEffect(() => {
    const visibility = () => setAutoPaused(document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => document.removeEventListener('visibilitychange', visibility)
  }, [])

  const typeStart = 500
  const typeEnd = typeStart + CUSTOMER_MESSAGE.length * 38
  const typedLength = Math.max(
    0,
    Math.min(CUSTOMER_MESSAGE.length, Math.floor((elapsed - typeStart) / 38)),
  )
  const replyAt = typeEnd + 650
  const replyVisible = elapsed >= replyAt || reduced
  const statusCount = reduced
    ? 3
    : Math.max(0, Math.min(3, Math.floor((elapsed - replyAt - 250) / 520) + 1))

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
          <span className="generic-avatar">
            <MessageCircle size={15} aria-hidden="true" />
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
              <Check size={12} aria-hidden="true" /> confirmado
            </span>
          </div>
        </div>
        <div className="chat-input" aria-hidden="true">
          <span>Mensagem</span>
          <span>↗</span>
        </div>
      </div>

      <div className="demo-statuses" aria-label="Etapas concluídas">
        <div className={statusCount >= 1 ? 'is-visible' : ''}>
          <MessageCircle size={17} />
          <span>Mensagem atendida</span>
          <Check size={15} />
        </div>
        <div className={statusCount >= 2 ? 'is-visible' : ''}>
          <CalendarCheck size={17} />
          <span>Horário agendado</span>
          <Check size={15} />
        </div>
        <div className={statusCount >= 3 ? 'is-visible' : ''}>
          <Database size={17} />
          <span>Lead registrado no CRM</span>
          <Check size={15} />
        </div>
      </div>

      {!reduced && (
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

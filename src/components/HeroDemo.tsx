import { useEffect, useRef, useState } from 'react'
import { CalendarCheck, Check, Database, MessageCircle, Pause, Play } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { trackEvent } from '@/lib/analytics'

/* ==========================================================================
   HERO DEMO (DEMONSTRAÇÃO ILUSTRATIVA)
   - Motor de tempo único via requestAnimationFrame e tempo decorrido absoluto.
   - Totalmente desacoplado da rolagem: quando sai da viewport, pausa; ao voltar,
     retoma exatamente de forma fluida sem travar.
   - Ritmo acelerado e dinâmico (~4,8s total): leitura fluida e viva.
   - Mensagem digitada rápida, IA responde em <600ms, 3 passos de confirmação
     entram em cascata imediata.
   ========================================================================== */

const CUSTOMER_MESSAGE = 'Olá! Vocês têm horário disponível para amanhã à tarde?'
const REPLY_MESSAGE = 'Sim! Horário confirmado para amanhã às 14h na nossa agenda.'
const CYCLE_DURATION = 4800

export function HeroDemo() {
  const reduced = useReducedMotion()
  const [elapsed, setElapsed] = useState(reduced ? CYCLE_DURATION : 0)
  const [manualPaused, setManualPaused] = useState(false)
  const [isInView, setIsInView] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const animFrameRef = useRef<number | null>(null)

  // IntersectionObserver para pausar fora da viewport e retomar ao voltar
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting)
        })
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Visibilidade da aba (pausar se trocar de aba)
  const [isTabVisible, setIsTabVisible] = useState(true)
  useEffect(() => {
    const onVis = () => setIsTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Motor rAF com tempo decorrido absoluto contínuo
  useEffect(() => {
    if (reduced) {
      setElapsed(CYCLE_DURATION)
      return
    }

    // Pausa/retoma manual sempre vence: sem "auto pausa" por hover, o clique em
    // "Retomar" restaura o loop imediatamente, mesmo com o ponteiro sobre a demo.
    const shouldRun = isInView && isTabVisible && !manualPaused
    if (!shouldRun) {
      lastTimeRef.current = null
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp
      }
      const delta = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      elapsedRef.current = (elapsedRef.current + delta) % CYCLE_DURATION
      setElapsed(elapsedRef.current)

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isInView, isTabVisible, manualPaused, reduced])

  // Cronologia acelerada e dinâmica (ciclo total 4800ms):
  // 0 - 150ms: início imediato
  // 150ms - 1300ms: digitação ágil (ritmo vivo, ~20ms por caractere)
  // 1300ms - 1700ms: IA responde com confirmação imediata
  // 1700ms: Bloco 1 (Mensagem atendida)
  // 2100ms: Bloco 2 (Horário agendado)
  // 2500ms: Bloco 3 (Lead registrado no CRM)
  // 2500ms - 4800ms: Leitura clara do ciclo completo e reinício sem pausa morta
  const typeStart = 150
  const typingSpeed = 20
  const typedLength = Math.max(
    0,
    Math.min(CUSTOMER_MESSAGE.length, Math.floor((elapsed - typeStart) / typingSpeed)),
  )
  const replyAt = 1350
  const replyVisible = elapsed >= replyAt || reduced

  const statusCount = reduced ? 3 : elapsed < 1700 ? 0 : elapsed < 2100 ? 1 : elapsed < 2500 ? 2 : 3

  return (
    <div
      ref={rootRef}
      className="hero-demo"
      aria-label="Demonstração ilustrativa de atendimento e agendamento automatizado"
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

      {!reduced && (
        <button
          type="button"
          className="demo-control"
          onClick={() => {
            setManualPaused((value) => !value)
            trackEvent('interacao_demo', { acao: manualPaused ? 'retomar' : 'pausar' })
          }}
          aria-pressed={manualPaused}
          aria-label={manualPaused ? 'Retomar demonstração do hero' : 'Pausar demonstração do hero'}
        >
          {manualPaused ? (
            <Play size={15} aria-hidden="true" />
          ) : (
            <Pause size={15} aria-hidden="true" />
          )}
          <span>{manualPaused ? 'Retomar' : 'Pausar demonstração'}</span>
        </button>
      )}
    </div>
  )
}

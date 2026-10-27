import { useState, useEffect, useRef } from 'react'
import {
  Bot,
  CalendarDays,
  Check,
  Code2,
  Cpu,
  Globe2,
  LayoutTemplate,
  MessageCircle,
  RefreshCw,
  Rows3,
  Sparkles,
  UserRoundSearch,
  Zap,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { CONFIG } from '@/lib/site'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { SectionHeading } from './SectionHeading'

/* ==========================================================================
   SOLUÇÕES DIGITAIS (bento grid)
   - Título: "Soluções digitais"
   - Subtítulo: "A implementação muda. O critério não."
   - Cada card tem:
     * Título
     * Uma frase de benefício
     * De 2 a 3 itens curtos em "O que entregamos"
   - Cards especificados no prompt:
     1. Sites e landing pages
     2. Portfólios
     3. Catálogos digitais (símbolo próprio da marca e nomes de linguagens em TEXTO orbitando)
     4. Agendamento com Google Calendar (rótulo "Demonstração ilustrativa")
     5. Atendimento e automação no WhatsApp
     6. CRM e acompanhamento de leads
     7. Presença no Google
   ========================================================================== */

/* ==========================================================================
   MINI MOCKUPS / DEMONSTRAÇÕES ANIMADAS GENÉRICAS DO BENTO GRID
   - Todos os 7 cards com mockups animados padronizados e visual coeso.
   - Rótulo "Demonstração ilustrativa" removido de todos os cards.
   - Animação em requestAnimationFrame contínuo, pausada fora da viewport.
   - Apenas transform e opacity (GPU-friendly).
   ========================================================================== */

function CalendarDemo({ isInView }: { isInView: boolean }) {
  const reduced = useReducedMotion()
  const [activeDay, setActiveDay] = useState(17)

  useEffect(() => {
    if (reduced || !isInView) return
    let lastTick = performance.now()
    let frameId: number
    const days = [11, 14, 16, 17, 19, 20]

    const tick = (now: number) => {
      if (now - lastTick >= 1600) {
        lastTick = now
        setActiveDay((prev) => {
          const nextIdx = (days.indexOf(prev) + 1) % days.length
          return days[nextIdx]
        })
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [reduced, isInView])

  return (
    <div className="bento-mockup calendar-demo" aria-label="Visualização de agendamento integrado">
      <div className="calendar-demo-grid">
        {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((day) => (
          <span className={day === activeDay ? 'is-free' : ''} key={day}>
            {day}
          </span>
        ))}
      </div>
      <div className="sync-flow" aria-hidden="true">
        <span className="slot-pill">
          <Check size={13} /> {activeDay === 17 ? '14:00' : '10:30'}
        </span>
        <RefreshCw className="sync-glyph" size={18} />
        <span className="calendar-outline">
          <CalendarDays size={20} />
        </span>
      </div>
    </div>
  )
}

function WhatsAppDemo({ isInView }: { isInView: boolean }) {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(reduced ? 3 : 1)

  useEffect(() => {
    if (reduced || !isInView) return
    let lastTick = performance.now()
    let frameId: number

    const tick = (now: number) => {
      if (now - lastTick >= 1800) {
        lastTick = now
        setStep((s) => (s >= 3 ? 1 : s + 1))
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [reduced, isInView])

  return (
    <div className="bento-mockup whatsapp-card-demo" aria-label="Visualização de fluxo de WhatsApp">
      <div className="messages-stream" aria-hidden="true">
        <div className={`message-bubble bubble-client ${step >= 1 ? 'is-visible' : ''}`}>
          <span>Qual o valor do projeto?</span>
        </div>
        <div className={`message-bubble bubble-assistant ${step >= 2 ? 'is-visible' : ''}`}>
          <span>Olá! Fazemos um diagnóstico gratuito antes.</span>
        </div>
        <div className={`message-bubble bubble-system ${step >= 3 ? 'is-visible' : ''}`}>
          <Check size={11} aria-hidden="true" />
          <span>Atendimento iniciado em 40s</span>
        </div>
      </div>
    </div>
  )
}

/* Orbit / Radar Tech de Catálogos Digitais com IA e capacidades da Nozes Ink */
const ORBIT_ITEMS = [
  { id: 'ia', label: 'IA no WhatsApp', icon: Bot, angle: 0 },
  { id: 'cat', label: 'Catálogo Ágil', icon: Sparkles, angle: 60 },
  { id: 'ts', label: 'TypeScript', icon: Code2, angle: 120 },
  { id: 'auto', label: 'Automação', icon: Zap, angle: 180 },
  { id: 'sync', label: 'Integrações', icon: Cpu, angle: 240 },
  { id: 'react', label: 'React / Web', icon: Code2, angle: 300 },
]

function CatalogDemo({ isInView }: { isInView: boolean }) {
  const reduced = useReducedMotion()
  const [activeItem, setActiveItem] = useState(0)

  useEffect(() => {
    if (reduced || !isInView) return
    let lastTick = performance.now()
    let frameId: number

    const tick = (now: number) => {
      if (now - lastTick >= 1700) {
        lastTick = now
        setActiveItem((prev) => (prev + 1) % ORBIT_ITEMS.length)
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [reduced, isInView])

  return (
    <div
      className="bento-mockup catalog-demo"
      aria-label="Capacidades de tecnologia e IA do catálogo"
    >
      <div className="catalog-radar-grid" aria-hidden="true">
        <div className="radar-circle circle-outer" />
        <div className="radar-circle circle-mid" />
        <div className="radar-circle circle-inner" />
        <div className="radar-cross-h" />
        <div className="radar-cross-v" />
      </div>

      <div className="orbit-center-hub" aria-hidden="true">
        <Logo variant="symbol" tone="evergreen" />
        <span className="hub-badge">IA + Web</span>
      </div>

      <div className="catalog-orbit-nodes" aria-hidden="true">
        {ORBIT_ITEMS.map((item, index) => {
          const Icon = item.icon
          const isActive = index === activeItem
          return (
            <div
              key={item.id}
              className={`catalog-node node-${index + 1} ${isActive ? 'is-active' : ''}`}
            >
              <div className="node-icon">
                <Icon size={13} aria-hidden="true" />
              </div>
              <span className="node-label">{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* Mockup animado padronizado para Sites e Landing Pages */
function BrowserDemo({ isInView }: { isInView: boolean }) {
  const reduced = useReducedMotion()
  const [pulseIndex, setPulseIndex] = useState(0)

  useEffect(() => {
    if (reduced || !isInView) return
    let lastTick = performance.now()
    let frameId: number

    const tick = (now: number) => {
      if (now - lastTick >= 1400) {
        lastTick = now
        setPulseIndex((prev) => (prev + 1) % 3)
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [reduced, isInView])

  return (
    <div className="bento-mockup browser-mockup-deluxe" aria-hidden="true">
      <div className="browser-deluxe-bar">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <span className="browser-url-pill">nozesink.com.br</span>
      </div>
      <div className="browser-deluxe-canvas">
        <div className={`hero-wireframe ${pulseIndex === 0 ? 'is-active' : ''}`}>
          <span className="wire-headline" />
          <span className="wire-sub" />
          <span className="wire-cta" />
        </div>
        <div className="browser-wire-cards">
          <div className={`wire-card ${pulseIndex === 1 ? 'is-active' : ''}`} />
          <div className={`wire-card ${pulseIndex === 2 ? 'is-active' : ''}`} />
        </div>
      </div>
    </div>
  )
}

/* Mockup animado padronizado para Portfólios Digitais */
function PortfolioDemo({ isInView }: { isInView: boolean }) {
  const reduced = useReducedMotion()
  const [focusedCard, setFocusedCard] = useState(1)

  useEffect(() => {
    if (reduced || !isInView) return
    let lastTick = performance.now()
    let frameId: number

    const tick = (now: number) => {
      if (now - lastTick >= 1600) {
        lastTick = now
        setFocusedCard((prev) => (prev + 1) % 3)
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [reduced, isInView])

  return (
    <div className="bento-mockup portfolio-mockup-deluxe" aria-hidden="true">
      {[0, 1, 2].map((idx) => {
        const isFocused = idx === focusedCard
        return (
          <div
            key={idx}
            className={`portfolio-card-item card-${idx} ${isFocused ? 'is-focused' : ''}`}
          >
            <div className="portfolio-thumb-inner" />
            <span className="portfolio-label-line" />
          </div>
        )
      })}
    </div>
  )
}

/* Mockup animado padronizado para CRM e Acompanhamento de Leads */
function CrmDemo({ isInView }: { isInView: boolean }) {
  const reduced = useReducedMotion()
  const [leadStage, setLeadStage] = useState(1)

  useEffect(() => {
    if (reduced || !isInView) return
    let lastTick = performance.now()
    let frameId: number

    const tick = (now: number) => {
      if (now - lastTick >= 1500) {
        lastTick = now
        setLeadStage((prev) => (prev >= 3 ? 1 : prev + 1))
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [reduced, isInView])

  return (
    <div className="bento-mockup crm-mockup-deluxe" aria-hidden="true">
      <div className="crm-kanban-cols">
        <div className="crm-col">
          <span className="crm-col-header">Novo contato</span>
          <div className={`crm-card ${leadStage === 1 ? 'is-lead-active' : ''}`}>
            <strong>Roberto S.</strong>
            <small>Orçamento balcão</small>
          </div>
        </div>
        <div className="crm-col">
          <span className="crm-col-header">Em conversa</span>
          <div className={`crm-card ${leadStage === 2 ? 'is-lead-active' : ''}`}>
            <strong>Carla M.</strong>
            <small>Visita técnica</small>
          </div>
        </div>
        <div className="crm-col">
          <span className="crm-col-header">Proposta ganha</span>
          <div className={`crm-card ${leadStage === 3 ? 'is-lead-active' : ''}`}>
            <strong>Juliano P.</strong>
            <small className="gain-label">Fechado R$ 4.200</small>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Mockup animado padronizado para Presença no Google */
function GoogleSearchDemo({ isInView }: { isInView: boolean }) {
  const reduced = useReducedMotion()
  const [badgeGlow, setBadgeGlow] = useState(true)

  useEffect(() => {
    if (reduced || !isInView) return
    let lastTick = performance.now()
    let frameId: number

    const tick = (now: number) => {
      if (now - lastTick >= 1400) {
        lastTick = now
        setBadgeGlow((prev) => !prev)
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [reduced, isInView])

  return (
    <div className="bento-mockup google-mockup-deluxe" aria-hidden="true">
      <div className="google-result-item">
        <div className="google-avatar-icon">G</div>
        <div className="google-result-info">
          <span className="google-place-name">Sua Empresa no Maps</span>
          <div className="google-stars-row">
            <span className="stars-fill">★★★★★</span>
            <span className="stars-score">5.0 (128 avaliações)</span>
          </div>
          <span className={`google-badge-status ${badgeGlow ? 'glow' : ''}`}>
            ✓ Verificado & Aberto agora
          </span>
        </div>
      </div>
    </div>
  )
}

interface FeatureItem {
  title: string
  benefit: string
  entregamos: string[]
  icon: React.ComponentType<{
    size?: number
    className?: string
    'aria-hidden'?: boolean | 'true' | 'false'
  }>
  size: 'wide' | 'small' | 'tall' | 'large' | 'medium'
  demoType: 'browser' | 'portfolio' | 'catalog' | 'calendar' | 'messages' | 'crm' | 'google'
}

const features: FeatureItem[] = [
  {
    title: 'Sites e landing pages',
    benefit: 'Páginas rápidas voltadas para a conversão de clientes locais.',
    entregamos: [
      'Estrutura mobile first e veloz',
      'Design alinhado à sua marca',
      'Integração direta com WhatsApp',
    ],
    icon: LayoutTemplate,
    size: 'wide',
    demoType: 'browser',
  },
  {
    title: 'Portfólios digitais',
    benefit: 'Seus melhores projetos organizados com clareza para fechar propostas.',
    entregamos: [
      'Galeria limpa de projetos',
      'Contexto antes e depois',
      'Carregamento rápido em fotos',
    ],
    icon: Rows3,
    size: 'small',
    demoType: 'portfolio',
  },
  {
    title: 'Catálogos digitais',
    benefit: 'Informação de produtos fácil de atualizar e consultar no balcão ou no chat.',
    entregamos: [
      'Atualização simples e central',
      'Visualização ágil no celular',
      'Envio de item para o WhatsApp',
    ],
    icon: Code2,
    size: 'tall',
    demoType: 'catalog',
  },
  {
    title: 'Agendamento com Google Calendar',
    benefit: 'Horários disponíveis confirmados sem troca de mensagens demoradas.',
    entregamos: [
      'Sincronização com agenda oficial',
      'Bloqueio automático de choque de horários',
      'Confirmação com o cliente',
    ],
    icon: CalendarDays,
    size: 'large',
    demoType: 'calendar',
  },
  {
    title: 'Atendimento e automação no WhatsApp',
    benefit: 'Dúvidas frequentes respondidas no primeiro minuto, sem perder o tom humano.',
    entregamos: [
      'Triagem inicial rápida',
      'Respostas de dúvidas comuns',
      'Transbordo para atendente humano',
    ],
    icon: MessageCircle,
    size: 'medium',
    demoType: 'messages',
  },
  {
    title: 'CRM e acompanhamento de leads',
    benefit: 'Histórico de cada conversa para sua equipe não esquecer nenhum orçamento.',
    entregamos: [
      'Registro automático do contato',
      'Status de cada negociação',
      'Lembretes de retorno',
    ],
    icon: UserRoundSearch,
    size: 'wide',
    demoType: 'crm',
  },
  {
    title: 'Presença no Google',
    benefit: 'Perfil da sua empresa bem posicionado para buscas da sua região.',
    entregamos: [
      'Otimização do Perfil da Empresa',
      'Fotos e horários atualizados',
      'Estratégia para novas avaliações',
    ],
    icon: Globe2,
    size: 'wide',
    demoType: 'google',
  },
]

function FeatureVisual({
  demoType,
  isInView,
}: {
  demoType: FeatureItem['demoType']
  isInView: boolean
}) {
  if (demoType === 'calendar') return <CalendarDemo isInView={isInView} />
  if (demoType === 'catalog') return <CatalogDemo isInView={isInView} />
  if (demoType === 'browser') return <BrowserDemo isInView={isInView} />
  if (demoType === 'portfolio') return <PortfolioDemo isInView={isInView} />
  if (demoType === 'messages') return <WhatsAppDemo isInView={isInView} />
  if (demoType === 'crm') return <CrmDemo isInView={isInView} />
  if (demoType === 'google') return <GoogleSearchDemo isInView={isInView} />
  return null
}

export function FeaturesSection() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
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

  if (CONFIG.modo_funcionalidades !== 'bento') return null

  return (
    <section
      ref={sectionRef}
      className="section features-section"
      data-features
      aria-labelledby="features-title"
    >
      <div className="shell">
        <SectionHeading
          eyebrow="Soluções digitais"
          title="Soluções digitais"
          description="A implementação muda. O critério não."
        />
        <div className="bento-grid">
          {features.map(({ title, benefit, entregamos, icon: Icon, size, demoType }) => {
            return (
              <article
                className={`feature-card feature-${size} card-with-${demoType}`}
                data-scroll-card
                key={title}
              >
                <div className="feature-top-bar">
                  <div className="feature-icon">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                </div>

                <div className="feature-body-layout">
                  <div className="feature-copy">
                    <h3>{title}</h3>
                    <p className="feature-benefit">{benefit}</p>
                    <div className="feature-deliverables">
                      <span className="deliverables-title">O que entregamos:</span>
                      <ul>
                        {entregamos.map((item) => (
                          <li key={item}>
                            <Check size={13} aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="feature-demo-container">
                    <FeatureVisual demoType={demoType} isInView={isInView} />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

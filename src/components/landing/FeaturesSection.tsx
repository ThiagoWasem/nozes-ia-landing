import {
  CalendarDays,
  Check,
  Code2,
  Globe2,
  LayoutTemplate,
  MessageCircle,
  RefreshCw,
  Rows3,
  UserRoundSearch,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { CONFIG } from '@/lib/site'
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

function CalendarDemo() {
  return (
    <div className="calendar-demo" aria-label="Demonstração ilustrativa de agendamento">
      <span className="mini-demo-label">Demonstração ilustrativa</span>
      <div className="calendar-demo-grid">
        {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((day) => (
          <span className={day === 17 ? 'is-free' : ''} key={day}>
            {day}
          </span>
        ))}
      </div>
      <div className="sync-flow" aria-hidden="true">
        <span className="slot-pill">
          <Check size={13} /> 14:00
        </span>
        <RefreshCw className="sync-glyph" size={18} />
        <span className="calendar-outline">
          <CalendarDays size={20} />
        </span>
      </div>
    </div>
  )
}

function WhatsAppDemo() {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(reduced ? 3 : 1)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (reduced || isPaused) return
    const interval = window.setInterval(() => {
      setStep((s) => (s >= 3 ? 1 : s + 1))
    }, 2200)
    return () => window.clearInterval(interval)
  }, [reduced, isPaused])

  return (
    <div className="whatsapp-card-demo" aria-label="Demonstração ilustrativa de atendimento">
      <div className="whatsapp-card-demo-header">
        <span className="mini-demo-label">Demonstração ilustrativa</span>
        {!reduced && (
          <button
            type="button"
            className="mini-demo-pause-btn"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={
              isPaused ? 'Retomar demonstração de WhatsApp' : 'Pausar demonstração de WhatsApp'
            }
            title={isPaused ? 'Retomar' : 'Pausar'}
          >
            {isPaused ? (
              <Play size={10} aria-hidden="true" />
            ) : (
              <Pause size={10} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
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

function CatalogDemo() {
  return (
    <div className="catalog-demo" aria-hidden="true">
      <div className="orbit-ring auto-orbit" data-orbit>
        <span className="orbit-text text-one">React</span>
        <span className="orbit-text text-two">TypeScript</span>
        <span className="orbit-text text-three">Tailwind</span>
        <span className="orbit-mark" data-orbit-upright>
          <Logo variant="symbol" tone="evergreen" />
        </span>
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
  demo?: string
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
    demo: 'browser',
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
    demo: 'portfolio',
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
    demo: 'catalog',
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
    demo: 'calendar',
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
    demo: 'messages',
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
    demo: 'crm',
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
    demo: 'browser',
  },
]

function FeatureVisual({ demo }: { demo?: string }) {
  if (demo === 'calendar') return <CalendarDemo />
  if (demo === 'catalog') return <CatalogDemo />
  if (demo === 'browser') {
    return (
      <div className="browser-mini" aria-hidden="true">
        <span />
        <div>
          <b />
          <b />
          <b />
        </div>
      </div>
    )
  }
  if (demo === 'portfolio') {
    return (
      <div className="portfolio-mini" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    )
  }
  if (demo === 'messages') {
    return (
      <div className="messages-mini" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    )
  }
  if (demo === 'crm') {
    return (
      <div className="crm-mini" aria-hidden="true">
        <span />
        <span />
        <span />
        <i />
      </div>
    )
  }
  return null
}

export function FeaturesSection() {
  if (CONFIG.modo_funcionalidades !== 'bento') return null

  return (
    <section className="section features-section" data-features aria-labelledby="features-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Soluções digitais"
          title="Soluções digitais"
          description="A implementação muda. O critério não."
        />
        <div className="bento-grid">
          {features.map(({ title, benefit, entregamos, icon: Icon, size, demo }) => (
            <article className={`feature-card feature-${size}`} data-scroll-card key={title}>
              <div className="feature-top-bar">
                <div className="feature-icon">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <FeatureVisual demo={demo} />
              </div>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

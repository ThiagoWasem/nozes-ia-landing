import {
  CalendarDays,
  Check,
  Code2,
  LayoutTemplate,
  MessageCircle,
  RefreshCw,
  Rows3,
  UserRoundSearch,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { CONFIG } from '@/lib/site'
import { SectionHeading } from './SectionHeading'

function CalendarDemo() {
  return (
    <div className="calendar-demo" aria-label="Demonstração ilustrativa de sincronização de agenda">
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
        <RefreshCw className="sync-glyph" size={20} />
        <span className="calendar-outline">
          <CalendarDays size={22} />
        </span>
      </div>
    </div>
  )
}

function CatalogDemo() {
  return (
    <div className="catalog-demo" aria-hidden="true">
      <div className="orbit-ring" data-orbit>
        <span className="orbit-glyph glyph-one">&lt;/&gt;</span>
        <span className="orbit-glyph glyph-two">{'{ }'}</span>
        <span className="orbit-glyph glyph-three">◫</span>
        <span className="orbit-mark" data-orbit-upright>
          <Logo variant="symbol" tone="evergreen" />
        </span>
      </div>
      <div className="catalog-lines">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

const features = [
  {
    title: 'Sites e landing pages',
    copy: 'Presença digital focada na ação que sua empresa precisa gerar.',
    icon: LayoutTemplate,
    size: 'wide',
    demo: 'browser',
  },
  {
    title: 'Portfólios',
    copy: 'Projetos apresentados com contexto, organização e clareza.',
    icon: Rows3,
    size: 'small',
    demo: 'portfolio',
  },
  {
    title: 'Catálogos digitais',
    copy: 'Informação centralizada para facilitar consulta e atualização.',
    icon: Code2,
    size: 'tall',
    demo: 'catalog',
  },
  {
    title: 'Agendamento integrado com Google Calendar',
    copy: 'Disponibilidade e confirmação dentro de um fluxo organizado.',
    icon: CalendarDays,
    size: 'large',
    demo: 'calendar',
  },
  {
    title: 'Atendimento e automação no WhatsApp',
    copy: 'Dúvidas recorrentes atendidas sem perder o contexto humano.',
    icon: MessageCircle,
    size: 'medium',
    demo: 'messages',
  },
  {
    title: 'CRM e acompanhamento de leads',
    copy: 'Contatos registrados para que nenhuma conversa dependa da memória.',
    icon: UserRoundSearch,
    size: 'wide',
    demo: 'crm',
  },
]

function FeatureVisual({ demo }: { demo: string }) {
  if (demo === 'calendar') return <CalendarDemo />
  if (demo === 'catalog') return <CatalogDemo />
  if (demo === 'browser')
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
  if (demo === 'portfolio')
    return (
      <div className="portfolio-mini" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    )
  if (demo === 'messages')
    return (
      <div className="messages-mini" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    )
  return (
    <div className="crm-mini" aria-hidden="true">
      <span />
      <span />
      <span />
      <i />
    </div>
  )
}

export function FeaturesSection() {
  if (CONFIG.modo_funcionalidades !== 'bento') return null

  return (
    <section className="section features-section" data-features aria-labelledby="features-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Soluções digitais"
          title="A implementação muda. O critério não."
          description="Escolhemos a tecnologia depois de entender o gargalo, o fluxo e quem precisa usar a solução."
        />
        <div className="bento-grid">
          {features.map(({ title, copy, icon: Icon, size, demo }) => (
            <article className={`feature-card feature-${size}`} data-scroll-card key={title}>
              <div className="feature-icon">
                <Icon size={20} aria-hidden="true" />
              </div>
              <div className="feature-copy">
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <FeatureVisual demo={demo} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

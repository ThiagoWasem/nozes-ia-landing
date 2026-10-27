import type { LucideIcon } from 'lucide-react'
import {
  BriefcaseBusiness,
  CarFront,
  HelpCircle,
  House,
  PanelsTopLeft,
  ShoppingBag,
} from 'lucide-react'

/* ==========================================================================
   SEÇÃO PARA QUEM É
   - Título: "Para negócios que vendem pelo WhatsApp, pelo Google e pelo catálogo."
   - 5 segmentos específicos:
     1. Móveis planejados
     2. Esquadrias e serviços residenciais
     3. Automotivo
     4. Varejo local
     5. Serviços profissionais
   - Garantia: NUNCA renderizar undefined (prevenção contra "Element type is invalid")
   ========================================================================== */

interface SegmentItem {
  titulo: string
  descricao: string
  icon: LucideIcon
}

const AUDIENCE_SEGMENTS: SegmentItem[] = [
  {
    titulo: 'Móveis planejados',
    descricao: 'Projetos, medidas e orçamentos organizados sem perda de contexto.',
    icon: PanelsTopLeft,
  },
  {
    titulo: 'Esquadrias e serviços residenciais',
    descricao: 'Solicitações de clientes e especificações encaminhadas com rapidez.',
    icon: House,
  },
  {
    titulo: 'Automotivo',
    descricao: 'Atendimentos, agendamento de serviços e dúvidas com fluxo rápido.',
    icon: CarFront,
  },
  {
    titulo: 'Varejo local',
    descricao: 'Catálogo de produtos sempre visível e fácil de consultar no WhatsApp.',
    icon: ShoppingBag,
  },
  {
    titulo: 'Serviços profissionais',
    descricao: 'Agenda conectada, presença no Google e captação de contatos qualificados.',
    icon: BriefcaseBusiness,
  },
]

export function AudienceSection() {
  return (
    <section className="audience-section" aria-labelledby="audience-title">
      <div className="shell">
        <div className="audience-heading" data-reveal>
          <p className="eyebrow">Para quem é</p>
          <h2 id="audience-title">
            Para negócios que vendem pelo WhatsApp, pelo Google e pelo catálogo.
          </h2>
        </div>
        <div className="audience-row" tabIndex={0} aria-label="Segmentos atendidos pela Nozes Ink">
          {AUDIENCE_SEGMENTS.map((segment) => {
            const Icon = segment.icon || HelpCircle
            const titulo = segment.titulo || 'Segmento'
            const descricao = segment.descricao || ''

            return (
              <article key={titulo} data-reveal>
                <div className="audience-icon-wrap" aria-hidden="true">
                  <Icon size={24} />
                </div>
                <h3>{titulo}</h3>
                <p>{descricao}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import type { LucideIcon } from 'lucide-react'
import {
  BriefcaseBusiness,
  CarFront,
  HelpCircle,
  House,
  PanelsTopLeft,
  ShoppingBag,
} from 'lucide-react'
import { SEGMENTOS } from '@/lib/site'

interface SegmentDetails {
  icon: LucideIcon
  description: string
}

const SEGMENT_DETAILS: Record<string, SegmentDetails> = {
  'Móveis planejados': {
    icon: PanelsTopLeft,
    description: 'Projetos, medidas e orçamentos com informação organizada.',
  },
  'Esquadrias e serviços residenciais': {
    icon: House,
    description: 'Solicitações residenciais encaminhadas com mais contexto.',
  },
  Automotivo: {
    icon: CarFront,
    description: 'Atendimento, serviços e agendamentos em um fluxo claro.',
  },
  'Varejo local': {
    icon: ShoppingBag,
    description: 'Produtos e contatos fáceis de consultar e acompanhar.',
  },
  'Serviços profissionais': {
    icon: BriefcaseBusiness,
    description: 'Presença, agenda e relacionamento conectados à rotina.',
  },
  Outro: {
    icon: HelpCircle,
    description: 'Gargalos mapeados e soluções digitais sob medida para a sua operação.',
  },
}

const DEFAULT_SEGMENT_DETAILS: SegmentDetails = {
  icon: HelpCircle,
  description: 'Gargalos mapeados e soluções digitais sob medida para a sua operação.',
}

export function AudienceSection() {
  return (
    <section className="audience-section" aria-labelledby="audience-title">
      <div className="shell">
        <div className="audience-heading" data-reveal>
          <p className="eyebrow">Para quem é</p>
          <h2 id="audience-title">Negócios com uma operação real para destravar.</h2>
        </div>
        <div
          className="audience-row"
          tabIndex={0}
          aria-label="Segmentos atendidos, role horizontal no celular"
        >
          {SEGMENTOS.map((segment) => {
            const detail = SEGMENT_DETAILS[segment] || DEFAULT_SEGMENT_DETAILS
            const Icon = detail.icon || HelpCircle
            const description = detail.description || DEFAULT_SEGMENT_DETAILS.description

            return (
              <article key={segment}>
                {Icon ? <Icon size={23} aria-hidden="true" /> : null}
                <h3>{segment}</h3>
                <p>{description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

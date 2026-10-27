import { BriefcaseBusiness, CarFront, House, PanelsTopLeft, ShoppingBag } from 'lucide-react'
import { SEGMENTOS } from '@/lib/site'

const descriptions = [
  'Projetos, medidas e orçamentos com informação organizada.',
  'Solicitações residenciais encaminhadas com mais contexto.',
  'Atendimento, serviços e agendamentos em um fluxo claro.',
  'Produtos e contatos fáceis de consultar e acompanhar.',
  'Presença, agenda e relacionamento conectados à rotina.',
]
const icons = [PanelsTopLeft, House, CarFront, ShoppingBag, BriefcaseBusiness]

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
          {SEGMENTOS.map((segment, index) => {
            const Icon = icons[index]
            return (
              <article key={segment}>
                <Icon size={23} aria-hidden="true" />
                <h3>{segment}</h3>
                <p>{descriptions[index]}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

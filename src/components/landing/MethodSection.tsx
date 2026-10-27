import { Search, ListFilter, Wrench, LineChart } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const steps = [
  {
    title: 'Diagnosticar',
    copy: 'Entender como a operação funciona hoje e onde o cliente escapa.',
    tag: 'Fase 01',
    icon: Search,
  },
  {
    title: 'Priorizar',
    copy: 'Escolher o gargalo que merece atenção primeiro para dar tração.',
    tag: 'Fase 02',
    icon: ListFilter,
  },
  {
    title: 'Implementar',
    copy: 'Construir a solução adequada ao problema real, sem excessos.',
    tag: 'Fase 03',
    icon: Wrench,
  },
  {
    title: 'Acompanhar',
    copy: 'Verificar o resultado em números e mapear o próximo avanço.',
    tag: 'Fase 04',
    icon: LineChart,
  },
]

export function MethodSection() {
  return (
    <section className="section method-section" data-method aria-labelledby="method-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Método Gargalo"
          title="Uma sequência simples. Sem pacote pronto."
          description="Cada etapa reduz a chance de construir algo que não resolve o problema real."
        />
        <div className="method-map">
          <div className="method-track" aria-hidden="true">
            <span />
          </div>
          {steps.map(({ title, copy, tag, icon: Icon }, index) => (
            <article className="method-step" data-method-node key={title}>
              <div className="method-node-wrapper">
                <div className="method-node">
                  <span>0{index + 1}</span>
                  <div className="method-pulse-ring" aria-hidden="true" />
                  <i />
                </div>
                <div className="method-icon-badge" aria-hidden="true">
                  <Icon size={14} />
                </div>
              </div>
              <div className="method-step-content">
                <span className="method-phase-tag">{tag}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

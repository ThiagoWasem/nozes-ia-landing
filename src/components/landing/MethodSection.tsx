import { SectionHeading } from './SectionHeading'

const steps = [
  ['Diagnosticar', 'Entender como a operação funciona hoje.'],
  ['Priorizar', 'Escolher o gargalo que merece atenção primeiro.'],
  ['Implementar', 'Construir a solução adequada ao problema.'],
  ['Acompanhar', 'Verificar o resultado e identificar o próximo gargalo.'],
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
          {steps.map(([title, copy], index) => (
            <article className="method-step" data-method-node key={title}>
              <div className="method-node">
                <span>0{index + 1}</span>
                <i />
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

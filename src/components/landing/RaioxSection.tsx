import { ArrowDownRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const cenarios = [
  {
    title: 'Orçamento que demora dias',
    fields: [
      ['Problema', 'As informações chegam soltas e o orçamento depende de várias perguntas.'],
      ['Impacto', 'O cliente espera e a equipe repete trabalho manual.'],
      ['Prioridade', 'Organizar a entrada antes de acelerar a resposta.'],
      ['Solução', 'Formulário objetivo, dados completos e encaminhamento claro.'],
    ],
  },
  {
    title: 'Catálogo desatualizado',
    fields: [
      ['Problema', 'Produtos e serviços ficam espalhados em arquivos e conversas.'],
      ['Impacto', 'A apresentação perde consistência e exige correções frequentes.'],
      ['Prioridade', 'Criar uma fonte simples de atualização.'],
      ['Solução', 'Catálogo digital organizado e fácil de manter.'],
    ],
  },
  {
    title: 'A mesma pergunta no WhatsApp',
    fields: [
      ['Problema', 'A equipe responde repetidamente dúvidas básicas.'],
      ['Impacto', 'O atendimento ocupa tempo antes de a conversa avançar.'],
      ['Prioridade', 'Separar dúvidas recorrentes de contatos que precisam de atenção.'],
      ['Solução', 'Atendimento orientado, registro do lead e continuidade humana.'],
    ],
  },
]

export function RaioxSection() {
  return (
    <section className="section raiox-section" aria-labelledby="raiox-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Raio-X digital"
          title="O problema aparece antes da tecnologia."
          description="O diagnóstico transforma sintomas soltos em uma decisão clara: problema, impacto, prioridade e solução."
        />
        <div className="raiox-grid">
          {cenarios.map((cenario, index) => (
            <article
              className="raiox-card"
              data-reveal
              style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}
              key={cenario.title}
            >
              <div className="raiox-card-top">
                <span>0{index + 1}</span>
                <ArrowDownRight size={20} aria-hidden="true" />
              </div>
              <h3>{cenario.title}</h3>
              <dl>
                {cenario.fields.map(([label, text]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

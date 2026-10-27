import { Check, MessageCircle } from 'lucide-react'
import { CONFIG } from '@/lib/site'
import { SectionHeading } from './SectionHeading'

const moments = [
  ['Conversa organizada', 'A mensagem entra com contexto e segue para o atendimento certo.'],
  ['Acompanhamento visível', 'O contato deixa de ficar perdido entre conversas e lembretes.'],
  ['Evolução contínua', 'A operação ganha informação para decidir o próximo ajuste.'],
]

function PhoneStory() {
  return (
    <div className="story-phone" aria-label="Celular ilustrativo mostrando conversas organizadas">
      <div className="phone-speaker" aria-hidden="true" />
      <div className="phone-header">
        <MessageCircle size={16} />
        <span>Atendimento</span>
        <i />
      </div>
      <div className="phone-messages">
        <div data-story-message>Preciso de um orçamento para meu projeto.</div>
        <div data-story-message>Perfeito. Vou organizar as informações necessárias.</div>
        <div data-story-message>
          Contato registrado para acompanhamento.
          <span>
            <Check size={11} /> pronto
          </span>
        </div>
      </div>
      <div className="phone-input" aria-hidden="true">
        Mensagem <span>↗</span>
      </div>
    </div>
  )
}

function StoryIndicators() {
  return (
    <div className="story-indicators">
      <p className="story-kicker">Cenário ilustrativo</p>
      <strong data-story-indicator>Organizando conversas</strong>
      <div className="indicator-grid">
        <div>
          <span data-counter data-target="24">
            0
          </span>
          <small>mensagens organizadas</small>
        </div>
        <div>
          <span data-counter data-target="8">
            0
          </span>
          <small>contatos acompanhados</small>
        </div>
      </div>
      <div className="story-chart">
        <span>Fluxo acompanhado</span>
        <svg viewBox="0 0 420 150" role="img" aria-label="Gráfico ilustrativo de evolução do fluxo">
          <path
            className="chart-area"
            d="M12 135 C70 130 86 116 132 120 S205 80 250 91 S330 36 408 21 L408 145 L12 145 Z"
          />
          <path
            data-story-chart
            pathLength="1"
            className="chart-line"
            d="M12 135 C70 130 86 116 132 120 S205 80 250 91 S330 36 408 21"
          />
        </svg>
      </div>
    </div>
  )
}

export function StorySection() {
  if (!CONFIG.sticky_storytelling_ativo) return null

  return (
    <section className="story-section" data-story aria-labelledby="story-title">
      <div className="story-stage shell">
        <div className="story-copy">
          <SectionHeading
            eyebrow="Da conversa ao acompanhamento"
            title="Quando o processo se conecta, o trabalho deixa rastros úteis."
            description="Uma mensagem pode virar contexto, ação e acompanhamento sem transformar a operação em uma coleção de ferramentas."
            light
          />
          <div className="story-moments-mobile">
            {moments.map(([title, text], index) => (
              <article data-reveal key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="story-visual">
          <PhoneStory />
          <StoryIndicators />
        </div>
      </div>
    </section>
  )
}

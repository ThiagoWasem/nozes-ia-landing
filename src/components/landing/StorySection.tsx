import { Check, MessageCircle } from 'lucide-react'
import { CONFIG } from '@/lib/site'
import { SectionHeading } from './SectionHeading'

/* ==========================================================================
   STORYTELLING (sticky, somente a partir de 1024 px)
   - Celular ilustrativo próprio (sem marcas de terceiros).
   - Ao rolar: mensagens sobem na tela, indicadores sobem de valor:
     "Atendimentos automáticos", "Agendamentos", "Leads no CRM"
   - Gráfico em gold cresce.
   - Rótulo "Dados ilustrativos" visível.
   - Abaixo de 1024 px: sequência vertical sem pin.
   ========================================================================== */

const moments = [
  ['Atendimentos automáticos', 'A mensagem entra com contexto e dúvidas são resolvidas na hora.'],
  ['Agendamentos confirmados', 'O horário é alinhado direto com a agenda sem conflito de data.'],
  ['Leads no CRM', 'O contato é registrado com todo o histórico para a equipe acompanhar.'],
]

function PhoneStory() {
  return (
    <div className="story-phone" aria-label="Demonstração ilustrativa em celular">
      <div className="phone-speaker" aria-hidden="true" />
      <div className="phone-header">
        <MessageCircle size={16} aria-hidden="true" />
        <span>Atendimento Nozes Ink</span>
        <i aria-hidden="true" />
      </div>
      <div className="phone-messages">
        <div data-story-message className="story-msg-visible">
          Olá! Gostaria de saber os horários para atendimento amanhã.
        </div>
        <div data-story-message className="story-msg-visible">
          Olá! Temos vaga amanhã às 14h ou às 16h30. Qual prefere?
        </div>
        <div data-story-message className="story-msg-visible">
          Às 14h perfeito!
          <span>
            <Check size={11} aria-hidden="true" /> Agendado e registrado no CRM
          </span>
        </div>
      </div>
      <div className="phone-input" aria-hidden="true">
        <span>Mensagem</span> <span>↗</span>
      </div>
    </div>
  )
}

function StoryIndicators() {
  return (
    <div className="story-indicators">
      <div className="story-indicators-header">
        <span className="story-kicker">Dados ilustrativos</span>
        <span className="story-badge-live">Tempo real</span>
      </div>
      <strong data-story-indicator>Organizando conversas</strong>
      <div className="indicator-grid">
        <div className="indicator-item">
          <span data-counter data-base="12" data-target="32">
            12
          </span>
          <small>Atendimentos automáticos</small>
        </div>
        <div className="indicator-item">
          <span data-counter data-base="4" data-target="14">
            4
          </span>
          <small>Agendamentos</small>
        </div>
        <div className="indicator-item">
          <span data-counter data-base="6" data-target="19">
            6
          </span>
          <small>Leads no CRM</small>
        </div>
      </div>
      <div className="story-chart">
        <div className="story-chart-meta">
          <span>Evolução dos atendimentos</span>
          <span className="story-chart-growth">+165% fluxo</span>
        </div>
        <svg viewBox="0 0 420 150" role="img" aria-label="Gráfico ilustrativo de evolução">
          <defs>
            <linearGradient id="chartGoldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            className="chart-area"
            fill="url(#chartGoldGrad)"
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
            description="Uma mensagem vira contexto, ação e acompanhamento sem transformar a operação em uma coleção confusa de ferramentas."
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

import { BarChart3, Play } from 'lucide-react'
import { CASOS, CONFIG } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'
import { SectionHeading } from './SectionHeading'

const incomplete = (value: string) =>
  !value || /^\[(preencher|foto|print|vazio|url ou vazio)\]$/i.test(value.trim())

function MediaFrame({ value, label, area }: { value: string; label: string; area: string }) {
  if (incomplete(value)) {
    return (
      <div className="case-placeholder" aria-label={`${label} ainda não publicado`}>
        <BarChart3 size={24} aria-hidden="true" />
      </div>
    )
  }
  return (
    <img
      src={value}
      width="640"
      height="440"
      loading="lazy"
      alt={`${label} do projeto de ${area}`}
    />
  )
}

export function CasesSection() {
  const cases = CONFIG.casos_reais_ativos ? CASOS.filter((item) => Boolean(item.autorizado)) : []
  if (cases.length === 0) return null

  return (
    <section className="section cases-section" aria-labelledby="cases-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Casos reais"
          title="Evidência autorizada. Sem resultado inventado."
          description="Cada caso publicado mostra contexto, mudança e prova com autorização do cliente."
        />
        <div className="cases-grid">
          {cases.map((item) => (
            <article
              className="case-card"
              data-reveal
              key={item.area}
              onClick={() => trackEvent('interacao_casos', { area: item.area })}
            >
              <p className="case-area">{item.area}</p>
              <div className="case-metric">
                {incomplete(item.metrica.valor) ? (
                  <div className="case-placeholder compact">
                    <BarChart3 size={22} />
                  </div>
                ) : (
                  <strong>{item.metrica.valor}</strong>
                )}
                {!incomplete(item.metrica.rotulo) && <span>{item.metrica.rotulo}</span>}
              </div>
              <div className="case-text">{!incomplete(item.texto) && <p>{item.texto}</p>}</div>
              <div className="before-after">
                <div>
                  <span>Antes</span>
                  <MediaFrame value={item.antes_depois.antes} label="Antes" area={item.area} />
                </div>
                <div>
                  <span>Depois</span>
                  <MediaFrame value={item.antes_depois.depois} label="Depois" area={item.area} />
                </div>
              </div>
              {!incomplete(item.video) && (
                <video
                  controls
                  preload="none"
                  poster="/video-poster.svg"
                  onPlay={() =>
                    trackEvent('interacao_casos', { area: item.area, acao: 'reproduzir_video' })
                  }
                >
                  <source src={item.video} />
                  Seu navegador não consegue reproduzir este vídeo.
                </video>
              )}
              {!incomplete(item.depoimento.texto) && (
                <blockquote>
                  <b>“</b>
                  <p>{item.depoimento.texto}</p>
                  <footer>
                    {item.depoimento.autor}, {item.depoimento.cargo}, {item.cliente}
                  </footer>
                </blockquote>
              )}
              {incomplete(item.video) && (
                <span className="sr-only">
                  <Play size={16} /> Vídeo não publicado
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

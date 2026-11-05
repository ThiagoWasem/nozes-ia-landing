import { useState } from 'react'
import { MapPin, Globe, TrendingUp, Users, Clock } from 'lucide-react'
import { CASOS, CASOS_VISIVEIS } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'
import { SectionHeading } from './SectionHeading'

const areaIcons: Record<
  string,
  React.ComponentType<{
    size?: number
    className?: string
    'aria-hidden'?: boolean | 'true' | 'false'
  }>
> = {
  'Google Meu Negócio': MapPin,
  'Novo site': Globe,
  'Conversão de vendas': TrendingUp,
  'Crescimento de seguidores': Users,
}

const incomplete = (value: string | undefined) =>
  !value || /^\[(preencher|foto|print|vazio|url ou vazio)\]$/i.test(value.trim())

function BeforeAfterSlider({
  antes,
  depois,
  area,
}: {
  antes: string
  depois: string
  area: string
}) {
  const [sliderPos, setSliderPos] = useState(50)

  if (incomplete(antes) || incomplete(depois)) {
    return null
  }

  return (
    <div className="case-slider-wrap">
      <div className="case-slider-container">
        <img src={depois} alt={`Depois: ${area}`} className="case-slider-img" />
        <div
          className="case-slider-overlay"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img src={antes} alt={`Antes: ${area}`} className="case-slider-img" />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="case-slider-range"
          aria-label={`Comparação antes e depois para ${area}`}
        />
        <div className="case-slider-labels">
          <span className="case-badge-before">Antes</span>
          <span className="case-badge-after">Depois</span>
        </div>
      </div>
    </div>
  )
}

export function CasesSection() {
  // CASOS_VISIVEIS = false mantém a seção de casos reais oculta até haver material autorizado.
  if (!CASOS_VISIVEIS) return null

  return (
    <section className="section cases-section" aria-labelledby="cases-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Casos reais"
          title="Resultados de clientes"
          description="Mostramos cada caso com autorização do cliente."
        />
        <div className="cases-grid">
          {CASOS.map((item) => {
            const Icon = areaIcons[item.area] || TrendingUp
            const isAuthorized = Boolean(item.autorizado)

            return (
              <article
                className={`case-card ${isAuthorized ? 'is-authorized' : 'is-pending'}`}
                data-reveal
                key={item.area}
                onClick={() =>
                  trackEvent('interacao_casos', { area: item.area, autorizado: isAuthorized })
                }
              >
                <div className="case-card-header">
                  <div className="case-area-tag">
                    <Icon size={16} aria-hidden="true" />
                    <span>{item.area}</span>
                  </div>
                  <span className="case-client-ref">{item.cliente}</span>
                </div>

                {!isAuthorized ? (
                  <div className="case-pending-frame" role="status">
                    <div className="case-pending-icon-wrap">
                      <Icon size={32} aria-hidden="true" />
                    </div>
                    <div className="case-pending-status">
                      <Clock size={15} aria-hidden="true" />
                      <strong>Caso em preparação</strong>
                    </div>
                  </div>
                ) : (
                  <div className="case-authorized-content">
                    {!incomplete(item.metrica.valor) && (
                      <div className="case-metric">
                        <strong>{item.metrica.valor}</strong>
                        {!incomplete(item.metrica.rotulo) && <span>{item.metrica.rotulo}</span>}
                      </div>
                    )}

                    {!incomplete(item.texto) && (
                      <div className="case-text">
                        <p>{item.texto}</p>
                      </div>
                    )}

                    {!incomplete(item.antes_depois.antes) &&
                      !incomplete(item.antes_depois.depois) && (
                        <BeforeAfterSlider
                          antes={item.antes_depois.antes}
                          depois={item.antes_depois.depois}
                          area={item.area}
                        />
                      )}

                    {!incomplete(item.video) && (
                      <video
                        controls
                        preload="none"
                        poster="/video-poster.svg"
                        playsInline
                        onPlay={() =>
                          trackEvent('interacao_casos', {
                            area: item.area,
                            acao: 'reproduzir_video',
                          })
                        }
                      >
                        <source src={item.video} />
                        Seu navegador não suporta este vídeo.
                      </video>
                    )}

                    {!incomplete(item.depoimento.texto) && (
                      <blockquote className="case-quote">
                        <b className="quote-mark">“</b>
                        <p>{item.depoimento.texto}</p>
                        <footer>
                          {item.depoimento.autor}
                          {!incomplete(item.depoimento.cargo) && `, ${item.depoimento.cargo}`}
                        </footer>
                      </blockquote>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

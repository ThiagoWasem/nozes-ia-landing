import { useEffect } from 'react'
import { ArrowDown, ArrowUpRight, MessageCircle, ShieldCheck } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { HeroDemo } from '@/components/HeroDemo'
import { DiagnosticCtaButton } from '@/components/DiagnosticCtaButton'
import { RaioxSection } from '@/components/landing/RaioxSection'
import { MethodSection } from '@/components/landing/MethodSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { StorySection } from '@/components/landing/StorySection'
import { AudienceSection } from '@/components/landing/AudienceSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { CasesSection } from '@/components/landing/CasesSection'
import { DiagnosticForm } from '@/components/landing/DiagnosticForm'
import { CONFIG, HERO_COPY, VARIANTE_HERO, WHATSAPP_URL } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'
import { useLandingMotion } from '@/hooks/use-landing-motion'

function scrollToForm() {
  document.getElementById('diagnostico')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}

function WhatsappLink({ source, dark = false }: { source: string; dark?: boolean }) {
  return (
    <a
      className={`whatsapp-button ${dark ? 'dark' : ''}`}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('clique_whatsapp', { origem: source })}
    >
      <MessageCircle size={18} aria-hidden="true" /> Falar no WhatsApp
    </a>
  )
}

function MidCta() {
  return (
    <section className="mid-cta" aria-label="Solicite seu diagnóstico">
      <div className="shell mid-cta-inner" data-reveal>
        <div>
          <p className="eyebrow">Próximo passo</p>
          <h2>Descubra o gargalo antes de escolher a ferramenta.</h2>
        </div>
        <div className="mid-cta-actions">
          <DiagnosticCtaButton source="banner_intermediario" onClick={scrollToForm} />
          <WhatsappLink source="banner_intermediario" dark />
        </div>
      </div>
    </section>
  )
}

export default function Index() {
  /* ==========================================================================
     PONTO DE TROCA DO TESTE A/B DO HERO:
     Controlado por VARIANTE_HERO (e AB_HERO em src/lib/site.ts).
     ========================================================================== */
  const copy = HERO_COPY[VARIANTE_HERO]
  useLandingMotion()

  useEffect(() => {
    document.title = 'Nozes Ink | IA e soluções digitais | Diagnóstico antes da solução'
  }, [])

  return (
    <Layout>
      <main>
        {/* 1. HERO */}
        <section
          className={`hero hero-variant-${VARIANTE_HERO.toLowerCase()} visual-${copy.visual}`}
        >
          <div className="hero-grid shell">
            <div className="hero-copy">
              <p className="hero-kicker">{copy.kicker}</p>
              <h1>{copy.title}</h1>
              <p className="hero-subtitle">{copy.subtitle}</p>
              <div className="hero-actions">
                <DiagnosticCtaButton source="hero" onClick={scrollToForm}>
                  {copy.cta}
                </DiagnosticCtaButton>
                <WhatsappLink source="hero" />
              </div>
              <p className="microproof">
                <ShieldCheck size={16} aria-hidden="true" /> {copy.microproof}
              </p>
            </div>
            {CONFIG.demo_whatsapp_ativa && <HeroDemo />}
          </div>
          <a className="hero-scroll" href="#raiox" aria-label="Ir para a próxima seção">
            <span>Entenda o processo</span>
            <ArrowDown size={17} />
          </a>
        </section>

        {/* Transição cinematográfica: Hero (offwhite) -> Raio-X */}
        <div className="cinematic-divider divider-hero-to-raiox" aria-hidden="true">
          <div className="cinematic-curtain" />
        </div>

        {/* 2. PROBLEMA (Raio-X) */}
        <div id="raiox">
          <RaioxSection />
        </div>

        {/* Transição cinematográfica: Raio-X -> Método Gargalo */}
        <div className="cinematic-divider divider-raiox-to-method" aria-hidden="true">
          <div className="cinematic-curtain" />
        </div>

        {/* 3. MÉTODO GARGALO */}
        <MethodSection />

        {/* Transição cinematográfica real: Claro (offwhite) -> Escuro (graphite) consumindo a tela */}
        <div className="transition-light-to-dark" data-transition-divider aria-hidden="true">
          <div className="transition-veil" />
          <div className="transition-crest" />
          <div className="transition-beam" />
        </div>

        {/* 4. SOLUÇÕES DIGITAIS (bento grid - fundo graphite #1B1C1B) */}
        <FeaturesSection />

        {/* Transição Graphite -> Evergreen */}
        <div className="divider-graphite-to-evergreen" aria-hidden="true" />

        {/* 5. STORYTELLING (evergreen #1F3B33) */}
        <StorySection />

        {/* Costura sutil entre Storytelling e Para Quem É (ambos evergreen) */}
        <div className="divider-evergreen-seamless" aria-hidden="true">
          <div className="cinematic-gold-seam" />
        </div>

        {/* 6. PARA QUEM É (evergreen #1F3B33) */}
        <AudienceSection />

        {/* Transição cinematográfica real: Escuro (evergreen) -> Claro (offwhite) com feixe dourado */}
        <div className="transition-dark-to-light" data-transition-divider aria-hidden="true">
          <div className="transition-veil" />
          <div className="transition-crest" />
          <div className="transition-beam" />
        </div>

        {/* 7. O QUE NOSSOS CLIENTES DIZEM (DEPOIMENTOS_VISIVEIS = true, claro #F2F0EA) */}
        <TestimonialsSection />

        {/* Transição cinematográfica real: Claro (offwhite) -> Escuro (evergreen) */}
        <div
          className="transition-light-to-dark variant-evergreen"
          data-transition-divider
          aria-hidden="true"
        >
          <div className="transition-veil" />
          <div className="transition-crest" />
          <div className="transition-beam" />
        </div>

        {/* CTA intermediário (evergreen) */}
        <MidCta />

        {/* 8. CASOS REAIS (oculto enquanto CASOS_VISIVEIS = false) */}
        <CasesSection />

        {/* Transição cinematográfica real: Escuro (evergreen) -> Claro (offwhite) para o formulário */}
        <div className="transition-to-form" data-transition-divider aria-hidden="true">
          <div className="transition-veil" />
          <div className="transition-beam" />
        </div>

        {/* 9. DIAGNÓSTICO (formulário padrão curto; 3 etapas preparado para teste A/B) */}
        <section className="final-cta" id="diagnostico" aria-labelledby="diagnostico-title">
          <div className="shell final-cta-grid">
            <div className="final-cta-copy" data-reveal>
              <p className="eyebrow">Diagnóstico gratuito</p>
              <h2 id="diagnostico-title">Antes de qualquer solução, um diagnóstico.</h2>
              <p>Preencha em menos de 1 minuto. Entramos em contato pelo WhatsApp.</p>
              <div className="diagnostic-note">
                <span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </span>
                <p>
                  <strong>O diagnóstico é o primeiro passo.</strong> Só recomendamos solução depois
                  de entender o problema.
                </p>
              </div>
            </div>
            <div className="form-card" data-reveal>
              <div className="form-card-top">
                <span>Solicitação de diagnóstico</span>
                <span>Gratuito</span>
              </div>
              <DiagnosticForm />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

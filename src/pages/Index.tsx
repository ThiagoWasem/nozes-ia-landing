import { useEffect } from 'react'
import { ArrowDown, ArrowUpRight, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { HeroDemo } from '@/components/HeroDemo'
import { DiagnosticCtaButton } from '@/components/DiagnosticCtaButton'
import { RaioxSection } from '@/components/landing/RaioxSection'
import { MethodSection } from '@/components/landing/MethodSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { StorySection } from '@/components/landing/StorySection'
import { CasesSection } from '@/components/landing/CasesSection'
import { AudienceSection } from '@/components/landing/AudienceSection'
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
      rel="noreferrer"
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
  const copy = HERO_COPY[VARIANTE_HERO]
  useLandingMotion()

  useEffect(() => {
    document.title = 'Nozes Ink | IA e soluções digitais | Diagnóstico antes da solução'
  }, [])

  return (
    <Layout>
      <main>
        <section
          className={`hero hero-variant-${VARIANTE_HERO.toLowerCase()} visual-${copy.visual}`}
        >
          <div className="hero-grid shell">
            <div className="hero-copy">
              <p className="hero-kicker">
                <Sparkles size={15} aria-hidden="true" /> IA e soluções digitais em Joinville
              </p>
              <h1>{copy.title}</h1>
              <p className="hero-subtitle">
                Analisamos como sua empresa funciona, identificamos gargalos e implementamos
                soluções digitais.
              </p>
              <div className="hero-actions">
                <DiagnosticCtaButton source="hero" onClick={scrollToForm}>
                  {copy.cta}
                </DiagnosticCtaButton>
                <WhatsappLink source="hero" />
              </div>
              <p className="microproof">
                <ShieldCheck size={16} aria-hidden="true" /> Diagnóstico gratuito. Sem compromisso.
              </p>
            </div>
            {CONFIG.demo_whatsapp_ativa && <HeroDemo />}
          </div>
          <a className="hero-scroll" href="#raiox" aria-label="Ir para a próxima seção">
            <span>Entenda o processo</span>
            <ArrowDown size={17} />
          </a>
        </section>

        <div id="raiox">
          <RaioxSection />
        </div>
        <MethodSection />
        <FeaturesSection />
        <StorySection />
        <MidCta />
        <CasesSection />
        <AudienceSection />

        <section className="final-cta" id="diagnostico" aria-labelledby="diagnostico-title">
          <div className="shell final-cta-grid">
            <div className="final-cta-copy" data-reveal>
              <p className="eyebrow">Diagnóstico gratuito</p>
              <h2 id="diagnostico-title">Antes de qualquer solução, um diagnóstico.</h2>
              <p>
                O diagnóstico é o primeiro passo. Só recomendamos solução depois de entender o
                problema.
              </p>
              <div className="diagnostic-note">
                <span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </span>
                <p>
                  <strong>O que acontece depois?</strong> Entramos em contato, entendemos seu
                  cenário e definimos se existe um próximo passo útil.
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

import { useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { WHATSAPP_URL } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

const sections = [
  {
    title: '1. Quem trata seus dados',
    content: [
      'A Nozes Ink, sediada em Joinville, Santa Catarina, é responsável pelo tratamento dos dados enviados por esta página para atender solicitações de diagnóstico digital.',
    ],
  },
  {
    title: '2. Dados que coletamos',
    content: [
      'No formulário de diagnóstico, coletamos nome, empresa, WhatsApp e segmento de atuação. A empresa é um campo opcional. Também registramos a origem da solicitação e a variante da página para compreender como o contato foi iniciado.',
    ],
  },
  {
    title: '3. Finalidade e base do tratamento',
    content: [
      'Usamos os dados para entrar em contato sobre o diagnóstico solicitado, compreender o cenário informado, organizar o atendimento e manter o histórico necessário dessa conversa.',
      'O contato ocorre com base no consentimento fornecido no formulário. Você pode retirar esse consentimento a qualquer momento pelos canais indicados nesta política.',
    ],
  },
  {
    title: '4. Compartilhamento e segurança',
    content: [
      'Os dados não são vendidos. Eles podem ser processados por fornecedores de infraestrutura estritamente necessários para manter o formulário, armazenar solicitações e realizar o contato.',
      'Adotamos controles de acesso e medidas técnicas compatíveis com a natureza dos dados. Nenhum ambiente digital é totalmente imune a riscos, por isso revisamos acessos e limitamos o uso ao necessário.',
    ],
  },
  {
    title: '5. Retenção e exclusão',
    content: [
      'Mantemos os dados pelo período necessário para responder à solicitação, acompanhar o diagnóstico e cumprir obrigações legais. Quando deixam de ser necessários, os dados são excluídos ou anonimizados de forma segura.',
      'Se você pedir a exclusão, avaliaremos e atenderemos a solicitação conforme os prazos e exceções previstos na legislação aplicável.',
    ],
  },
  {
    title: '6. Seus direitos pela LGPD',
    content: [
      'Você pode solicitar confirmação do tratamento, acesso, correção, anonimização, bloqueio, exclusão, informação sobre compartilhamento, portabilidade quando aplicável e revogação do consentimento.',
      'Para exercer seus direitos, fale conosco pelo WhatsApp indicado abaixo ou pelo canal de e-mail institucional divulgado nos nossos meios oficiais. Podemos pedir informações mínimas para confirmar sua identidade e proteger seus dados.',
    ],
  },
  {
    title: '7. Cookies e medição de uso',
    content: [
      'A página pode usar cookies estritamente necessários ao funcionamento. Se ferramentas de medição de uso forem ativadas, elas serão configuradas para entender interações gerais, como cliques e profundidade de rolagem, sem usar essas informações para vender seus dados.',
      'Configurações futuras que exijam consentimento adicional serão apresentadas de forma clara antes da ativação.',
    ],
  },
  {
    title: '8. Atualizações desta política',
    content: [
      'Podemos atualizar este documento para refletir mudanças operacionais, legais ou técnicas. A versão vigente permanece publicada nesta página com linguagem acessível.',
    ],
  },
]

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Política de privacidade | Nozes Ink'
  }, [])

  return (
    <Layout>
      <main className="privacy-page">
        <header className="privacy-hero">
          <div className="shell narrow-copy" data-reveal>
            <p className="eyebrow">Privacidade e LGPD</p>
            <h1>Política de privacidade</h1>
            <p>
              Esta política explica, sem linguagem complicada, como a Nozes Ink usa os dados
              enviados na solicitação de diagnóstico.
            </p>
            <span>Última atualização: outubro de 2026</span>
          </div>
        </header>
        <section className="privacy-content shell">
          <aside data-reveal>
            <p className="eyebrow">Resumo</p>
            <p>Coletamos somente o necessário para responder ao seu pedido de diagnóstico.</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('clique_whatsapp', { origem: 'politica_privacidade' })}
            >
              <MessageCircle size={17} aria-hidden="true" /> Falar sobre seus dados
            </a>
          </aside>
          <div className="privacy-sections">
            {sections.map((section) => (
              <article data-reveal key={section.title}>
                <h2>{section.title}</h2>
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}

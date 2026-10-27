import { useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { WHATSAPP_URL } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

const sections = [
  {
    title: '1. Quem somos e quem controla seus dados',
    content: [
      'A Nozes Ink, sediada na Rua Waldemiro José Borges, 3528, bairro Itinga, em Joinville/SC, atua como controladora dos dados pessoais coletados por meio deste site e de seus canais digitais de atendimento.',
      'Nosso compromisso é tratar suas informações com respeito, integridade e transparência, em total conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018 — LGPD).',
    ],
  },
  {
    title: '2. Quais dados coletamos',
    content: [
      'Coletamos exclusivamente os dados fornecidos por você no formulário de solicitação de diagnóstico digital gratuito: seu Nome completo ou prenome, o Nome da sua Empresa, o número de telefone WhatsApp (+55 com DDD) e o Segmento de atuação do seu negócio.',
      'No caso de navegação no site, podem ser registrados dados técnicos estritamente operacionais (como versão da página e origem da solicitação), sem cruzamento com bancos de terceiros ou perfilamento abusivo.',
    ],
  },
  {
    title: '3. Finalidades do tratamento',
    content: [
      'Os dados coletados têm objetivos claros e específicos: (a) entrar em contato direto pelo WhatsApp para apresentar o diagnóstico digital do seu negócio; (b) entender a operação da sua empresa e onde ela perde clientes na internet; (c) tirar dúvidas sobre sites, catálogos, agendamentos e automações; e (d) manter o histórico do atendimento prestado.',
      'Não utilizamos seus dados para nenhuma finalidade divergente daquela informada no momento da coleta.',
    ],
  },
  {
    title: '4. Base legal para o tratamento (LGPD)',
    content: [
      'O tratamento dos seus dados fundamenta-se no seu Consentimento livre, informado e inequívoco (Artigo 7º, inciso I, da LGPD), manifestado ativamente ao marcar a caixa de consentimento e clicar em "Solicitar meu diagnóstico", bem como nos procedimentos preliminares relacionados a contrato a pedido do titular (Artigo 7º, inciso V).',
      'Você tem total liberdade para revogar seu consentimento a qualquer momento, de forma simples e gratuita, sem qualquer penalidade.',
    ],
  },
  {
    title: '5. Não venda e não compartilhamento para publicidade',
    content: [
      'A Nozes Ink NUNCA vende, aluga, troca ou comercializa seus dados pessoais com terceiros.',
      'Seus dados são compartilhados apenas com prestadores de serviços de infraestrutura e hospedagem de tecnologia estritamente indispensáveis para o funcionamento do site e do banco de dados seguro, os quais também estão sujeitos a obrigações rigorosas de sigilo e conformidade com a LGPD.',
    ],
  },
  {
    title: '6. Segurança e armazenamento',
    content: [
      'Adotamos medidas técnicas, administrativas e organizacionais adequadas para proteger seus dados pessoais contra acessos não autorizados, situações acidentais ou ilícitas de destruição, perda, alteração ou qualquer forma de tratamento inadequado.',
      'O tráfego de dados é criptografado via HTTPS/TLS e o acesso interno às solicitações é restrito exclusivamente aos profissionais responsáveis pelo atendimento e diagnóstico.',
    ],
  },
  {
    title: '7. Retenção e descarte de dados',
    content: [
      'Mantemos suas informações apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletadas, incluindo o atendimento inicial, a elaboração do diagnóstico e eventuais prazos legais ou regulatórios.',
      'Após o término do tratamento ou mediante sua solicitação de exclusão, os dados são definitivamente eliminados ou anonimizados de forma segura.',
    ],
  },
  {
    title: '8. Seus direitos como titular de dados',
    content: [
      'Conforme o Artigo 18 da LGPD, você pode a qualquer momento solicitar: confirmação da existência de tratamento; acesso aos dados que possuímos sobre você; correção de dados incompletos, inexatos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade; portabilidade; eliminação dos dados tratados com base no consentimento; e revogação do consentimento.',
      'Para exercer qualquer um desses direitos, basta enviar uma mensagem pelo canal oficial de WhatsApp (+55 47 8839-2501). Responderemos no menor prazo possível e de forma facilitada.',
    ],
  },
  {
    title: '9. Cookies e tecnologias de navegação',
    content: [
      'Utilizamos apenas cookies essenciais para o funcionamento correto do site e métricas de desempenho estritamente agregadas (como cliques e rolagem), sem compartilhamento com redes de anúncios de terceiros ou rastreamento invasivo entre diferentes sites.',
    ],
  },
  {
    title: '10. Contato do encarregado e atualizações',
    content: [
      'O canal de atendimento para qualquer dúvida ou requisição sobre a LGPD e privacidade é o WhatsApp oficial da Nozes Ink: +55 (47) 8839-2501, ou no endereço físico da nossa sede em Joinville/SC.',
      'Esta Política de Privacidade é revisada periodicamente para manter-se alinhada às melhores práticas e à regulamentação da Autoridade Nacional de Proteção de Dados (ANPD). Qualquer alteração entrará em vigor a partir da data de publicação nesta página.',
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

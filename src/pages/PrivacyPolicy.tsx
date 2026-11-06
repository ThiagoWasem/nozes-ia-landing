import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { WHATSAPP_URL } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

interface SecaoPrivacidade {
  title: string
  id?: string
  content: string[]
}

const sections: SecaoPrivacidade[] = [
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
      'Pelo formulário de diagnóstico gratuito, coletamos os dados que você preenche: seu Nome completo ou prenome, o Nome da sua Empresa, o número de telefone WhatsApp (+55 com DDD) e o Segmento de atuação do seu negócio.',
      'Se você conversar com a nossa assistente virtual Nozes IA, as mensagens da conversa ficam registradas — inclusive os dados de lead que você informar no chat (por exemplo, nome e WhatsApp) — para que a equipe consiga retomar o contato e melhorar o atendimento.',
      'No caso de navegação no site, podem ser registrados dados técnicos estritamente operacionais (como versão da página e origem da solicitação), sem cruzamento com bancos de terceiros ou perfilamento abusivo.',
    ],
  },
  {
    title: '3. Finalidades do tratamento',
    content: [
      'Os dados coletados têm objetivos claros e específicos: (a) entrar em contato direto pelo WhatsApp para apresentar o diagnóstico digital do seu negócio; (b) entender a operação da sua empresa e onde ela perde clientes na internet; (c) tirar dúvidas sobre sites, catálogos, agendamentos e automações; e (d) manter o histórico do atendimento prestado.',
      'Somente se você marcar o checkbox opcional de novidades, utilizamos seus dados também para enviar conteúdos e novidades da Nozes Ink (relacionamento comercial). Esse aceite é separado do consentimento essencial e você pode recusá-lo sem que isso afete o envio do seu pedido de diagnóstico.',
      'Não utilizamos seus dados para nenhuma finalidade divergente daquela informada no momento da coleta.',
    ],
  },
  {
    title: '4. Base legal para o tratamento (LGPD)',
    content: [
      'O tratamento dos seus dados fundamenta-se no seu Consentimento livre, informado e inequívoco (Artigo 7º, inciso I, da LGPD), manifestado ativamente ao marcar a caixa de consentimento e clicar em "Solicitar meu diagnóstico", bem como nos procedimentos preliminares relacionados a contrato a pedido do titular (Artigo 7º, inciso V).',
      'O recebimento de novidades e conteúdos (marketing) tem base legal própria: um segundo consentimento, opcional e nunca pré-marcado. Não marcar essa caixa não impede o envio do formulário nem o atendimento do seu pedido.',
      'Você tem total liberdade para revogar qualquer consentimento a qualquer momento, de forma simples e gratuita, sem qualquer penalidade.',
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
    title: '6. Segurança, armazenamento e logs de acesso',
    content: [
      'Adotamos medidas técnicas, administrativas e organizacionais adequadas para proteger seus dados pessoais contra acessos não autorizados, situações acidentais ou ilícitas de destruição, perda, alteração ou qualquer forma de tratamento inadequado.',
      'O tráfego de dados é criptografado via HTTPS/TLS e o acesso interno às solicitações é restrito exclusivamente aos profissionais responsáveis pelo atendimento e diagnóstico.',
      'A infraestrutura de hospedagem mantém logs de acesso (registros técnicos como data, hora e endereço IP das requisições) por razões de segurança e funcionamento do serviço. Esses logs não são utilizados para publicidade ou perfilamento.',
    ],
  },
  {
    title: '7. Retenção e descarte de dados',
    content: [
      'Prazos declarados: dados de contato de leads que não se convertem em cliente são mantidos por 12 meses, contados da coleta; para clientes, os dados ficam retidos por até 2 anos após a última interação; o registro do seu consentimento é mantido pelo mesmo prazo do lead a que se refere.',
      'Na prática, um processo automático de retenção percorre a base diariamente e anonimiza ou elimina de forma segura os dados de contato vencidos (nome, empresa e WhatsApp), preservando apenas registros sem dado pessoal para fins estatísticos.',
      'Após o término do tratamento ou mediante sua solicitação de exclusão, os dados são definitivamente eliminados ou anonimizados de forma segura.',
    ],
  },
  {
    title: '8. Protocolo de incidentes de segurança',
    content: [
      'Em caso de incidente de segurança que possa causar risco relevante a você (por exemplo, um vazamento de dados), a Nozes Ink comunica os titulares afetados e a Autoridade Nacional de Proteção de Dados (ANPD) em até 3 dias úteis, a contar da constatação do incidente.',
      'A comunicação informa, em linguagem clara, o que aconteceu, quais dados foram afetados, os riscos e as medidas que estamos adotando — além das orientações de proteção que você pode tomar.',
    ],
  },
  {
    title: '9. Seus direitos como titular de dados e canal de solicitação',
    id: 'canal-do-titular',
    content: [
      'Conforme o Artigo 18 da LGPD, você pode a qualquer momento solicitar: confirmação da existência de tratamento; acesso aos dados que possuímos sobre você; correção de dados incompletos, inexatos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade; portabilidade; eliminação dos dados tratados com base no consentimento; e revogação do consentimento.',
      'Canal de solicitação: envie seu pedido de acesso, correção ou exclusão pelo WhatsApp oficial (+55 47 8839-2501) ou pelo formulário de diagnóstico deste site, indicando que deseja exercer um direito de titular. Nos comprometemos a responder no menor prazo possível — e, em qualquer hipótese, dentro de 15 dias.',
      'Você também pode revogar o aceite de novidades (marketing) pelo mesmo canal, sem afetar nenhum atendimento em andamento.',
    ],
  },
  {
    title: '10. Cookies e rastreadores',
    content: [
      'Atualmente, este site NÃO utiliza cookies de rastreamento nem ferramentas de terceiros (como Analytics ou Pixels de anúncios). Não há rastreadores de terceiros coletando dados de navegação hoje.',
      'Caso isso mude no futuro, um aviso de cookies será exibido antes de qualquer carregamento, com botões de "Aceitar" e "Recusar" igualmente acessíveis, e esta política será atualizada.',
    ],
  },
  {
    title: '11. Contato do encarregado e atualizações',
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
              enviados na solicitação de diagnóstico e nas conversas com a Nozes IA.
            </p>
            <span>Última atualização: novembro de 2026</span>
          </div>
        </header>
        <section className="privacy-content shell">
          <aside data-reveal>
            <p className="eyebrow">Resumo</p>
            <p>Coletamos somente o necessário para responder ao seu pedido de diagnóstico.</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('clique_whatsapp', { origem: 'politica_privacidade' })}
            >
              <MessageCircle size={17} aria-hidden="true" /> Falar sobre seus dados
            </a>
            <Link to="/termos-de-uso" className="privacy-inline-link">
              Ler os Termos de uso
            </Link>
          </aside>
          <div className="privacy-sections">
            {sections.map((section) => (
              <article data-reveal key={section.title} id={section.id}>
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

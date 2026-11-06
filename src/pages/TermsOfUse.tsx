import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'

const sections = [
  {
    title: '1. O que é este site',
    content: [
      'Este site é a página oficial da Nozes Ink, agência de inteligência artificial e soluções digitais sediada em Joinville/SC, fundada por Thiago Cabral Wasem e Maria Eduarda Felisbino.',
      'A finalidade da página é apresentar nossos serviços e permitir que você solicite um diagnóstico digital gratuito para a sua empresa, preenchendo o formulário disponível na seção de diagnóstico.',
    ],
  },
  {
    title: '2. O envio do formulário não gera obrigação de contratação',
    content: [
      'Preencher e enviar o formulário de diagnóstico é gratuito e não cria nenhuma obrigação de contratação para nenhuma das partes.',
      'Após o envio, nossa equipe entra em contato pelo WhatsApp para entender o seu cenário e apresentar o diagnóstico. A contratação de qualquer serviço só acontece se você quiser, a partir de uma proposta que você avalia com calma. Você pode desistir a qualquer momento, sem custo e sem qualquer penalidade.',
      'Da mesma forma, o envio não garante a contratação pela Nozes Ink: reservamo-nos o direito de priorizar atendimentos conforme nossa capacidade, sempre com transparência.',
    ],
  },
  {
    title: '3. Uso permitido do site',
    content: [
      'Você pode usar este site para conhecer nossos serviços e solicitar o diagnóstico gratuito, desde que seja para fins legítimos e lícitos.',
      'Não é permitido: enviar informações falsas no formulário; tentar sobrecarregar, invadir ou extrair dados do site de forma automatizada; usar o assistente virtual Nozes IA para práticas abusivas (como spam, tentativas de enganar a assistente ou solicitação de dados sensíveis); e usar o site para prejudicar terceiros.',
    ],
  },
  {
    title: '4. Propriedade intelectual',
    content: [
      'Todos os conteúdos deste site — textos, identidade visual, logotipo e marca Nozes Ink, layout, ilustrações e código — pertencem à Nozes Ink e são protegidos pela legislação brasileira de propriedade intelectual (inclusive a Lei nº 9.610/1998 e a Lei nº 9.279/1996).',
      'Você pode compartilhar links para o site livremente. Já a reprodução dos conteúdos, no todo ou em parte, para uso comercial de terceiros só é permitida com autorização prévia e por escrito da Nozes Ink.',
      'As marcas e os nomes de empresas citados em depoimentos e casos pertencem aos seus respectivos titulares, que autorizaram expressamente a publicação dos depoimentos originais.',
    ],
  },
  {
    title: '5. Limitação de responsabilidade',
    content: [
      'O conteúdo deste site é informativo. Os exemplos, projeções e resultados apresentados em depoimentos e casos refletem experiências reais de clientes, mas não constituem promessa de resultado idêntico para o seu negócio — cada diagnóstico parte da realidade de cada empresa.',
      'A Nozes Ink não se responsabiliza por decisões tomadas com base apenas nas informações gerais deste site, nem por interrupções temporárias de disponibilidade, nem por conteúdos de sites de terceiros para os quais apontamos links (como redes sociais e mapa do Google).',
      'Nada aqui limita responsabilidades que a lei não permita limitar, incluindo, quando aplicável, as regras de proteção do Código de Defesa do Consumidor (Lei nº 8.078/1990).',
    ],
  },
  {
    title: '6. Privacidade e tratamento de dados',
    content: [
      'O tratamento dos seus dados pessoais (nome, empresa, WhatsApp e segmento informados no formulário, além das mensagens trocadas no chat) segue as regras da nossa Política de Privacidade, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD, Lei nº 13.709/2018).',
    ],
  },
  {
    title: '7. Legislação aplicável',
    content: [
      'Estes Termos são regidos pelas leis da República Federativa do Brasil, em especial o Código de Defesa do Consumidor (Lei nº 8.078/1990), quando aplicável à relação entre você e a Nozes Ink, e a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).',
      'Fica eleito o foro da comarca de Joinville/SC para dirimir eventuais controvérsias, sem prejuízo da regra mais favorável ao consumidor prevista na legislação.',
    ],
  },
  {
    title: '8. Contato e atualizações destes Termos',
    content: [
      'Dúvidas sobre estes Termos podem ser enviadas pelo WhatsApp oficial da Nozes Ink: +55 47 8839-2501.',
      'Podemos atualizar estes Termos para refletir melhorias no site ou mudanças na legislação. A versão vigente é sempre a publicada nesta página.',
      'Para saber como tratamos seus dados, acesse a nossa Política de Privacidade.',
    ],
  },
]

export default function TermsOfUse() {
  useEffect(() => {
    document.title = 'Termos de uso | Nozes Ink'
  }, [])

  return (
    <Layout>
      <main className="privacy-page">
        <header className="privacy-hero">
          <div className="shell narrow-copy" data-reveal>
            <p className="eyebrow">Transparência</p>
            <h1>Termos de uso</h1>
            <p>
              Regras simples e honestas sobre o uso deste site e sobre o que acontece quando você
              solicita um diagnóstico gratuito.
            </p>
            <span>Última atualização: novembro de 2026</span>
          </div>
        </header>
        <section className="privacy-content shell">
          <aside data-reveal>
            <p className="eyebrow">Resumo</p>
            <p>
              O diagnóstico é gratuito e não obriga você a contratar nada. Usar o site é simples —
              só pedimos bom senso e respeito.
            </p>
            <Link to="/politica-de-privacidade" className="privacy-inline-link">
              Ler a Política de Privacidade
            </Link>
          </aside>
          <div className="privacy-sections">
            {sections.map((section) => (
              <article data-reveal key={section.title}>
                <h2>{section.title}</h2>
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.title.startsWith('6.') && (
                  <p>
                    <Link to="/politica-de-privacidade" className="privacy-inline-link">
                      Acessar a Política de Privacidade →
                    </Link>
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}

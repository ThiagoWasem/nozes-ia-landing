# Nozes Ink — landing page de conversão

Landing page da minha startup, a Nozes Ink: agência de IA e soluções digitais de Joinville/SC, fundada por Thiago Cabral Wasem e Maria Eduarda Felisbino.

**Site no ar:** https://nozesink.goskip.app

<!-- TODO: adicionar aqui uma captura de tela ou GIF do chat da Nozes IA em ação
     (ex.: salvar o arquivo como docs/chat-nozes-ia.gif e referenciar abaixo):
     ![Chat da Nozes IA](docs/chat-nozes-ia.gif)
-->

## O problema que ela resolve

Negócios locais perdem cliente todos os dias por demora e desorganização no atendimento: mensagem que fica sem resposta, orçamento que nunca sai, follow-up que não existe. A Nozes Ink trabalha com um princípio simples — diagnóstico antes da solução. Primeiro identificamos onde o gargalo está; depois implementamos um sistema só, do primeiro contato ao pós-venda, em vez de empilhar ferramentas soltas.

## A IA é o produto — e está demonstrada na própria página

O destaque da landing é a **Nozes IA**: um agente de IA consultivo embutido no próprio site, no widget de chat flutuante. Ele é a melhor vitrine do que vendemos, porque está funcionando ali na frente do visitante.

O que ele faz:

- **Qualifica o visitante em poucas perguntas**, com tom consultivo em vez de script de vendas.
- **Entende o contexto da conversa** — mantém o histórico da sessão, responde com base no que já foi dito e renderiza as respostas em markdown.
- **Registra o lead com consentimento LGPD**, gravando no banco com a origem do contato.
- **Encaminha para a conversão**: diagnóstico gratuito pelo formulário da própria página ou direto no WhatsApp (+55 47 8839-2501).

Ou seja: o marketing demonstra o serviço dentro dele mesmo. Quem chega na página conversa com o mesmo tipo de agente que a Nozes Ink implanta nos negócios dos clientes.

## Stack e arquitetura

- **React 19 + TypeScript + Vite** no frontend, com **Tailwind CSS**.
- **Backend com banco de dados** (coleção de leads, com regras de acesso) e **agente de IA no servidor** — o frontend fala com uma rota própria de chat em streaming (SSE), nunca direto com o provedor de IA.
- **Motor de animação próprio**, sem bibliotecas externas de animação: usa IntersectionObserver para disparar entradas na viewport, Web Animations API para as transições e requestAnimationFrame para os loops (todos pausáveis fora da tela ou com "prefers-reduced-motion"). Rodar isso nas APIs nativas do navegador dispensa o bundle de uma biblioteca de animação e evita trabalho de layout na thread principal — em celular barato, é a diferença entre animação fluida e página engasgada.
- Componentes de UI (shadcn/ui), formulário com react-hook-form + zod e análise de eventos de interação via `trackEvent`.

## Rodando localmente

Pré-requisitos: Node.js 18+ e npm.

```bash
npm install
```

Crie um arquivo `.env` na raiz com a URL do backend (usado pelo formulário de leads e pelo chat):

```
VITE_POCKETBASE_URL=https://seu-backend-url
```

Depois:

```bash
npm run dev       # servidor de desenvolvimento em http://localhost:5173
npm run build     # build de produção na pasta dist/
npm run preview   # serve o build localmente
npm run lint      # oxlint
npm run format    # oxfmt
```

O backend do projeto (migrations e lógica de servidor) fica em `pocketbase/`: as collections e o agente de IA são definidos em `pocketbase/migrations/` e as rotas de servidor (inclusive a do chat) em `pocketbase/hooks/`.

## Estrutura

```
src/
├── components/
│   ├── landing/     # seções da página (hero, método, soluções, depoimentos, formulário...)
│   ├── chat/        # widget do chat Nozes IA + renderização das mensagens
│   └── ui/          # primitivas de interface
├── hooks/           # hooks utilitários (movimento, realtime, mobile)
├── lib/             # configuração do site, cliente do banco, analytics
├── services/        # chamadas de API (leads, chat)
└── pages/           # rotas (landing, política de privacidade)
pocketbase/          # migrations e hooks do backend
```

## Resultados

Em coleta.

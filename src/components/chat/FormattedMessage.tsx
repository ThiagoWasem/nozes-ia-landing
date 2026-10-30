import { ReactNode } from 'react'

/**
 * Sanitiza e normaliza URLs para evitar esquemas perigosos (javascript:, data:, vbscript:).
 * Apenas http:, https:, mailto: e tel: são permitidos.
 */
function sanitizeHref(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  // Trata formato explícito de wa.me sem protocolo
  if (/^wa\.me\//i.test(trimmed)) {
    return `https://${trimmed}`
  }

  try {
    const parsed = new URL(trimmed, 'https://nozes.ink')
    const protocol = parsed.protocol.toLowerCase()
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)) {
      return trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('mailto:') ||
        trimmed.startsWith('tel:')
        ? trimmed
        : `https://${trimmed}`
    }
  } catch {
    // Se falhar URL parser mas começar com https:// ou wa.me
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed
    }
  }

  return null
}

/**
 * Renderiza trechos inline de formatação com segurança total (sem innerHTML):
 * - Links em markdown [texto](url)
 * - Links puros wa.me/... ou https://...
 * - Negrito **texto** ou __texto__
 * - Itálico *texto* ou _texto_
 * - Código inline `código`
 */
function renderInlineFormattedText(rawText: string, keyPrefix = 'inline'): ReactNode[] {
  if (!rawText) return []

  // Tokenizer regex seguro para markdown inline:
  // 1: Markdown link [label](url)
  // 2: Bare wa.me link ou https:// link
  // 3: Negrito (**...** ou __...__)
  // 4: Itálico (*...* ou _..._)
  // 5: Inline code (`...`)
  const pattern =
    /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|wa\.me\/[^\s)]+)\))|(https?:\/\/[^\s)]+|wa\.me\/[^\s)]+)|(\*\*([^*]+)\*\*|__([^_]+)__)|(\*([^*]+)\*|_([^_]+)_)|(`([^`]+)`)/g

  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(rawText)) !== null) {
    const matchIndex = match.index

    // Texto plano antes do token
    if (matchIndex > lastIndex) {
      nodes.push(rawText.substring(lastIndex, matchIndex))
    }

    const [
      full,
      mdLink,
      mdLabel,
      mdHref,
      bareUrl,
      boldFull,
      bold1,
      bold2,
      italicFull,
      italic1,
      italic2,
      codeFull,
      codeContent,
    ] = match

    const k = `${keyPrefix}-${matchIndex}`

    if (mdLink && mdLabel && mdHref) {
      const safeHref = sanitizeHref(mdHref)
      if (safeHref) {
        nodes.push(
          <a
            key={k}
            href={safeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="nozes-chat-link"
          >
            {mdLabel}
          </a>,
        )
      } else {
        nodes.push(mdLabel)
      }
    } else if (bareUrl) {
      const safeHref = sanitizeHref(bareUrl)
      if (safeHref) {
        nodes.push(
          <a
            key={k}
            href={safeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="nozes-chat-link"
          >
            {bareUrl}
          </a>,
        )
      } else {
        nodes.push(bareUrl)
      }
    } else if (boldFull) {
      const boldText = bold1 || bold2 || ''
      nodes.push(
        <strong key={k} className="nozes-chat-strong">
          {boldText}
        </strong>,
      )
    } else if (italicFull) {
      const italicText = italic1 || italic2 || ''
      nodes.push(
        <em key={k} className="nozes-chat-em">
          {italicText}
        </em>,
      )
    } else if (codeFull && codeContent) {
      nodes.push(
        <code key={k} className="nozes-chat-code">
          {codeContent}
        </code>,
      )
    } else {
      nodes.push(full)
    }

    lastIndex = pattern.lastIndex
  }

  // Texto restante
  if (lastIndex < rawText.length) {
    nodes.push(rawText.substring(lastIndex))
  }

  return nodes
}

interface FormattedMessageProps {
  content: string
  role?: 'assistant' | 'user'
}

type Block =
  | { type: 'paragraph'; lines: string[] }
  | { type: 'bullet_list'; items: string[] }
  | { type: 'ordered_list'; items: string[] }

/**
 * Converte o texto bruto da IA em blocos semânticos e seguros:
 * - Parágrafos separados
 * - Listas com marcadores (ex: - item, * item, • item)
 * - Listas numeradas (ex: 1. item)
 * - Formatação inline limpa e sanitizada
 */
export function FormattedMessage({ content, role = 'assistant' }: FormattedMessageProps) {
  if (!content) return null

  // Normaliza quebras de linha
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const rawLines = normalized.split('\n')

  const blocks: Block[] = []
  let currentParagraphLines: string[] = []
  let currentBulletItems: string[] = []
  let currentOrderedItems: string[] = []

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      blocks.push({ type: 'paragraph', lines: currentParagraphLines })
      currentParagraphLines = []
    }
  }

  const flushBulletList = () => {
    if (currentBulletItems.length > 0) {
      blocks.push({ type: 'bullet_list', items: currentBulletItems })
      currentBulletItems = []
    }
  }

  const flushOrderedList = () => {
    if (currentOrderedItems.length > 0) {
      blocks.push({ type: 'ordered_list', items: currentOrderedItems })
      currentOrderedItems = []
    }
  }

  const flushAll = () => {
    flushParagraph()
    flushBulletList()
    flushOrderedList()
  }

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i]
    const trimmed = rawLine.trim()

    // Linha vazia indica separação de parágrafo / bloco
    if (!trimmed) {
      flushAll()
      continue
    }

    // Marcador de lista não ordenada: -, *, • seguido de espaço
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/)
    if (bulletMatch) {
      flushParagraph()
      flushOrderedList()
      currentBulletItems.push(bulletMatch[1])
      continue
    }

    // Marcador de lista ordenada: 1., 2., etc.
    const orderedMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/)
    if (orderedMatch) {
      flushParagraph()
      flushBulletList()
      currentOrderedItems.push(orderedMatch[2])
      continue
    }

    // Se estiver em lista e vier uma linha comum, fecha a lista e vira parágrafo
    flushBulletList()
    flushOrderedList()
    currentParagraphLines.push(rawLine)
  }

  flushAll()

  return (
    <div className={`nozes-chat-formatted-body ${role}`}>
      {blocks.map((block, blockIndex) => {
        if (block.type === 'bullet_list') {
          return (
            <ul key={`ul-${blockIndex}`} className="nozes-chat-bullet-list">
              {block.items.map((item, itemIdx) => (
                <li key={`li-${blockIndex}-${itemIdx}`} className="nozes-chat-list-item">
                  <span className="nozes-chat-list-bullet" aria-hidden="true" />
                  <span className="nozes-chat-list-text">
                    {renderInlineFormattedText(item, `b-${blockIndex}-${itemIdx}`)}
                  </span>
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === 'ordered_list') {
          return (
            <ol key={`ol-${blockIndex}`} className="nozes-chat-ordered-list">
              {block.items.map((item, itemIdx) => (
                <li key={`oli-${blockIndex}-${itemIdx}`} className="nozes-chat-ordered-item">
                  <span className="nozes-chat-ordered-num" aria-hidden="true">
                    {itemIdx + 1}.
                  </span>
                  <span className="nozes-chat-list-text">
                    {renderInlineFormattedText(item, `o-${blockIndex}-${itemIdx}`)}
                  </span>
                </li>
              ))}
            </ol>
          )
        }

        // Parágrafo
        return (
          <p key={`p-${blockIndex}`} className="nozes-chat-paragraph">
            {block.lines.map((line, lineIdx) => (
              <span key={`l-${blockIndex}-${lineIdx}`} className="nozes-chat-line">
                {renderInlineFormattedText(line, `p-${blockIndex}-${lineIdx}`)}
                {lineIdx < block.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

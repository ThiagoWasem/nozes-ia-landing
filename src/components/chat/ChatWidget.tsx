import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ClipboardList,
} from 'lucide-react'
import { sendChatMessage } from '@/services/nozesIa'
import { WHATSAPP_URL } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

export interface ChatWidgetProps {
  /** Se a barra fixa mobile estiver visível na tela */
  isMobileBarVisible?: boolean
  /** Se algum campo de formulário estiver em foco */
  isInputFocused?: boolean
  /** Iniciar aberto caso já tenha sido acionado pelo botão inicial */
  defaultOpen?: boolean
}

interface MessageItem {
  id: string
  role: 'assistant' | 'user'
  text: string
  timestamp: string
  isError?: boolean
}

const STORAGE_CONVERSATION_KEY = 'nozes_ia_chat_conv_id'
const STORAGE_MESSAGES_KEY = 'nozes_ia_chat_history'

const INITIAL_GREETING: MessageItem = {
  id: 'greeting-init',
  role: 'assistant',
  text: 'Olá! Sou a Nozes IA. Analiso como sua empresa opera e identifico onde você pode estar perdendo clientes no digital. Como posso ajudar seu negócio hoje?',
  timestamp: 'Agora',
}

function scrollToDiagnosticForm() {
  const target = document.getElementById('diagnostico')
  if (target) {
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  } else {
    window.location.href = '/#diagnostico'
  }
}

export function ChatWidget({
  isMobileBarVisible = false,
  isInputFocused = false,
  defaultOpen = true,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [messages, setMessages] = useState<MessageItem[]>([INITIAL_GREETING])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const conversationIdRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Recupera histórico apenas de sessionStorage na inicialização para persistência leve de sessão
  useEffect(() => {
    try {
      const savedConv = sessionStorage.getItem(STORAGE_CONVERSATION_KEY)
      if (savedConv) {
        conversationIdRef.current = savedConv
      }
      const savedHistory = sessionStorage.getItem(STORAGE_MESSAGES_KEY)
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch {
      // Ignora erro se sessionStorage estiver bloqueado
    }
  }, [])

  // Auto-scroll para o final da lista de mensagens com animação suave
  const scrollToBottom = useCallback((instant = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior:
          instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
      })
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, scrollToBottom])

  // Ajuste de altura dinâmico da caixa de texto
  const adjustTextareaHeight = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const nextHeight = Math.min(el.scrollHeight, 120)
    el.style.height = `${Math.max(42, nextHeight)}px`
  }

  // Foco no campo ao abrir o painel em telas maiores
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
      const timer = setTimeout(() => {
        if (window.innerWidth > 640) {
          textareaRef.current?.focus()
        }
        scrollToBottom(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, scrollToBottom])

  // Persistir mensagens no sessionStorage sem dados sensíveis
  const saveToSession = (nextMessages: MessageItem[], convId: string | null) => {
    try {
      sessionStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(nextMessages.slice(-20)))
      if (convId) {
        sessionStorage.setItem(STORAGE_CONVERSATION_KEY, convId)
      }
    } catch {
      // Silencioso
    }
  }

  // Limpar conversa e começar nova
  const handleResetChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    conversationIdRef.current = null
    const resetMessages = [INITIAL_GREETING]
    setMessages(resetMessages)
    setNetworkError(null)
    setLastFailedMessage(null)
    setIsLoading(false)
    try {
      sessionStorage.removeItem(STORAGE_CONVERSATION_KEY)
      sessionStorage.removeItem(STORAGE_MESSAGES_KEY)
    } catch {
      // Silencioso
    }
    trackEvent('chat_reiniciado', { origem: 'widget_nozes_ia' })
  }

  const handleOpenChat = () => {
    setIsOpen(true)
    trackEvent('chat_aberto', { origem: 'botao_flutuante_nozes_ia' })
  }

  const handleCloseChat = () => {
    setIsOpen(false)
    trackEvent('chat_fechado', { origem: 'painel_nozes_ia' })
  }

  // Envio de mensagem
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage ?? inputValue).trim()
    if (!textToSend || isLoading) return

    setNetworkError(null)
    setLastFailedMessage(null)

    const userMessageItem: MessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
    }

    const nextMessages = [...messages, userMessageItem]
    setMessages(nextMessages)
    if (!customMessage) {
      setInputValue('')
      if (textareaRef.current) {
        textareaRef.current.style.height = '42px'
      }
    }
    setIsLoading(true)

    trackEvent('chat_mensagem_enviada', {
      tamanho: textToSend.length,
      papel: 'usuario',
    })

    try {
      abortControllerRef.current = new AbortController()
      const res = await sendChatMessage({
        message: textToSend,
        conversationId: conversationIdRef.current,
        signal: abortControllerRef.current.signal,
      })

      if (res.conversation_id) {
        conversationIdRef.current = res.conversation_id
      }

      const assistantMessageItem: MessageItem = {
        id: res.message_id || `assistant-${Date.now()}`,
        role: 'assistant',
        text: res.content,
        timestamp: new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      }

      const updatedHistory = [...nextMessages, assistantMessageItem]
      setMessages(updatedHistory)
      saveToSession(updatedHistory, conversationIdRef.current)

      trackEvent('chat_resposta_recebida', {
        resultado: 'sucesso',
      })
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Não foi possível se comunicar com o Nozes IA agora.'

      setNetworkError(errorMessage)
      setLastFailedMessage(textToSend)

      trackEvent('chat_resposta_erro', {
        motivo: 'falha_rede_ou_backend',
      })
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSendMessage(lastFailedMessage)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Sugestões de início rápido para facilitar qualificação
  const quickPrompts = [
    'Quais serviços a Nozes Ink oferece?',
    'Como funciona o diagnóstico gratuito?',
    'Quero ajuda para meu negócio vender mais',
  ]

  // Detecta menção a diagnóstico ou WhatsApp para exibir atalhos contextuais amigáveis
  const lastMessageText = messages[messages.length - 1]?.text || ''
  const showCtaShortcuts =
    lastMessageText.toLowerCase().includes('diagnóstico') ||
    lastMessageText.toLowerCase().includes('whatsapp') ||
    lastMessageText.toLowerCase().includes('wa.me')

  // Posicionamento dinâmico para NUNCA conflitar com a barra fixa mobile existente
  // Se a barra fixa mobile estiver visível e nenhum input estiver em foco:
  // a barra fixa tem min-height ~64px (padding 10px + botão 44px). O widget sobe para 80px no mobile.
  const isMobileLifted = isMobileBarVisible && !isInputFocused

  return (
    <aside className="nozes-chat-root" aria-label="Assistente virtual Nozes IA" aria-live="polite">
      {/* PAINEL DE CONVERSA */}
      <div
        className={`nozes-chat-panel ${isOpen ? 'is-open' : ''} ${
          isMobileLifted ? 'has-mobile-bar' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        {/* Cabeçalho */}
        <header className="nozes-chat-header">
          <div className="nozes-chat-header-info">
            <div className="nozes-chat-avatar" aria-hidden="true">
              <Sparkles size={18} />
              <span className="nozes-chat-status-dot" />
            </div>
            <div className="nozes-chat-header-titles">
              <div className="nozes-chat-title-row">
                <h3 className="nozes-chat-title">Nozes IA</h3>
                <span className="nozes-chat-badge">Online</span>
              </div>
              <p className="nozes-chat-subtitle">Respondemos na hora</p>
            </div>
          </div>

          <div className="nozes-chat-header-actions">
            <button
              type="button"
              className="nozes-chat-icon-btn"
              onClick={handleResetChat}
              title="Reiniciar conversa"
              aria-label="Reiniciar conversa com o assistente"
            >
              <RotateCcw size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="nozes-chat-icon-btn close-btn"
              onClick={handleCloseChat}
              title="Fechar chat"
              aria-label="Fechar painel do assistente"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Área de Mensagens */}
        <div className="nozes-chat-messages-scroll" tabIndex={0}>
          {messages.map((msg, index) => {
            const isAssistant = msg.role === 'assistant'
            return (
              <div
                key={msg.id || index}
                className={`nozes-chat-row ${isAssistant ? 'is-assistant' : 'is-user'}`}
              >
                {isAssistant && (
                  <div className="nozes-chat-row-avatar" aria-hidden="true">
                    <Sparkles size={13} />
                  </div>
                )}
                <div className="nozes-chat-bubble-wrap">
                  <div className={`nozes-chat-bubble ${msg.role}`}>
                    <p className="nozes-chat-bubble-text">{msg.text}</p>
                  </div>
                  <span className="nozes-chat-timestamp">{msg.timestamp}</span>
                </div>
              </div>
            )
          })}

          {/* Indicador de digitação */}
          {isLoading && (
            <div className="nozes-chat-row is-assistant">
              <div className="nozes-chat-row-avatar" aria-hidden="true">
                <Sparkles size={13} />
              </div>
              <div className="nozes-chat-bubble is-typing" aria-label="Nozes IA está digitando...">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          {/* Banner de erro de rede amigável com botão de tentar novamente */}
          {networkError && (
            <div className="nozes-chat-error-banner" role="alert">
              <div className="error-icon-wrap" aria-hidden="true">
                <AlertTriangle size={16} />
              </div>
              <div className="error-copy">
                <strong>Falha de conexão</strong>
                <p>{networkError}</p>
              </div>
              {lastFailedMessage && (
                <button
                  type="button"
                  className="nozes-chat-retry-btn"
                  onClick={handleRetry}
                  disabled={isLoading}
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>Tentar novamente</span>
                </button>
              )}
            </div>
          )}

          {/* Atalhos contextuais (Diagnóstico ou WhatsApp) */}
          {showCtaShortcuts && !isLoading && (
            <div className="nozes-chat-action-pills" aria-label="Ações recomendadas">
              <button
                type="button"
                className="chat-action-pill diagnostic"
                onClick={() => {
                  trackEvent('clique_cta', { origem: 'chat_atalho_diagnostico' })
                  scrollToDiagnosticForm()
                }}
              >
                <ClipboardList size={13} aria-hidden="true" />
                <span>Preencher diagnóstico gratuito</span>
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-action-pill whatsapp"
                onClick={() => trackEvent('clique_whatsapp', { origem: 'chat_atalho_whatsapp' })}
              >
                <MessageCircle size={13} aria-hidden="true" />
                <span>Chamar no WhatsApp oficial</span>
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </div>
          )}

          {/* Sugestões de início se a conversa estiver só na saudação */}
          {messages.length === 1 && !isLoading && (
            <div className="nozes-chat-quick-prompts" aria-label="Sugestões de perguntas">
              <span className="quick-prompts-label">Perguntas frequentes:</span>
              <div className="quick-prompts-list">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="quick-prompt-btn"
                    onClick={() => handleSendMessage(prompt)}
                  >
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Rodapé e Campo de Entrada */}
        <form
          className="nozes-chat-input-bar"
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            handleSendMessage()
          }}
        >
          <label htmlFor="nozes-chat-textarea" className="sr-only">
            Mensagem para Nozes IA
          </label>
          <textarea
            id="nozes-chat-textarea"
            ref={textareaRef}
            rows={1}
            className="nozes-chat-textarea"
            placeholder="Pergunte sobre soluções, gargalos..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            maxLength={1000}
          />
          <button
            type="submit"
            className="nozes-chat-send-btn"
            disabled={isLoading || !inputValue.trim()}
            title="Enviar mensagem (Enter)"
            aria-label="Enviar mensagem"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Send size={16} aria-hidden="true" />
            )}
          </button>
        </form>
      </div>

      {/* BOTÃO FLUTUANTE DE CHAT (Dourado da paleta, canto inferior direito) */}
      <button
        type="button"
        className={`nozes-chat-trigger-btn ${isOpen ? 'is-active' : ''} ${
          isMobileLifted ? 'has-mobile-bar' : ''
        }`}
        onClick={() => {
          if (isOpen) {
            handleCloseChat()
          } else {
            handleOpenChat()
          }
        }}
        aria-label={isOpen ? 'Fechar chat Nozes IA' : 'Abrir chat Nozes IA'}
        aria-expanded={isOpen}
      >
        <span className="nozes-chat-trigger-icon" aria-hidden="true">
          {isOpen ? <X size={24} /> : <MessageCircle size={25} />}
        </span>
        <span className="nozes-chat-trigger-ping" aria-hidden="true" />
        {!isOpen && unreadCount > 0 && (
          <span className="nozes-chat-badge-count">{unreadCount}</span>
        )}
      </button>
    </aside>
  )
}

import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useDocumentStore } from '../../store/documentStore'
import './ChatPanel.css'

export default function ChatPanel() {
  const [input, setInput] = useState('')
  const { messages, isStreaming, streamingContent, addMessage, appendStreaming, finalizeStreaming } =
    useChatStore()
  const { document } = useDocumentStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  useEffect(() => {
    window.electronAPI?.onAIChunk((chunk) => appendStreaming(chunk))
    window.electronAPI?.onAIDone(() => finalizeStreaming())

    return () => {
      window.electronAPI?.removeAllListeners('ai:stream-chunk')
      window.electronAPI?.removeAllListeners('ai:stream-done')
    }
  }, [appendStreaming, finalizeStreaming])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    addMessage('user', text)
    setInput('')

    const history = [...messages, { role: 'user' as const, content: text }].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    await window.electronAPI?.sendChat({
      messages: history,
      documentContext: document?.rawText?.slice(0, 8000),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>문서를 열거나 질문을 입력하세요.</p>
            <p className="chat-hint">
              {document ? `"${document.title}" 로드됨` : '파일을 드래그하거나 문서 탭에서 열어주세요.'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.role}`}>
            <div className="message-bubble">
              <p>{msg.content}</p>
            </div>
          </div>
        ))}

        {isStreaming && streamingContent && (
          <div className="chat-message assistant">
            <div className="message-bubble streaming">
              <p>{streamingContent}</p>
              <span className="cursor" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="지시사항 입력... (Cmd+Enter로 전송)"
          rows={2}
          disabled={isStreaming}
        />
        <button
          className={`send-btn ${isStreaming ? 'loading' : ''}`}
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
        >
          {isStreaming ? (
            <span className="loading-dots">...</span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

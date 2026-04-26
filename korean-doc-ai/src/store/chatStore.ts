import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatState {
  messages: Message[]
  isStreaming: boolean
  streamingContent: string
  addMessage: (role: 'user' | 'assistant', content: string) => void
  appendStreaming: (chunk: string) => void
  finalizeStreaming: () => void
  clearChat: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  streamingContent: '',

  addMessage: (role, content) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      role,
      content,
      timestamp: Date.now(),
    }
    set((state) => ({ messages: [...state.messages, message] }))
  },

  appendStreaming: (chunk) => {
    set((state) => ({
      isStreaming: true,
      streamingContent: state.streamingContent + chunk,
    }))
  },

  finalizeStreaming: () => {
    const { streamingContent } = get()
    if (streamingContent) {
      const message: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: streamingContent,
        timestamp: Date.now(),
      }
      set((state) => ({
        messages: [...state.messages, message],
        isStreaming: false,
        streamingContent: '',
      }))
    } else {
      set({ isStreaming: false, streamingContent: '' })
    }
  },

  clearChat: () => set({ messages: [], streamingContent: '', isStreaming: false }),
}))

export {}

declare global {
  interface Window {
    electronAPI?: {
      parseFile: (filePath: string) => Promise<{ success: boolean; data?: import('../store/documentStore').ParsedDocument; error?: string }>
      onFileParsed: (cb: (data: unknown) => void) => void

      onSelectionChanged: (cb: (data: { text: string; x: number; y: number }) => void) => void

      sendChat: (payload: { messages: { role: 'user' | 'assistant'; content: string }[]; documentContext?: string }) => Promise<{ success: boolean; error?: string }>
      onAIChunk: (cb: (chunk: string) => void) => void
      onAIDone: (cb: () => void) => void

      analyzeDocument: (text: string) => Promise<{ success: boolean; error?: string }>
      onAnalyzeChunk: (cb: (chunk: string) => void) => void
      onAnalyzeDone: (cb: () => void) => void

      quickEdit: (payload: { text: string; action: string; surrounding?: string }) => Promise<{ success: boolean; result?: string; error?: string }>

      copyToClipboard: (text: string) => Promise<boolean>

      resizeOverlay: (size: { width: number; height: number }) => void
      moveOverlay: (pos: { x: number; y: number }) => void
      pinOverlay: (alwaysOnTop: boolean) => void

      removeAllListeners: (channel: string) => void
    }
  }
}

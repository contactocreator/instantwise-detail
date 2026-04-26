import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // 파일 파싱
  parseFile: (filePath: string) => ipcRenderer.invoke('file:parse', filePath),
  onFileParsed: (cb: (data: unknown) => void) => {
    ipcRenderer.on('file:parsed', (_e, data) => cb(data))
  },

  // 선택 텍스트 감지
  onSelectionChanged: (cb: (data: { text: string; x: number; y: number }) => void) => {
    ipcRenderer.on('selection:changed', (_e, data) => cb(data))
  },

  // AI 채팅 (스트리밍)
  sendChat: (payload: { messages: unknown[]; documentContext?: string }) =>
    ipcRenderer.invoke('ai:chat', payload),
  onAIChunk: (cb: (chunk: string) => void) => {
    ipcRenderer.on('ai:stream-chunk', (_e, chunk) => cb(chunk))
  },
  onAIDone: (cb: () => void) => {
    ipcRenderer.on('ai:stream-done', () => cb())
  },

  // 전체 문서 분석
  analyzeDocument: (text: string) => ipcRenderer.invoke('ai:analyze', text),
  onAnalyzeChunk: (cb: (chunk: string) => void) => {
    ipcRenderer.on('ai:analyze-chunk', (_e, chunk) => cb(chunk))
  },
  onAnalyzeDone: (cb: () => void) => {
    ipcRenderer.on('ai:analyze-done', () => cb())
  },

  // 선택 텍스트 빠른 수정
  quickEdit: (payload: { text: string; action: string; surrounding?: string }) =>
    ipcRenderer.invoke('ai:quick-edit', payload),

  // 결과를 클립보드에 복사
  copyToClipboard: (text: string) => ipcRenderer.invoke('clipboard:write', text),

  // 오버레이 제어
  resizeOverlay: (size: { width: number; height: number }) =>
    ipcRenderer.send('overlay:resize', size),
  moveOverlay: (pos: { x: number; y: number }) => ipcRenderer.send('overlay:move', pos),
  pinOverlay: (alwaysOnTop: boolean) => ipcRenderer.send('overlay:pin', alwaysOnTop),

  // 이벤트 제거 헬퍼
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
})

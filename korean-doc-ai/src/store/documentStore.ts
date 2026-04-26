import { create } from 'zustand'

export interface Paragraph {
  id: string
  text: string
  level: number
}

export interface ParsedDocument {
  format: string
  title: string
  paragraphs: Paragraph[]
  rawText: string
  wordCount: number
  filePath: string
}

interface DocumentState {
  document: ParsedDocument | null
  isLoading: boolean
  error: string | null
  analysisResult: string
  isAnalyzing: boolean
  setDocument: (doc: ParsedDocument) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  appendAnalysis: (chunk: string) => void
  clearAnalysis: () => void
  setAnalyzing: (analyzing: boolean) => void
}

export const useDocumentStore = create<DocumentState>((set) => ({
  document: null,
  isLoading: false,
  error: null,
  analysisResult: '',
  isAnalyzing: false,
  setDocument: (document) => set({ document, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  appendAnalysis: (chunk) =>
    set((state) => ({ analysisResult: state.analysisResult + chunk })),
  clearAnalysis: () => set({ analysisResult: '' }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
}))

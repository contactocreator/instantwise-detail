import { create } from 'zustand'

export type OverlayMode = 'hidden' | 'mini' | 'expanded' | 'selection-popup'

interface OverlayState {
  mode: OverlayMode
  selectedText: string
  selectionX: number
  selectionY: number
  setMode: (mode: OverlayMode) => void
  setSelection: (text: string, x: number, y: number) => void
}

export const useOverlayStore = create<OverlayState>((set) => ({
  mode: 'mini',
  selectedText: '',
  selectionX: 0,
  selectionY: 0,
  setMode: (mode) => {
    set({ mode })
    // 오버레이 크기 동기화
    const sizes: Record<OverlayMode, { width: number; height: number }> = {
      hidden: { width: 0, height: 0 },
      mini: { width: 380, height: 56 },
      expanded: { width: 420, height: 680 },
      'selection-popup': { width: 260, height: 56 },
    }
    if (mode !== 'hidden') {
      window.electronAPI?.resizeOverlay(sizes[mode])
    }
  },
  setSelection: (selectedText, selectionX, selectionY) =>
    set({ selectedText, selectionX, selectionY }),
}))

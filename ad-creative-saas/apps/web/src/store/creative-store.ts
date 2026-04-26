import { create } from 'zustand'

interface LayerAnalysis {
  background: { type: string; color_tone: string; style: string }
  product: { position: string; size: string; composition: string }
  text_sections: Array<{ part: number; position: string; role: string; font_style: string }>
}

interface AdCopy {
  headline: string
  subheadline: string
  cta: string
}

interface GeneratedImage {
  url: string
  copy_index: number
}

interface CreativeStore {
  productImage: File | null
  referenceImage: File | null
  productInfo: string
  layers: LayerAnalysis | null
  copies: AdCopy[]
  selectedCopies: number[]
  generatedImages: GeneratedImage[]
  setProductImage: (file: File | null) => void
  setReferenceImage: (file: File | null) => void
  setProductInfo: (info: string) => void
  setLayers: (layers: LayerAnalysis) => void
  setCopies: (copies: AdCopy[]) => void
  toggleCopySelection: (index: number) => void
  setGeneratedImages: (images: GeneratedImage[]) => void
}

export const useCreativeStore = create<CreativeStore>((set) => ({
  productImage: null,
  referenceImage: null,
  productInfo: '',
  layers: null,
  copies: [],
  selectedCopies: [],
  generatedImages: [],
  setProductImage: (file) => set({ productImage: file }),
  setReferenceImage: (file) => set({ referenceImage: file }),
  setProductInfo: (info) => set({ productInfo: info }),
  setLayers: (layers) => set({ layers }),
  setCopies: (copies) => set({ copies, selectedCopies: [] }),
  toggleCopySelection: (index) => set((state) => ({
    selectedCopies: state.selectedCopies.includes(index)
      ? state.selectedCopies.filter(i => i !== index)
      : [...state.selectedCopies, index],
  })),
  setGeneratedImages: (images) => set({ generatedImages: images }),
}))

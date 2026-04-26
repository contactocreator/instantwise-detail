export interface Organization {
  id: string
  name: string
  created_at: string
}

export interface Project {
  id: string
  org_id: string
  name: string
  created_at: string
}

export interface Creative {
  id: string
  project_id: string
  name: string
  status: 'draft' | 'analyzing' | 'copy_ready' | 'generating' | 'completed'
  layers?: LayerAnalysis
  copies?: AdCopy[]
  selected_copies?: number[]
  generated_images?: GeneratedImage[]
  created_at: string
}

export interface LayerAnalysis {
  background: {
    type: string
    color_tone: string
    style: string
    dominant_colors: string[]
  }
  product: {
    position: string
    size: string
    composition: string
    angle: string
  }
  text_sections: TextSection[]
  overall_composition: string
  mood: string
}

export interface TextSection {
  part: number
  position: string
  role: string
  font_style: string
  estimated_font_size: string
}

export interface AdCopy {
  headline: string
  subheadline: string
  cta: string
}

export interface GeneratedImage {
  url: string
  copy_index: number
}

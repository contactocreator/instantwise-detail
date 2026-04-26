from pydantic import BaseModel
from typing import Optional, List

class Background(BaseModel):
    type: str
    color_tone: str
    style: str
    dominant_colors: List[str] = []

class ProductPlacement(BaseModel):
    position: str
    size: str
    composition: str
    angle: str = ""

class TextSection(BaseModel):
    part: int
    position: str
    role: str
    font_style: str
    estimated_font_size: str = ""

class LayerAnalysis(BaseModel):
    background: Background
    product: ProductPlacement
    text_sections: List[TextSection]
    overall_composition: str = ""
    mood: str = ""

class AdCopy(BaseModel):
    headline: str
    subheadline: str
    cta: str

class GeneratedImage(BaseModel):
    url: str
    copy_index: int

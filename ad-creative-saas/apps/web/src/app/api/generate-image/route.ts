import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// 무료 등급 한도: 분당 15회, 하루 1,500회
// 요청 간 최소 간격 4초 (분당 15회 = 4초/회)
const FREE_TIER_DELAY_MS = 4000
const FREE_TIER_MAX_PER_REQUEST = 3 // 한 번에 최대 3장 (12초 소요)

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const copies = JSON.parse(formData.get('copies') as string)
    const layers = JSON.parse(formData.get('layers') as string)

    // 무료 등급 보호: 최대 3개로 제한
    const limitedCopies = copies.slice(0, FREE_TIER_MAX_PER_REQUEST)

    const images: { url: string; copy_index: number }[] = []

    // 병렬 대신 순차 처리 + 딜레이 (분당 15회 초과 방지)
    for (let i = 0; i < limitedCopies.length; i++) {
      if (i > 0) await sleep(FREE_TIER_DELAY_MS)

      const copy = limitedCopies[i]
      const prompt = buildImagePrompt(copy, layers)
      const url = await generateWithNanoBanana(prompt)
      images.push({ url, copy_index: i })
    }

    return NextResponse.json({
      images,
      notice: limitedCopies.length < copies.length
        ? `무료 등급 제한으로 ${FREE_TIER_MAX_PER_REQUEST}개만 생성됐습니다.`
        : null,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: '이미지 생성 중 오류가 발생했습니다' }, { status: 500 })
  }
}

function buildImagePrompt(
  copy: { headline: string; subheadline: string },
  layers: {
    background?: { style: string; color_tone: string }
    product?: { position: string; composition: string }
    mood?: string
  }
) {
  const bg = layers?.background
  const product = layers?.product
  return `한국 광고 이미지. ${bg?.style ?? '깔끔한'} 배경, ${bg?.color_tone ?? '밝은'} 색조. 제품은 ${product?.position ?? '중앙'}에 ${product?.composition ?? '단독 제품샷'}으로 배치. 헤드라인 텍스트: "${copy.headline}", 서브헤드라인: "${copy.subheadline}". 전문 광고 사진, 고품질, 상업용 스타일, ${layers?.mood ?? '모던한'} 분위기. Korean advertisement, professional commercial photography.`
}

async function generateWithNanoBanana(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return `https://placehold.co/1024x1024/2563eb/white?text=Gemini+API+Key+필요`
  }

  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-preview-image-generation',
    contents: prompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  })

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData?.data) {
      return `data:image/png;base64,${part.inlineData.data}`
    }
  }

  return `https://placehold.co/1024x1024/2563eb/white?text=생성+실패`
}

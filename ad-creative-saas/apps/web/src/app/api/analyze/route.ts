import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const referenceImage = formData.get('reference_image') as File
    const productInfo = formData.get('product_info') as string

    const imageBuffer = await referenceImage.arrayBuffer()
    const base64 = Buffer.from(imageBuffer).toString('base64')
    const mediaType = referenceImage.type as 'image/jpeg' | 'image/png' | 'image/webp'

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: `이 광고 이미지를 분석해서 다음 JSON 형식으로 레이어 구조를 반환해주세요. 한국어로 설명해주세요.

{
  "background": {
    "type": "단색|그라디언트|이미지|패턴",
    "color_tone": "밝음|어두움|중간",
    "style": "미니멀|화려한|자연적|도시적 등",
    "dominant_colors": ["#hex1", "#hex2"]
  },
  "product": {
    "position": "중앙|좌측|우측|하단|상단",
    "size": "크게|중간|작게",
    "composition": "단독|그룹|생활샷|플랫레이 등",
    "angle": "정면|측면|상단|기울기"
  },
  "text_sections": [
    {
      "part": 1,
      "position": "상단|중앙|하단|좌측|우측",
      "role": "헤드라인|서브헤드라인|CTA|설명",
      "font_style": "굵은|얇은|중간",
      "estimated_font_size": "크게|중간|작게"
    }
  ],
  "overall_composition": "전체 구도 설명",
  "mood": "광고 분위기 설명"
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`
          }
        ]
      }]
    })

    const content = response.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    const layers = JSON.parse(content.text)
    return NextResponse.json({ layers })
  } catch (error) {
    console.error('Analyze error:', error)
    return NextResponse.json({ error: '분석 중 오류가 발생했습니다' }, { status: 500 })
  }
}

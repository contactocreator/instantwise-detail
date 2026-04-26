import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { layers, product_info } = await req.json()

    const textSections = layers?.text_sections ?? []
    const sectionCount = textSections.length

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `당신은 한국 광고 카피라이터 전문가입니다.

제품 정보:
${product_info || '(제품 정보 없음)'}

광고 레이아웃 분석:
- 텍스트 섹션 수: ${sectionCount}개
- 섹션 구조: ${JSON.stringify(textSections, null, 2)}
- 전체 구도: ${layers?.overall_composition ?? ''}
- 광고 분위기: ${layers?.mood ?? ''}

위 정보를 바탕으로 광고 카피 10개를 JSON 배열로 생성해주세요.
각 카피는 레이아웃에 맞게 헤드라인, 서브헤드라인, CTA를 포함해야 합니다.
자연스럽고 임팩트 있는 한국어 광고 문구를 작성하세요.

반환 형식 (JSON 배열만, 다른 텍스트 없이):
[
  {
    "headline": "메인 헤드라인 (짧고 임팩트있게)",
    "subheadline": "서브 헤드라인 (조금 더 설명적으로)",
    "cta": "행동 유도 문구"
  }
]`
      }]
    })

    const content = response.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    const copies = JSON.parse(content.text)
    return NextResponse.json({ copies })
  } catch (error) {
    console.error('Copy generation error:', error)
    return NextResponse.json({ error: '카피 생성 중 오류가 발생했습니다' }, { status: 500 })
  }
}

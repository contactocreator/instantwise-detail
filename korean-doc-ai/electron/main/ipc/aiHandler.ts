import { ipcMain, BrowserWindow } from 'electron'
import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY 환경변수가 없습니다.')
    client = new Anthropic({ apiKey })
  }
  return client
}

function getSender(): BrowserWindow | null {
  return BrowserWindow.getAllWindows()[0] ?? null
}

export function registerAIHandlers(): void {
  // 채팅 교정 모드 (스트리밍)
  ipcMain.handle('ai:chat', async (_event, payload: {
    messages: { role: 'user' | 'assistant'; content: string }[]
    documentContext?: string
  }) => {
    const win = getSender()
    try {
      const anthropic = getClient()
      const systemPrompt = `당신은 한국어 문서 교정 전문가입니다.
사용자의 지시에 따라 문서를 교정하고 개선합니다.
수정된 텍스트를 제공할 때는 명확하게 구분해서 보여주세요.
${payload.documentContext ? `\n[현재 문서 컨텍스트]\n${payload.documentContext}` : ''}`

      const stream = anthropic.messages.stream({
        model: 'claude-sonnet-4-5',
        max_tokens: 4096,
        system: systemPrompt,
        messages: payload.messages,
      })

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          win?.webContents.send('ai:stream-chunk', chunk.delta.text)
        }
      }

      win?.webContents.send('ai:stream-done')
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      win?.webContents.send('ai:stream-done')
      return { success: false, error: message }
    }
  })

  // 전체 문서 분석 모드 (스트리밍)
  ipcMain.handle('ai:analyze', async (_event, text: string) => {
    const win = getSender()
    try {
      const anthropic = getClient()

      const stream = anthropic.messages.stream({
        model: 'claude-opus-4-5',
        max_tokens: 8192,
        system: `당신은 한국어 문서 교정 전문가입니다.
주어진 문서를 분석하여 다음을 수행합니다:
1. 맞춤법/띄어쓰기 오류 지적
2. 어색한 문장 구조 개선 제안
3. 논리적 흐름 분석
4. 전체적인 문서 품질 평가
각 항목을 명확한 섹션으로 구분하여 제공하세요.`,
        messages: [
          {
            role: 'user',
            content: `다음 문서를 분석하고 교정해주세요:\n\n${text}`,
          },
        ],
      })

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          win?.webContents.send('ai:analyze-chunk', chunk.delta.text)
        }
      }

      win?.webContents.send('ai:analyze-done')
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      win?.webContents.send('ai:analyze-done')
      return { success: false, error: message }
    }
  })

  // 드래그 선택 텍스트 빠른 수정
  ipcMain.handle('ai:quick-edit', async (_event, payload: {
    text: string
    action: 'correct' | 'rewrite' | 'summarize' | 'formal' | 'casual'
    surrounding?: string
  }) => {
    try {
      const anthropic = getClient()

      const actionPrompts: Record<string, string> = {
        correct: '맞춤법과 문법을 교정해주세요. 수정된 텍스트만 반환하세요.',
        rewrite: '더 자연스럽고 명확하게 다시 써주세요. 수정된 텍스트만 반환하세요.',
        summarize: '핵심 내용을 간결하게 요약해주세요.',
        formal: '격식체(공식적인 어투)로 바꿔주세요. 수정된 텍스트만 반환하세요.',
        casual: '구어체(친근한 어투)로 바꿔주세요. 수정된 텍스트만 반환하세요.',
      }

      const contextInfo = payload.surrounding
        ? `\n[앞뒤 문맥]\n${payload.surrounding}`
        : ''

      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${actionPrompts[payload.action]}${contextInfo}\n\n[대상 텍스트]\n${payload.text}`,
          },
        ],
      })

      const result =
        response.content[0].type === 'text' ? response.content[0].text : ''
      return { success: true, result }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  })
}

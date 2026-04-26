import fs from 'fs'
import path from 'path'
import type { ParsedDocument } from './parserFactory'

export async function parseTxt(filePath: string): Promise<ParsedDocument> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const ext = path.extname(filePath).toLowerCase()

  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const paragraphs: ParsedDocument['paragraphs'] = lines.map((text, i) => {
    // 마크다운 제목 감지
    const headingMatch = text.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      return {
        id: `p-${String(i).padStart(3, '0')}`,
        text: headingMatch[2],
        level: headingMatch[1].length,
      }
    }
    return {
      id: `p-${String(i).padStart(3, '0')}`,
      text,
      level: 0,
    }
  })

  const rawText = lines.join('\n')
  const title = path.basename(filePath, ext)

  return {
    format: ext === '.md' || ext === '.markdown' ? 'md' : 'txt',
    title,
    paragraphs,
    rawText,
    wordCount: rawText.replace(/\s/g, '').length,
    filePath,
  }
}

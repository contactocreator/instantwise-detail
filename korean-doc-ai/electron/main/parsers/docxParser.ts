import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import type { ParsedDocument } from './parserFactory'

export async function parseDocx(filePath: string): Promise<ParsedDocument> {
  const buffer = fs.readFileSync(filePath)
  const result = await mammoth.extractRawText({ buffer })

  const lines = result.value
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const paragraphs: ParsedDocument['paragraphs'] = lines.map((text, i) => ({
    id: `p-${String(i).padStart(3, '0')}`,
    text,
    level: 0,
  }))

  const rawText = lines.join('\n')
  const title = path.basename(filePath, '.docx')

  return {
    format: 'docx',
    title,
    paragraphs,
    rawText,
    wordCount: rawText.replace(/\s/g, '').length,
    filePath,
  }
}

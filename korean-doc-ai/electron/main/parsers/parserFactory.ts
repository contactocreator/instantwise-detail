import path from 'path'
import { parseHwpx } from './hwpxParser'
import { parseDocx } from './docxParser'
import { parsePdf } from './pdfParser'
import { parseTxt } from './txtParser'

export interface ParsedDocument {
  format: 'hwpx' | 'hwp' | 'docx' | 'pdf' | 'txt' | 'md' | 'unknown'
  title: string
  paragraphs: Array<{
    id: string
    text: string
    level: number
  }>
  rawText: string
  wordCount: number
  filePath: string
}

export async function parseFile(filePath: string): Promise<ParsedDocument> {
  const ext = path.extname(filePath).toLowerCase()

  switch (ext) {
    case '.hwpx':
      return parseHwpx(filePath)
    case '.docx':
      return parseDocx(filePath)
    case '.pdf':
      return parsePdf(filePath)
    case '.txt':
    case '.md':
    case '.markdown':
      return parseTxt(filePath)
    default:
      throw new Error(`지원하지 않는 파일 형식입니다: ${ext}`)
  }
}

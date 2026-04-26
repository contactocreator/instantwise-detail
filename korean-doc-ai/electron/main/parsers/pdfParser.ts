import fs from 'fs'
import path from 'path'
import type { ParsedDocument } from './parserFactory'

export async function parsePdf(filePath: string): Promise<ParsedDocument> {
  // pdfjs-dist를 동적으로 로드 (CommonJS 환경)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js')

  const buffer = fs.readFileSync(filePath)
  const uint8Array = new Uint8Array(buffer)

  const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
  const pdfDoc = await loadingTask.promise

  const paragraphs: ParsedDocument['paragraphs'] = []
  let idx = 0

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum)
    const textContent = await page.getTextContent()

    let pageText = ''
    for (const item of textContent.items) {
      if ('str' in item) {
        pageText += item.str + ' '
      }
    }

    const lines = pageText
      .split(/\n|(?<=[\.\?\!])\s+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    for (const line of lines) {
      paragraphs.push({
        id: `p-${String(idx).padStart(3, '0')}`,
        text: line,
        level: 0,
      })
      idx++
    }
  }

  const rawText = paragraphs.map((p) => p.text).join('\n')
  const title = path.basename(filePath, '.pdf')

  return {
    format: 'pdf',
    title,
    paragraphs,
    rawText,
    wordCount: rawText.replace(/\s/g, '').length,
    filePath,
  }
}

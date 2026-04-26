import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'
import { DOMParser } from '@xmldom/xmldom'
import type { ParsedDocument } from './parserFactory'

export async function parseHwpx(filePath: string): Promise<ParsedDocument> {
  const buffer = fs.readFileSync(filePath)
  const zip = await JSZip.loadAsync(buffer)

  // hwpx 구조: Contents/content.hml 에 본문 XML
  const contentFile =
    zip.file('Contents/content.hml') ||
    zip.file('content.hml') ||
    zip.file('Contents/Content.xml')

  if (!contentFile) {
    throw new Error('hwpx 파일에서 본문(content.hml)을 찾을 수 없습니다.')
  }

  const xmlText = await contentFile.async('text')
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'text/xml')

  const paragraphs: ParsedDocument['paragraphs'] = []
  let idx = 0

  // hp:p (단락) 태그 순회
  const pNodes = doc.getElementsByTagName('hp:p')
  if (pNodes.length === 0) {
    // 네임스페이스 없이 시도
    const pNodes2 = doc.getElementsByTagName('p')
    for (let i = 0; i < pNodes2.length; i++) {
      const text = extractTextFromNode(pNodes2[i])
      if (text.trim()) {
        paragraphs.push({ id: `p-${String(idx).padStart(3, '0')}`, text, level: 0 })
        idx++
      }
    }
  } else {
    for (let i = 0; i < pNodes.length; i++) {
      const text = extractTextFromNode(pNodes[i])
      if (text.trim()) {
        paragraphs.push({ id: `p-${String(idx).padStart(3, '0')}`, text, level: 0 })
        idx++
      }
    }
  }

  const rawText = paragraphs.map((p) => p.text).join('\n')
  const title = path.basename(filePath, '.hwpx')

  return {
    format: 'hwpx',
    title,
    paragraphs,
    rawText,
    wordCount: rawText.replace(/\s/g, '').length,
    filePath,
  }
}

function extractTextFromNode(node: Element): string {
  let text = ''
  const tNodes = node.getElementsByTagName('hp:t')
  if (tNodes.length === 0) {
    // 네임스페이스 없이 시도
    const tNodes2 = node.getElementsByTagName('t')
    for (let i = 0; i < tNodes2.length; i++) {
      text += tNodes2[i].textContent || ''
    }
  } else {
    for (let i = 0; i < tNodes.length; i++) {
      text += tNodes[i].textContent || ''
    }
  }
  return text || node.textContent || ''
}

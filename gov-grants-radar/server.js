import express from 'express'
import cors from 'cors'
import axios from 'axios'
import multer from 'multer'
import { createRequire } from 'module'
import Anthropic from '@anthropic-ai/sdk'
import { config } from 'dotenv'

config()

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

const app = express()
const PORT = 3001
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } })

app.use(cors())
app.use(express.json())

// 비즈인포 API 프록시
app.get('/api/bizinfo', async (req, res) => {
  const { crtfcKey, pageIndex = 1, pageUnit = 10, hashtags = '' } = req.query
  try {
    const params = { crtfcKey, pageIndex, pageUnit, dataType: 'json' }
    if (hashtags) params.hashtags = hashtags

    const response = await axios.get('https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do', {
      params,
      timeout: 10000,
    })
    res.json(response.data)
  } catch (err) {
    console.error('[bizinfo]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// K-Startup 창업소식 API 프록시 (api.odcloud.kr) - 최신 데이터 자동 조회
app.get('/api/kstartup', async (req, res) => {
  const { serviceKey, perPage = 30 } = req.query
  const baseUrl = 'https://api.odcloud.kr/api/15122759/v1/uddi:4113b9df-32f4-4eaf-ba4b-ef50bd2b4bee'
  try {
    // 1) 전체 건수 확인
    const countRes = await axios.get(baseUrl, {
      params: { serviceKey, page: 1, perPage: 1 },
      timeout: 10000,
    })
    const totalCount = countRes.data?.totalCount || 1
    const lastPage = Math.ceil(totalCount / parseInt(perPage))

    // 2) 마지막 페이지(최신) 조회
    const response = await axios.get(baseUrl, {
      params: { serviceKey, page: lastPage, perPage },
      timeout: 10000,
    })
    // 최신순으로 뒤집어서 반환
    const data = response.data
    if (data?.data) data.data = data.data.reverse()
    res.json(data)
  } catch (err) {
    console.error('[kstartup]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// 중기부 사업공고 API 프록시
app.get('/api/mss', async (req, res) => {
  const { serviceKey, pageNo = 1, numOfRows = 10 } = req.query
  try {
    const response = await axios.get(
      'https://apis.data.go.kr/1421000/mssBizService_v2/getbizList_v2',
      {
        params: { serviceKey, pageNo, numOfRows },
        timeout: 10000,
      }
    )
    res.json(response.data)
  } catch (err) {
    console.error('[mss]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// 사업계획서/IR피치덱 분석 → 기업 프로필 자동 추출
app.post('/api/analyze-doc', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: '파일이 없습니다.' })

  const anthropicKey = req.headers['x-anthropic-key'] || process.env.ANTHROPIC_API_KEY
  if (!anthropicKey) return res.status(400).json({ error: 'Anthropic API 키가 필요합니다.' })

  try {
    const mime = req.file.mimetype
    const fileName = req.file.originalname.toLowerCase()
    let textContent = ''

    if (mime === 'application/pdf' || fileName.endsWith('.pdf')) {
      const parsed = await pdfParse(req.file.buffer)
      textContent = parsed.text.slice(0, 8000)
    } else {
      // PPT/DOCX 등 텍스트 추출 불가 시 파일명으로 힌트만 제공
      textContent = `[파일명: ${req.file.originalname}] — 텍스트 추출 불가. 파일명과 컨텍스트를 바탕으로 최대한 추론하세요.`
    }

    const client = new Anthropic({ apiKey: anthropicKey })
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `다음은 기업의 사업계획서 또는 IR 피치덱 내용입니다. 이를 분석하여 기업 정보를 JSON으로 추출하세요.

문서 내용:
${textContent}

아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "companyName": "기업명 (없으면 빈 문자열)",
  "industry": "다음 중 하나: IT/소프트웨어, AI/데이터, 제조업, 바이오/의료, 서비스업, 유통/물류, 농업/식품, 문화/콘텐츠, 기타",
  "age": 창업년도_기준_업력_숫자_또는_null,
  "size": "다음 중 하나: 예비창업자, 창업3년미만, 스타트업, 소기업, 중기업 (모를 경우 스타트업)",
  "region": "다음 중 하나: 서울, 경기, 인천, 강원, 충북, 충남, 대전, 세종, 전북, 전남, 광주, 경북, 경남, 대구, 울산, 부산, 제주, 전국",
  "keywords": ["핵심기술/제품/서비스 키워드 최대 5개"],
  "interests": ["다음 중 해당되는 것들: 자금지원, 기술개발, R&D, 수출지원, 판로개척, 인력지원, 교육/컨설팅"],
  "summary": "기업 및 사업 요약 2-3줄"
}`,
        },
      ],
    })

    const raw = message.content[0].text.trim()
    // JSON 블록 추출
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('JSON 파싱 실패')
    const profile = JSON.parse(match[0])
    res.json({ profile })
  } catch (err) {
    console.error('[analyze-doc]', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`API 프록시 서버 실행 중: http://localhost:${PORT}`)
})

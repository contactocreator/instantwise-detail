import axios from 'axios'

// 샘플 데이터 (API 키 없을 때 표시)
export const SAMPLE_ANNOUNCEMENTS = [
  {
    id: 'sample-001',
    source: 'bizinfo',
    title: '2026년 AI 스타트업 육성 지원사업 공고',
    description:
      '인공지능 기술을 보유한 초기 스타트업을 대상으로 사업화 자금 및 멘토링을 지원합니다. AI, 머신러닝, 딥러닝 기반 제품·서비스를 개발 중인 기업이라면 누구든 신청 가능합니다.',
    agency: '중소벤처기업부',
    targetAudience: '창업 3년 이내 AI 스타트업',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    url: 'https://www.bizinfo.go.kr',
    tags: ['AI', '스타트업', '사업화', '초기창업'],
    isActive: true,
  },
  {
    id: 'sample-002',
    source: 'kstartup',
    title: '중소기업 R&D 기술개발 지원 (전략형)',
    description:
      '중소기업의 기술경쟁력 강화를 위한 R&D 과제를 지원합니다. 소재·부품·장비 분야 및 미래 신산업 분야 기술개발 과제를 우선 선정합니다.',
    agency: 'KEIT 한국산업기술평가관리원',
    targetAudience: '중소기업, 소기업 (업력 무관)',
    startDate: '2026-03-15',
    endDate: '2026-05-15',
    url: 'https://www.k-startup.go.kr',
    tags: ['R&D', '기술개발', '소재부품장비', '제조'],
    isActive: true,
  },
  {
    id: 'sample-003',
    source: 'mss',
    title: '수출 바우처 지원사업 — 글로벌 진출 패키지',
    description:
      '수출 역량을 보유한 중소·중견기업의 해외 마케팅 활동을 바우처 방식으로 지원합니다. 해외 전시회 참가, 현지 광고, 번역·통역 비용 등을 포함합니다.',
    agency: 'KOTRA 대한무역투자진흥공사',
    targetAudience: '수출 실적 보유 중소·중견기업',
    startDate: '2026-04-10',
    endDate: '2026-05-10',
    url: 'https://www.mss.go.kr',
    tags: ['수출지원', '해외마케팅', '바우처', '글로벌'],
    isActive: true,
  },
  {
    id: 'sample-004',
    source: 'bizinfo',
    title: '소상공인 온라인 판로개척 지원사업',
    description:
      '온라인 쇼핑몰 입점, SNS 마케팅, 라이브커머스 활성화를 통해 소상공인의 디지털 판로를 지원합니다. 플랫폼 입점비·광고비 일부를 보조합니다.',
    agency: '소상공인시장진흥공단',
    targetAudience: '소상공인, 예비창업자',
    startDate: '2026-04-05',
    endDate: '2026-06-30',
    url: 'https://www.bizinfo.go.kr',
    tags: ['판로개척', '온라인마케팅', '소상공인', '이커머스'],
    isActive: true,
  },
  {
    id: 'sample-005',
    source: 'kstartup',
    title: '청년창업사관학교 15기 모집 공고',
    description:
      '만 39세 이하 청년 예비·초기 창업자를 선발하여 전용 입주공간, 사업화 자금(최대 1억원), 창업 교육·멘토링을 패키지로 지원합니다.',
    agency: '중소벤처기업진흥공단',
    targetAudience: '만 39세 이하 예비창업자, 창업 3년 미만',
    startDate: '2026-04-07',
    endDate: '2026-04-21',
    url: 'https://www.k-startup.go.kr',
    tags: ['청년창업', '사관학교', '예비창업자', '교육'],
    isActive: true,
  },
]

function normalizeBizInfo(item) {
  // HTML 태그 제거
  const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').trim()

  const tags = item.hashtags
    ? item.hashtags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  // 신청기간 텍스트 파싱 (예: "예산 소진시까지", "2026-04-01 ~ 2026-04-30")
  const period = item.reqstBeginEndDe || ''
  const dateMatch = period.match(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/)
  const startDate = dateMatch ? dateMatch[1] : item.creatPnttm?.slice(0, 10) || ''
  const endDate = dateMatch ? dateMatch[2] : ''

  // 마감 여부: 종료일 없으면 모집중, 있으면 날짜 비교
  const isActive = endDate ? new Date(endDate) >= new Date() : true

  return {
    id: `bizinfo-${item.pblancId || Math.random()}`,
    source: 'bizinfo',
    title: item.pblancNm || '제목 없음',
    description: stripHtml(item.bsnsSumryCn),
    agency: item.jrsdInsttNm || item.excInsttNm || '',
    targetAudience: item.trgetNm || '',
    startDate,
    endDate,
    periodText: period, // 원본 신청기간 텍스트
    url: item.pblancUrl || 'https://www.bizinfo.go.kr',
    tags,
    isActive,
    category: item.pldirSportRealmLclasCodeNm || '',
  }
}

function normalizeKStartup(item) {
  // odcloud 창업소식 API 필드: 제목, 내용, 등록일자, 인터넷주소(URL) or URL, 순번
  const title = item['제목'] || item.title || '제목 없음'
  const desc = (item['내용'] || item.description || '').slice(0, 300)
  const url = item['인터넷주소(URL)'] || item['URL'] || 'https://www.k-startup.go.kr'
  const dateStr = item['등록일자'] || item.creatPnttm || ''

  return {
    id: `kstartup-${item['순번'] || Math.random()}`,
    source: 'kstartup',
    title,
    description: desc,
    agency: 'K-Startup 창업진흥원',
    targetAudience: '창업자',
    startDate: dateStr,
    endDate: '',
    periodText: dateStr ? `등록일: ${dateStr}` : '',
    url,
    tags: ['창업소식', 'K-Startup'],
    isActive: true,
  }
}

function normalizeMSS(item) {
  return {
    id: `mss-${item.pblancId || item.id || Math.random()}`,
    source: 'mss',
    title: item.pblancNm || item.title || '제목 없음',
    description: item.bsnsSumryCn || item.description || '',
    agency: item.jrsdInsttNm || item.organNm || '',
    targetAudience: item.trgetNm || '',
    startDate: item.reqstBeginDt || item.startDate || '',
    endDate: item.reqstEndDt || item.endDate || '',
    url: item.detailUrl || 'https://www.mss.go.kr',
    tags: item.hashtags
      ? item.hashtags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    isActive: item.pblancStts === '모집중' || item.isActive || false,
  }
}

export async function fetchBizInfo({ apiKey, pageIndex = 1, pageUnit = 30, hashtags = '' }) {
  const params = new URLSearchParams({ crtfcKey: apiKey, pageIndex, pageUnit })
  if (hashtags) params.append('hashtags', hashtags)

  const response = await axios.get(`/api/bizinfo?${params.toString()}`)
  const data = response.data

  // 응답: { jsonArray: [...] }
  const items = data?.jsonArray || (Array.isArray(data) ? data : [])
  return items.map(normalizeBizInfo)
}

export async function fetchKStartup({ apiKey, page = 1, perPage = 30 }) {
  const params = new URLSearchParams({ serviceKey: apiKey, page, perPage })

  const response = await axios.get(`/api/kstartup?${params.toString()}`)
  const data = response.data

  // odcloud 창업소식 응답: { data: [...], currentCount, totalCount }
  const items = data?.data || (Array.isArray(data) ? data : [])
  return items.map(normalizeKStartup)
}

export async function fetchMSS({ apiKey, pageNo = 1, numOfRows = 20 }) {
  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo,
    numOfRows,
  })

  const response = await axios.get(`/api/mss?${params.toString()}`)
  const data = response.data

  const items =
    data?.response?.body?.items?.item ||
    data?.items?.item ||
    data?.data ||
    (Array.isArray(data) ? data : [])

  return (Array.isArray(items) ? items : [items]).map(normalizeMSS)
}

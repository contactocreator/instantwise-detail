const INDUSTRY_KEYWORDS = {
  'IT/소프트웨어': ['IT', '소프트웨어', 'SW', '앱', '플랫폼', '웹', '모바일', '디지털', 'SaaS'],
  'AI/데이터': ['AI', '인공지능', '데이터', '머신러닝', '딥러닝', 'ML', 'DL', '빅데이터', '분석'],
  '제조업': ['제조', '생산', '공장', '소재', '부품', '장비', '스마트팩토리', '자동화'],
  '바이오/의료': ['바이오', '의료', '헬스케어', '제약', '의약', '생명공학', '디지털헬스'],
  '서비스업': ['서비스', '컨설팅', '솔루션', '플랫폼', '커머스'],
  '유통/물류': ['유통', '물류', '배송', '이커머스', '온라인쇼핑', '공급망'],
  '농업/식품': ['농업', '식품', '푸드테크', '농산물', '스마트팜', '바이오'],
  '문화/콘텐츠': ['콘텐츠', '미디어', '문화', '게임', '엔터테인먼트', 'K-콘텐츠', '영상'],
}

const SIZE_KEYWORDS = {
  '예비창업자': ['예비창업', '예비 창업', '창업 전'],
  '창업3년미만': ['창업 3년', '창업3년', '초기창업', '창업 초기', '창업 이내'],
  '스타트업': ['스타트업', 'startup', '벤처', '초기기업'],
  '소기업': ['소기업', '소상공인', '소규모'],
  '중기업': ['중소기업', '중기업', 'SME', '중소'],
  '중견기업': ['중견기업', '중견'],
}

const INTEREST_KEYWORDS = {
  '자금지원': ['자금', '융자', '대출', '보조금', '지원금', '투자'],
  '기술개발': ['기술개발', '기술지원', '특허', '기술이전'],
  'R&D': ['R&D', 'R&amp;D', '연구개발', '연구', '개발'],
  '수출지원': ['수출', '해외', '글로벌', 'KOTRA', '수출바우처'],
  '판로개척': ['판로', '마케팅', '유통', '온라인판로', '홍보', '전시회'],
  '인력지원': ['인력', '채용', '고용', '인재', '직원'],
  '교육/컨설팅': ['교육', '컨설팅', '멘토링', '코칭', '훈련'],
}

/**
 * 텍스트에 키워드가 포함되어 있는지 검사 (대소문자 무시)
 */
function containsKeyword(text, keyword) {
  if (!text || !keyword) return false
  return text.toLowerCase().includes(keyword.toLowerCase())
}

/**
 * 텍스트 배열 전체에서 키워드 검색
 */
function matchesAny(texts, keywords) {
  const combined = texts.filter(Boolean).join(' ')
  return keywords.some((kw) => containsKeyword(combined, kw))
}

/**
 * 공고와 기업 프로필의 관련도 점수 계산
 * @param {object} announcement - 정규화된 공고
 * @param {object} profile - 기업 프로필
 * @returns {{ score: number, reasons: string[] }}
 */
export function calculateMatchScore(announcement, profile) {
  if (!profile || !profile.companyName) {
    return { score: 0, reasons: [] }
  }

  let rawScore = 0
  const reasons = []

  const announcementTexts = [
    announcement.title,
    announcement.description,
    announcement.targetAudience,
    ...(announcement.tags || []),
  ]

  // 1. 업종 키워드 매칭 (+30점)
  if (profile.industry && INDUSTRY_KEYWORDS[profile.industry]) {
    const industryKws = INDUSTRY_KEYWORDS[profile.industry]
    if (matchesAny(announcementTexts, industryKws)) {
      rawScore += 30
      reasons.push(`업종 매칭 (${profile.industry})`)
    }
  }

  // 2. 지역 매칭 (+20점)
  if (profile.region) {
    const isNational = matchesAny(announcementTexts, ['전국', '전 지역', '지역 무관'])
    const isRegionMatch =
      profile.region === '전국' ||
      isNational ||
      matchesAny(announcementTexts, [profile.region])

    if (isRegionMatch) {
      rawScore += 20
      reasons.push(`지역 매칭 (${isNational ? '전국' : profile.region})`)
    }
  }

  // 3. 업력/기업규모 매칭 (+25점)
  if (profile.size && SIZE_KEYWORDS[profile.size]) {
    const sizeKws = SIZE_KEYWORDS[profile.size]
    if (matchesAny(announcementTexts, sizeKws)) {
      rawScore += 25
      reasons.push(`기업규모 매칭 (${profile.size})`)
    } else {
      // 업력으로 추가 체크
      if (profile.age !== undefined && profile.age !== '') {
        const age = Number(profile.age)
        if (age < 3 && matchesAny(announcementTexts, ['창업', '초기'])) {
          rawScore += 15
          reasons.push(`업력 매칭 (창업 ${age}년)`)
        }
      }
    }
  }

  // 4. 관심 키워드 매칭 (각 +5점, 최대 +20점)
  if (profile.keywords && profile.keywords.length > 0) {
    let kwScore = 0
    const matchedKws = []
    for (const kw of profile.keywords) {
      if (kwScore >= 20) break
      if (matchesAny(announcementTexts, [kw])) {
        kwScore += 5
        matchedKws.push(kw)
      }
    }
    if (kwScore > 0) {
      rawScore += kwScore
      reasons.push(`키워드 매칭: ${matchedKws.join(', ')}`)
    }
  }

  // 5. 관심 지원유형 매칭 (+5점)
  if (profile.interests && profile.interests.length > 0) {
    for (const interest of profile.interests) {
      const interestKws = INTEREST_KEYWORDS[interest] || [interest]
      if (matchesAny(announcementTexts, interestKws)) {
        rawScore += 5
        reasons.push(`지원유형 매칭 (${interest})`)
        break // 중복 방지를 위해 첫 번째 매칭만 카운트
      }
    }
  }

  // 0~100 정규화 (최대 가능 점수: 30+20+25+20+5 = 100)
  const score = Math.min(100, Math.max(0, rawScore))

  return { score, reasons }
}

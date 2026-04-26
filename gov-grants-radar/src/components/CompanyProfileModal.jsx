import { useState, useRef } from 'react'
import axios from 'axios'

const INDUSTRIES = [
  'IT/소프트웨어', 'AI/데이터', '제조업', '바이오/의료',
  '서비스업', '유통/물류', '농업/식품', '문화/콘텐츠', '기타',
]

const SIZES = ['예비창업자', '창업3년미만', '스타트업', '소기업', '중기업']

const REGIONS = [
  '서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종',
  '전북', '전남', '광주', '경북', '경남', '대구', '울산', '부산', '제주', '전국',
]

const INTEREST_OPTIONS = [
  '자금지원', '기술개발', 'R&D', '수출지원', '판로개척', '인력지원', '교육/컨설팅',
]

export default function CompanyProfileModal({ profile, onSave, onClose, anthropicKey }) {
  const [form, setForm] = useState({
    companyName: profile?.companyName || '',
    industry: profile?.industry || '',
    age: profile?.age ?? '',
    size: profile?.size || '',
    region: profile?.region || '',
    keywords: profile?.keywords || [],
    interests: profile?.interests || [],
  })
  const [keywordInput, setKeywordInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')
  const [analyzeSummary, setAnalyzeSummary] = useState('')
  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAnalyzing(true)
    setAnalyzeError('')
    setAnalyzeSummary('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/analyze-doc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-anthropic-key': anthropicKey || '',
        },
        timeout: 60000,
      })

      const { profile: extracted, summary } = response.data
      if (extracted) {
        setForm((prev) => ({
          companyName: extracted.companyName || prev.companyName,
          industry: extracted.industry || prev.industry,
          age: extracted.age != null ? extracted.age : prev.age,
          size: extracted.size || prev.size,
          region: extracted.region || prev.region,
          keywords: extracted.keywords?.length ? extracted.keywords : prev.keywords,
          interests: extracted.interests?.length ? extracted.interests : prev.interests,
        }))
        if (extracted.summary) setAnalyzeSummary(extracted.summary)
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message
      setAnalyzeError(msg)
    } finally {
      setAnalyzing(false)
      // 같은 파일 재업로드 허용
      e.target.value = ''
    }
  }

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const addKeyword = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault()
      const kw = keywordInput.trim()
      if (!form.keywords.includes(kw)) {
        update('keywords', [...form.keywords, kw])
      }
      setKeywordInput('')
    }
  }

  const removeKeyword = (kw) => {
    update('keywords', form.keywords.filter((k) => k !== kw))
  }

  const toggleInterest = (interest) => {
    if (form.interests.includes(interest)) {
      update('interests', form.interests.filter((i) => i !== interest))
    } else {
      update('interests', [...form.interests, interest])
    }
  }

  const handleSave = () => {
    onSave({ ...form, age: form.age === '' ? '' : Number(form.age) })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>기업 프로필 설정</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* 문서 업로드 분석 */}
        <div style={uploadStyles.uploadBox}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button
            style={uploadStyles.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={analyzing}
          >
            {analyzing ? '⏳ AI 분석 중...' : '📄 사업계획서 / IR 피치덱 업로드'}
          </button>
          <div style={uploadStyles.uploadHint}>
            PDF, PPT, DOCX 지원 · AI가 자동으로 기업 정보를 채워줍니다
            {!anthropicKey && ' · API 설정에서 Anthropic 키를 먼저 입력하세요'}
          </div>
          {analyzeError && <div style={uploadStyles.error}>⚠ {analyzeError}</div>}
          {analyzeSummary && (
            <div style={uploadStyles.summary}>
              <strong>분석 요약:</strong> {analyzeSummary}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>기업명</label>
          <input
            type="text"
            placeholder="예: (주)테크스타트"
            value={form.companyName}
            onChange={(e) => update('companyName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>업종</label>
          <select value={form.industry} onChange={(e) => update('industry', e.target.value)}>
            <option value="">선택하세요</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>업력 (년)</label>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="0"
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>기업규모</label>
            <select value={form.size} onChange={(e) => update('size', e.target.value)}>
              <option value="">선택하세요</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label>지역</label>
          <select value={form.region} onChange={(e) => update('region', e.target.value)}>
            <option value="">선택하세요</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>관심 키워드 (엔터로 추가)</label>
          <div className="tag-input-area" onClick={(e) => e.currentTarget.querySelector('input').focus()}>
            {form.keywords.map((kw) => (
              <span key={kw} className="tag-chip">
                {kw}
                <button type="button" onClick={() => removeKeyword(kw)}>×</button>
              </span>
            ))}
            <input
              type="text"
              placeholder="예: AI, 수출, R&D..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={addKeyword}
            />
          </div>
        </div>

        <div className="form-group">
          <label>관심 지원유형</label>
          <div className="checkbox-group">
            {INTEREST_OPTIONS.map((interest) => (
              <label key={interest} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={form.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                />
                {interest}
              </label>
            ))}
          </div>
        </div>

        <div className="form-footer">
          <button className="btn-ghost" onClick={onClose}>취소</button>
          <button className="btn-primary" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  )
}

const uploadStyles = {
  uploadBox: {
    border: '1.5px dashed #3d4266',
    borderRadius: 10,
    padding: '14px 16px',
    marginBottom: 20,
    background: 'rgba(99,102,241,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  uploadBtn: {
    background: 'rgba(99,102,241,0.15)',
    color: '#818cf8',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 8,
    padding: '9px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s',
    textAlign: 'left',
  },
  uploadHint: {
    fontSize: 11,
    color: '#4a5568',
    lineHeight: 1.5,
  },
  error: {
    fontSize: 12,
    color: '#f87171',
    background: 'rgba(239,68,68,0.08)',
    borderRadius: 6,
    padding: '6px 10px',
  },
  summary: {
    fontSize: 12,
    color: '#a5b4fc',
    background: 'rgba(99,102,241,0.08)',
    borderRadius: 6,
    padding: '8px 10px',
    lineHeight: 1.6,
  },
}

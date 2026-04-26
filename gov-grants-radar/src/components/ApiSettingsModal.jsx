import { useState } from 'react'

export default function ApiSettingsModal({ apiKeys, onSave, onClose }) {
  const [form, setForm] = useState({
    bizinfo: apiKeys?.bizinfo || '',
    datagokr: apiKeys?.datagokr || '',
    anthropic: apiKeys?.anthropic || '',
  })

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>API 키 설정</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={styles.notice}>
          API 키 없이도 샘플 데이터로 앱을 이용할 수 있어요. API 키를 등록하면 실시간 공고를 가져옵니다.
        </div>

        {/* 비즈인포 */}
        <div className="form-group">
          <label style={styles.labelRow}>
            <span>비즈인포 API 키</span>
            <a
              href="https://www.bizinfo.go.kr/apiList.do"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.labelLink}
            >
              발급받기 →
            </a>
          </label>
          <input
            type="text"
            placeholder="bizinfo.go.kr에서 발급한 인증키를 입력하세요"
            value={form.bizinfo}
            onChange={(e) => update('bizinfo', e.target.value)}
            spellCheck={false}
          />
          <div style={styles.hint}>비즈인포 정부지원사업 공고에 사용됩니다</div>
        </div>

        {/* odcloud (K-Startup) */}
        <div className="form-group">
          <label style={styles.labelRow}>
            <span>K-Startup (odcloud) API 키</span>
            <a
              href="https://www.data.go.kr/data/15122759/fileData.do"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.labelLink}
            >
              발급받기 →
            </a>
          </label>
          <input
            type="text"
            placeholder="개발계정 상세보기 > 일반 인증키를 입력하세요"
            value={form.datagokr}
            onChange={(e) => update('datagokr', e.target.value)}
            spellCheck={false}
          />
          <div style={styles.hint}>K-Startup 창업소식 공고에 사용됩니다 (api.odcloud.kr)</div>
        </div>

        {/* Anthropic API 키 */}
        <div className="form-group">
          <label style={styles.labelRow}>
            <span>Anthropic API 키 (AI 문서 분석)</span>
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.labelLink}
            >
              발급받기 →
            </a>
          </label>
          <input
            type="password"
            placeholder="sk-ant-... (사업계획서/IR피치덱 자동 분석에 사용)"
            value={form.anthropic}
            onChange={(e) => update('anthropic', e.target.value)}
            spellCheck={false}
          />
          <div style={styles.hint}>기업 프로필 자동 추출에 사용됩니다 (선택)</div>
        </div>

        <div style={styles.apiList}>
          <div style={styles.apiListTitle}>API 발급 경로</div>
          <ul style={styles.apiListItems}>
            <li>비즈인포: bizinfo.go.kr → 로그인 → API 신청</li>
            <li>K-Startup: data.go.kr → 중소벤처기업부_K STARTUP 창업소식 → 활용신청 → 개발계정 상세보기 → 일반 인증키</li>
          </ul>
        </div>

        <div className="form-footer">
          <button className="btn-ghost" onClick={onClose}>취소</button>
          <button className="btn-primary" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  notice: {
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: '#818cf8',
    marginBottom: 20,
    lineHeight: 1.5,
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelLink: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: 500,
  },
  hint: {
    marginTop: 4,
    fontSize: 11,
    color: '#4a5568',
  },
  apiList: {
    background: '#232636',
    border: '1px solid #2d3148',
    borderRadius: 8,
    padding: '12px 14px',
    marginTop: 8,
    marginBottom: 4,
  },
  apiListTitle: {
    fontSize: 12,
    color: '#8892a4',
    fontWeight: 600,
    marginBottom: 6,
  },
  apiListItems: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 12,
    color: '#8892a4',
  },
}

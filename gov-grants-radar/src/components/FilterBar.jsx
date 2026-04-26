const SOURCES = [
  { value: 'all', label: '전체' },
  { value: 'bizinfo', label: '비즈인포' },
  { value: 'kstartup', label: 'K-Startup' },
  { value: 'mss', label: '중기부' },
]

export default function FilterBar({ filter, onChange, totalCount }) {
  const update = (key, value) => onChange({ ...filter, [key]: value })

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        {/* 소스 탭 */}
        <div style={styles.tabs}>
          {SOURCES.map((s) => (
            <button
              key={s.value}
              onClick={() => update('source', s.value)}
              style={{
                ...styles.tab,
                ...(filter.source === s.value ? styles.tabActive : {}),
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={styles.controls}>
          {/* 모집중 체크박스 */}
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filter.activeOnly}
              onChange={(e) => update('activeOnly', e.target.checked)}
              style={styles.checkbox}
            />
            모집중만 보기
          </label>

          {/* 관련도 슬라이더 */}
          <div style={styles.sliderGroup}>
            <span style={styles.sliderLabel}>관련도 {filter.minScore}점 이상</span>
            <input
              type="range"
              min={0}
              max={80}
              step={5}
              value={filter.minScore}
              onChange={(e) => update('minScore', Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          {/* 검색 */}
          <input
            type="text"
            placeholder="공고 검색..."
            value={filter.search}
            onChange={(e) => update('search', e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* 결과 수 */}
      <div style={styles.resultCount}>
        총 <strong>{totalCount}</strong>개 공고
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: '#12151f',
    borderBottom: '1px solid #2d3148',
    padding: '0 20px',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '12px 0',
    flexWrap: 'wrap',
  },
  tabs: {
    display: 'flex',
    gap: 2,
    background: '#1a1d27',
    padding: 3,
    borderRadius: 8,
    border: '1px solid #2d3148',
  },
  tab: {
    background: 'transparent',
    color: '#8892a4',
    padding: '5px 14px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  tabActive: {
    background: '#6366f1',
    color: '#fff',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    flexWrap: 'wrap',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#8892a4',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  checkbox: {
    accentColor: '#6366f1',
    width: 14,
    height: 14,
  },
  sliderGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#8892a4',
    minWidth: 100,
  },
  slider: {
    accentColor: '#6366f1',
    width: 100,
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    padding: 0,
  },
  searchInput: {
    maxWidth: 220,
    padding: '6px 12px',
    fontSize: 13,
    background: '#1a1d27',
    border: '1px solid #2d3148',
    borderRadius: 6,
    color: '#e2e8f0',
    outline: 'none',
    flex: '0 0 auto',
  },
  resultCount: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '6px 0 10px',
    fontSize: 12,
    color: '#8892a4',
  },
}

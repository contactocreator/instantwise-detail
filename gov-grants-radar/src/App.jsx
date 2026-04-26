import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import AnnouncementCard from './components/AnnouncementCard'
import CompanyProfileModal from './components/CompanyProfileModal'
import ApiSettingsModal from './components/ApiSettingsModal'
import { fetchBizInfo, fetchKStartup, fetchMSS, SAMPLE_ANNOUNCEMENTS } from './utils/api'
import { calculateMatchScore } from './utils/matcher'

const LS_PROFILE = 'gov_radar_profile'
const LS_APIKEYS = 'gov_radar_apikeys'

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const DEFAULT_FILTER = {
  source: 'all',
  activeOnly: false,
  minScore: 0,
  search: '',
}

export default function App() {
  const [companyProfile, setCompanyProfile] = useState(() => loadLS(LS_PROFILE, null))
  const [apiKeys, setApiKeys] = useState(() => loadLS(LS_APIKEYS, { bizinfo: '', datagokr: '' }))
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showApiModal, setShowApiModal] = useState(false)

  const hasApiKeys = Boolean(apiKeys.bizinfo || apiKeys.datagokr)

  // 점수 계산 후 공고 목록 설정
  const applyScores = useCallback(
    (items) => {
      return items.map((item) => {
        const { score, reasons } = calculateMatchScore(item, companyProfile)
        return { ...item, score, reasons }
      })
    },
    [companyProfile]
  )

  // 실제 API 호출
  const fetchAnnouncements = useCallback(async () => {
    if (!hasApiKeys) {
      setAnnouncements(applyScores(SAMPLE_ANNOUNCEMENTS))
      return
    }

    setLoading(true)
    setError(null)
    const results = []

    if (apiKeys.bizinfo) {
      try {
        const items = await fetchBizInfo({ apiKey: apiKeys.bizinfo, pageUnit: 30 })
        results.push(...items)
      } catch (e) {
        console.warn('[bizinfo] fetch failed:', e.message)
      }
    }

    if (apiKeys.datagokr) {
      try {
        const kItems = await fetchKStartup({ apiKey: apiKeys.datagokr, numOfRows: 30 })
        results.push(...kItems)
      } catch (e) {
        console.warn('[kstartup] fetch failed:', e.message)
      }

      try {
        const mItems = await fetchMSS({ apiKey: apiKeys.datagokr, numOfRows: 30 })
        results.push(...mItems)
      } catch (e) {
        console.warn('[mss] fetch failed:', e.message)
      }
    }

    if (results.length === 0) {
      // API 호출 실패 시 샘플 표시
      setAnnouncements(applyScores(SAMPLE_ANNOUNCEMENTS))
      setError('API 호출에 실패했습니다. 샘플 데이터를 표시합니다.')
    } else {
      setAnnouncements(applyScores(results))
    }

    setLoading(false)
  }, [apiKeys, applyScores, hasApiKeys])

  // 초기 로드 및 API 키 변경 시 fetch
  useEffect(() => {
    fetchAnnouncements()
  }, [apiKeys]) // eslint-disable-line react-hooks/exhaustive-deps

  // 프로필 변경 시 점수 재계산
  useEffect(() => {
    setAnnouncements((prev) =>
      prev.map((item) => {
        const { score, reasons } = calculateMatchScore(item, companyProfile)
        return { ...item, score, reasons }
      })
    )
  }, [companyProfile])

  const handleSaveProfile = (profile) => {
    setCompanyProfile(profile)
    localStorage.setItem(LS_PROFILE, JSON.stringify(profile))
  }

  const handleSaveApiKeys = (keys) => {
    localStorage.setItem(LS_APIKEYS, JSON.stringify(keys))
    setApiKeys(keys)
  }

  // 필터 적용
  const filtered = announcements
    .filter((a) => {
      if (filter.source !== 'all' && a.source !== filter.source) return false
      if (filter.activeOnly && !a.isActive) return false
      if ((a.score || 0) < filter.minScore) return false
      if (filter.search) {
        const q = filter.search.toLowerCase()
        const haystack = [a.title, a.description, a.agency, a.targetAudience, ...(a.tags || [])]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0))

  return (
    <div style={appStyles.root}>
      <Header
        hasApiKeys={hasApiKeys}
        loading={loading}
        onRefresh={fetchAnnouncements}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenApiSettings={() => setShowApiModal(true)}
      />

      <FilterBar
        filter={filter}
        onChange={setFilter}
        totalCount={filtered.length}
      />

      <main style={appStyles.main}>
        <div style={appStyles.content}>
          {/* 에러 배너 */}
          {error && (
            <div style={appStyles.errorBanner}>
              <span>⚠ {error}</span>
              <button onClick={() => setError(null)} style={appStyles.errorClose}>×</button>
            </div>
          )}

          {/* 로딩 */}
          {loading && (
            <div style={appStyles.loadingState}>
              <div style={appStyles.spinner} />
              <span>공고를 불러오는 중...</span>
            </div>
          )}

          {/* 빈 상태 */}
          {!loading && filtered.length === 0 && (
            <div style={appStyles.emptyState}>
              <div style={appStyles.emptyIcon}>📭</div>
              <div style={appStyles.emptyTitle}>표시할 공고가 없어요</div>
              <div style={appStyles.emptySub}>필터 조건을 조정해보세요</div>
            </div>
          )}

          {/* 공고 그리드 */}
          {!loading && filtered.length > 0 && (
            <div style={appStyles.grid}>
              {filtered.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </div>
          )}

          {/* 샘플 데이터 안내 */}
          {!hasApiKeys && !loading && (
            <div style={appStyles.sampleNotice}>
              샘플 데이터를 표시 중입니다.{' '}
              <button
                onClick={() => setShowApiModal(true)}
                style={appStyles.sampleLink}
              >
                API 키를 설정
              </button>
              하면 실시간 공고를 확인할 수 있어요.
            </div>
          )}
        </div>
      </main>

      {showProfileModal && (
        <CompanyProfileModal
          profile={companyProfile}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
          anthropicKey={apiKeys.anthropic}
        />
      )}

      {showApiModal && (
        <ApiSettingsModal
          apiKeys={apiKeys}
          onSave={handleSaveApiKeys}
          onClose={() => setShowApiModal(false)}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const appStyles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0f1117',
  },
  main: {
    flex: 1,
    padding: '24px 20px',
  },
  content: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: 16,
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '80px 20px',
    color: '#8892a4',
    fontSize: 14,
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid #2d3148',
    borderTop: '3px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#e2e8f0',
  },
  emptySub: {
    fontSize: 13,
    color: '#8892a4',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 16,
    fontSize: 13,
    color: '#ef4444',
  },
  errorClose: {
    background: 'transparent',
    color: '#ef4444',
    fontSize: 16,
    padding: '0 4px',
  },
  sampleNotice: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 13,
    color: '#4a5568',
  },
  sampleLink: {
    background: 'transparent',
    color: '#6366f1',
    fontSize: 13,
    textDecoration: 'underline',
  },
}

export default function Header({
  hasApiKeys,
  loading,
  onRefresh,
  onOpenProfile,
  onOpenApiSettings,
}) {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>📡</span>
          </div>
          <div>
            <div style={styles.appName}>공고 레이더</div>
            <div style={styles.appSub}>정부지원 사업공고 모니터링</div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            className="btn-ghost"
            onClick={onOpenProfile}
            style={styles.actionBtn}
          >
            기업 프로필
          </button>
          <button
            className="btn-ghost"
            onClick={onOpenApiSettings}
            style={styles.actionBtn}
          >
            API 설정
          </button>
          <button
            className="btn-icon"
            onClick={onRefresh}
            disabled={loading}
            title="새로고침"
            style={{ ...styles.actionBtn, opacity: loading ? 0.5 : 1 }}
          >
            <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none' }}>
              ↻
            </span>
          </button>
        </div>
      </div>

      {!hasApiKeys && (
        <div style={styles.banner}>
          <span style={styles.bannerIcon}>⚠</span>
          API 키를 설정하면 실시간 공고를 가져올 수 있어요.{' '}
          <button
            onClick={onOpenApiSettings}
            style={styles.bannerLink}
          >
            지금 설정하기
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </header>
  )
}

const styles = {
  header: {
    background: '#12151f',
    borderBottom: '1px solid #2d3148',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 20px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 36,
    height: 36,
    background: 'rgba(99,102,241,0.15)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 18,
  },
  appName: {
    fontWeight: 700,
    fontSize: 16,
    color: '#e2e8f0',
    lineHeight: 1.2,
  },
  appSub: {
    fontSize: 11,
    color: '#8892a4',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    fontSize: 13,
  },
  banner: {
    background: 'rgba(245, 158, 11, 0.1)',
    borderTop: '1px solid rgba(245, 158, 11, 0.2)',
    color: '#f59e0b',
    fontSize: 13,
    padding: '8px 20px',
    textAlign: 'center',
  },
  bannerIcon: {
    marginRight: 6,
  },
  bannerLink: {
    background: 'transparent',
    color: '#f59e0b',
    textDecoration: 'underline',
    fontWeight: 600,
    fontSize: 13,
  },
}

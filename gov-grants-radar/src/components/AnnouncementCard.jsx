const SOURCE_META = {
  bizinfo: { label: '비즈인포', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  kstartup: { label: 'K-Startup', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  mss: { label: '중기부', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
}

function getScoreStyle(score) {
  if (score >= 80) return { bar: '#10b981', text: '#10b981' }
  if (score >= 50) return { bar: '#f59e0b', text: '#f59e0b' }
  return { bar: '#4a5568', text: '#8892a4' }
}

function getDaysLeft(endDate) {
  if (!endDate) return null
  const end = new Date(endDate.replace(/\./g, '-'))
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  return diff
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return dateStr.replace(/-/g, '.')
}

export default function AnnouncementCard({ announcement }) {
  const { title, source, agency, targetAudience, startDate, endDate, periodText, url, tags, isActive, score, reasons } =
    announcement

  const sourceMeta = SOURCE_META[source] || SOURCE_META.bizinfo
  const scoreStyle = getScoreStyle(score || 0)
  const daysLeft = getDaysLeft(endDate)
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7

  return (
    <div style={styles.card}>
      {/* 헤더 행 */}
      <div style={styles.cardHeader}>
        <div style={styles.badges}>
          <span style={{ ...styles.sourceBadge, color: sourceMeta.color, background: sourceMeta.bg }}>
            {sourceMeta.label}
          </span>
          {isActive && (
            <span style={styles.activeBadge}>모집중</span>
          )}
          {isUrgent && (
            <span style={styles.urgentBadge}>마감 {daysLeft}일 전</span>
          )}
        </div>

        {score !== undefined && score > 0 && (
          <div style={styles.scoreContainer}>
            <span style={{ ...styles.scoreText, color: scoreStyle.text }}>
              {score}점
            </span>
          </div>
        )}
      </div>

      {/* 제목 */}
      <h3 style={styles.title}>{title}</h3>

      {/* 기관 / 대상 */}
      <div style={styles.meta}>
        {agency && (
          <span style={styles.metaItem}>
            <span style={styles.metaIcon}>🏛</span>
            {agency}
          </span>
        )}
        {targetAudience && (
          <span style={styles.metaItem}>
            <span style={styles.metaIcon}>👥</span>
            {targetAudience}
          </span>
        )}
      </div>

      {/* 관련도 점수 바 */}
      {score !== undefined && (
        <div style={styles.scoreBarContainer}>
          <div style={styles.scoreBarTrack}>
            <div
              style={{
                ...styles.scoreBarFill,
                width: `${score}%`,
                background: scoreStyle.bar,
              }}
            />
          </div>
        </div>
      )}

      {/* 매칭 이유 태그 */}
      {reasons && reasons.length > 0 && (
        <div style={styles.reasons}>
          {reasons.map((r, i) => (
            <span key={i} style={styles.reasonTag}>
              {r}
            </span>
          ))}
        </div>
      )}

      {/* 태그 */}
      {tags && tags.length > 0 && (
        <div style={styles.tags}>
          {tags.slice(0, 5).map((tag, i) => (
            <span key={i} style={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 하단 */}
      <div style={styles.cardFooter}>
        <div style={styles.period}>
          <span style={styles.periodIcon}>📅</span>
          <span style={styles.periodText}>
            {periodText
              ? periodText
              : startDate
              ? `${formatDate(startDate)}${endDate ? ` ~ ${formatDate(endDate)}` : ''}`
              : '기간 미정'}
          </span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.viewLink}
        >
          공고 보기 →
        </a>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#1a1d27',
    border: '1px solid #2d3148',
    borderRadius: 12,
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    transition: 'border-color 0.15s, transform 0.15s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  badges: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  sourceBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 4,
    letterSpacing: '0.02em',
  },
  activeBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 4,
    background: 'rgba(16,185,129,0.12)',
    color: '#10b981',
  },
  urgentBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 4,
    background: 'rgba(239,68,68,0.12)',
    color: '#ef4444',
  },
  scoreContainer: {
    flexShrink: 0,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: 700,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: '#e2e8f0',
    lineHeight: 1.4,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: '#8892a4',
  },
  metaIcon: {
    fontSize: 12,
  },
  scoreBarContainer: {
    marginTop: 2,
  },
  scoreBarTrack: {
    height: 3,
    background: '#2d3148',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
  reasons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  },
  reasonTag: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 4,
    background: 'rgba(99,102,241,0.12)',
    color: '#818cf8',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    fontSize: 11,
    color: '#4a5568',
    background: '#232636',
    padding: '2px 6px',
    borderRadius: 4,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 10,
    borderTop: '1px solid #2d3148',
  },
  period: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  periodIcon: {
    fontSize: 12,
  },
  periodText: {
    fontSize: 12,
    color: '#8892a4',
  },
  viewLink: {
    fontSize: 12,
    fontWeight: 600,
    color: '#6366f1',
    padding: '5px 12px',
    background: 'rgba(99,102,241,0.1)',
    borderRadius: 6,
    textDecoration: 'none',
    transition: 'background 0.15s',
  },
}

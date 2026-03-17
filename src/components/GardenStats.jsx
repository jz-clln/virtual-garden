// ============================================================
//  GardenStats — beautiful stats card panel
// ============================================================
import { useMemo } from 'react'
import { USERS } from '../utils/auth.js'
import styles from './GardenStats.module.css'

function StatItem({ label, value, sub, color }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue} style={color ? { color } : {}}>
        {value}
      </span>
      <span className={styles.statLabel}>{label}</span>
      {sub && <span className={styles.statSub}>{sub}</span>}
    </div>
  )
}

export default function GardenStats({ flowers, open, onClose }) {
  const stats = useMemo(() => {
    const real = flowers.filter(f => !f.isLoveLetter)
    const bloomed = real.filter(f => f.bloomed)
    const byJabez   = real.filter(f => f.plantedBy === 'DesilynBrillante')
    const byDesilyn = real.filter(f => f.plantedBy === 'JabezCollano')

    // Most used mood
    const moodCount = {}
    real.forEach(f => {
      if (f.mood?.label) moodCount[f.mood.label] = (moodCount[f.mood.label] ?? 0) + 1
    })
    const topMood = Object.entries(moodCount).sort((a,b) => b[1]-a[1])[0]?.[0] ?? '—'

    // First flower date
    const sorted = [...real].sort((a,b) => (a.plantedAt??0) - (b.plantedAt??0))
    const firstDate = sorted[0]?.plantedAt
      ? new Date(sorted[0].plantedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '—'

    // Days since first flower
    const daysSince = sorted[0]?.plantedAt
      ? Math.floor((Date.now() - sorted[0].plantedAt) / 86400000)
      : 0

    // Most recent
    const lastDate = sorted[sorted.length - 1]?.plantedAt
      ? new Date(sorted[sorted.length - 1].plantedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '—'

    return {
      total: real.length,
      bloomed: bloomed.length,
      growing: real.length - bloomed.length,
      byJabez: byJabez.length,
      byDesilyn: byDesilyn.length,
      topMood,
      firstDate,
      daysSince,
      lastDate,
    }
  }, [flowers])

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
      onClick={onClose}
    >
      <div
        className={`${styles.sheet} ${open ? styles.sheetOpen : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.handle} onClick={onClose} />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <h2 className={styles.title}>Garden Stats</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {stats.total === 0 ? (
            <div className={styles.empty}>
              <span>🌱</span>
              <p>No flowers planted yet — start your garden!</p>
            </div>
          ) : (
            <>
              {/* Main numbers */}
              <div className={styles.mainStats}>
                <StatItem label="Total Flowers" value={stats.total} />
                <StatItem label="Bloomed" value={stats.bloomed} color="var(--pink-soft)" />
                <StatItem label="Still Growing" value={stats.growing} color="var(--green-light)" />
              </div>

              <div className={styles.divider} />

              {/* Per-user */}
              <p className={styles.sectionLabel}>By gardener</p>
              <div className={styles.userStats}>
                <div className={styles.userStat}>
                  <div className={styles.userDot} style={{ background: USERS.JabezCollano.color }} />
                  <span className={styles.userName}>Jabez</span>
                  <span className={styles.userCount} style={{ color: USERS.JabezCollano.color }}>
                    {stats.byJabez} flower{stats.byJabez !== 1 ? 's' : ''}
                  </span>
                  {/* Bar */}
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: stats.total > 0 ? `${(stats.byJabez / stats.total) * 100}%` : '0%',
                        background: USERS.JabezCollano.color,
                      }}
                    />
                  </div>
                </div>
                <div className={styles.userStat}>
                  <div className={styles.userDot} style={{ background: USERS.JabezCollano.color }} />
                  <span className={styles.userName}>Desilyn</span>
                  <span className={styles.userCount} style={{ color: USERS.JabezCollano.color }}>
                    {stats.byDesilyn} flower{stats.byDesilyn !== 1 ? 's' : ''}
                  </span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: stats.total > 0 ? `${(stats.byDesilyn / stats.total) * 100}%` : '0%',
                        background: USERS.JabezCollano.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.divider} />

              {/* Details */}
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🌱</span>
                  <div>
                    <p className={styles.detailLabel}>First flower</p>
                    <p className={styles.detailValue}>{stats.firstDate}</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🌸</span>
                  <div>
                    <p className={styles.detailLabel}>Last planted</p>
                    <p className={styles.detailValue}>{stats.lastDate}</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>💚</span>
                  <div>
                    <p className={styles.detailLabel}>Days gardening</p>
                    <p className={styles.detailValue}>{stats.daysSince} day{stats.daysSince !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🎭</span>
                  <div>
                    <p className={styles.detailLabel}>Favourite mood</p>
                    <p className={styles.detailValue}>{stats.topMood}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
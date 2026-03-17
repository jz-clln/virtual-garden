// ============================================================
//  MusicPlayer — floating bottom-left music player
//  Plays 5 local MP3 tracks from /public/music/
//  Default volume: 0.35 (gentle, not too loud or soft)
//
//  FIX: Auto-plays on FIRST click/tap anywhere on the page.
//       No need to hold — any single tap triggers playback.
// ============================================================
import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './MusicPlayer.module.css'

// ── Track list — files must be in /public/music/ ──
const TRACKS = [
  { title: 'Beside You',     artist: 'Keshi',        src: '/music/Beside You.mp3'       },
  { title: 'Nothing',        artist: 'Bruno Major',  src: '/music/Nothing.mp3'           },
  { title: 'Rose',           artist: 'D.O',          src: '/music/Rose.mp3'              },
  { title: 'You Feel Like',  artist: 'Hojean',       src: '/music/You Feel Like.mp3'     },
  { title: 'Better With You',artist: 'Jeff Bernat',  src: '/music/Better With You.mp3'   },
]

const DEFAULT_VOLUME = 0.20

export default function MusicPlayer() {
  const audioRef    = useRef(null)
  const progressRef = useRef(null)
  // Use a ref to track playing state inside event listeners (avoids stale closure)
  const playingRef  = useRef(false)

  const [trackIdx,    setTrackIdx]    = useState(0)
  const [playing,     setPlaying]     = useState(false)
  const [progress,    setProgress]    = useState(0)
  const [duration,    setDuration]    = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume,      setVolume]      = useState(DEFAULT_VOLUME)
  const [expanded,    setExpanded]    = useState(false)

  // Keep ref in sync with state
  useEffect(() => { playingRef.current = playing }, [playing])

  const track = TRACKS[trackIdx]

  // Music only plays when the user clicks the play button — no auto-play

  /* ── Load new track when trackIdx changes ── */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src    = track.src
    audio.volume = DEFAULT_VOLUME
    audio.load()
    // Only auto-play next track if already playing
    if (playingRef.current) {
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx])

  /* ── Progress / duration / ended listeners ── */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
    }
    const onLoaded = () => setDuration(audio.duration || 0)
    const onEnded  = () => {
      const next = (trackIdx + 1) % TRACKS.length
      setTrackIdx(next)
      // playingRef stays true so the trackIdx useEffect auto-plays next
    }

    audio.addEventListener('timeupdate',     onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended',          onEnded)
    return () => {
      audio.removeEventListener('timeupdate',     onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended',          onEnded)
    }
  }, [trackIdx])

  /* ── Toggle play / pause ── */
  const togglePlay = useCallback((e) => {
    e.stopPropagation()   // don't plant a flower when tapping the player
    const audio = audioRef.current
    if (!audio) return
    if (playingRef.current) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => {})
    }
  }, [])

  /* ── Next / prev ── */
  const nextTrack = useCallback((e) => {
    e?.stopPropagation()
    playingRef.current = true   // ensure next track auto-plays
    setPlaying(true)
    setTrackIdx(i => (i + 1) % TRACKS.length)
  }, [])

  const prevTrack = useCallback((e) => {
    e?.stopPropagation()
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
    } else {
      playingRef.current = true
      setPlaying(true)
      setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length)
    }
  }, [])

  /* ── Volume ── */
  const handleVolume = useCallback((e) => {
    e.stopPropagation()
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  /* ── Progress seek ── */
  const handleProgressClick = useCallback((e) => {
    e.stopPropagation()
    const rect = progressRef.current?.getBoundingClientRect()
    if (!rect || !audioRef.current || !duration) return
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = ratio * duration
    setProgress(ratio)
  }, [duration])

  /* ── Format seconds → m:ss ── */
  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m   = Math.floor(s / 60)
    const sec = Math.floor(s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return (
    <>
      <audio ref={audioRef} preload="auto" />

      {/* Stop propagation on the whole player so clicks don't plant flowers */}
      <div
        className={`${styles.player} ${expanded ? styles.expanded : ''}`}
        onClick={e => e.stopPropagation()}
        onTouchEnd={e => e.stopPropagation()}
      >
        {/* ── Mini row ── */}
        <div className={styles.miniRow}>

          {/* Spinning art */}
          <div className={styles.artWrap} onClick={togglePlay}>
            <div className={`${styles.art} ${playing ? styles.artSpinning : ''}`}>🌸</div>
            {playing && (
              <div className={styles.bars} aria-hidden>
                {[1,2,3,4].map(i => (
                  <span key={i} className={styles.bar} style={{ animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            )}
          </div>

          {/* Track info — tap to expand */}
          <div className={styles.info} onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}>
            <p className={styles.trackTitle}>{track.title}</p>
            <p className={styles.trackArtist}>{track.artist}</p>
          </div>

          {/* Play/pause */}
          <button className={styles.playBtn} onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? '⏸' : '▶'}
          </button>

          {/* Expand */}
          <button
            className={styles.expandBtn}
            onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
            aria-label="Expand player"
          >
            {expanded ? '▾' : '▴'}
          </button>
        </div>

        {/* ── Expanded controls ── */}
        {expanded && (
          <div className={styles.expandedSection}>

            {/* Progress */}
            <div className={styles.progressWrap}>
              <span className={styles.time}>{fmt(currentTime)}</span>
              <div className={styles.progressBar} ref={progressRef} onClick={handleProgressClick}>
                <div className={styles.progressFill} style={{ width: `${progress * 100}%` }}>
                  <div className={styles.progressThumb} />
                </div>
              </div>
              <span className={styles.time}>{fmt(duration)}</span>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
              <button className={styles.ctrlBtn} onClick={prevTrack} aria-label="Previous">⏮</button>
              <button className={`${styles.ctrlBtn} ${styles.ctrlBtnMain}`} onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? '⏸' : '▶'}
              </button>
              <button className={styles.ctrlBtn} onClick={nextTrack} aria-label="Next">⏭</button>
            </div>

            {/* Volume */}
            <div className={styles.volumeRow}>
              <span className={styles.volIcon}>🔈</span>
              <input
                type="range" min="0" max="1" step="0.02"
                value={volume}
                onChange={handleVolume}
                className={styles.volumeSlider}
                aria-label="Volume"
              />
              <span className={styles.volIcon}>🔊</span>
            </div>

            {/* Track list */}
            <div className={styles.trackList}>
              {TRACKS.map((t, i) => (
                <div
                  key={i}
                  className={`${styles.trackItem} ${i === trackIdx ? styles.trackActive : ''}`}
                  onClick={e => { e.stopPropagation(); playingRef.current = true; setPlaying(true); setTrackIdx(i) }}
                >
                  <span className={styles.trackNum}>{i === trackIdx && playing ? '♪' : i + 1}</span>
                  <span className={styles.trackName}>{t.title}</span>
                  <span className={styles.trackArtistSmall}>{t.artist}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
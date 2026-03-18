// ============================================================
//  LetterComposer — write a letter + optional photo attachment
// ============================================================
import { useState, useRef } from 'react'
import { FLOWER_SPRITES } from '../utils/constants.js'
import styles from './LetterComposer.module.css'

const MOODS = [
  { id: 'happy',    label: '😊 Happy',           color: '#f5c842' },
  { id: 'loving',   label: '❤️ Loving You',       color: '#e87fa0' },
  { id: 'missing',  label: '💜 Missing You',      color: '#b39ddb' },
  { id: 'sad',      label: '😔 Sad',              color: '#7ecbf5' },
  { id: 'grateful', label: '🙏 Grateful',         color: '#7ab648' },
  { id: 'thinking', label: '💭 Thinking of You',  color: '#c9a0dc' },
  { id: 'proud',    label: '🌟 Proud of You',     color: '#ffd700' },
  { id: 'sorry',    label: '☹️ Sorry',            color: '#f0a896' },
]

export default function LetterComposer({ currentUser, onReady, onCancel }) {
  const [step,         setStep]         = useState(1)
  const [title,        setTitle]        = useState('')
  const [body,         setBody]         = useState('')
  const [mood,         setMood]         = useState(null)
  const [sprite,       setSprite]       = useState(null)
  const [photoDataUrl, setPhotoDataUrl] = useState(null)
  const [error,        setError]        = useState('')
  const fileRef = useRef(null)

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoDataUrl(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleNext = () => {
    if (!title.trim())  { setError('Please give your letter a title.'); return }
    if (!body.trim())   { setError('Please write something in your letter.'); return }
    if (!mood)          { setError('Please pick a mood for your flower.'); return }
    if (!sprite)        { setError('Please choose a flower sprite.'); return }
    setError(''); setStep(2)
  }

  return step === 2 ? (
    <PickSpotOverlay sprite={sprite} onPickSpot={(x,y) => onReady({ title, body, mood, sprite, photoDataUrl, x, y })} onBack={() => setStep(1)} />
  ) : (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.fromBadge}>From {currentUser.displayName} 💚</span>
          <button className={styles.cancelBtn} onClick={onCancel} aria-label="Cancel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Letter Title</label>
            <input type="text" className={styles.input} placeholder="e.g. Just thinking of you..."
              value={title} onChange={e => { setTitle(e.target.value); setError('') }} maxLength={60} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mood</label>
            <div className={styles.moodRow}>
              {MOODS.map(m => (
                <button key={m.id}
                  className={`${styles.moodBtn} ${mood?.id === m.id ? styles.moodActive : ''}`}
                  style={mood?.id === m.id ? { borderColor: m.color, background: m.color + '22' } : {}}
                  onClick={() => { setMood(m); setError('') }}
                >{m.label}</button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Choose your flower</label>
            <div className={styles.spriteRow}>
              {FLOWER_SPRITES.map((s, i) => (
                <button key={i}
                  className={`${styles.spriteBtn} ${sprite?.file === s.file ? styles.spriteActive : ''}`}
                  onClick={() => { setSprite(s); setError('') }} title={s.name}
                >
                  <img src={s.file} alt={s.name} className={styles.spriteImg} draggable={false} />
                  <span className={styles.spriteName}>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Your Letter</label>
            <textarea className={styles.textarea} placeholder="Write your letter here..."
              value={body} onChange={e => { setBody(e.target.value); setError('') }} rows={7} />
          </div>

          {/* Photo attachment */}
          <div className={styles.field}>
            <label className={styles.label}>Attach a Photo (optional)</label>
            <div className={styles.photoUploadArea} onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" className={styles.photoInput}
                onChange={handlePhotoChange} onClick={e => e.stopPropagation()} />
              {photoDataUrl ? (
                <div className={styles.photoPreviewWrap}>
                  <img src={photoDataUrl} alt="preview" className={styles.photoPreview} />
                  <button className={styles.photoRemoveBtn}
                    onClick={e => { e.stopPropagation(); setPhotoDataUrl(null) }}>✕</button>
                </div>
              ) : (
                <p className={styles.photoPlaceholder}>
                  📷 Click to attach a photo memory
                </p>
              )}
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button className={styles.cancelBtnBottom} onClick={onCancel}>Cancel</button>
            <button className={styles.nextBtn} onClick={handleNext}>Choose planting spot 🌱</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PickSpotOverlay({ onPickSpot, onBack, sprite }) {
  return (
    <div className={styles.pickOverlay} onClick={e => { e.stopPropagation(); onPickSpot(e.clientX, e.clientY) }}>
      <div className={styles.pickCard} onClick={e => e.stopPropagation()}>
        <img src={sprite.file} alt={sprite.name} className={styles.pickSprite} draggable={false} />
        <p className={styles.pickTitle}>Where should this flower grow?</p>
        <p className={styles.pickSub}>Click anywhere on the garden to plant it 🌱</p>
        <button className={styles.cancelBtnBottom} onClick={onBack}>← Go back</button>
      </div>
      <p className={styles.pickHint}>Click the garden to plant</p>
    </div>
  )
}
// ============================================================
//  GardenPage — main garden with all features wired
// ============================================================
import { useEffect, useState, useCallback } from 'react'
import { BACKGROUND_IMAGE } from '../utils/constants.js'
import { useGarden } from '../hooks/useGarden.js'
import { useParticles } from '../hooks/useParticles.js'
import { useToast } from '../hooks/useToast.js'
import { useDayNight } from '../hooks/useDayNight.js'

import Header from '../components/Header.jsx'
import BottomBar from '../components/BottomBar.jsx'
import ButtonRow from '../components/ButtonRow.jsx'
import FlowerLayer from '../components/FlowerLayer.jsx'
import FlowerPopup from '../components/FlowerPopup.jsx'
import SpotifyPanel from '../components/SpotifyPanel.jsx'
import FallingPetals from '../components/FallingPetals.jsx'
import Toast from '../components/Toast.jsx'
import MusicPlayer from '../components/MusicPlayer.jsx'
import ClearConfirm from '../components/ClearConfirm.jsx'
import LetterComposer from './LetterComposer.jsx'
import GardenJournal from '../components/GardenJournal.jsx'
import GardenStats from '../components/GardenStats.jsx'

const JABEZ_LETTER_BODY = `Hi Wifey,

I made this little virtual garden for you because I know how much you love flowers. Hindi man ito totoong garden na pwede nating hawakan, but this is a small space where we can plant flowers together. Parang tayo rin, slowly growing, learning how to take care of something beautiful together.

You once told me that flowers make you happy, so I thought maybe this could be a place we can always come back to whenever we need a little peace. Every flower here will be something we planted together, a small reminder of the time and care we share with each other.

Alam ko hindi ako palaging magaling sa words. But one thing I'm sure of is that meeting you changed something in me. These past weeks with you feel different in a good way. Parang may bagong kulay yung mundo ko ever since you came into my life.

Thank you for everything, love. I appreciate all the little things you do, even the ones you think are small.

This garden is just a small thing I made, but it carries a big meaning for me. Just like flowers, I hope what we have continues to grow with care, patience, and love.

I love you so much, Desilyn.

— Jabez`;



export default function GardenPage({ currentUser, onLogout, onOpenLetter }) {
  const { canvasRef, spawnSparkles } = useParticles()
  const { flowers, flowerCount, plantLetter, addReaction, handleInteraction, clearGarden } = useGarden({ onSpawnSparkles: spawnSparkles })
  const { toast, showToast } = useToast()
  const theme = useDayNight()

  const [popup, setPopup] = useState(null)
  const [spotifyOpen, setSpotifyOpen] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [composing, setComposing] = useState(false)
  const [journalOpen, setJournalOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [loveLetter, setLoveLetter] = useState(null)

  // Apply theme to root element
  useEffect(() => {
    document.getElementById('root')?.setAttribute('data-theme', theme)
  }, [theme])

  const allFlowers = flowers

  const openPopup = useCallback((flower) => {
    if (!flower.bloomed && !flower.isLoveLetter) return
    setPopup(flower)
  }, [])

  const handleLetterReady = useCallback(({ title, body, mood, sprite, photoDataUrl, x, y }) => {
    setComposing(false)
    const result = plantLetter({ rawX: x, rawY: y, sprite, letterTitle: title, letterBody: body, mood, plantedBy: currentUser.username, userColor: currentUser.color, photoDataUrl, spawnSparkles })
    if (result && result !== 'full' && result !== 'close' && result !== 'busy')
      showToast(`🌱 A ${sprite.name} is growing for Desilyn!`)
    else if (result === 'full') showToast('🌿 Garden is full! Clear some flowers first.')
    else if (result === 'close') showToast('🌿 Too close to another flower — try a different spot.')
  }, [plantLetter, currentUser, spawnSparkles, showToast])

  const handleClear = useCallback(() => {
    if (flowers.length === 0) { showToast('Garden is already empty! 🌿'); return }
    setShowClearConfirm(true)
  }, [flowers.length, showToast])

  const confirmClear = useCallback(() => {
    setShowClearConfirm(false); clearGarden()
    showToast('🌿 Garden cleared — ready to bloom again!')
  }, [clearGarden, showToast])

  const handleReact = useCallback((flowerId, emoji) => {
    if (!currentUser) return
    addReaction(flowerId, emoji, currentUser.username)
    // Update popup to trigger re-render
    setPopup(prev => {
      if (!prev || prev.id !== flowerId) return prev
      return { ...prev }
    })
  }, [addReaction, currentUser])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (popup) setPopup(null)
        else if (composing) setComposing(false)
        else if (journalOpen) setJournalOpen(false)
        else if (statsOpen) setStatsOpen(false)
        else if (spotifyOpen) setSpotifyOpen(false)
        else if (showClearConfirm) setShowClearConfirm(false)
      }
      if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.metaKey) setSpotifyOpen(v => !v)
      if ((e.key === 'j' || e.key === 'J') && !e.ctrlKey && !e.metaKey) setJournalOpen(v => !v)
      if ((e.key === 'l' || e.key === 'L') && !e.ctrlKey && !e.metaKey) onOpenLetter()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [popup, composing, journalOpen, statsOpen, spotifyOpen, showClearConfirm, onOpenLetter])

  // Find up-to-date popup flower (reactions may have changed)
  const popupFlower = popup ? allFlowers.find(f => f.id === popup.id) ?? popup : null

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${BACKGROUND_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 35%, rgba(15,40,5,0.45) 100%)', pointerEvents: 'none' }} />
        {theme === 'night' && <div className="night-overlay" />}
        {theme === 'dusk' && <div className="dusk-overlay" />}
      </div>

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
      <FallingPetals />
      <FlowerLayer flowers={allFlowers} onFlowerClick={openPopup} />

      <Header currentUser={currentUser} onLogout={onLogout} theme={theme} />
      <ButtonRow
        spotifyOpen={spotifyOpen} onToggleSpotify={() => setSpotifyOpen(v => !v)}
        onClear={handleClear} showClearConfirm={showClearConfirm}
        onConfirmClear={confirmClear} onCancelClear={() => setShowClearConfirm(false)}
        onCompose={() => setComposing(true)}
        onOpenJournal={() => setJournalOpen(v => !v)} journalOpen={journalOpen}
        onOpenStats={() => setStatsOpen(v => !v)} statsOpen={statsOpen}
      />
      <BottomBar flowerCount={allFlowers.length} theme={theme} />
      <MusicPlayer />
      <SpotifyPanel open={spotifyOpen} onClose={() => setSpotifyOpen(false)} />

      <GardenJournal flowers={allFlowers} open={journalOpen} onClose={() => setJournalOpen(false)}
        onSelectFlower={f => { setJournalOpen(false); setPopup(f) }} />
      <GardenStats flowers={allFlowers} open={statsOpen} onClose={() => setStatsOpen(false)} />

      {composing && <LetterComposer currentUser={currentUser} onReady={handleLetterReady} onCancel={() => setComposing(false)} />}

      {popupFlower && (
        <FlowerPopup flower={popupFlower} currentUser={currentUser} onClose={() => setPopup(null)} onReact={handleReact} />
      )}

{showClearConfirm && <ClearConfirm count={allFlowers.length} onConfirm={confirmClear} onCancel={() => setShowClearConfirm(false)} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
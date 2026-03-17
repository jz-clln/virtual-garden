// ============================================================
//  CONSTANTS — Virtual Garden for Desilyn
// ============================================================

/** Flower sprite filenames. Put these in /public/images/ */
export const FLOWER_SPRITES = [
  { file: '/images/flower1.png', name: 'Sunshine Flower' },
  { file: '/images/flower2.png', name: 'Pink Bloom' },
  { file: '/images/flower3.png', name: 'Golden Blossom' },
  { file: '/images/flower4.png', name: 'Violet Bloom' },
  { file: '/images/flower5.png', name: 'Red Rose' },
]

/** Background image path — put in /public/images/ */
export const BACKGROUND_IMAGE = '/images/background.jpg'

/** Spotify playlist embed URL */
export const SPOTIFY_EMBED_URL =
  'https://open.spotify.com/embed/playlist/6swSxDDbhrgVmb1uvbBI5G?utm_source=generator&theme=0'

/** Garden planting rules */
export const GARDEN_CONFIG = {
  minDistance: 52,
  maxFlowers:  100,
  doubleTapGuard: 350,
  sizeMin: 58,
  sizeMax: 100,
}

/** Sway animation variants (CSS keyframe names match global.css) */
export const SWAY_VARIANTS = ['swayA', 'swayB', 'swayC']

// ============================================================
//  ✏️  PASTE YOUR OPENAI API KEY HERE
//  Get it from: https://platform.openai.com/api-keys
//  It starts with "sk-..."
// ============================================================
export const OPENAI_API_KEY = ""

/** OpenAI model — gpt-4o-mini is cheap and fast */
export const AI_MODEL = 'gpt-4o-mini'

/** OpenAI API endpoint */
export const AI_ENDPOINT = 'https://api.openai.com/v1/chat/completions'

/** Fallback messages if API is unavailable */
export const FALLBACK_MESSAGES = [
  'Every flower in this garden is a piece of my heart, planted just for you, Desilyn.',
  'You are the reason this garden blooms, Mi Amor — always and forever.',
  "I'd plant a thousand gardens just to see you smile, my love.",
  'In every petal, in every bloom — it\'s always you, Desilyn.',
  'My love for you is like this garden — it only grows, never fades.',
  'You are wildflower and wonder, all at once, Mi Amor.',
  'Keep blooming, no matter what season life brings — I\'ll be right here.',
]

/** Love letter content — paragraphs shown on the letter page */
export const LOVE_LETTER = {
  date: 'Forever & Always',
  salutation: 'My Dearest Desilyn,',
  paragraphs: [
    `Every morning I wake up beside you feels like the first page of a story I never want to end. You are the reason ordinary days feel like something sacred — the way you laugh, the way you see beauty in the smallest things, the way you've made a home in every corner of my heart.`,
    `I built this garden for you. Not because flowers can capture what I feel — nothing ever could — but because I wanted you to have a place that blooms as endlessly as my love for you does. Every flower here is a wish I've made on your behalf, a secret spoken softly to the universe: *let her be loved the way she deserves.*`,
    `You are my greatest adventure and my deepest peace. My partner, my best friend, my home. Being your husband is the highest honor of my life, and I would choose you — in every garden, in every lifetime — a thousand times over.`,
    `So come here whenever you need to feel it: the warmth of being cherished, the quiet certainty of being known. Plant flowers. Read the messages. Let the music play. This garden is yours, Mi Amor — just like I am.`,
  ],
  closing: 'All my love, always and completely,',
  signature: 'Jabez — Your Husband, Your Man 🌿',
}

/** Falling petal config */
export const PETAL_CONFIG = {
  count: 18,
  colors: [
    '#ffb7c5', '#ffd6e0', '#ffe4ec',
    '#fff0a0', '#b5e78a', '#e8d5ff',
    '#ffffff',
  ],
}
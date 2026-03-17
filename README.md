# 🌸 Virtual Garden — For Desilyn

A romantic pixel-art interactive flower garden built with **React + Vite**.
Plant flowers, read AI-generated love messages, listen to her Spotify playlist, and read a love letter from Jabez.

---

## 📁 Project Structure

```
virtual-garden/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── public/
│   └── images/
│       ├── background.jpg     ← your pixel-art background
│       ├── flower1.png        ← red rose
│       ├── flower2.png        ← golden blossom
│       ├── flower3.png        ← pink lily
│       ├── flower4.png        ← sunshine flower
│       └── flower5.png        ← violet bloom
└── src/
    ├── main.jsx               ← React entry point
    ├── App.jsx                ← root with page routing
    ├── styles/
    │   └── global.css         ← design tokens, resets, keyframes
    ├── utils/
    │   ├── constants.js       ← all config, Spotify URL, letter content
    │   ├── generateMessage.js ← Anthropic API call for AI messages
    │   └── gardenUtils.js     ← pure helpers (overlap, random, clamp)
    ├── hooks/
    │   ├── useGarden.js       ← flowers state, planting logic
    │   ├── useParticles.js    ← canvas sparkle particle system
    │   └── useToast.js        ← toast notification state
    ├── pages/
    │   ├── GardenPage.jsx          ← main garden view
    │   ├── LoveLetterPage.jsx      ← romantic letter page
    │   └── LoveLetterPage.module.css
    └── components/
        ├── Header.jsx / .module.css
        ├── BottomBar.jsx / .module.css
        ├── ButtonRow.jsx / .module.css
        ├── FlowerLayer.jsx / .module.css
        ├── FlowerPopup.jsx / .module.css
        ├── SpotifyPanel.jsx / .module.css
        ├── FallingPetals.jsx / .module.css
        └── Toast.jsx / .module.css
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Add your images
Copy your image files into `public/images/`:
```
public/images/background.jpg
public/images/flower1.png
public/images/flower2.png
public/images/flower3.png
public/images/flower4.png
public/images/flower5.png
```

### 3. Start the dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
npm run preview
```

---

## ✏️ Customisation

### Change names / messages
Edit `src/utils/constants.js`:
- `LOVE_LETTER` — all letter content (paragraphs, signature, date)
- `FALLBACK_MESSAGES` — shown if the AI API is unreachable
- `SPOTIFY_EMBED_URL` — swap in any Spotify playlist embed link

### Change AI message style
Edit the prompt in `src/utils/generateMessage.js`.

### Change petal count / colors
Edit `PETAL_CONFIG` in `src/utils/constants.js`.

---

## 🎹 Keyboard Shortcuts

| Key | Action                  |
|-----|-------------------------|
| S   | Toggle Spotify panel    |
| L   | Open Love Letter        |
| C   | Clear garden            |
| Esc | Close popup / panel     |

---

## 💡 Notes

- The AI message generation calls the **Anthropic API** directly from the browser.
  This works in development. For production, route the call through a backend
  proxy to keep your API key secure.
- The Spotify iframe requires an internet connection.
- All flower images should have **transparent backgrounds** (PNG) for best results.
- The background should be landscape-oriented JPG for best coverage.

---

Made with 💚 by Jabez, for Desilyn 🌸

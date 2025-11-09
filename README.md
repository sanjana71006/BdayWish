# Happy Birthday Raiyu 🐒 — React + Tailwind

This small Vite + React + Tailwind project contains the full app you provided: changing backgrounds, shooting stars, confetti, animations, and background music.

## Quick setup

1. Put your assets in the `public` folder (create `public` at the project root):

```
/public/bg1.jpg
/public/bg2.jpg
/public/bg3.jpg
/public/bg4.jpg
/public/birthday.mp3   # your music file
/public/birthday.gif   # optional animated GIF shown on greeting
/public/cards/1.png
/public/cards/2.png
/public/cards/3.png
/public/cards/4.png
/public/cards/5.png
```

2. Install and run (PowerShell on Windows):

```powershell
npm install
npm run dev
```

Open the URL shown by Vite (typically http://localhost:5173).

## Notes
- The app cycles backgrounds every 6 seconds.
- If the audio doesn't autoplay, click the page or the play control to allow it.
- You can tweak timing/animation in `src/App.jsx` and the CSS in `src/index.css`.

If you want, I can add a small simple play/pause music control, or integrate AnimatePresence for more polished transitions. Tell me which next step you prefer.

# 🕯️ Ravenhall — Gothic Academia Open Study

> *Four rooms. Four atmospheres. One little invitation to stay awhile.*

Ravenhall is a cozy, candlelit study experience for anyone who wants their focus time to feel a little more magical. Step through the foyer, choose a room, and let the rain, firelight, and turning pages set the mood. No productivity dashboard, no login—just a quiet place to read, think, or work.

## ✨ Take a peek

[Watch the Ravenhall study-room tour](./assets/ravenhall-study-tour.mp4)

## 🗝️ Four rooms to wander

| Room | For a little... | Atmosphere |
| --- | --- | --- |
| **The Raven — Grand Library** | Deep reading | Cathedral shelves, old books, firelight, and drifting dust |
| **Nocturne — Moonlit Desk** | Quiet work | Rain on the glass, ink, a green lamp, and moonlight |
| **The Alchemist — Curiosity Room** | Strange ideas | A private laboratory of brass, books, candlelight, and smoke |
| **The Conservatory — Rain & Poetry** | Reflection | Gothic windows, stormlight, rain, and turning pages |

## 🌙 Little details

- **RAIN** brings a soft, procedural shower to the windows.
- **SOUND** creates a gentle rain-and-candle soundscape right in your browser.
- **FOCUS** hides the controls so the room can take over.
- **FULL** opens the room in browser fullscreen when your browser allows it.
- **FOYER** leads you back to choose another room.

Motion is deliberately slow and atmospheric: expect drifting dust, flickering candlelight, soft smoke, a moving pen, and the occasional page turn. The soundscape is generated with the Web Audio API; no audio track or account is needed.

## 🛠️ Made with

- **HTML** for the rooms and their content
- **CSS** for the Gothic Academia look, responsive layouts, and ambient effects
- **Vanilla JavaScript** for room selection, interactions, procedural ambience, and Web Audio
- **Vite 7** for local development and production builds
- **Google Fonts** for Cinzel, Cormorant Garamond, and IM Fell English

There is no app framework, backend, database, or analytics service. Google Fonts are loaded from Google Fonts when online; the visual assets are stored in `assets/`.

## 🚪 Run it locally

You'll need Node.js and npm.

```bash
npm install
npm run dev
```

To create and preview a production build:

```bash
npm run build
npm run preview
```

## 📜 A small note

Ravenhall is an open UI experiment in atmosphere-first study spaces. If you reuse or publish the visual assets, make sure you have permission to redistribute them; replace any third-party reference images with licensed or self-created alternatives when needed.

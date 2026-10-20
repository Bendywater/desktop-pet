# Desktop Pet

A cross-platform desktop pet built with Electron. The character floats on your desktop in a transparent, frameless, always-on-top window, supporting drag, click-to-switch actions, a right-click menu, and a tray icon.

## Features

- Transparent, frameless, always-on-top window showing only the character
- Left-click to switch actions; drag to move
- Right-click menu: next / previous / random action, quit
- Tray icon: switch actions / quit
- Visible across all Spaces (survives macOS fullscreen apps)
- GIF playback and transparency handled natively by the browser

## Getting Started

```bash
npm install
npm start
```

On macOS, the first launch may be blocked by Gatekeeper — see Troubleshooting below.

## Project Structure

```
desktop-pet/
├── main.js           # Electron main process: transparent window + tray + IPC
├── gif-pet.html      # Pet page (GIF character, main entry)
├── gif-pet.css       # Pet styles
├── gif-pet.js        # Pet interactions (switch action / drag / context menu)
├── index.html        # Bonus: pure-CSS character demo (no assets needed)
├── pet.css / pet.js  # Bonus: CSS character styles and logic
├── typing.html       # Bonus: CSS typing animation demo
├── assets/
│   ├── gifs/         # Character GIF assets (prepare your own, see below)
│   └── tray.png      # Tray icon
├── .gitignore
└── package.json
```

## Adding Character Assets

The character animation is driven by GIFs. Place transparent-background GIFs into `assets/gifs/`, then add their filenames to the `GIFS` array at the top of `gif-pet.js`.

Asset requirements:

- Transparent background (alpha channel)
- Recommended size 200–1000px; the app scales them automatically
- Looping animation

## Implementation Notes

The four layers of a desktop pet:

| File | Layer |
|------|-------|
| `main.js` | Window layer: transparent / frameless / always-on-top + tray |
| `gif-pet.html` + `gif-pet.css` | Rendering layer: GIF display |
| `gif-pet.js` | Interaction layer: click / drag / context menu |
| (extensible) | AI layer: LLM chat / TTS |

Key points:

- A transparent window requires three settings: `transparent: true` + `frame: false` + `alwaysOnTop: true`
- Dragging is implemented by sending mouse deltas from `mousedown`/`mousemove` to the main process (instead of `-webkit-app-region`), so that click and drag can be distinguished
- An exit mechanism (context menu / tray) is required, otherwise the frameless always-on-top window cannot be closed

## Troubleshooting

### macOS says "Electron.app can't be opened because it is from an unidentified developer"

The Electron binary is not signed by Apple, triggering Gatekeeper. Solutions:

1. Upgrade to a newer Electron version (older versions such as 31.x may have their notarization revoked by Apple, reporting `notarization indicates this code has been revoked`);
2. Or go to "System Settings → Privacy & Security → Open Anyway" to allow it once.

### Pet disappears when an app goes fullscreen

macOS fullscreen apps occupy a dedicated Space. The code uses `setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })` to keep the pet visible across Spaces.

## License & Copyright

The **code** and the **character assets** in this project use different licenses:

### Code

Licensed under the [MIT License](./LICENSE) — free to use, modify, and use commercially.

### Character assets (`assets/gifs/`)

The assets are the "一二布布" sticker pack by **黄小B (Huang Xiao B)**, copyright **北京微次元文化创意有限公司 (Beijing Weiciyuan Culture & Creativity Co., Ltd.)**, released under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) (Attribution-NonCommercial 4.0):

- Allowed: personal use, non-commercial reproduction and sharing, non-commercial derivative works
- Prohibited: commercial use (advertising, merchandise, monetization), resale
- Attribution must be retained, and commercial use is not permitted

For commercial use, contact the copyright holder for a formal license.

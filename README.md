# Browser Wrapped

A browser extension that maps your browsing, tracks time spent on each site, and delivers a **weekly Wrapped** — like Spotify Wrapped, but for your browser.

## Features

- **Automatic tracking** — counts time per domain while you browse
- **Live popup** — top sites for today, this week, and by category
- **Smart categorization** — identifies tools (dev, social, entertainment, productivity, etc.)
- **Weekly Wrapped** — Spotify-style animated slide presentation
- **Full privacy** — data stays in your browser only; nothing leaves your machine
- **Idle detection** — stops counting when you are away

## Installation

### Chrome / Edge / Brave

1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `browser-wrapped` folder

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select the `manifest.json` file in this folder

Requires **Firefox 109+** (121+ recommended). The manifest includes both `background.scripts` (Firefox) and `background.service_worker` (Chrome/Edge) — each browser uses the one it supports.

> Temporary add-ons are removed when Firefox closes. Reload the extension after code changes.

> **Note:** To generate PNG icons, run `node scripts/generate-icons.cjs` (requires Node.js).

## Usage

1. **Browse as usual** — the extension tracks automatically
2. **Click the icon** to see daily and weekly stats
3. **Weekly Wrapped** — every Sunday evening, or click “View Weekly Wrapped”
4. **Settings** — pause tracking or delete data from the options page

## Weekly Wrapped

The presentation includes 10 slides:

1. Week introduction
2. Total browsing time
3. Your #1 site (highlight)
4. Top 5 favorite sites
5. Chart by day of the week
6. Peak hours
7. Usage categories (dev, social, etc.)
8. Your browsing profile (Night Owl, Builder, etc.)
9. Fun facts
10. Final summary

Navigate with keyboard arrows, swipe on mobile, or use the on-screen buttons.

## Privacy

- Only **domains** are recorded (e.g. `github.com`), never full URLs
- No page content is read or stored
- Data lives in `chrome.storage.local` — 100% local
- No telemetry, no servers, no accounts

## Project structure

```
browser-wrapped/
├── manifest.json          # Manifest V3
├── background/
│   └── service-worker.js  # Tab tracking
├── lib/
│   ├── storage.js         # Local persistence
│   ├── stats.js           # Statistics
│   ├── categories.js      # Domain categories
│   └── utils.js           # Utilities
├── popup/                 # Extension popup
├── wrapped/               # Wrapped presentation
├── options/               # Settings page
└── icons/                 # Extension icons
```

## Author

**Laura Barros** — [github.com/laurabarros5/browser-wrapped](https://github.com/laurabarros5/browser-wrapped)

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Laura Barros.

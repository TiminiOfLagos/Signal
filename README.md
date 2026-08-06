# SIGNAL — Sessions 03

Campaign site for a studio residency: twelve rooms, twelve records, one year, fully funded.
Built for artists, producers and engineers across Nigeria, Ghana, Kenya and South Africa.

## Run it

```bash
npm start
```

Then open <http://localhost:5173>.

No build step, no dependencies. `server.js` is a ~40-line zero-dependency Node static
server; the site itself is a single self-contained HTML file.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The entire site — markup, styles and behaviour |
| `og-image.jpg` | 1200×630 link-preview card |
| `favicon.svg` · `favicon-32.png` · `favicon-192.png` · `apple-touch-icon.png` | Icons |
| `server.js` | Zero-dependency static server (port 5173, override with `PORT`) |
| `.claude/launch.json` | Dev-server config for the Claude Code preview pane |

## Link previews

`index.html` carries Open Graph and Twitter card tags, and `og-image.jpg` is the
card that shows when the URL is pasted into WhatsApp, Slack, X or LinkedIn.

**One thing to finish:** `og:image` and `twitter:image` currently use the
relative path `/og-image.jpg`. Facebook's scraper (which WhatsApp and Instagram
also use) resolves that against the page URL, but X and a few others want an
absolute one. Once the production domain is settled, change both to the full
URL and add a matching `og:url`:

```html
<meta property="og:url"   content="https://YOUR-DOMAIN/">
<meta property="og:image" content="https://YOUR-DOMAIN/og-image.jpg">
<meta name="twitter:image" content="https://YOUR-DOMAIN/og-image.jpg">
```

Scrapers cache aggressively. After changing it, re-scrape via
[Facebook's debugger](https://developers.facebook.com/tools/debug/) and
[X's validator](https://cards-dev.twitter.com/validator) rather than waiting.

## Deploying

The site is plain static files with no build step, so **serve the repo root and
point the host at `index.html`** — that is all any static host needs:

| Host | Setting |
| --- | --- |
| GitHub Pages | Settings → Pages → deploy from `main`, folder `/ (root)` |
| Netlify | Build command: *(blank)*, Publish directory: `.` |
| Vercel | Framework preset: **Other**, Output directory: `.` |
| Cloudflare Pages | Build command: *(blank)*, Build output directory: `/` |
| Render / Railway | Static site, publish directory `.` — or a Node service running `npm start` |

`server.js` is only needed for local development or a Node host. If you use one,
it honours `PORT` and binds `0.0.0.0`, which is what those platforms require.

## How it is built

Deliberately dependency-free. No framework, no bundler, no webfonts, no external
requests of any kind — the page works offline and from any static host.

**Type.** Font CDNs are avoided rather than risked, so the personality lives in the
treatment: Arial Black at 900 with -0.045em tracking for the display stacks, and
monospace for every label, channel number and tick — because studio gear is
silkscreened in mono.

**Colour.** One accent. `--amber #FF6A00` is the signal; `--clip` and `--vu` are
semantic and appear only inside meters. Neutrals are warm-biased toward the cream.
The page commits to a single visual world (a console room at 3am), so the theme
toggle is deliberately pinned to a no-op rather than half-inverting the art direction.

**Motion.** A lerped native scroll (sticky still works, no library). Scroll-linked
scenes in the hero, the timeline and the archive. Cards in the lanes hang from SVG
cable drawn from measured positions, so it re-lays correctly at every breakpoint —
and hovering a card tugs its cable and, less, its neighbours'.

**Audio.** The archive deck plays an original composition — gospel I–vi–ii–V changes
in F, drawbar organ over a walking bass — synthesised live with the Web Audio API.
Nothing is fetched and nothing is licensed. The waveform is driven from the real
output through an `AnalyserNode`, so the visual reacts to actual sound.

## Responsiveness

Verified by measurement, not by eye. Display type is sized from measured em-ratios
against the real content box — which is viewport width minus padding minus the
scrollbar, and capped by `--maxw`. Headline lines live inside `overflow: hidden`
wrappers for the reveal animation, so an overrun clips rather than wraps; the
sizes are chosen so it cannot.

Last checked clean (no clipped headlines, no horizontal overflow, no element wider
than the viewport) at: 320, 375, 414, 600, 640, 641, 768, 1024, 1280, 1440, 1920,
2560 px wide, and 560–1080 px tall.

## Before this goes live

The copy is written to be credible, not to be true. Replace before publishing:

- Cohort numbers, charting claims and the "sixteen residents" history
- The resident quote attributed to *Ify O.*
- Room locations, phone numbers and `demos@signal.sessions`
- All dates in the timeline

The application CTAs currently link to `#send`; wire them to the real form.

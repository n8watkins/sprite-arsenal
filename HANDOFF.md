# Sprite Bench — Handoff

**Live:** https://sprite-bench.vercel.app  
**Repo:** https://github.com/n8watkins/sprite-bench  
**Deployed:** Vercel (auto-deploys on push to `main`)

---

## What we built

A standalone, fully browser-side sprite sheet → animated GIF tool. Zero server, zero model calls, zero cost to run.

### Tech stack
- Next.js 16 (app router, static export)
- Tailwind CSS v4
- TypeScript
- No other dependencies

### File map

```
app/
  page.tsx              — the entire UI (single page app)
  layout.tsx            — metadata, globals
  globals.css           — Tailwind import + base styles
lib/
  sprite/
    slice.ts            — grid math, blank detection, auto-detect, stabilize
    gif.ts              — dependency-free GIF89a encoder
    demo.ts             — programmatic slime demo (no image assets shipped)
  zip.ts                — dependency-free ZIP writer
components/
  sprite/
    AnimationPreview.tsx — canvas-based live frame player
```

### What it does
- Drop / click / paste / drag a sprite sheet
- Auto-detects grid from background color gaps
- Slices into frames, live previews animation
- Per-frame: toggle in/out, nudge crop (1px or 8px shift-click), hold duration multiplier, reorder
- Stabilize: aligns all frames to feet or center anchor (fixes jittery sprites)
- Export: animated GIF at 1×/2×/4×, transparent or solid background, ping-pong mode
- Export: individual frames as a .zip
- Demo slime loads on first visit so the page isn't a blank form

### What it does NOT do (yet)
- APNG / WebP export (GIF only)
- Multiple named animation clips per sheet
- Clipboard copy (copy GIF directly, no download)
- Mobile-optimized layout (functional but not polished on small screens)
- Google Analytics
- About / "made by" section beyond a footer GitHub link
- OG image / social card

---

## Origin

Extracted from `asset-arsenal/backend` (private repo, `n8watkins/asset-arsenal`).
The sprite bench was one sub-tool inside a larger AI asset generation app.
All core logic was written from scratch (no third-party GIF/ZIP libraries).
The original was inspired by collidingScopes' MIT `spritesheet-to-gif`; this is a full reimplementation.

---

## Domain decision

**Keep it standalone. Add attribution, not integration.**

| Option | Verdict |
|---|---|
| `sprite-bench.vercel.app` (current) | Fine for now, not memorable |
| `n8builds.dev/sprite-bench` | Routing/ownership complexity, slows the tool with n8builds infra |
| Subdomain `sprite.n8builds.dev` | Clean, no code bloat, routes back to brand |
| Own domain `spritebench.dev` or `spritebench.io` | Best for SEO/sharing; ~$12/yr |

**Recommended path:**
1. Short term: add a small "by [n8builds.dev](https://n8builds.dev)" credit in the footer — free, builds brand, no bloat
2. Medium term: add sprite-bench as a card on n8builds.dev projects
3. Long term: if it gets traction, grab `spritebench.dev` and point it here

---

## Analytics

GA4 is the right call. The implementation is 5 lines — a `<Script>` tag in `layout.tsx` + a `NEXT_PUBLIC_GA_ID` env var in Vercel. Zero bundle size impact. Zero server logic.

**Steps:**
1. Create a new GA4 property at analytics.google.com → call it "Sprite Bench"
2. Copy the `G-XXXXXXXXXX` measurement ID
3. Add to Vercel env vars: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
4. Add to `app/layout.tsx`:

```tsx
import Script from "next/script";
// in <head>:
<Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
<Script id="ga-init" strategy="afterInteractive">{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
`}</Script>
```

---

## Immediate polish (next session)

These are all small, high-impact, low-risk:

- [ ] **OG / social card** — add `og:image` and Twitter card meta so sharing looks good on Discord/Twitter. A static 1200×630 PNG is enough.
- [ ] **Favicon** — currently using Next default. A pixel-art icon (even a simple sprite frame) would be on-brand.
- [ ] **Footer** — add "by [n8builds.dev](https://n8builds.dev) · [Ko-fi](https://ko-fi.com/n8watkins)" at the bottom of the page
- [ ] **GA4** — see above, 5-minute task once you have the measurement ID
- [ ] **Add to n8builds.dev projects** — card pointing to the live URL

---

## Features that would make it genuinely more useful

### Tier 1 — High value, reasonable effort

**Animated WebP / APNG export**  
GIF has a 256-color palette cap. For pixel art it's usually fine, but for anything richer the output degrades. WebP and APNG both support true color + full alpha. This would make the tool useful for a wider range of assets and is a real differentiator vs every other "sprite to gif" site.

**Copy GIF to clipboard**  
Right now: Generate → Download → open file explorer → copy. One `navigator.clipboard.write()` call eliminates three steps. Game devs pasting into Discord would love this.

**Multiple named clips**  
Most character sprite sheets have multiple animations stacked: rows 1–2 = walk, rows 3–4 = run, row 5 = jump, etc. Right now you'd have to re-set the grid for each one. A "clips" system where you define named frame ranges and export each as its own GIF would take this from a one-shot tool to a real pipeline step.

**URL import**  
Paste an image URL and load it directly. Especially useful for people browsing itch.io asset packs who don't want to download first.

### Tier 2 — Bigger, worth doing if there's traction

**Reverse: pack frames → spritesheet**  
Upload individual frames, get a packed sheet back. Completes the loop. Aseprite users sometimes want to work the other direction.

**Shareable link**  
Encode the grid settings (not the image, just rows/cols/offsets/fps/scale) in the URL so you can share a link with your settings pre-loaded. Useful for "here's the correct grid for this specific sheet."

**GIF optimizer pass**  
Crop each frame to the minimum bounding box of the content delta (don't redraw pixels that didn't change). Standard GIF optimization trick — can cut file size by 30–60% on sprites with large empty areas.

**Drag-to-reorder frames**  
The ◀/▶ buttons work but dragging frame thumbnails directly is more natural. `@dnd-kit/sortable` would do it in ~50 lines.

---

## What success looks like

This tool has a natural SEO target: "sprite sheet to gif," "spritesheet animator," "pixel art gif maker." Those are real searches from game devs and pixel artists. With GA in place and the OG card working so it previews nicely when shared on Discord/Reddit/Twitter, this can pull organic traffic with no paid promotion.

The Ko-fi link is already in the README. Add it to the page footer too and it'll convert.

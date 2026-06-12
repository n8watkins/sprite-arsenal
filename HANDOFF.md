# Sprite Bench — Handoff

**Live:** https://sprite-bench.vercel.app  
**Repo:** https://github.com/n8watkins/sprite-bench  
**Auto-deploys:** every push to `main` triggers a Vercel production build.

---

## Project summary

Standalone, 100% browser-side sprite sheet → animated GIF tool. No server,
no model calls, no API keys. Extracted from `asset-arsenal/backend` (private
repo `n8watkins/asset-arsenal`) where it lived at `/app/sprite/page.tsx`.

**Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript — zero runtime
deps beyond those four.

**What it does:**
- Drop / click / paste / drag a sprite sheet image
- Auto-detects grid from background color gaps
- Slices frames, shows live animation preview via canvas
- Per-frame: toggle in/out, nudge crop (1px or 8px), hold-duration multiplier, reorder
- Stabilize: aligns all frames to a common anchor (feet or center)
- Export: animated GIF at 1×/2×/4× scale, transparent or solid bg, ping-pong
- Export: individual frames as a .zip
- Demo slime sheet loads on first visit (programmatically generated — no image assets)

---

## Session work (2026-06-12)

| Commit | What |
|---|---|
| `cef3f25` | Initial commit — full extraction from asset-arsenal, clean standalone build |
| `462a154` | README with Ko-fi link |
| `3eed745` | Updated README with real Vercel URL |
| `2ffb60f` | Footer (n8builds.dev · GitHub · Ko-fi), HANDOFF.md |

**Verified working:**
- `npm run build` passes clean (TypeScript + static export)
- Deployed to https://sprite-bench.vercel.app and confirmed live
- GitHub repo is public: https://github.com/n8watkins/sprite-bench

**Not done / in flight:**
- Google Analytics (GA4) — needs a measurement ID from the user; implementation is ready (see Next steps)
- OG social card image — placeholder URL is in place, no actual image yet
- All feature work below is unstarted

---

## Next steps (ordered)

### 1. Google Analytics
The user wants GA on this project. They have GA on other projects (n8builds-web).

**Steps:**
1. User must create a new GA4 property at analytics.google.com → call it "Sprite Bench" → copy the `G-XXXXXXXXXX` measurement ID
2. Add to Vercel env vars: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
3. In `app/layout.tsx`, add after the existing imports:

```tsx
import Script from "next/script";
```

And inside `<head>` (add `<head>` tag to the layout if not present):

```tsx
{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      strategy="afterInteractive"
    />
    <Script id="ga-init" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `}</Script>
  </>
)}
```

Acceptance: visiting the live site triggers a `page_view` event in the GA4 realtime dashboard.

---

### 2. OG / social card
Sharing the URL on Discord/Twitter/Reddit shows a blank card right now.

- Create a static `public/og.png` — 1200×630px, dark background, tool name, a GIF of the demo slime
- In `app/layout.tsx` metadata, add:

```tsx
openGraph: {
  title: "Sprite Bench",
  description: "Slice a sprite sheet, preview live, export GIF or frames. Free, runs in-browser.",
  url: "https://sprite-bench.vercel.app",
  images: [{ url: "/og.png", width: 1200, height: 630 }],
},
twitter: {
  card: "summary_large_image",
  title: "Sprite Bench",
  description: "...",
  images: ["/og.png"],
},
```

Acceptance: pasting the URL into Twitter card validator shows the image.

---

### 3. Copy GIF to clipboard
One of the highest-friction moments: user generates a GIF, wants to paste it into Discord — currently requires Download → open folder → copy file.

In `app/page.tsx`, in the `gif &&` block alongside the Download button:

```tsx
<button
  type="button"
  onClick={async () => {
    const res = await fetch(gif.url);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/gif": blob })]);
  }}
  className="..."
>
  Copy GIF
</button>
```

Note: `ClipboardItem` with `image/gif` has mixed browser support. Wrap in try/catch and show a toast if it fails. Chrome supports it; Firefox/Safari may not.

---

### 4. Add to n8builds.dev projects

The user's main site is `/home/natkins/n8builds/n8builds-web` (deployed at https://n8builds.dev). Sprite Bench should appear there as a project card.

- File to edit: `n8builds-web/components/Projects/index.tsx` (or wherever the project list lives — read it first)
- Card: title "Sprite Bench", description from README, link to https://sprite-bench.vercel.app, tag "tool" or "free"

---

### 5. Animated WebP / APNG export (bigger feature)

GIF's 256-color cap is fine for pixel art but degrades richer sprites. WebP and APNG both support true color + full alpha.

- `lib/sprite/gif.ts` is the model to follow — a dependency-free encoder written by hand
- For APNG: the format is documented at https://wiki.mozilla.org/APNG_Specification — follows PNG with extra chunks
- For WebP: more complex; a library like `@ffmpeg/ffmpeg` (WASM) would be easier than hand-rolling
- Add export format selector (GIF / APNG / WebP) to the Export section in `app/page.tsx`

---

### 6. Multiple named animation clips

Most character sheets stack several animations: rows 1–2 = walk, rows 3–4 = run, row 5 = jump. Right now the user re-sets the grid for each one.

- Add a "Clips" concept: named frame-range slices of the loaded sheet
- Each clip gets its own frame strip, preview, and export button
- This is a larger UI change — design the data model first before touching the page

---

## Domain

**Decision (made by user this session):** Keep as standalone Vercel deployment.
Do NOT route through n8builds.dev as a sub-path — too much infra coupling.

Options considered and their status:
- `sprite-bench.vercel.app` — current, fine for now
- `sprite.n8builds.dev` — clean subdomain option if user wants custom domain later
- `spritebench.dev` — best for SEO, ~$12/yr, grab if it gets traction

---

## Conventions & gotchas

- **Deploy:** push to `main` → auto-deploys to Vercel. No manual deploy step needed.
- **Build command:** `npm run build` (runs `next build`). Must pass before committing.
- **No server code.** This is a fully static/client-side app. Do not add API routes or server components that touch secrets — there are none.
- **Tailwind v4 syntax** — uses `@import "tailwindcss"` in globals.css, NOT the v3 `@tailwind base/components/utilities` directives.
- **Next.js 16** — this is a cutting-edge version; check `node_modules/next/dist/docs/` if behavior seems wrong before assuming a bug.
- **Commit trailers:** all commits in this repo use `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- **No `lib/icon/` imports** — the sprite bench was deliberately extracted to have zero dependency on asset-arsenal's `lib/icon/` or `lib/storage/` utilities. Keep it that way.
- **`slugify` lives in `lib/zip.ts`** — was inlined from asset-arsenal's `lib/icon/download.ts` to break the dependency. Don't re-import it from anywhere else.

---

## File map

| File | Role |
|---|---|
| `app/page.tsx` | Entire UI — source intake, grid controls, frame editor, export |
| `app/layout.tsx` | Metadata, GA goes here |
| `app/globals.css` | Tailwind import, base body styles |
| `lib/sprite/slice.ts` | Grid math, auto-detect, blank detection, stabilize |
| `lib/sprite/gif.ts` | Dependency-free GIF89a encoder |
| `lib/sprite/demo.ts` | Programmatic slime demo sheet |
| `lib/zip.ts` | Dependency-free ZIP writer (includes `slugify`) |
| `components/sprite/AnimationPreview.tsx` | Canvas-based live frame player |
| `HANDOFF.md` | This file |

---

## Related repos

- **asset-arsenal/backend** (`n8watkins/asset-arsenal`, private) — where the sprite bench originated. The `/app/sprite/page.tsx` there is the source of truth for the original implementation. If a significant feature is added to sprite-bench, the user may want to mirror it back.
- **n8builds-web** (`/home/natkins/n8builds/n8builds-web`, `n8builds.dev`) — user's main portfolio/lab site. Sprite Bench should be added as a project card there.

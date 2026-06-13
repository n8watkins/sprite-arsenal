# Sprite Arsenal — Handoff

**Live:** https://sprite-bench.vercel.app  
**Repo:** https://github.com/n8watkins/sprite-bench *(rename to sprite-arsenal pending — see below)*  
**Auto-deploys:** every push to `main` triggers a Vercel production build.

---

## What this is

Standalone, 100% browser-side sprite sheet → animated GIF tool. No server,
no model calls, no API keys. Extracted from `asset-arsenal/backend` where it
lived at `/app/sprite/page.tsx`.

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
- Copy GIF to clipboard
- Demo slime sheet loads on first visit (programmatically generated)
- Live GitHub star count fetched from GitHub API shown in nav

---

## Git state (2026-06-12)

All commits on `main`, pushed to `origin` (`n8watkins/sprite-bench`). Working tree clean.

| Commit | What |
|---|---|
| `cef3f25` | Initial extraction from asset-arsenal |
| `e40bbe0` | OG image, Copy GIF button |
| `b5e85a9` | n8builds-web: project card + `/sprite-bench` redirect |
| `079e2ea` | Big visual refresh: icons, animated bg, about page overhaul |
| `4e82d3f` | Grid overlay fix, live star count, local favicon, frame-open animation |
| `5c92505` | Rename to Sprite Arsenal; nav overhaul; hero cleanup; centered overlay |

---

## Pending manual steps (dashboard only — no code needed)

### 1. Rename GitHub repo
A stale older repo `n8watkins/sprite-arsenal` exists and blocks the rename. Steps:
1. Delete the old one: github.com/n8watkins/sprite-arsenal → Settings → Danger Zone → Delete
2. Rename this one: github.com/n8watkins/sprite-bench → Settings → Repository name → `sprite-arsenal`
3. Update local remote: `git remote set-url origin https://github.com/n8watkins/sprite-arsenal.git`

### 2. Vercel project rename
vercel.com → sprite-bench project → Settings → General → Project Name → `sprite-arsenal`

### 3. Vercel Analytics
vercel.com → sprite-bench project → Analytics tab → Enable. One click, no code.

---

## Relationship to Asset Arsenal

Sprite Arsenal is the **free, public, zero-AI version** of the sprite tooling
inside `asset-arsenal/backend`. Asset Arsenal (private) has richer features.

**Future option:** fold Sprite Arsenal into Asset Arsenal as a public free route
(`/sprite`), point the Vercel deployment there, and archive this repo. Do this
once Asset Arsenal has a clean public-vs-authenticated split.

---

## Conventions & gotchas

- **Tailwind v4** — `@import "tailwindcss"` in globals.css, NOT v3 directives.
- **No `Github` icon in lucide-react v1.18** — use the inline `GitHubIcon` SVG
  in `page.tsx` and `about/page.tsx`. Never import `Github` from lucide-react.
- **n8builds favicon** — `/public/n8-icon.png` (local copy). Do not revert to external URL.
- **No server code** — fully static/client-side. Do not add API routes.
- **Build check** — `npm run build` must pass before committing.
- **Commit trailers** — `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

---

## File map

| File | Role |
|---|---|
| `app/page.tsx` | Entire UI — intake, grid, frame editor, export |
| `app/layout.tsx` | Metadata, OG tags |
| `app/globals.css` | Tailwind import, scrollbar, shimmer, floating pixels, slide-down |
| `app/about/page.tsx` | About page: features, how-it-works, other projects, Ko-fi |
| `app/opengraph-image.tsx` | 1200×630 OG image (edge runtime) |
| `lib/sprite/slice.ts` | Grid math, auto-detect, blank detection, stabilize |
| `lib/sprite/gif.ts` | Dependency-free GIF89a encoder |
| `lib/sprite/demo.ts` | Programmatic slime demo sheet |
| `lib/zip.ts` | Dependency-free ZIP writer (includes `slugify`) |
| `components/sprite/AnimationPreview.tsx` | Canvas-based live frame player |
| `public/n8-icon.png` | n8builds.dev favicon (local copy) |

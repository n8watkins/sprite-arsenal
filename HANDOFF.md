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

**Also done (same session, later):**
| `e40bbe0` | OG image (ImageResponse), social metadata, Copy GIF button |
| `b5e85a9` | n8builds-web: Sprite Bench project card + `/sprite-bench` redirect (separate repo) |

**Not done / in flight:**
- Vercel Analytics — one-click enable in the Vercel dashboard (no code needed)
- All feature work below is unstarted

---

## Next steps (ordered)

### 1. Vercel Analytics (analytics — DECIDED)
**Decision:** Use Vercel Analytics, not GA4. User does not have a GA4 property set up and doesn't want to manage multiple GA accounts. Vercel Analytics is one-click, no code changes, no measurement ID.

**Steps (no code needed):**
1. Go to https://vercel.com → sprite-bench project → **Analytics** tab → **Enable**
2. Done. Page views, visitors, and top pages appear in the Vercel dashboard.

**Trade-off accepted:** Vercel Analytics has no event tracking or funnels — just pageview-level data. That's sufficient for a free tool where the goal is "how many people are using this."

Do NOT implement GA4 — that decision was explicitly rejected this session.

---

### 2. OG social card — DONE (`e40bbe0`)
`app/opengraph-image.tsx` — programmatic 1200×630 via `ImageResponse`. Auto-served at `/opengraph-image`. Metadata wired in `app/layout.tsx`.

### 3. Copy GIF to clipboard — DONE (`e40bbe0`)
Button added in the gif export block in `app/page.tsx`. Shows "Copied!" for 2s on success; shows error message on browser API failure.

### 4. Add to n8builds.dev projects — DONE (`b5e85a9` in n8builds-web)
Project card added at id 5 in `n8builds-web/data/projects.tsx`. `/sprite-bench` redirect added in `next.config.mjs`. `sprite-bench.vercel.app` added to remotePatterns.

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

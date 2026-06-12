# Sprite Bench

**Turn any sprite sheet into an animated GIF in seconds — free, no sign-up, nothing leaves your browser.**

[![Ko-fi](https://img.shields.io/badge/Buy%20me%20a%20coffee-Ko--fi-ff5e5b?logo=ko-fi&logoColor=white)](https://ko-fi.com/n8watkins)

---

## What it does

Drop a sprite sheet. Get a GIF.

That's the pitch. Everything else — the grid detection, the encoding, the frame editor — is there to make sure the GIF actually looks good.

- **Auto-detects the grid** from your sheet's background gaps so you don't have to count cells manually
- **Live animation preview** updates as you change settings — no "generate to preview" loop
- **Per-frame controls** — toggle frames in/out, nudge the crop by pixel (or 8px with Shift), hold a frame longer, reorder
- **Stabilize** — aligns every frame to a common anchor so a drifty sprite stops bouncing around
- **Ping-pong** — bakes forward + reversed into the file, no extra work
- **Transparent GIF export** with correct disposal so frames don't ghost over each other
- **1×, 2×, 4× export scale** for pixel-perfect upscaling
- **Download frames as a .zip** if you want the individual PNGs instead
- **Zero dependencies** on any backend, model, or API — runs entirely in your browser, costs $0 to use forever

---

## Try it

**[sprite-bench.vercel.app](https://sprite-bench.vercel.app)**

When you open it, a demo sprite (a little bouncing slime) loads automatically so the page is alive immediately. Drop your own sheet on top of it and go.

---

## Who it's for

- Game developers turning sprite sheets into preview GIFs for itch.io / Steam pages
- Pixel artists who want to proof their animation before exporting from Aseprite
- Anyone who has ever dragged a sprite sheet into ezgif and wanted more control

---

## Deploy your own

```bash
git clone https://github.com/n8watkins/sprite-bench.git
cd sprite-bench
npm install
npm run dev
```

It's a Next.js app with no server-side code. `npm run build` produces a fully static export you can host anywhere — Vercel, Netlify, GitHub Pages, wherever.

---

## Support

If this saved you ten minutes of fiddling with online tools, [buy me a coffee on Ko-fi](https://ko-fi.com/n8watkins). It's genuinely appreciated and helps me keep building free stuff.

---

## License

MIT — use it, fork it, ship it.

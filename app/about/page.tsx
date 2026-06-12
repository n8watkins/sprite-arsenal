import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Sprite Bench",
  description: "What Sprite Bench is, how it works, and who built it.",
};

const features = [
  {
    icon: "🎯",
    title: "Auto-detect grid",
    body: "Drop any sprite sheet and Sprite Bench reads the background color gaps to suggest the right rows and columns. No counting frames by hand.",
  },
  {
    icon: "⚡",
    title: "Live preview",
    body: "The animation plays as you adjust settings. You see exactly what your GIF will look like before you hit export — no guess-and-check.",
  },
  {
    icon: "✂️",
    title: "Per-frame control",
    body: "Toggle frames in or out, nudge the crop 1px at a time (or 8px with Shift), set how long each frame holds, and reorder frames by dragging.",
  },
  {
    icon: "🔧",
    title: "Stabilize",
    body: "If your sprite drifts between cells, Stabilize aligns every frame to a common anchor — feet or center — so your animation stops jittering.",
  },
  {
    icon: "🎬",
    title: "Ping-pong & scale",
    body: "Export at 1×, 2×, or 4× for pixel-perfect upscaling. Enable ping-pong to bake a forward-then-reverse loop into the file.",
  },
  {
    icon: "📦",
    title: "GIF or zip",
    body: "Export an animated GIF with a transparent or solid background, or download all frames as individual PNGs in a zip. Copy the GIF directly to your clipboard.",
  },
];

export default function AboutPage() {
  return (
    <div className="pixel-grid-bg min-h-screen text-zinc-100" style={{ background: "#0b0914" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-md"
        style={{ borderColor: "rgba(139,92,246,0.25)", background: "rgba(11,9,20,0.92)" }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-zinc-100 hover:opacity-80 transition-opacity">
            <span className="text-lg">🎮</span>
            <span className="text-base">Sprite Bench</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200">
              ← Back to tool
            </Link>
            <a
              href="https://ko-fi.com/n8watkins"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:scale-105 hover:opacity-90"
              style={{ background: "#ff5e5b", color: "#fff" }}
            >
              ☕ Buy me a coffee
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14">
        {/* Hero */}
        <div className="mb-14 text-center">
          <div className="mb-4 text-5xl">🎮</div>
          <h1 className="gradient-text text-4xl font-extrabold tracking-tight sm:text-5xl">
            About Sprite Bench
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
            A fast, free, browser-side tool for turning sprite sheets into animated GIFs.
            No account, no server, no cost — ever.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#06b6d4", color: "#0b0914" }}
          >
            Try it now →
          </Link>
        </div>

        {/* What it does */}
        <section className="mb-14">
          <h2 className="mb-6 text-xl font-bold text-zinc-100">What it does</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-5"
                style={{ border: "1px solid rgba(139,92,246,0.18)", background: "rgba(255,255,255,0.03)" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">{f.icon}</span>
                  <h3 className="font-semibold text-zinc-100">{f.title}</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-14 rounded-2xl p-7" style={{ border: "1px solid rgba(6,182,212,0.2)", background: "rgba(6,182,212,0.04)" }}>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">How it works</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-3">
            Everything runs in your browser using the Canvas API. When you drop a sprite sheet,
            the tool reads each pixel to detect background gaps and suggest a grid. Slicing
            samples pixel rectangles directly from the image element — no file upload, no server round-trip.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed mb-3">
            The GIF encoder is written from scratch in TypeScript — a dependency-free implementation
            of the GIF89a spec with median-cut palette quantization and transparency support.
            Same story for the ZIP writer: raw PKWARE format, no library.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The result: the whole tool is four files, ships zero runtime dependencies beyond
            Next.js + React, and costs $0 to run.
          </p>
        </section>

        {/* Built by */}
        <section className="mb-14 rounded-2xl p-7" style={{ border: "1px solid rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.04)" }}>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Built by Nathan Watkins</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            I&apos;m a software developer who builds tools in public at{" "}
            <a
              href="https://n8builds.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              n8builds.dev
            </a>
            . Sprite Bench started as a sub-tool inside a larger AI asset pipeline and
            got spun out because it was useful on its own.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed mb-5">
            If you make games, do pixel art, or just needed to turn a sprite sheet into a
            GIF without logging into some service — this was built for you. It&apos;ll stay
            free forever.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://n8builds.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105"
              style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "#a855f7" }}
            >
              🔨 n8builds.dev
            </a>
            <a
              href="https://github.com/n8watkins/sprite-bench"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#e4e4e7" }}
            >
              ⭐ Star on GitHub
            </a>
          </div>
        </section>

        {/* Ko-fi CTA */}
        <section
          className="rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, rgba(255,94,91,0.12) 0%, rgba(168,85,247,0.1) 100%)", border: "1px solid rgba(255,94,91,0.25)" }}
        >
          <div className="text-4xl mb-3">☕</div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Like what you see?</h2>
          <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
            Sprite Bench is free, ad-free, and always will be. If it saved you time,
            buying me a coffee is the best way to say thanks and keep projects like
            this coming.
          </p>
          <a
            href="https://ko-fi.com/n8watkins"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold transition-all hover:scale-105 hover:opacity-90"
            style={{ background: "#ff5e5b", color: "#fff" }}
          >
            ☕ Buy me a coffee on Ko-fi
          </a>
        </section>
      </main>

      <footer className="mt-10 pb-10 px-6 text-center">
        <div className="flex items-center justify-center gap-5 text-xs text-zinc-600">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
          <a href="https://github.com/n8watkins/sprite-bench" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">GitHub</a>
          <a href="https://n8builds.dev" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">n8builds.dev</a>
        </div>
      </footer>
    </div>
  );
}

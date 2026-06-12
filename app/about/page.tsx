import type { Metadata } from "next";
import Link from "next/link";
import { Star, Coffee, ExternalLink, Gamepad2, Hammer } from "lucide-react";

function GitHubIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "About — Sprite Bench",
  description: "What Sprite Bench is, how it works, and who built it.",
};

const features = [
  { icon: "🎯", title: "Auto-detect grid", body: "Drop any sprite sheet and Sprite Bench reads the background color gaps to suggest the right rows and columns. No counting frames by hand." },
  { icon: "⚡", title: "Live preview", body: "The animation plays as you adjust settings — you see exactly what your GIF will look like before you export." },
  { icon: "✂️", title: "Per-frame control", body: "Toggle frames in/out, nudge the crop 1px at a time (or 8px with Shift), set hold duration, and reorder frames." },
  { icon: "🔧", title: "Stabilize", body: "If your sprite drifts between cells, Stabilize aligns every frame to a common anchor — feet or center — so your animation stops jittering." },
  { icon: "🎬", title: "Ping-pong & scale", body: "Export at 1×, 2×, or 4× for pixel-perfect upscaling. Enable ping-pong to bake a forward-then-reverse loop into the file." },
  { icon: "📦", title: "GIF or zip", body: "Export an animated GIF with transparent or solid background, or download all frames as individual PNGs in a zip. Copy the GIF straight to clipboard." },
];

const otherProjects = [
  {
    name: "TL;DW",
    tagline: "One-keystroke YouTube → Gemini summary",
    category: "Chrome extension",
    icon: "📺",
    href: "https://n8builds.dev/builds/tldw",
    color: "rgba(251,146,60,0.15)",
    border: "rgba(251,146,60,0.3)",
    textColor: "#fb923c",
  },
  {
    name: "Quizmatic",
    tagline: "AI-generated quizzes on any topic",
    category: "Web app",
    icon: "🧠",
    href: "https://quizmatic.vercel.app",
    color: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.3)",
    textColor: "#a855f7",
  },
  {
    name: "Portfolio Rank",
    tagline: "The best dev portfolios, ranked by ELO",
    category: "Web app",
    icon: "🏆",
    href: "https://portfolio-rank.vercel.app",
    color: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.3)",
    textColor: "#06b6d4",
  },
  {
    name: "Chrome Extension Kit",
    tagline: "Config-driven Manifest V3 starter",
    category: "Starter template",
    icon: "🧩",
    href: "https://n8builds.dev/builds/chrome-extension-kit",
    color: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.3)",
    textColor: "#818cf8",
  },
  {
    name: "TubeVault",
    tagline: "Local-first YouTube video archiver",
    category: "Chrome extension",
    icon: "📼",
    href: "https://n8builds.dev/builds/tubevault",
    color: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    textColor: "#f87171",
  },
  {
    name: "Solara",
    tagline: "Know your sun window",
    category: "Web app",
    icon: "☀️",
    href: "https://n8builds.dev/builds/solara",
    color: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.3)",
    textColor: "#fbbf24",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen text-zinc-100" style={{ background: "#0b0914" }}>
      {/* Floating pixels */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="pixel-float" />
        ))}
      </div>

      {/* Nav */}
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-md"
        style={{ borderColor: "rgba(139,92,246,0.25)", background: "rgba(11,9,20,0.95)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-zinc-100 hover:opacity-80 transition-opacity shrink-0">
            <Gamepad2 size={20} className="text-purple-400" />
            <span className="text-sm font-extrabold">Sprite Bench</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/" className="rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-400 transition-all hover:text-zinc-200 hover:bg-white/5">
              ← Tool
            </Link>
            <a
              href="https://github.com/n8watkins/sprite-bench"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-400 transition-all hover:text-zinc-200 hover:bg-white/5"
            >
              <GitHubIcon size={13} /> GitHub
            </a>
            <a
              href="https://ko-fi.com/n8watkins"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:scale-105"
              style={{ background: "#ff5e5b", color: "#fff" }}
            >
              <Coffee size={13} /> Buy me a coffee
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-14">
        {/* Hero */}
        <div className="mb-14 text-center">
          <div className="mb-4"><Gamepad2 size={52} className="inline text-purple-400" /></div>
          <h1 className="gradient-text text-4xl font-extrabold tracking-tight sm:text-5xl">About Sprite Bench</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
            A fast, free, browser-side tool for turning sprite sheets into animated GIFs.
            No account, no server, no cost — ever.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:scale-105"
              style={{ background: "#06b6d4", color: "#0b0914" }}
            >
              Try it now <ExternalLink size={14} />
            </Link>
            <a
              href="https://github.com/n8watkins/sprite-bench"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:scale-105"
              style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)", color: "#fbbf24" }}
            >
              <Star size={14} fill="currentColor" /> Star on GitHub
            </a>
          </div>
        </div>

        {/* Features */}
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
            the tool reads the pixels to detect background color gaps and suggest the right grid.
            Slicing samples pixel rectangles directly from the image — no upload, no server round-trip.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The GIF encoder is written from scratch in TypeScript — dependency-free GIF89a with median-cut
            palette quantization and transparency support. Same for the ZIP writer: raw PKWARE format, no library.
            The whole tool ships zero runtime deps beyond Next.js and React.
          </p>
        </section>

        {/* Other projects */}
        <section className="mb-14">
          <div className="mb-6 flex items-center gap-2">
            <Hammer size={18} className="text-purple-400" />
            <h2 className="text-xl font-bold text-zinc-100">More from n8builds.dev</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {otherProjects.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank" rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-2xl p-4 transition-all hover:scale-[1.02]"
                style={{ border: `1px solid ${p.border}`, background: p.color }}
              >
                <span className="text-2xl mt-0.5 shrink-0">{p.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm" style={{ color: p.textColor }}>{p.name}</span>
                    <span className="text-xs text-zinc-600 rounded-full px-2 py-0.5" style={{ background: "rgba(255,255,255,0.05)" }}>{p.category}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{p.tagline}</p>
                </div>
                <ExternalLink size={13} className="shrink-0 mt-1 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </a>
            ))}
          </div>
          <div className="mt-5 text-center">
            <a
              href="https://n8builds.dev"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.35)", color: "#a855f7" }}
            >
              <img src="https://n8builds.dev/tab/n8-icon-192.png" alt="n8builds" width={16} height={16} className="rounded-sm" />
              See everything at n8builds.dev
            </a>
          </div>
        </section>

        {/* Built by */}
        <section className="mb-14 rounded-2xl p-7" style={{ border: "1px solid rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.04)" }}>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Built by Nathan Watkins</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-5">
            I&apos;m a software developer building tools in public at{" "}
            <a href="https://n8builds.dev" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              n8builds.dev
            </a>
            . Sprite Bench started inside a larger AI asset pipeline and got spun out as its own free tool.
            If you make games, do pixel art, or just needed a GIF without signing up somewhere — this was built for you.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://n8builds.dev"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105"
              style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "#a855f7" }}
            >
              <img src="https://n8builds.dev/tab/n8-icon-192.png" alt="n8builds" width={16} height={16} className="rounded-sm" />
              n8builds.dev
            </a>
            <a
              href="https://github.com/n8watkins/sprite-bench"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#e4e4e7" }}
            >
              <GitHubIcon size={15} /> View source
            </a>
            <a
              href="https://github.com/n8watkins/sprite-bench"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105"
              style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)", color: "#fbbf24" }}
            >
              <Star size={14} fill="currentColor" /> Star on GitHub
            </a>
          </div>
        </section>

        {/* Ko-fi CTA */}
        <section
          className="rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, rgba(255,94,91,0.12) 0%, rgba(168,85,247,0.1) 100%)", border: "1px solid rgba(255,94,91,0.25)" }}
        >
          <Coffee size={40} className="inline mb-3 text-[#ff5e5b]" />
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Like what you see?</h2>
          <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
            Sprite Bench is free, ad-free, and always will be. Buying me a coffee is the best way to
            say thanks and keep projects like this coming.
          </p>
          <a
            href="https://ko-fi.com/n8watkins"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold transition-all hover:scale-105 hover:opacity-90"
            style={{ background: "#ff5e5b", color: "#fff" }}
          >
            <Coffee size={16} /> Buy me a coffee on Ko-fi
          </a>
        </section>
      </main>

      <footer className="relative z-10 mt-10 pb-10 px-6 text-center">
        <div className="flex items-center justify-center gap-5 text-xs text-zinc-600">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
          <a href="https://github.com/n8watkins/sprite-bench" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-zinc-400 transition-colors"><GitHubIcon size={11} /> GitHub</a>
          <a href="https://n8builds.dev" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">n8builds.dev</a>
          <a href="https://ko-fi.com/n8watkins" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-zinc-400 transition-colors"><Coffee size={11} /> Ko-fi</a>
        </div>
      </footer>
    </div>
  );
}

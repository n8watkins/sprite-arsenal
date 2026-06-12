"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Star, Coffee, Gamepad2 } from "lucide-react";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}
import AnimationPreview from "@/components/sprite/AnimationPreview";
import { downloadZip, zipEntriesFromDataUrls } from "@/lib/zip";
import { encodeGif } from "@/lib/sprite/gif";
import { makeDemoSheet, DEMO_NAME } from "@/lib/sprite/demo";
import {
  autoDetectGrid,
  computeStabilizeTweaks,
  frameDims,
  scaleImageData,
  sliceSpritesheet,
  MAX_FRAMES,
  type FrameTweak,
  type GridSpec,
  type SlicedFrame,
  type StabilizeAnchor,
} from "@/lib/sprite/slice";

// Sprite bench: slice a sprite sheet on a grid, preview the animation live,
// export an animated GIF (or the frames as a zip). Everything runs locally in
// the browser — zero model calls, zero cost.

interface SourceSheet {
  dataUrl: string;
  img: HTMLImageElement;
  name: string;
  width: number;
  height: number;
}

const DEFAULT_GRID: GridSpec = {
  rows: 4,
  cols: 4,
  offsetTop: 0,
  offsetBottom: 0,
  offsetLeft: 0,
  offsetRight: 0,
};

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode image."));
    img.src = dataUrl;
  });
}

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  const v = m ? parseInt(m[1], 16) : 0xffffff;
  return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
}

function gridToDraft(g: GridSpec): Record<keyof GridSpec, string> {
  return {
    rows: String(g.rows),
    cols: String(g.cols),
    offsetTop: String(g.offsetTop),
    offsetBottom: String(g.offsetBottom),
    offsetLeft: String(g.offsetLeft),
    offsetRight: String(g.offsetRight),
  };
}

export default function SpriteBench() {
  const [source, setSource] = useState<SourceSheet | null>(null);
  const [grid, setGrid] = useState<GridSpec>(DEFAULT_GRID);
  const [draft, setDraft] = useState<Record<keyof GridSpec, string>>(() =>
    gridToDraft(DEFAULT_GRID),
  );
  const [frames, setFrames] = useState<SlicedFrame[]>([]);
  const [tweaks, setTweaks] = useState<Map<number, FrameTweak>>(new Map());
  const [order, setOrder] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [anchor, setAnchor] = useState<StabilizeAnchor>("bottom");
  const [excluded, setExcluded] = useState<Set<number>>(new Set());
  const [skipBlank, setSkipBlank] = useState(true);
  const [fps, setFps] = useState(10);
  const [pingPong, setPingPong] = useState(false);
  const [transparent, setTransparent] = useState(true);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1);
  const [gif, setGif] = useState<{ url: string; bytes: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const gifUrlRef = useRef<string | null>(null);

  // Fetch live GitHub star count
  useEffect(() => {
    fetch("https://api.github.com/repos/n8watkins/sprite-bench")
      .then((r) => r.json())
      .then((d: { stargazers_count?: number }) => {
        if (typeof d.stargazers_count === "number") setStarCount(d.stargazers_count);
      })
      .catch(() => {});
  }, []);

  // ---- Source intake (file / drop / paste) ----
  const acceptFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setError(null);
    try {
      const dataUrl = await readImageFile(file);
      const img = await loadImage(dataUrl);
      const detected = autoDetectGrid(img);
      if (detected) setGrid(detected);
      setSource({ dataUrl, img, name: file.name, width: img.naturalWidth, height: img.naturalHeight });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  }, []);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files ?? []).find((f) =>
        f.type.startsWith("image/"),
      );
      if (file) void acceptFile(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [acceptFile]);

  const handlePasteButton = useCallback(async () => {
    setError(null);
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((t) => t.startsWith("image/"));
        if (type) {
          const blob = await item.getType(type);
          await acceptFile(new File([blob], "pasted-image.png", { type }));
          return;
        }
      }
      setError("No image on the clipboard — copy an image first, then hit Paste.");
    } catch {
      setError(
        "Couldn't read the clipboard (browser blocked it). Pressing Ctrl/Cmd+V anywhere on the page also works.",
      );
    }
  }, [acceptFile]);

  // Load the demo slime on first visit so the page is alive immediately.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const dataUrl = makeDemoSheet();
      if (!dataUrl) return;
      const img = await loadImage(dataUrl);
      if (cancelled) return;
      setSource(
        (prev) =>
          prev ?? { dataUrl, img, name: DEMO_NAME, width: img.naturalWidth, height: img.naturalHeight },
      );
    })();
    return () => { cancelled = true; };
  }, []);

  // ---- Slice whenever the sheet or grid changes ----
  useEffect(() => {
    if (!source) { setFrames([]); return; }
    if (grid.rows * grid.cols > MAX_FRAMES) {
      setFrames([]);
      setError(`That grid is ${grid.rows}×${grid.cols} — over the ${MAX_FRAMES}-frame cap.`);
      return;
    }
    setError(null);
    const sliced = sliceSpritesheet(source.img, grid);
    setFrames(sliced);
    setOrder(sliced.map((f) => f.index));
    setTweaks(new Map());
    setSelected(null);
    setExcluded(new Set());
    setGif(null);
  }, [source, grid]);

  useEffect(() => { setDraft(gridToDraft(grid)); }, [grid]);

  // ---- Grid overlay on the sheet preview ----
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas || !source) return;
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { frameW, frameH } = frameDims(source.width, source.height, grid);
    if (frameW < 1 || frameH < 1) return;
    ctx.strokeStyle = "rgba(34, 211, 238, 0.9)";
    ctx.lineWidth = Math.max(1, Math.round(source.width / 512));
    const effW = frameW * grid.cols;
    const effH = frameH * grid.rows;
    ctx.strokeRect(grid.offsetLeft, grid.offsetTop, effW, effH);
    for (let c = 1; c < grid.cols; c++) {
      const x = grid.offsetLeft + c * frameW;
      ctx.beginPath(); ctx.moveTo(x, grid.offsetTop); ctx.lineTo(x, grid.offsetTop + effH); ctx.stroke();
    }
    for (let r = 1; r < grid.rows; r++) {
      const y = grid.offsetTop + r * frameH;
      ctx.beginPath(); ctx.moveTo(grid.offsetLeft, y); ctx.lineTo(grid.offsetLeft + effW, y); ctx.stroke();
    }
  }, [source, grid]);

  // ---- Frame selection (in display order) ----
  const included = order
    .map((i) => frames[i])
    .filter((f): f is SlicedFrame => !!f && !excluded.has(f.index) && !(skipBlank && f.blank));

  const previewFrames = included.map((f) => ({
    imageData: f.imageData,
    hold: tweaks.get(f.index)?.hold ?? 1,
  }));

  const toggleFrame = useCallback((index: number) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
    setGif(null);
  }, []);

  // ---- Auto-detect ----
  const handleAutoDetect = useCallback(() => {
    if (!source) return;
    const detected = autoDetectGrid(source.img);
    if (detected) setGrid(detected);
    else setError("Couldn't auto-detect a grid — sprites may not have background gaps between them.");
  }, [source]);

  // ---- Per-frame tweaks ----
  const applyTweaks = useCallback(
    (next: Map<number, FrameTweak>) => {
      if (!source) return;
      setTweaks(next);
      setFrames(sliceSpritesheet(source.img, grid, next));
      setGif(null);
    },
    [source, grid],
  );

  const updateTweak = useCallback(
    (index: number, patch: Partial<FrameTweak>) => {
      const cur = tweaks.get(index) ?? { dx: 0, dy: 0, hold: 1 };
      const merged = { ...cur, ...patch };
      const next = new Map(tweaks);
      if (merged.dx === 0 && merged.dy === 0 && merged.hold === 1) next.delete(index);
      else next.set(index, merged);
      applyTweaks(next);
    },
    [tweaks, applyTweaks],
  );

  const handleStabilize = useCallback(() => {
    if (!source) return;
    const computed = computeStabilizeTweaks(source.img, grid, anchor, tweaks);
    if (computed) applyTweaks(computed);
    else setError("Couldn't stabilize — need at least two frames with content.");
  }, [source, grid, anchor, tweaks, applyTweaks]);

  // ---- Export ----
  const handleGenerate = useCallback(() => {
    if (included.length === 0) return;
    setBusy(true);
    setError(null);
    setTimeout(() => {
      try {
        const sequence = pingPong
          ? [...included, ...included.slice(1, -1).reverse()]
          : included;
        const blob = encodeGif(
          sequence.map((f) => scaleImageData(f.imageData, scale)),
          {
            delayMs: 1000 / fps,
            delaysMs: sequence.map((f) => (1000 / fps) * (tweaks.get(f.index)?.hold ?? 1)),
            transparent,
            background: hexToRgb(bgColor),
          },
        );
        if (gifUrlRef.current) URL.revokeObjectURL(gifUrlRef.current);
        const url = URL.createObjectURL(blob);
        gifUrlRef.current = url;
        setGif({ url, bytes: blob.size });
      } catch (e) {
        setError(e instanceof Error ? e.message : "GIF encoding failed.");
      } finally {
        setBusy(false);
      }
    }, 30);
  }, [included, fps, pingPong, transparent, bgColor, tweaks, scale]);

  useEffect(() => () => { if (gifUrlRef.current) URL.revokeObjectURL(gifUrlRef.current); }, []);

  const exportCount = pingPong
    ? Math.max(included.length, included.length * 2 - 2)
    : included.length;

  const handleDownloadFrames = useCallback(() => {
    if (!source || included.length === 0) return;
    const base = source.name.replace(/\.[a-z0-9]+$/i, "") || "sprite";
    downloadZip(
      `${base}-frames.zip`,
      zipEntriesFromDataUrls(
        included.map((f, i) => ({
          name: `${base}-frame-${String(i + 1).padStart(2, "0")}`,
          dataUrl: f.dataUrl,
        })),
      ),
    );
  }, [source, included]);

  const setGridField = (field: keyof GridSpec, raw: string) => {
    setDraft((d) => ({ ...d, [field]: raw }));
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return;
    const v = field === "rows" || field === "cols" ? Math.max(1, n) : Math.max(0, n);
    setGrid((g) => (g[field] === v ? g : { ...g, [field]: v }));
  };

  const numInput = (label: string, field: keyof GridSpec, min: number) => (
    <label className="flex flex-col gap-1 text-xs font-medium text-zinc-400">
      {label}
      <input
        type="number"
        min={min}
        value={draft[field]}
        onChange={(e) => setGridField(field, e.target.value)}
        onBlur={() => setDraft((d) => ({ ...d, [field]: String(grid[field]) }))}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-500 focus:outline-none"
      />
    </label>
  );

  return (
    <div className="min-h-screen text-zinc-100" style={{ background: "#0b0914" }}>
      {/* Floating pixel background */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="pixel-float" />
        ))}
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-20 border-b backdrop-blur-md" style={{ borderColor: "rgba(139,92,246,0.25)", background: "rgba(11,9,20,0.95)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 font-bold tracking-tight text-zinc-100 hover:opacity-80 transition-opacity shrink-0">
            <Gamepad2 size={22} className="text-purple-400" />
            <span className="text-lg font-extrabold tracking-tight">Sprite Arsenal</span>
          </a>

          {/* Nav links */}
          <nav className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
            <a
              href="https://n8builds.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-400 transition-all hover:text-purple-300 hover:bg-purple-500/10"
            >
              <span className="inline-flex items-center justify-center rounded-full shrink-0" style={{ width: 24, height: 24, background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/n8-icon.png" alt="n8builds" width={14} height={14} className="rounded-full" />
              </span>
              <span className="hidden sm:inline">n8builds.dev</span>
            </a>
            <a
              href="https://github.com/n8watkins/sprite-bench"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all hover:scale-105"
              style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24" }}
            >
              <GitHubIcon size={13} />
              <Star size={11} fill="currentColor" />
              <span>{starCount !== null ? starCount : "Star"}</span>
            </a>
            <a
              href="/about"
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-400 transition-all hover:text-zinc-200 hover:bg-white/5"
            >
              About
            </a>
            <a
              href="https://ko-fi.com/n8watkins"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:scale-105 hover:opacity-90"
              style={{ background: "#ff5e5b", color: "#fff" }}
            >
              <Coffee size={13} />
              <span>Buy me a coffee</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-8 pb-6">
        <p className="mb-2 text-xs font-semibold tracking-widest uppercase" style={{ color: "#a855f7", letterSpacing: "0.12em" }}>
          Always free · Runs in your browser · No signup · No server
        </p>
        <p className="max-w-xl text-base text-zinc-400">
          Drop a sprite sheet, get a GIF. Auto-detects the grid, previews live, exports at 1×/2×/4×.
          Nothing leaves your browser — ever.
        </p>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8">

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 px-4 py-3 text-sm text-red-300" style={{ background: "rgba(239,68,68,0.08)" }}>
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" style={{ position: "relative", zIndex: 10 }}>
          {/* Left column: source + grid + export */}
          <div className="flex flex-col gap-6">
            {/* Source */}
            <section className="rounded-2xl p-5" style={{ border: "1px solid rgba(139,92,246,0.18)", background: "rgba(255,255,255,0.03)" }}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Sprite sheet
              </h2>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) void acceptFile(file);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-6 text-center transition-colors ${
                  dragOver
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-zinc-700 hover:border-zinc-500"
                }`}
              >
                <span className="text-sm font-medium text-zinc-200">
                  Drop, click, or paste a sprite sheet
                </span>
                <span className="text-xs text-zinc-500">PNG with transparency works best</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); void handlePasteButton(); }}
                  className="mt-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-cyan-500/60 hover:text-cyan-300"
                >
                  Paste from clipboard
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void acceptFile(file);
                  e.target.value = "";
                }}
              />
              {source && (
                <p className="mt-2 truncate text-xs text-zinc-500">
                  {source.name} · {source.width}×{source.height}
                </p>
              )}
            </section>

            {/* Grid */}
            <section className="rounded-2xl p-5" style={{ border: "1px solid rgba(139,92,246,0.18)", background: "rgba(255,255,255,0.03)" }}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Grid</h2>
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  disabled={!source}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-300 disabled:opacity-40"
                >
                  Auto-detect
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {numInput("Rows", "rows", 1)}
                {numInput("Columns", "cols", 1)}
                {numInput("Offset top", "offsetTop", 0)}
                {numInput("Offset bottom", "offsetBottom", 0)}
                {numInput("Offset left", "offsetLeft", 0)}
                {numInput("Offset right", "offsetRight", 0)}
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={skipBlank}
                  onChange={(e) => { setSkipBlank(e.target.checked); setGif(null); }}
                  className="accent-cyan-400"
                />
                Skip blank frames automatically
              </label>
              <div className="mt-3 flex items-center gap-2 border-t border-zinc-800 pt-3">
                <button
                  type="button"
                  onClick={handleStabilize}
                  disabled={!source}
                  title="Auto-align the sprite across frames so the animation doesn't jitter"
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-300 disabled:opacity-40"
                >
                  Stabilize frames
                </button>
                <select
                  value={anchor}
                  onChange={(e) => setAnchor(e.target.value as StabilizeAnchor)}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-300 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="bottom">anchor: feet (bottom)</option>
                  <option value="center">anchor: center</option>
                </select>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Stabilize aligns each frame&apos;s content to a common anchor —
                fixes sprites that drift around between cells.
              </p>
            </section>

            {/* Export */}
            <section className="rounded-2xl p-5" style={{ border: "1px solid rgba(139,92,246,0.18)", background: "rgba(255,255,255,0.03)" }}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">Export</h2>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-between gap-3 text-sm text-zinc-300">
                  <span>
                    Speed{" "}
                    <span className="text-xs text-zinc-500">({fps} fps · {Math.round(1000 / fps)}ms/frame)</span>
                  </span>
                  <input
                    type="range" min={1} max={30} value={fps}
                    onChange={(e) => { setFps(Number(e.target.value)); setGif(null); }}
                    className="w-40 accent-cyan-400"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 text-sm text-zinc-300">
                  <span>
                    Size{" "}
                    {included[0] && (
                      <span className="text-xs text-zinc-500">
                        ({included[0].imageData.width * scale}×{included[0].imageData.height * scale}px)
                      </span>
                    )}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 4].map((s) => (
                      <button
                        key={s} type="button"
                        onClick={() => { setScale(s); setGif(null); }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          scale === s
                            ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/40"
                            : "border border-zinc-700 text-zinc-300 hover:border-cyan-500/60 hover:text-cyan-300"
                        }`}
                      >
                        {s}×
                      </button>
                    ))}
                  </div>
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox" checked={pingPong}
                    onChange={(e) => { setPingPong(e.target.checked); setGif(null); }}
                    className="accent-cyan-400"
                  />
                  Ping-pong (forward then back)
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox" checked={transparent}
                    onChange={(e) => { setTransparent(e.target.checked); setGif(null); }}
                    className="accent-cyan-400"
                  />
                  Transparent background
                  {!transparent && (
                    <input
                      type="color" value={bgColor}
                      onChange={(e) => { setBgColor(e.target.value); setGif(null); }}
                      className="ml-2 h-7 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent"
                      title="Background color"
                    />
                  )}
                </label>
                <button
                  type="button" onClick={handleGenerate}
                  disabled={included.length === 0 || busy}
                  className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400 disabled:opacity-40"
                >
                  {busy ? "Encoding…" : `Generate GIF (${exportCount} frames)`}
                </button>
                {gif && (
                  <div className="flex flex-col items-center gap-3 rounded-xl p-4" style={{ border: "1px solid rgba(139,92,246,0.2)", background: "rgba(0,0,0,0.4)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={gif.url} alt="Generated sprite animation"
                      className="max-h-48 rounded-lg"
                      style={{
                        imageRendering: "pixelated",
                        backgroundImage: "conic-gradient(#3f3f46 0 25%, #27272a 0 50%, #3f3f46 0 75%, #27272a 0)",
                        backgroundSize: "16px 16px",
                      }}
                    />
                    <div className="flex items-center gap-3">
                      <a
                        href={gif.url} download="sprite-animation.gif"
                        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400"
                      >
                        Download GIF
                      </a>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await fetch(gif.url);
                            const blob = await res.blob();
                            await navigator.clipboard.write([
                              new ClipboardItem({ "image/gif": blob }),
                            ]);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          } catch {
                            setError("Clipboard copy isn't supported in this browser — use Download instead.");
                          }
                        }}
                        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-300"
                      >
                        {copied ? "Copied!" : "Copy GIF"}
                      </button>
                      <span className="text-xs text-zinc-500">{(gif.bytes / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                )}
                <button
                  type="button" onClick={handleDownloadFrames}
                  disabled={included.length === 0}
                  className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-300 disabled:opacity-40"
                >
                  Download frames (.zip)
                </button>
              </div>
            </section>
          </div>

          {/* Right column: previews */}
          <div className="flex flex-col gap-6">
            {source && (
              <section className="rounded-2xl p-5" style={{ border: "1px solid rgba(139,92,246,0.18)", background: "rgba(255,255,255,0.03)" }}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                  Sheet · grid overlay
                </h2>
                <div className="flex justify-center">
                <div className="overflow-hidden rounded-lg" style={{ display: "inline-block", maxWidth: "100%", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={source.dataUrl} alt="Sprite sheet"
                    className="block max-h-64 max-w-full border border-zinc-800"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <canvas
                    ref={overlayRef}
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  />
                </div>
                </div>
              </section>
            )}

            <section className="sticky top-20 z-10 rounded-2xl p-5 backdrop-blur-md" style={{ border: "1px solid rgba(139,92,246,0.25)", background: "rgba(11,9,20,0.85)" }}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Live preview
              </h2>
              <AnimationPreview frames={previewFrames} fps={fps} pingPong={pingPong} />
            </section>

            {frames.length > 0 && (
              <section className="rounded-2xl p-5" style={{ border: "1px solid rgba(139,92,246,0.18)", background: "rgba(255,255,255,0.03)" }}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Frames</h2>
                  <span className="text-xs text-zinc-500">
                    {included.length} of {frames.length} in animation — click a frame to edit
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.map((idx) => {
                    const f = frames[idx];
                    if (!f) return null;
                    const skipped = skipBlank && f.blank;
                    const off = excluded.has(f.index) || skipped;
                    const isSel = selected === f.index;
                    return (
                      <button
                        key={f.index} type="button"
                        onClick={() => setSelected(isSel ? null : f.index)}
                        title={skipped ? "Blank frame (auto-skipped)" : `Frame ${f.index + 1} — click to edit`}
                        className={`relative rounded-lg border p-0.5 transition-all ${
                          isSel
                            ? "border-cyan-300 ring-2 ring-cyan-400/60"
                            : off
                              ? "border-zinc-800 opacity-30 hover:opacity-60"
                              : "border-cyan-500/50 hover:border-cyan-400"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={f.dataUrl} alt={`Frame ${f.index + 1}`}
                          className="h-14 w-14 rounded object-contain"
                          style={{
                            imageRendering: "pixelated",
                            backgroundImage: "conic-gradient(#3f3f46 0 25%, #27272a 0 50%, #3f3f46 0 75%, #27272a 0)",
                            backgroundSize: "8px 8px",
                          }}
                        />
                        {skipped && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded bg-zinc-800 px-1 text-[9px] uppercase text-zinc-400">
                            blank
                          </span>
                        )}
                        {!skipped && excluded.has(f.index) && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded bg-zinc-800 px-1 text-[9px] uppercase text-zinc-400">
                            off
                          </span>
                        )}
                        {tweaks.has(f.index) && (
                          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-cyan-400" title="Adjusted" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selected !== null && frames[selected] && (() => {
                  const f = frames[selected];
                  const t = tweaks.get(selected) ?? { dx: 0, dy: 0, hold: 1 };
                  const pos = order.indexOf(selected);
                  const skipped = skipBlank && f.blank;
                  const nudge = (dx: number, dy: number, step: number) =>
                    updateTweak(selected, { dx: t.dx + dx * step, dy: t.dy + dy * step });
                  const move = (dir: -1 | 1) => {
                    const j = pos + dir;
                    if (j < 0 || j >= order.length) return;
                    const next = [...order];
                    [next[pos], next[j]] = [next[j], next[pos]];
                    setOrder(next);
                    setGif(null);
                  };
                  const btn =
                    "rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-300 disabled:opacity-40";
                  return (
                    <div className="animate-slide-down mt-4 rounded-xl p-4" style={{ border: "1px solid rgba(139,92,246,0.22)", background: "rgba(0,0,0,0.35)" }}>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-zinc-200">
                          Frame {pos + 1}
                          <span className="ml-2 text-xs font-normal text-zinc-500">
                            cell {f.index + 1}{skipped ? " · blank" : ""}
                          </span>
                        </h3>
                        <button type="button" onClick={() => setSelected(null)} className={btn}>Close</button>
                      </div>
                      <div className="flex flex-wrap items-start gap-5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={f.dataUrl} alt={`Frame ${f.index + 1} preview`}
                          className={`h-36 w-36 shrink-0 rounded-lg border object-contain ${
                            excluded.has(f.index) || skipped ? "border-zinc-800 opacity-40" : "border-zinc-700"
                          }`}
                          style={{
                            imageRendering: "pixelated",
                            backgroundImage: "conic-gradient(#3f3f46 0 25%, #27272a 0 50%, #3f3f46 0 75%, #27272a 0)",
                            backgroundSize: "16px 16px",
                          }}
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-4 text-sm text-zinc-300">
                          <button
                            type="button" disabled={skipped} onClick={() => toggleFrame(f.index)}
                            className={`self-start rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40 ${
                              excluded.has(f.index)
                                ? "border border-red-500/50 text-red-300 hover:border-red-400 hover:text-red-200"
                                : "bg-cyan-500 text-zinc-950 hover:bg-cyan-400"
                            }`}
                          >
                            {excluded.has(f.index) ? "✗ Removed from GIF — click to restore" : "✓ In animation — click to remove"}
                          </button>
                          <div className="flex items-center gap-2" title="Nudge the crop. Shift-click = 8px">
                            <span className="text-xs text-zinc-500">Nudge</span>
                            <button type="button" className={btn} onClick={(e) => nudge(-1, 0, e.shiftKey ? 8 : 1)}>←</button>
                            <button type="button" className={btn} onClick={(e) => nudge(1, 0, e.shiftKey ? 8 : 1)}>→</button>
                            <button type="button" className={btn} onClick={(e) => nudge(0, -1, e.shiftKey ? 8 : 1)}>↑</button>
                            <button type="button" className={btn} onClick={(e) => nudge(0, 1, e.shiftKey ? 8 : 1)}>↓</button>
                            <span className="text-xs tabular-nums text-zinc-500">dx {t.dx} · dy {t.dy}</span>
                            {(t.dx !== 0 || t.dy !== 0) && (
                              <button type="button" className={btn} onClick={() => updateTweak(selected, { dx: 0, dy: 0 })}>Reset</button>
                            )}
                          </div>
                          <div className="flex items-center gap-2" title="How long this frame is shown">
                            <span className="text-xs text-zinc-500">Duration</span>
                            <button type="button" className={btn} disabled={t.hold <= 1}
                              onClick={() => updateTweak(selected, { hold: Math.max(1, t.hold - 1) })}>−</button>
                            <span className="text-xs tabular-nums text-zinc-400">×{t.hold} ({Math.round((1000 / fps) * t.hold)}ms)</span>
                            <button type="button" className={btn} disabled={t.hold >= 10}
                              onClick={() => updateTweak(selected, { hold: Math.min(10, t.hold + 1) })}>+</button>
                          </div>
                          <div className="flex items-center gap-2" title="Reorder this frame in the animation">
                            <span className="text-xs text-zinc-500">Order</span>
                            <button type="button" className={btn} disabled={pos <= 0} onClick={() => move(-1)}>◀ earlier</button>
                            <button type="button" className={btn} disabled={pos >= order.length - 1} onClick={() => move(1)}>later ▶</button>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-zinc-500">
                        Tip: shift-click the nudge arrows to move 8px at a time. The cyan dot marks adjusted frames.
                      </p>
                    </div>
                  );
                })()}
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Ko-fi CTA banner */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 mt-12">
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(6,182,212,0.1) 100%)", border: "1px solid rgba(168,85,247,0.25)" }}
        >
          <div>
            <p className="font-bold text-zinc-100 text-base">Enjoying Sprite Arsenal?</p>
            <p className="text-sm text-zinc-400 mt-0.5">It&apos;s free and always will be. If it saved you time, a coffee keeps the lights on.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://github.com/n8watkins/sprite-bench"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:scale-105"
              style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)", color: "#fbbf24" }}
            >
              <Star size={14} fill="currentColor" />
              Star on GitHub
            </a>
            <a
              href="https://ko-fi.com/n8watkins"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 hover:opacity-90"
              style={{ background: "#ff5e5b", color: "#fff" }}
            >
              <Coffee size={14} />
              Buy me a coffee
            </a>
          </div>
        </div>
      </div>

      <footer className="relative z-10 mt-10 pb-10 px-6 text-center">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Gamepad2 size={18} className="text-purple-400" />
            <span className="font-bold text-zinc-200 text-sm tracking-tight">Sprite Arsenal</span>
          </div>
          <p className="text-xs text-zinc-500 mb-4">
            A free tool by{" "}
            <a href="https://n8builds.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              <img src="/n8-icon.png" alt="" width={12} height={12} className="rounded-sm inline" />
              n8builds.dev
            </a>
            {" "}— building useful things in public.
          </p>
          <div className="flex items-center justify-center gap-5 text-xs text-zinc-600">
            <a href="/about" className="hover:text-zinc-300 transition-colors">About</a>
            <a href="https://github.com/n8watkins/sprite-bench" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-zinc-300 transition-colors"><GitHubIcon size={12} /> GitHub</a>
            <a href="https://n8builds.dev" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">n8builds.dev</a>
            <a href="https://ko-fi.com/n8watkins" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-zinc-300 transition-colors"><Coffee size={12} /> Ko-fi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

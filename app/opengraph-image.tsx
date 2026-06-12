import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sprite Arsenal — sprite sheet to GIF converter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const cells = Array.from({ length: 16 });
  const colors = ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63"];

  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Sprite grid decoration — top-right corner */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 60,
            display: "flex",
            flexWrap: "wrap",
            width: 200,
            gap: 6,
            opacity: 0.35,
          }}
        >
          {cells.map((_, i) => (
            <div
              key={i}
              style={{
                width: 42,
                height: 42,
                borderRadius: 6,
                background: colors[i % colors.length],
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#f4f4f5",
              letterSpacing: "-3px",
              lineHeight: 1,
            }}
          >
            Sprite Arsenal
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#71717a",
              textAlign: "center",
              maxWidth: 680,
              lineHeight: 1.4,
            }}
          >
            Slice a sprite sheet · preview live · export GIF or frames
          </div>
          <div
            style={{
              marginTop: 16,
              padding: "12px 32px",
              background: "#06b6d4",
              color: "#09090b",
              borderRadius: 14,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            Free · runs entirely in the browser
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            color: "#3f3f46",
            fontSize: 18,
            letterSpacing: "0.5px",
          }}
        >
          sprite-bench.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}

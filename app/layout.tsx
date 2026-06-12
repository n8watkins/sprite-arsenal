import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sprite Bench",
  description:
    "Slice a sprite sheet, preview the animation live, and export an animated GIF or individual frames as a zip. Free, runs entirely in the browser.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

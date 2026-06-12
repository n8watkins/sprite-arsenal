import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://sprite-bench.vercel.app";
const DESCRIPTION =
  "Slice a sprite sheet, preview the animation live, and export an animated GIF or individual frames as a zip. Free, runs entirely in the browser.";

export const metadata: Metadata = {
  title: "Sprite Bench",
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Sprite Bench",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Sprite Bench",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sprite Bench",
    description: DESCRIPTION,
    creator: "@n8watkins",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

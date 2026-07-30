import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at top, #2a2440 0%, #14121f 70%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <svg viewBox="0 0 64 64" width="84" height="84">
            <defs>
              <linearGradient id="g" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#3b82f6" />
                <stop offset="0.45" stopColor="#8b5cf6" />
                <stop offset="0.75" stopColor="#ec4899" />
                <stop offset="1" stopColor="#fb923c" />
              </linearGradient>
              <mask id="m">
                <rect width="64" height="64" fill="white" />
                <path
                  d="M31 51 C26.5 47 19 42 19 35 C19 30.4 22.6 27.2 26.6 27.2 C29.2 27.2 30.9 28.7 31.6 29.8 C32.3 28.7 34 27.2 36.6 27.2 C40.6 27.2 44.2 30.4 44.2 35 C44.2 42 35.5 47 31 51 Z"
                  fill="black"
                />
                <rect x="41" y="37.5" width="15" height="6.5" fill="black" />
              </mask>
            </defs>
            <ellipse cx="21.5" cy="12.5" rx="7.5" ry="4.8" transform="rotate(-28 21.5 12.5)" fill="url(#g)" />
            <ellipse cx="42.5" cy="12.5" rx="7.5" ry="4.8" transform="rotate(28 42.5 12.5)" fill="url(#g)" />
            <circle cx="32" cy="7.5" r="4.5" fill="url(#g)" />
            <rect x="10" y="20" width="44" height="42" rx="15" fill="url(#g)" mask="url(#m)" />
          </svg>
          <div style={{ fontSize: 56, fontWeight: 700 }}>buymeagoddie</div>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Receive support directly with UPI.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#b9b3cc",
            textAlign: "center",
          }}
        >
          No gateway. No fees. No middleman. Just your page.
        </div>
      </div>
    ),
    size,
  );
}

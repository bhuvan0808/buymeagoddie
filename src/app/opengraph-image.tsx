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
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
              background: "linear-gradient(120deg,#8b5cf6,#d946ef,#f5c451)",
            }}
          >
            ₹
          </div>
          <div style={{ fontSize: 56, fontWeight: 700 }}>BuyMeAGoddie</div>
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

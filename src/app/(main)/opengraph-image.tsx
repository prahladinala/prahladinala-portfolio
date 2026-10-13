import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/config/constants";

export const alt = "Prahlad Inala | Software Engineer & Frontend Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "80px",
          fontFamily: "sans-serif",
          border: "12px solid #3b82f6",
        }}
      >
        {/* Top Tagline */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#60a5fa",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(96, 165, 250, 0.3)",
              padding: "8px 24px",
              borderRadius: "9999px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "flex",
            }}
          >
            Software Engineer & Frontend Developer
          </div>
        </div>

        {/* Hero Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            marginBottom: "auto",
            maxWidth: "90%",
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.15,
              display: "flex",
            }}
          >
            Prahlad Inala
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#a1a1aa",
              marginTop: "20px",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Engineering scalable web apps with React, Next.js, and TypeScript.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            borderTop: "2px solid #27272a",
            paddingTop: "36px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "28px",
                backgroundColor: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 900,
                color: "#ffffff",
              }}
            >
              PI
            </div>
            <div style={{ fontSize: 26, color: "#e4e4e7", display: "flex" }}>
              prahladinala.in • Portfolio & Digital Notes
            </div>
          </div>
          <div style={{ fontSize: 24, color: "#60a5fa", fontWeight: 600, display: "flex" }}>
            @prahladinala
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic params
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "Prahlad Inala | Portfolio & Notes";
    const topic = searchParams.get("topic") || "Software Engineer";
    const date = searchParams.get("date") || "";

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
            backgroundColor: "#09090b", // zinc-950 (dark mode)
            padding: "80px",
            fontFamily: "sans-serif",
            border: "12px solid #3b82f6", // blue-500 border
          }}
        >
          {/* Top section: Topic Badge & Date */}
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: "#60a5fa", // blue-400
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {topic}
            </div>
            {date && (
              <div style={{ fontSize: 28, color: "#a1a1aa" }}>{date}</div>
            )}
          </div>

          {/* Middle section: Title */}
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
              marginTop: "auto",
              marginBottom: "auto",
              maxWidth: "90%",
            }}
          >
            {title}
          </div>

          {/* Bottom section: Branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              borderTop: "2px solid #27272a", // zinc-800
              paddingTop: "40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "30px",
                  backgroundColor: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#ffffff",
                  marginRight: "20px",
                }}
              >
                P.
              </div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#e4e4e7" }}>
                Prahlad Inala
              </div>
            </div>
            <div style={{ fontSize: 28, color: "#a1a1aa" }}>
              prahladinala.in
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e.message);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}

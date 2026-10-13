import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "Prahlad Inala | Portfolio & Digital Notes";
    const topic = searchParams.get("topic") || "Software Engineer & Frontend";
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
            backgroundColor: "#09090b",
            backgroundImage: "radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "80px",
            fontFamily: "sans-serif",
            border: "12px solid #3b82f6",
          }}
        >
          {/* Top section: Topic Badge & Date */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
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
                letterSpacing: "1.5px",
                display: "flex",
              }}
            >
              {topic}
            </div>
            {date ? (
              <div
                style={{
                  fontSize: 26,
                  color: "#a1a1aa",
                  display: "flex",
                }}
              >
                {date}
              </div>
            ) : null}
          </div>

          {/* Middle section: Title */}
          <div
            style={{
              display: "flex",
              fontSize: title && title.length > 50 ? 56 : 68,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.25,
              marginTop: "auto",
              marginBottom: "auto",
              maxWidth: "92%",
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
              borderTop: "2px solid #27272a",
              paddingTop: "36px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
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
                  marginRight: "20px",
                }}
              >
                PI
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#f4f4f5", display: "flex" }}>
                  Prahlad Inala
                </div>
                <div style={{ fontSize: 20, color: "#a1a1aa", display: "flex" }}>
                  Software Engineer & Frontend Developer
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#60a5fa",
                display: "flex",
              }}
            >
              prahladinala.in
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      }
    );
  } catch (e: any) {
    console.error("OG Image generation failed:", e.message);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}

import { ImageResponse } from "next/og";
import { getNoteBySlug, getTopicName } from "@/lib/mdx";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function NoteOpenGraphImage({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic, slug } = await params;
  const note = getNoteBySlug(topic, slug);
  const topicName = getTopicName(topic);

  const title = note?.meta.title || slug;
  const date = note?.meta.date || "";
  const readingTime = note?.meta.readingTime || 5;
  const difficulty = note?.meta.difficulty || "Intermediate";

  // Dynamic topic accent colors
  const isReact = topic.toLowerCase().includes("react");
  const isAi = topic.toLowerCase().includes("ai");
  
  const accentColor = isReact ? "#06b6d4" : isAi ? "#a855f7" : "#3b82f6";
  const badgeBg = isReact
    ? "rgba(6, 182, 212, 0.15)"
    : isAi
    ? "rgba(168, 85, 247, 0.15)"
    : "rgba(59, 130, 246, 0.15)";
  const badgeBorder = isReact
    ? "rgba(6, 182, 212, 0.4)"
    : isAi
    ? "rgba(168, 85, 247, 0.4)"
    : "rgba(59, 130, 246, 0.4)";

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
          padding: "70px 80px",
          fontFamily: "sans-serif",
          border: `12px solid ${accentColor}`,
        }}
      >
        {/* Top: Topic badge + Stats Pill */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: accentColor,
                backgroundColor: badgeBg,
                border: `1px solid ${badgeBorder}`,
                padding: "8px 24px",
                borderRadius: "9999px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                display: "flex",
              }}
            >
              {topicName}
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#e4e4e7",
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                padding: "8px 18px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
              }}
            >
              ⚡ {readingTime} min read
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#e4e4e7",
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                padding: "8px 18px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
              }}
            >
              🎯 {difficulty}
            </div>
          </div>

          {date ? (
            <div
              style={{
                fontSize: 20,
                color: "#a1a1aa",
                fontWeight: 500,
                display: "flex",
              }}
            >
              {date}
            </div>
          ) : null}
        </div>

        {/* Middle: Title */}
        <div
          style={{
            display: "flex",
            fontSize: title.length > 45 ? 54 : 64,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.22,
            marginTop: "auto",
            marginBottom: "auto",
            maxWidth: "96%",
            letterSpacing: "-0.5px",
          }}
        >
          {title}
        </div>

        {/* Bottom: Author branding & Site */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            borderTop: "2px solid #27272a",
            paddingTop: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "28px",
                backgroundColor: accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 900,
                color: "#ffffff",
                marginRight: "20px",
                boxShadow: `0 0 20px ${badgeBorder}`,
              }}
            >
              PI
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#f4f4f5",
                  display: "flex",
                }}
              >
                Prahlad Inala
              </div>
              <div style={{ fontSize: 16, color: "#a1a1aa", display: "flex" }}>
                Software Engineer • prahladinala.in
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: accentColor,
              backgroundColor: badgeBg,
              padding: "8px 20px",
              borderRadius: "14px",
              display: "flex",
            }}
          >
            Digital Notes & Deep Dives
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

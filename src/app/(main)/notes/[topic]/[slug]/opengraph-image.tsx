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
        {/* Top: Topic badge & Date */}
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
            {topicName}
          </div>
          {date ? (
            <div
              style={{
                fontSize: 24,
                color: "#a1a1aa",
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
            fontSize: title.length > 50 ? 56 : 68,
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

        {/* Bottom: Author branding */}
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
              <div style={{ fontSize: 28, fontWeight: 700, color: "#f4f4f5", display: "flex" }}>
                Prahlad Inala
              </div>
              <div style={{ fontSize: 18, color: "#a1a1aa", display: "flex" }}>
                Software Engineer • prahladinala.in
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
            Digital Notes
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

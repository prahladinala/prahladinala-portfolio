import { NextResponse } from "next/server";
import { getTopics } from "@/lib/keystatic-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const topics = getTopics();
  const options = topics.map((t) => ({
    label: t.name,
    value: t.slug,
  }));
  return NextResponse.json(options);
}

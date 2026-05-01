import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

/** Simple constant-time string comparison to prevent timing attacks */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still run comparison to avoid timing difference on length
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a.charCodeAt(i) ^ (b.charCodeAt(i % b.length) || 0);
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function GET(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin not configured." },
      { status: 503 },
    );
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!safeEqual(token, adminPassword)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();

    const [visitorsDoc, ctaRaw, topQuestionsRaw, pendingGuestbook] =
      await Promise.all([
        db.collection("visitors").findOne({ type: "site_stats" }),
        db
          .collection("cta_clicks")
          .aggregate([
            { $group: { _id: "$action", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ])
          .toArray(),
        db
          .collection("bot_questions")
          .aggregate([
            { $group: { _id: "$question", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 },
          ])
          .toArray(),
        db
          .collection("guestbook")
          .find({ approved: false })
          .sort({ timestamp: -1 })
          .limit(20)
          .toArray(),
      ]);

    return NextResponse.json({
      totalVisitors: visitorsDoc?.visits ?? 0,
      ctaClicks: ctaRaw.map((r) => ({
        action: r._id as string,
        count: r.count as number,
      })),
      topQuestions: topQuestionsRaw.map((r) => ({
        question: r._id as string,
        count: r.count as number,
      })),
      pendingGuestbook: pendingGuestbook.map((e) => ({
        _id: e._id?.toString(),
        name: e.name,
        message: e.message,
        timestamp: e.timestamp,
      })),
    });
  } catch (err) {
    console.error("[admin]", (err as Error).message);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

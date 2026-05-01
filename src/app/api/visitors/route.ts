import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const STATS_TYPE = "site_stats";
const isProd = process.env.NODE_ENV === "production";
const tag = isProd ? "[visitors]" : "\x1b[33m[visitors]\x1b[0m";

interface SiteStats {
  type: string;
  visits: number;
  lastUpdated: Date;
  createdAt: Date;
}

/** GET /api/visitors — returns current unique visitor count */
export async function GET() {
  console.log(`${tag} GET /api/visitors`);
  try {
    const db = await getDb();
    const doc = await db
      .collection<SiteStats>("visitors")
      .findOne({ type: STATS_TYPE });

    const count = doc?.visits ?? 0;
    console.log(`${tag} ✓ count=${count}`);
    return NextResponse.json({ count });
  } catch (err) {
    console.error(`${tag} ✗ GET failed:`, (err as Error).message);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

/**
 * POST /api/visitors — counts unique visitors only.
 * Body: { visitorId: string }
 *
 * Uses upsert on visitor_ids: if the visitorId doc was just inserted
 * (upsertedCount === 1) it's a new unique visitor → increment the counter.
 * If the doc already existed → returning visitor → skip increment.
 */
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  let visitorId: string;
  try {
    const body = await req.json();
    visitorId =
      typeof body?.visitorId === "string" ? body.visitorId.trim() : "";
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!visitorId || visitorId.length > 64) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  console.log(`${tag} POST — visitorId=${visitorId.slice(0, 8)}…`);
  try {
    const db = await getDb();

    // Atomic upsert — upsertedCount=1 means brand new visitor
    const dedup = await db
      .collection("visitor_ids")
      .updateOne(
        { visitorId },
        { $setOnInsert: { visitorId, firstSeen: new Date() } },
        { upsert: true },
      );

    const isNew = dedup.upsertedCount === 1;

    if (!isNew) {
      // Returning visitor — just return the current count, no increment
      console.log(`${tag} ↩ returning visitor, skipping increment`);
      const doc = await db
        .collection<SiteStats>("visitors")
        .findOne({ type: STATS_TYPE });
      return NextResponse.json({ count: doc?.visits ?? 0, unique: false });
    }

    // New unique visitor — increment the counter
    const result = await db.collection<SiteStats>("visitors").findOneAndUpdate(
      { type: STATS_TYPE },
      {
        $inc: { visits: 1 },
        $set: { lastUpdated: new Date() },
        $setOnInsert: { type: STATS_TYPE, createdAt: new Date() },
      },
      { upsert: true, returnDocument: "after" },
    );

    const count = result?.visits ?? 1;
    console.log(`${tag} ✓ new unique visitor, total=${count}`);
    return NextResponse.json({ count, unique: true });
  } catch (err) {
    console.error(`${tag} ✗ POST failed:`, (err as Error).message);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

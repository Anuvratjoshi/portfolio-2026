import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const STATS_TYPE = "site_stats";
const isProd = process.env.NODE_ENV === "production";
const tag = isProd ? "[visitors]" : "\x1b[33m[visitors]\x1b[0m"; // yellow in dev

interface SiteStats {
  type: string;
  visits: number;
  lastUpdated: Date;
  createdAt: Date;
}

/** GET /api/visitors — returns current visit count */
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

/** POST /api/visitors — increments visit count by 1 */
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    console.warn(`${tag} POST rejected — bad content-type: ${contentType}`);
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  console.log(`${tag} POST /api/visitors — incrementing visit count`);
  try {
    const db = await getDb();
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
    console.log(`${tag} ✓ visit recorded, total=${count}`);
    return NextResponse.json({ count });
  } catch (err) {
    console.error(`${tag} ✗ POST failed:`, (err as Error).message);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const isProd = process.env.NODE_ENV === "production";
const tag = isProd ? "[guestbook]" : "\x1b[32m[guestbook]\x1b[0m";
const MAX_MESSAGE_LEN = 280;
const MAX_NAME_LEN = 50;

export interface GuestbookEntry {
  _id?: unknown;
  name: string;
  message: string;
  timestamp: Date;
  approved: boolean;
}

/** GET /api/guestbook — returns all approved entries, newest first */
export async function GET() {
  try {
    const db = await getDb();
    const entries = await db
      .collection<GuestbookEntry>("guestbook")
      .find({ approved: true })
      .sort({ timestamp: -1 })
      .limit(50)
      .project({ name: 1, message: 1, timestamp: 1 })
      .toArray();

    return NextResponse.json({ entries });
  } catch (err) {
    console.error(`${tag} ✗ GET failed:`, (err as Error).message);
    return NextResponse.json({ entries: [] }, { status: 500 });
  }
}

/** POST /api/guestbook — submit a new entry (pending approval) */
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  let name: string, message: string;
  try {
    const body = await req.json();
    name = typeof body.name === "string" ? body.name.trim() : "";
    message = typeof body.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!name || name.length > MAX_NAME_LEN) {
    return NextResponse.json(
      { error: "Name is required (max 50 chars)." },
      { status: 422 },
    );
  }
  if (!message || message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json(
      { error: `Message is required (max ${MAX_MESSAGE_LEN} chars).` },
      { status: 422 },
    );
  }

  // Basic spam filter — reject messages that are only URLs or repeated chars
  if (/^https?:\/\//i.test(message) || /(.)\1{9,}/.test(message)) {
    return NextResponse.json(
      { error: "Message looks like spam." },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();
    await db.collection<GuestbookEntry>("guestbook").insertOne({
      name,
      message,
      timestamp: new Date(),
      approved: false,
    });

    console.log(`${tag} ✓ new entry from "${name}" (pending approval)`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`${tag} ✗ POST failed:`, (err as Error).message);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

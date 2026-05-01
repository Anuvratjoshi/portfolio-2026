import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const isProd = process.env.NODE_ENV === "production";
const tag = isProd ? "[cta]" : "\x1b[33m[cta]\x1b[0m";

const ALLOWED_ACTIONS = new Set([
  "hire_me",
  "resume_download",
  "github",
  "linkedin",
  "email",
  "contact_form_submit",
  "nav_link",
  "bot_open",
  "scroll_to_section",
]);

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  let action: string,
    visitorId: string,
    meta: Record<string, string> = {};
  try {
    const body = await req.json();
    action = typeof body.action === "string" ? body.action.trim() : "";
    visitorId = typeof body.visitorId === "string" ? body.visitorId.trim() : "";
    if (body.meta && typeof body.meta === "object") meta = body.meta;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!action || !ALLOWED_ACTIONS.has(action)) {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection("cta_clicks").insertOne({
      action,
      visitorId: visitorId || "anonymous",
      meta,
      timestamp: new Date(),
    });
    console.log(`${tag} ✓ ${action} clicked`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`${tag} ✗ failed:`, (err as Error).message);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

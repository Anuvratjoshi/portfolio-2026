import { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";

/**
 * DELETE /api/chat/session
 * Clears a chat session from MongoDB when the user resets the chat.
 * Always responds 204 (non-fatal — client doesn't need to know if it failed).
 */
export async function DELETE(req: NextRequest) {
  try {
    const { sessionId } = (await req.json()) as { sessionId?: string };
    if (!sessionId || typeof sessionId !== "string") {
      return new Response(null, { status: 204 });
    }
    const db = await getDb();
    await db
      .collection("chat_sessions")
      .deleteOne({ sessionId: sessionId.slice(0, 64) });
  } catch {
    // Non-fatal — silently ignore
  }
  return new Response(null, { status: 204 });
}

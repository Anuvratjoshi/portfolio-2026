import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

// ── Category keyword map ────────────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  skills: [
    "skill",
    "stack",
    "technology",
    "tech",
    "language",
    "framework",
    "typescript",
    "react",
    "node",
    "graphql",
    "css",
    "tailwind",
    "frontend",
    "backend",
    "database",
    "mongodb",
    "sql",
    "redis",
    "websocket",
    "api",
    "testing",
    "serverless",
    "azure",
    "performance",
    "optimization",
    "authentication",
    "jwt",
    "oauth",
  ],
  projects: [
    "tardis",
    "diibs",
    "antayoga",
    "project",
    "built",
    "platform",
    "system",
    "pipeline",
    "cron",
    "rbac",
    "auction",
    "bidding",
    "mental health",
    "assessment",
    "scoring",
    "ingestion",
    "servicenow",
    "concurrency",
    "race condition",
    "redux",
  ],
  rentease: [
    "rentease",
    "rent ease",
    "rent-ease",
    "startup",
    "saas",
    "rental",
    "landlord",
    "tenant",
    "side hustle",
    "side project",
    "property",
    "india rental",
    "market",
    "unorganised",
    "knight frank",
  ],
  npm: [
    "npm",
    "package",
    "error-intelligence",
    "type-bridge",
    "open source",
    "library",
    "publish",
    "pipeline",
    "error handling",
    "type safety",
    "cli tool",
    "sdk generator",
  ],
  ai: [
    "ai",
    "copilot",
    "groq",
    "claude",
    "cursor",
    "workflow",
    "prompt",
    "artificial intelligence",
    "llm",
    "chatgpt",
    "openai",
    "model",
    "code generation",
    "instruction",
  ],
  experience: [
    "experience",
    "year",
    "company",
    "incipient",
    "acs",
    "role",
    "career",
    "work history",
    "position",
    "mentor",
    "senior",
    "delivery",
    "latency",
    "production",
    "incident",
    "code review",
    "architecture",
  ],
  hiring: [
    "hire",
    "available",
    "job",
    "opportunity",
    "salary",
    "remote",
    "interview",
    "offer",
    "role",
    "relocation",
    "notice",
    "freelance",
    "startup",
    "enterprise",
    "culture",
    "team",
  ],
};

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  let bestCategory = "general";
  let bestScore = 0;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }
  return bestCategory;
}

// ── POST /api/chat/followups ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      sessionId?: string;
      responseText?: string;
    };
    const { sessionId, responseText } = body;

    if (!sessionId || !responseText) {
      return Response.json({ questions: [] });
    }

    const cleanSessionId = sessionId.slice(0, 64);
    const db = await getDb();

    // Load already-shown followup ObjectIds for this session
    const session = await db
      .collection("chat_sessions")
      .findOne({ sessionId: cleanSessionId });
    const shownIds: ObjectId[] =
      (session?.shownFollowupIds as ObjectId[]) ?? [];

    const category = detectCategory(responseText.slice(0, 800));

    // Attempt 1: unseen questions from matched category
    let questions = await db
      .collection("followup_questions")
      .aggregate([
        { $match: { category, _id: { $nin: shownIds } } },
        { $sample: { size: 2 } },
      ])
      .toArray();

    // Attempt 2: if < 2 found, fill from any other category (still unseen)
    if (questions.length < 2) {
      const usedIds = [...shownIds, ...questions.map((q) => q._id as ObjectId)];
      const extra = await db
        .collection("followup_questions")
        .aggregate([
          { $match: { _id: { $nin: usedIds } } },
          { $sample: { size: 2 - questions.length } },
        ])
        .toArray();
      questions = [...questions, ...extra];
    }

    // Attempt 3: all have been shown — reset and pick fresh ones
    if (questions.length === 0) {
      questions = await db
        .collection("followup_questions")
        .aggregate([{ $sample: { size: 2 } }])
        .toArray();
      // Clear the shown list so the cycle restarts
      await db
        .collection("chat_sessions")
        .updateOne(
          { sessionId: cleanSessionId },
          { $set: { shownFollowupIds: questions.map((q) => q._id) } },
        )
        .catch(() => {});
    } else {
      // Mark as shown (addToSet to avoid duplicates)
      await db
        .collection("chat_sessions")
        .updateOne(
          { sessionId: cleanSessionId },
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            $addToSet: {
              shownFollowupIds: { $each: questions.map((q) => q._id) },
            } as any,
          },
        )
        .catch(() => {});
    }

    return Response.json({
      questions: questions.map((q) => ({
        id: (q._id as ObjectId).toString(),
        text: q.text as string,
      })),
    });
  } catch (err) {
    console.error("[/api/chat/followups]", err);
    return Response.json({ questions: [] });
  }
}

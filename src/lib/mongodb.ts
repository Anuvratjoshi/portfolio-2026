/**
 * MongoDB singleton client for Next.js.
 *
 * - Development: caches the client promise on `globalThis` so hot-reloads
 *   don't create hundreds of open connections.
 * - Production: module-level singleton (process is long-lived).
 *
 * Usage:
 *   import { getDb } from "@/lib/mongodb";
 *   const db = await getDb();
 */

import { MongoClient, MongoClientOptions, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const isProd = process.env.NODE_ENV === "production";
const tag = isProd ? "[MongoDB]" : "\x1b[36m[MongoDB]\x1b[0m"; // cyan in dev

if (!uri) {
  throw new Error(
    "MONGODB_URI is not defined. Add it to .env.local (dev) and Vercel env vars (prod).",
  );
}

const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5_000,
  socketTimeoutMS: 30_000,
  connectTimeoutMS: 10_000,
  // Emit monitoring events so we can log them
  monitorCommands: false, // keep logs clean; flip to true for query-level debug
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClient(): Promise<MongoClient> {
  const client = new MongoClient(uri!, options);

  // ── Connection lifecycle events ──────────────────────────────────────────
  client.on("serverOpening", (e) =>
    console.log(`${tag} Server opening: ${e.address}`),
  );
  client.on("serverClosed", (e) =>
    console.warn(`${tag} Server closed: ${e.address}`),
  );
  client.on("topologyOpening", () =>
    console.log(`${tag} Topology opening — establishing connection pool…`),
  );
  client.on("topologyClosed", () =>
    console.warn(`${tag} Topology closed — all connections released.`),
  );
  client.on("connectionPoolCreated", (e) =>
    console.log(
      `${tag} Connection pool created (address=${e.address}, max=${options.maxPoolSize})`,
    ),
  );
  client.on("connectionCreated", (e) =>
    console.log(`${tag} New connection created (id=${e.connectionId})`),
  );
  client.on("connectionClosed", (e) =>
    console.log(
      `${tag} Connection closed (id=${e.connectionId}, reason=${e.reason})`,
    ),
  );
  client.on("connectionCheckOutFailed", (e) =>
    console.warn(`${tag} Connection check-out failed: ${e.reason}`),
  );
  client.on("error", (err) => console.error(`${tag} Client error:`, err));

  console.log(`${tag} Connecting to MongoDB…`);

  return client
    .connect()
    .then(async (c) => {
      console.log(`${tag} ✓ Connected successfully.`);
      await ensureCollections(c.db("portfolio"));
      return c;
    })
    .catch((err) => {
      console.error(`${tag} ✗ Connection failed:`, err.message);
      throw err;
    });
}

// ── Collection bootstrap ────────────────────────────────────────────────────

async function ensureCollections(db: Db): Promise<void> {
  const tag2 = isProd
    ? "[MongoDB:bootstrap]"
    : "\x1b[35m[MongoDB:bootstrap]\x1b[0m";
  try {
    const existing = await db
      .listCollections({ name: "visitors" }, { nameOnly: true })
      .toArray();

    if (existing.length === 0) {
      await db.createCollection("visitors");
      console.log(`${tag2} Collection 'visitors' created.`);
    }

    const coll = db.collection("visitors");

    // Unique index on `type` for fast O(1) lookups on the singleton doc
    await coll.createIndex(
      { type: 1 },
      { name: "type_unique", unique: true, background: true },
    );
    // Index on lastUpdated for time-range queries
    await coll.createIndex(
      { lastUpdated: -1 },
      { name: "lastUpdated_desc", background: true },
    );

    // Upsert the singleton stats document so it always exists
    await coll.updateOne(
      { type: "site_stats" },
      {
        $setOnInsert: {
          type: "site_stats",
          visits: 0,
          lastUpdated: new Date(),
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    console.log(`${tag2} ✓ Collection 'visitors' ready (indexes ensured).`);
  } catch (err) {
    // Non-fatal — app still works, just log it
    console.warn(
      `${tag2} Collection bootstrap warning:`,
      (err as Error).message,
    );
  }
}

// ── Singleton management ────────────────────────────────────────────────────

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongoClientPromise) {
    console.log(`${tag} (dev) Creating new MongoClient (hot-reload safe).`);
    globalThis._mongoClientPromise = createClient();
  } else {
    console.log(`${tag} (dev) Reusing cached MongoClient from globalThis.`);
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  console.log(`${tag} (prod) Creating module-level MongoClient singleton.`);
  clientPromise = createClient();
}

export default clientPromise;

/** Returns the portfolio database. Awaited lazily on first API call. */
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("portfolio");
}

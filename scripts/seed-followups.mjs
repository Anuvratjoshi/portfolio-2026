/**
 * One-time seed script — inserts follow-up questions into MongoDB.
 * Run: node scripts/seed-followups.mjs
 * Requires MONGODB_URI in .env.local (loaded via --env-file flag or dotenv).
 */
import { MongoClient } from "mongodb";
import { readFileSync } from "fs";

// Load .env.local manually
try {
  const env = readFileSync(".env.local", "utf8");
  for (const line of env.split("\n")) {
    const [k, ...v] = line.split("=");
    if (k && v.length && !process.env[k.trim()]) {
      process.env[k.trim()] = v.join("=").trim();
    }
  }
} catch {}

const SEED = [
  // skills
  { text: "Does he know GraphQL?", category: "skills" },
  { text: "What's his strongest frontend skill?", category: "skills" },
  { text: "How deep is his TypeScript knowledge?", category: "skills" },
  { text: "Does he use TypeScript strictly or loosely?", category: "skills" },
  { text: "What state management tools does he prefer?", category: "skills" },
  { text: "How does he handle complex React state?", category: "skills" },
  {
    text: "What's his experience with Next.js App Router?",
    category: "skills",
  },
  { text: "How does he approach REST API design?", category: "skills" },
  { text: "What's his MongoDB indexing strategy?", category: "skills" },
  { text: "Does he know SQL databases too?", category: "skills" },
  { text: "What's his experience with Azure services?", category: "skills" },
  { text: "How does he handle JWT authentication?", category: "skills" },
  { text: "What's his experience with real-time systems?", category: "skills" },
  { text: "Does he use any caching layer like Redis?", category: "skills" },
  { text: "How does he monitor errors in production?", category: "skills" },
  { text: "What's his CSS architecture approach?", category: "skills" },
  { text: "Can he work with Tailwind CSS at scale?", category: "skills" },
  {
    text: "How does he optimize React rendering performance?",
    category: "skills",
  },
  { text: "What testing frameworks does he use?", category: "skills" },
  {
    text: "Does he write unit tests or integration tests?",
    category: "skills",
  },
  {
    text: "How does he approach code splitting and lazy loading?",
    category: "skills",
  },
  {
    text: "What's his experience with serverless functions?",
    category: "skills",
  },
  { text: "How does he handle CORS and API security?", category: "skills" },
  { text: "What databases has he worked with?", category: "skills" },
  { text: "How does he structure a Node.js project?", category: "skills" },
  {
    text: "What's his approach to component architecture in React?",
    category: "skills",
  },
  { text: "Has he worked with WebSockets?", category: "skills" },
  // projects
  {
    text: "What was the hardest technical challenge in TARDIS?",
    category: "projects",
  },
  {
    text: "How did TARDIS handle real-time data from ServiceNow?",
    category: "projects",
  },
  { text: "How did the RBAC system work in TARDIS?", category: "projects" },
  { text: "How were cron jobs structured in TARDIS?", category: "projects" },
  {
    text: "What caching strategies did he use in TARDIS?",
    category: "projects",
  },
  {
    text: "How did DIIBS prevent race conditions in auctions?",
    category: "projects",
  },
  { text: "How was Redux structured in DIIBS?", category: "projects" },
  {
    text: "How did DIIBS handle concurrent bid submissions?",
    category: "projects",
  },
  { text: "What was the role-based UI logic in DIIBS?", category: "projects" },
  {
    text: "How did the conditional scoring engine work in ANTAYOGA?",
    category: "projects",
  },
  {
    text: "How did ANTAYOGA handle non-linear question flows?",
    category: "projects",
  },
  {
    text: "What data privacy measures were in ANTAYOGA?",
    category: "projects",
  },
  {
    text: "How did ANTAYOGA's improvements boost user retention by 15%?",
    category: "projects",
  },
  {
    text: "What's the most complex system Anuvrat has built?",
    category: "projects",
  },
  {
    text: "How does he approach large-scale system design?",
    category: "projects",
  },
  { text: "How did he reduce API latency by 30%?", category: "projects" },
  { text: "Has he worked on multi-tenant systems?", category: "projects" },
  {
    text: "How does he approach database schema design?",
    category: "projects",
  },
  { text: "What was the data volume TARDIS processed?", category: "projects" },
  {
    text: "How did he handle memoization in the TARDIS dashboard?",
    category: "projects",
  },
  // rentease
  {
    text: "What's the total addressable market for RentEase?",
    category: "rentease",
  },
  { text: "How does RentEase differ from NoBroker?", category: "rentease" },
  { text: "What's RentEase's pricing model?", category: "rentease" },
  { text: "Who is RentEase's ideal customer?", category: "rentease" },
  { text: "What's RentEase's go-to-market strategy?", category: "rentease" },
  { text: "When will RentEase launch publicly?", category: "rentease" },
  {
    text: "What features are live on RentEase right now?",
    category: "rentease",
  },
  { text: "What's the tech stack behind RentEase?", category: "rentease" },
  { text: "What's RentEase's retention strategy?", category: "rentease" },
  { text: "How does RentEase plan to acquire users?", category: "rentease" },
  {
    text: "Is Anuvrat looking for co-founders for RentEase?",
    category: "rentease",
  },
  { text: "What are RentEase's unit economics?", category: "rentease" },
  {
    text: "Why is RentEase better than a WhatsApp group for landlords?",
    category: "rentease",
  },
  {
    text: "What problem does RentEase solve for tenants?",
    category: "rentease",
  },
  {
    text: "What's the market evidence behind RentEase's thesis?",
    category: "rentease",
  },
  {
    text: "What's RentEase's revenue potential at scale?",
    category: "rentease",
  },
  // myfriendlydoc
  {
    text: "What problem does MyFriendlyDoc solve?",
    category: "projects",
  },
  {
    text: "How does Wizzard improve documentation?",
    category: "projects",
  },
  {
    text: "What security features does MyFriendlyDoc have?",
    category: "projects",
  },
  {
    text: "Who is MyFriendlyDoc built for?",
    category: "projects",
  },
  {
    text: "What makes MyFriendlyDoc different from a basic notes app?",
    category: "projects",
  },
  // npm
  { text: "How many npm packages has he published?", category: "npm" },
  {
    text: "What was the inspiration for error-intelligence-layer?",
    category: "npm",
  },
  {
    text: "How does the 6-stage pipeline in error-intelligence-layer work?",
    category: "npm",
  },
  {
    text: "What AI providers does error-intelligence-layer support?",
    category: "npm",
  },
  {
    text: "How is error-intelligence-layer different from Sentry?",
    category: "npm",
  },
  {
    text: "How does error-intelligence-layer generate AI fix suggestions?",
    category: "npm",
  },
  {
    text: "What problem does @joshianuvrat/type-bridge solve?",
    category: "npm",
  },
  {
    text: "How does type-bridge strip sensitive fields automatically?",
    category: "npm",
  },
  { text: "What's the watch mode in type-bridge?", category: "npm" },
  { text: "How does the SDK generator in type-bridge work?", category: "npm" },
  { text: "Are his npm packages actively maintained?", category: "npm" },
  {
    text: "What's the zero-dependency approach in error-intelligence-layer?",
    category: "npm",
  },
  // ai
  { text: "Which AI tools does he use daily?", category: "ai" },
  { text: "How does he use GitHub Copilot in his workflow?", category: "ai" },
  {
    text: "What's his prompt engineering approach for large codebases?",
    category: "ai",
  },
  { text: "How does he use Claude for code reviews?", category: "ai" },
  { text: "Does he use AI for architecture decisions?", category: "ai" },
  { text: "How does he prevent AI from introducing bugs?", category: "ai" },
  {
    text: "What's the .github/instruction.md approach he uses?",
    category: "ai",
  },
  {
    text: "How does he maintain AI context across a large codebase?",
    category: "ai",
  },
  { text: "Which model does he prefer for code generation?", category: "ai" },
  { text: "How has AI changed his development speed?", category: "ai" },
  // experience
  {
    text: "Why did he move into a senior role at Incipient?",
    category: "experience",
  },
  {
    text: "How did he improve delivery timelines by 20%?",
    category: "experience",
  },
  {
    text: "What does his mentoring process look like?",
    category: "experience",
  },
  { text: "How does he conduct code reviews?", category: "experience" },
  { text: "How does he handle production incidents?", category: "experience" },
  { text: "What's his debugging methodology?", category: "experience" },
  {
    text: "How does he stay current with the tech ecosystem?",
    category: "experience",
  },
  { text: "What industries has he worked in?", category: "experience" },
  {
    text: "What was his biggest technical win at Incipient?",
    category: "experience",
  },
  {
    text: "What's his approach to system architecture at scale?",
    category: "experience",
  },
  { text: "Has he led a team before?", category: "experience" },
  {
    text: "How did he reduce latency by 30% in production?",
    category: "experience",
  },
  // hiring
  { text: "Is Anuvrat actively looking for a new role?", category: "hiring" },
  { text: "What kind of role is he looking for?", category: "hiring" },
  { text: "Is he open to relocation?", category: "hiring" },
  { text: "Can he work in a remote-first environment?", category: "hiring" },
  { text: "What's his notice period?", category: "hiring" },
  {
    text: "Does he prefer startup or enterprise environments?",
    category: "hiring",
  },
  { text: "How can I schedule an interview with him?", category: "hiring" },
  {
    text: "What's his preferred tech stack for a new role?",
    category: "hiring",
  },
  { text: "Has he worked with international teams?", category: "hiring" },
  { text: "What kind of team culture does he thrive in?", category: "hiring" },
  {
    text: "Can he handle both frontend and backend equally well?",
    category: "hiring",
  },
  { text: "What's his expected salary range?", category: "hiring" },
  // general
  { text: "What does he do outside of work?", category: "general" },
  { text: "What's his biggest technical ambition?", category: "general" },
  {
    text: "What motivated him to get into software development?",
    category: "general",
  },
  { text: "What's the next skill he wants to master?", category: "general" },
  {
    text: "What does a typical workday look like for him?",
    category: "general",
  },
  { text: "What's something unique about how he works?", category: "general" },
  { text: "Is he available for freelance projects?", category: "general" },
];

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("portfolio");
const fq = db.collection("followup_questions");

await fq.createIndex({ text: 1 }, { name: "text_unique", unique: true });
await fq.createIndex({ category: 1 });

const existing = await fq.countDocuments();
console.log(`Existing documents: ${existing}`);

const result = await fq
  .insertMany(SEED, { ordered: false })
  .catch((err) => ({ insertedCount: err.result?.nInserted ?? 0 }));

console.log(`Inserted: ${result.insertedCount}`);
console.log(`Total now: ${await fq.countDocuments()}`);

await client.close();

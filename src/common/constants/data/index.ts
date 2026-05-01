import type { Experience, Project, Skill } from "@/types";

export const PERSONAL = {
  name: "Anuvrat Joshi",
  role: "Senior Full Stack Developer",
  tagline:
    "Building scalable systems with MERN stack and AI-enhanced workflows.",
  email: "joshianuvrat@gmail.com",
  phone: "9557115385",
  location: "Haridwar, UK",
  linkedin: "https://linkedin.com/in/anuvrat-joshi-39b867190",
  github: "https://github.com/Anuvratjoshi",
  resumeUrl: "/Anuvrat_Resume.pdf",
  yearsOfExperience: "3+",
  summary:
    "Senior Full Stack Developer with 3+ years of expertise in the MERN Stack. Proven track record of spearheading architectural upgrades that improve system performance by 30% and delivery timelines by 20%.",
};

export const SKILLS: Skill[] = [
  {
    category: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "Python"],
  },
  {
    category: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "Redux",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "GraphQL",
      "Bootstrap",
      "Shadcn/UI",
    ],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "RESTful APIs", "DSA"],
  },
  {
    category: "Databases",
    items: ["MongoDB", "Mongoose ORM", "Cosmos DB", "SQL"],
  },
  {
    category: "Tools & DevOps",
    items: [
      "Git",
      "GitHub",
      "Azure Blob Storage",
      "Azure Event Grid",
      "Postman",
      "Agile/Scrum",
      "Bruno",
    ],
  },
  {
    category: "AI Tools",
    items: [
      "GitHub Copilot",
      "Groq Code Fast 1",
      "Anti Gravity",
      "AI-Assisted Workflows",
      "Cursor AI",
      "Claude",
      "ChatGPT",
      "OpenAI API",
    ],
  },
];

export const EXPERIENCES: Experience[] = [
  {
    company: "INCIPIENT INFOTECH",
    role: "Senior Full Stack Developer",
    period: "Jan 2025 – Present",
    location: "Ahmedabad, GJ",
    bullets: [
      "Led end-to-end development of scalable MERN stack modules, improving delivery timelines by 20%",
      "Implemented architectural enhancements that improved system performance and reduced latency by 30%",
      "Mentored junior developers, conducted code reviews, and enforced best practices for scalable and maintainable code",
    ],
  },
  {
    company: "INCIPIENT INFOTECH",
    role: "Full Stack Developer",
    period: "Oct 2023 – Jan 2025",
    location: "Ahmedabad, GJ",
    bullets: [
      "Developed scalable MERN stack applications, reducing frontend load times by 25% through optimized state management",
      "Integrated secure REST APIs and third-party services with authentication mechanisms such as OAuth and JWT",
      "Collaborated on system architecture design, reducing post-release defects through modular and reusable components",
    ],
  },
  {
    company: "ACS NETWORKS & TECHNOLOGY",
    role: "Full Stack Developer",
    period: "Jul 2022 – Sep 2023",
    location: "Dehradun, UK",
    bullets: [
      "Developed RESTful APIs and responsive web interfaces with sub-second response times",
      "Optimized MongoDB queries and indexing strategies to improve database performance and efficiency",
      "Contributed across the full SDLC in an Agile environment, delivering production-ready features under tight deadlines",
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    title: "TARDIS",
    subtitle: "API Intelligence Platform",
    description:
      "An enterprise-grade platform built to handle and streamline calling and recording data for a client's business processes. The system integrates multiple external services to collect large volumes of data in real time, then processes, normalizes, and stores it in a structured way so it can be easily consumed and analyzed. A key challenge was maintaining performance under continuous, high-volume data flow from enterprise tools like ServiceNow — solved through caching strategies, optimized queries, and memoized rendering on the frontend.",
    tags: [
      "Node.js",
      "Express.js",
      "React.js",
      "Azure Blob Storage",
      "MongoDB",
      "ServiceNow",
      "Cron Jobs",
      "RBAC",
    ],
    bullets: [
      "Designed scalable data ingestion pipelines integrating ServiceNow, Cloud9, and Cohesity ASC for continuous real-time data flow across enterprise systems",
      "Built cron-based automation for data normalization and cleanup, significantly reducing manual operations and improving data reliability",
      "Implemented role-based access control (RBAC) so users see context-appropriate dashboards and permissions based on their business role",
      "Optimized database query performance and applied caching strategies to handle large datasets without latency degradation",
      "Improved React.js dashboard rendering using memoization and lazy loading, eliminating unnecessary re-renders under heavy data loads",
    ],
  },
  {
    title: "DIIBS",
    subtitle: "Restaurant & Live Auction Platform",
    description:
      "A dual-purpose platform combining restaurant booking management with a live auction system where users participate in real-time bidding. The core challenge was maintaining UI consistency and data accuracy when multiple users interact simultaneously during high-concurrency auction events. Role-based access ensured admins, vendors, and customers each had tailored views and permissions without leaking state between roles.",
    tags: ["React.js", "Tailwind CSS", "Redux", "Node.js", "REST APIs", "RBAC"],
    bullets: [
      "Built responsive, role-specific UIs using React.js and Tailwind CSS, supporting distinct views for admins, vendors, and customers",
      "Implemented Redux-based global state management to maintain data consistency during simultaneous high-concurrency auction interactions",
      "Designed and integrated role-based access control ensuring secure, dynamic UI rendering without cross-role state leakage",
      "Integrated backend REST APIs for real-time auction updates and live notifications, delivering a seamless bidding experience",
      "Engineered the auction flow to handle race conditions and concurrent bid submissions without inconsistency or data loss",
    ],
  },
  {
    title: "ANTAYOGA",
    subtitle: "Mental Health Assessment Platform",
    description:
      "A personalized mental health platform where users evaluate their well-being through dynamic questionnaires and receive insights based on their responses. The core engineering challenge was the non-linear assessment flow — questions and scoring depended on prior answers, so I built a flexible conditional logic engine that handled branching flows and calculated personalized scores in real time. Data privacy and reliability were top priorities given the sensitivity of the domain.",
    tags: [
      "React.js",
      "Node.js",
      "MongoDB",
      "Conditional Logic Engine",
      "Secure Storage",
      "Performance Optimization",
    ],
    bullets: [
      "Architected a dynamic assessment engine supporting fully conditional question flows and personalized real-time scoring based on user responses",
      "Optimized React state management and component rendering to handle complex branching UIs with minimal latency and no jank",
      "Built secure backend APIs with strict data privacy controls to protect sensitive mental health information at rest and in transit",
      "Improved platform user retention by 15% through performance optimizations and a smoother, more responsive user experience",
      "Designed scalable APIs capable of handling growing user load without degradation in response times or assessment accuracy",
    ],
  },
];

export const AI_WORKFLOW = [
  {
    title: "Multi-Model Copilot Usage",
    description:
      "Leveraged GitHub Copilot with Grok Code Fast 1 for rapid UI generation and Claude Sonnet for code reviews, edge case handling, and logic validation.",
  },
  {
    title: "Structured AI Context",
    description:
      "Created a .github/instruction.md defining complete project architecture, components, and workflows — enabling AI models to operate with full codebase context.",
  },
  {
    title: "AI-Assisted MERN Development",
    description:
      "Built workflows where AI assists in UI development, backend logic implementation, debugging, and performance optimization across MERN stack applications.",
  },
  {
    title: "Advanced Prompt Engineering",
    description:
      "Applied prompt engineering techniques to guide AI models for complex feature development, API integrations, and scalable system design.",
  },
  {
    title: "Edge Case Discovery",
    description:
      "Leveraged AI tools to identify edge cases, refactor code, and improve application performance and maintainability.",
  },
];

export const EDUCATION = [
  {
    degree: "B.Tech in Mechanical Engineering",
    institution: "THDC Institute of Hydropower Engineering & Technology",
    type: "university",
  },
  {
    degree: "Full Stack Bootcamp",
    institution: "10X Academy",
    type: "bootcamp",
  },
];

export const NPM_PACKAGES = [
  {
    name: "error-intelligence-layer",
    version: "0.3.0",
    description:
      "Transform any thrown value into a structured error object with severity, root-cause chain, fix suggestions, stack parsing, request sanitisation, and framework adapters.",
    longDescription:
      "Zero-dependency error enrichment library for Node.js and TypeScript. Runs every error through a 6-stage pure-function pipeline: normalize → parse stack → extract cause chain → enrich → analyze → assemble. Ships 630+ built-in error patterns and optionally enhances results with AI-generated suggestions from any OpenAI-compatible provider (Groq, xAI, OpenRouter).",
    highlights: [
      "Zero dependencies — pure TypeScript, ships ESM + CJS",
      "6-stage deterministic pipeline — normalize, parse, extract, enrich, analyze, assemble",
      "Severity classification: critical / high / medium / low",
      "Root-cause chain traversal with cycle detection",
      "Stable 8-char fingerprint for error deduplication",
      "Request sanitisation — Authorization, Cookie auto-redacted unconditionally",
      "Plugin system with 3 built-in plugins: httpStatus, nodeSystem, grouping",
      "Framework adapters for Express, Fastify, Next.js App & Pages Router",
    ],
    aiFeatures: [
      "analyzeErrorAsync — calls any OpenAI-compatible provider (default: Groq) after the pipeline",
      "aiSuggestion[] — short targeted hints from the LLM, always alongside pattern-based suggestions",
      "aiFixSuggested — corrected source code with inline comments (dev only, never in production)",
      "wrapAsyncWithAI & withErrorBoundaryAsync — auto-pass fn.toString() as context for precise fixes",
      "Provider-agnostic: swap to xAI Grok or OpenRouter with two config fields",
      "Graceful fallback — pattern suggestions always present even when AI quota is exhausted",
    ],
    tags: [
      "TypeScript",
      "Node.js",
      "Error Handling",
      "AI Suggestions",
      "Groq",
      "Express",
      "Fastify",
      "Next.js",
      "Zero Dependencies",
      "Observability",
    ],
    npm: "https://www.npmjs.com/package/error-intelligence-layer",
    github: "https://github.com/Anuvratjoshi/error-intelligence-layer",
    callout: {
      label: "AI-Powered Features",
      theme: "amber" as const,
      items: [
        "analyzeErrorAsync — calls any OpenAI-compatible provider (default: Groq) after the pipeline",
        "aiSuggestion[] — LLM-generated hints alongside the 630+ pattern-based suggestions",
        "aiFixSuggested — corrected source code with inline comments (dev only, never in production)",
        "wrapAsyncWithAI & withErrorBoundaryAsync — auto-pass fn.toString() as context for precise fixes",
        "Provider-agnostic: swap to xAI Grok or OpenRouter with two config fields",
        "Graceful fallback — pattern suggestions always present even when AI quota is exhausted",
      ],
    },
  },
  {
    name: "@joshianuvrat/type-bridge",
    version: "1.0.2",
    description:
      "Automatically sync backend TypeScript types to the frontend — zero manual duplication.",
    longDescription:
      "A CLI tool + Node.js library that parses your backend TypeScript source with ts-morph, strips backend-only constructs (Mongoose Document, Express Request/Response, sensitive fields like password), and emits clean, tree-shakable type files — eliminating type duplication and frontend/backend contract drift entirely.",
    highlights: [
      "3-stage pipeline: Extract (ts-morph AST) → Transform → Generate",
      "Strips sensitive fields (password, token, secret) by default — never leaks to frontend",
      "Date → string and ObjectId → string conversions out of the box",
      "Enum → union type conversion (or preserve enums with preserveEnums: true)",
      "Removes backend-only heritage: Document, Model, Request, Response, NextFunction",
      "@type-bridge-ignore JSDoc tag to exclude any individual declaration",
      "Watch mode with 300ms debounce via chokidar — real-time sync in dev",
      "Optional SDK Generator — scans Express routes and emits a typed fetch client",
      "Hash header on each generated file for CI staleness detection",
      "Programmatic API: loadConfig, runExtractor, runTransformer, runGenerator, runPipeline",
    ],
    tags: [
      "TypeScript",
      "CLI",
      "Code Generation",
      "Type Safety",
      "ts-morph",
      "Security",
      "Express",
      "DX",
      "Monorepo",
    ],
    npm: "https://www.npmjs.com/package/@joshianuvrat/type-bridge",
    github: "https://github.com/Anuvratjoshi/type-bridge",
    callout: {
      label: "Security-First Pipeline",
      theme: "teal" as const,
      items: [
        "Sensitive fields (password, token, secret) stripped by default — never leaks to frontend",
        "@type-bridge-ignore JSDoc tag excludes any individual declaration from generation",
        "Only export-ed declarations are processed — private types stay private",
        "Hash header on each generated file enables CI staleness detection",
        "No runtime access — purely build-time, zero database or env-var exposure",
        "SDK Generator emits a typed fetch client from Express route registrations",
      ],
    },
  },
];

export const STATS = [
  { label: "Years Experience", value: "3+" },
  { label: "Performance Boost", value: "30%" },
  { label: "Delivery Improvement", value: "20%" },
  { label: "Projects Delivered", value: "10+" },
];

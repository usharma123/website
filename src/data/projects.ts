export type Project = {
  slug: string
  name: string
  description: string
  kind: 'terminal' | 'agents' | 'web' | 'research'
  repoUrl: string
  liveLink?: string
  /** Only real screenshots — placeholder cards are rendered in CSS instead. */
  screenshot?: string
  /** Slug of the blog post that goes deeper on this project. */
  post?: string
  featured?: boolean
}

const PROJECTS: Project[] = [
  {
    slug: 'wasmterminal',
    name: 'WASMTerminal',
    description:
      'Linux terminal running entirely client-side using WebAssembly',
    kind: 'terminal',
    liveLink: 'https://head.wasmterminal.pages.dev/',
    screenshot: '/wasmterminal-shot.png',
    repoUrl: 'https://github.com/usharma123/wasmterminal',
    post: 'wasm-terminal',
    featured: true,
  },
  {
    slug: 'sitefs',
    name: 'SiteFS',
    description:
      'CLI-first QA agent runtime with a live accessibility-tree shell and persistent /site evidence for crawl, diff, and CI reports',
    kind: 'agents',
    repoUrl: 'https://github.com/usharma123/SiteFS',
    post: 'sitefs',
    featured: true,
  },
  {
    slug: 'packet28',
    name: 'Packet28',
    description:
      'Context engineering layer that reduces diffs, coverage, logs, and traces into bounded packets for AI agents and CI',
    kind: 'agents',
    repoUrl: 'https://github.com/usharma123/Packet28',
    post: 'packet28',
    featured: true,
  },
  {
    slug: 'ui-tester',
    name: 'UI-tester',
    description:
      'AI-powered terminal UI that tests websites using browser automation and LLM analysis',
    kind: 'agents',
    liveLink: 'https://ui-tester.dev',
    screenshot: '/UI-tester.png',
    repoUrl: 'https://github.com/usharma123/UI-tester-',
    post: 'ui-tester',
    featured: true,
  },
  {
    slug: 'markov-explorer',
    name: 'Markov Explorer',
    description: 'Markov Decision Process Visualizer and Optimizer',
    kind: 'web',
    liveLink: 'https://markov-explorer.vercel.app/',
    screenshot: '/markov-explorer.png',
    repoUrl: 'https://github.com/usharma123/MarkovExplorer',
    post: 'markov-explorer',
  },
  {
    slug: 'grammarly-wasm-editor',
    name: 'Grammarly WASM Editor',
    description:
      'Client-side writing assistant with TipTap, Rust/WASM lint engine, and WebWorker-backed suggestions',
    kind: 'web',
    liveLink: 'https://grammarly-editor.vercel.app',
    repoUrl: 'https://github.com/usharma123/Grammarly',
    post: 'grammarly-wasm-editor',
  },
  {
    slug: 'gsuitetui',
    name: 'GSuiteTUI',
    description: 'Rust terminal UI for Google Calendar, Gmail, and Drive',
    kind: 'terminal',
    repoUrl: 'https://github.com/usharma123/GSuiteTUI',
    post: 'gsuite-tui',
  },
  {
    slug: 'ssff',
    name: 'SSFF',
    description:
      'Startup Success Forecasting Framework — ML + LLM pipeline for evaluating early-stage startup viability (published research)',
    kind: 'research',
    repoUrl:
      'https://github.com/usharma123/Startup-Success-Forecasting-Framework',
  },
  {
    slug: 'opentrace',
    name: 'OpenTrace',
    description:
      'Clone a GitHub repo, auto-instrument with OpenTelemetry, run it, and visualize execution flows as interactive graphs',
    kind: 'web',
    repoUrl: 'https://github.com/usharma123/OpenTrace',
  },
  {
    slug: 'qamvp',
    name: 'QAMVP',
    description:
      'Governed QA workflow from source documents through Java Selenium execution and artifact generation',
    kind: 'agents',
    repoUrl: 'https://github.com/usharma123/QAMVP',
  },
  {
    slug: 'codecli',
    name: 'CodeCLI',
    description:
      'AI coding assistant CLI with multi-agent architecture, test generation, and Ink-based terminal UI',
    kind: 'terminal',
    repoUrl: 'https://github.com/usharma123/CodeCLI',
  },
  {
    slug: 'datatui',
    name: 'DataTUI',
    description:
      'Terminal data analysis agent with DuckDB, Python sandboxing, and LLM natural-language queries',
    kind: 'terminal',
    repoUrl: 'https://github.com/usharma123/DataTUI',
  },
  {
    slug: 'googledoc-convex',
    name: 'GoogleDoc-Convex',
    description:
      'Collaborative essay editor with Convex realtime sync, TipTap, and AI research/coaching',
    kind: 'web',
    repoUrl: 'https://github.com/usharma123/GoogleDoc-Convex',
  },
  {
    slug: 'blueskytrading',
    name: 'BlueSkyTrading',
    description:
      'Retail FX order-matching platform scaffold — Spring Boot microservices, IBM MQ, Postgres, React trader UI',
    kind: 'web',
    repoUrl: 'https://github.com/usharma123/BlueSkyTrading',
  },
  {
    slug: 'everafter',
    name: 'EverAfter',
    description: 'Wedding logo generator using AI',
    kind: 'web',
    liveLink: 'https://tryeverafter.dev/',
    screenshot: '/ever-after.png',
    repoUrl: 'https://github.com/usharma123/EverAfter',
  },
  {
    slug: 'msar-matchfinder',
    name: 'MSAR Matchfinder',
    description:
      'Medical school matching tool for MD schools based on GPA and MCAT scores',
    kind: 'web',
    liveLink: 'https://medmatcher.vercel.app/',
    screenshot: '/MSAR.png',
    repoUrl: 'https://github.com/usharma123/MSAR',
  },
]

export const KIND_LABEL: Record<Project['kind'], string> = {
  agents: 'agents & QA',
  terminal: 'terminal',
  web: 'web',
  research: 'research',
}

export default PROJECTS

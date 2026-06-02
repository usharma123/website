const PROJECTS: {
  name: string
  description: string
  previewImage: string
  repoUrl: string
  liveLink?: string
}[] = [
  {
    name: 'WASMTerminal',
    description: 'Linux terminal running entirely client-side using WebAssembly',
    liveLink: 'https://head.wasmterminal.pages.dev/',
    previewImage: '/WASM-Terminal.png',
    repoUrl: 'https://github.com/usharma123/wasmterminal',
  },
  {
    name: 'Markov Explorer',
    description: 'Markov Decision Process Visualizer and Optimizer',
    liveLink: 'https://markov-explorer.vercel.app/',
    previewImage: '/markov-explorer.png',
    repoUrl: 'https://github.com/usharma123/MarkovExplorer',
  },
  {
    name: 'EverAfter',
    description: 'Wedding logo generator using AI',
    liveLink: 'https://tryeverafter.dev/',
    previewImage: '/ever-after.png',
    repoUrl: 'https://github.com/usharma123/EverAfter',
  },
  {
    name: 'MSAR Matchfinder',
    description: 'Medical school matching tool for MD schools based on GPA and MCAT scores',
    liveLink: 'https://medmatcher.vercel.app/',
    previewImage: '/MSAR.png',
    repoUrl: 'https://github.com/usharma123/MSAR',
  },
  {
    name: 'UI-tester',
    description: 'AI-powered terminal UI that tests websites using browser automation and LLM analysis',
    liveLink: 'https://ui-tester.dev',
    previewImage: '/UI-tester.png',
    repoUrl: 'https://github.com/usharma123/UI-tester-',
  },
  {
    name: 'Packet28',
    description:
      'Context engineering layer that reduces diffs, coverage, logs, and traces into bounded packets for AI agents and CI',
    previewImage: '/packet28.png',
    repoUrl: 'https://github.com/usharma123/Packet28',
  },
  {
    name: 'SiteFS',
    description:
      'CLI-first QA agent runtime with a live accessibility-tree shell and persistent /site evidence for crawl, diff, and CI reports',
    previewImage: '/sitefs.png',
    repoUrl: 'https://github.com/usharma123/SiteFS',
  },
  {
    name: 'QAMVP',
    description:
      'Governed QA workflow from source documents through Java Selenium execution and artifact generation',
    previewImage: '/qamvp.png',
    repoUrl: 'https://github.com/usharma123/QAMVP',
  },
  {
    name: 'OpenTrace',
    description:
      'Clone a GitHub repo, auto-instrument with OpenTelemetry, run it, and visualize execution flows as interactive graphs',
    previewImage: '/opentrace.png',
    repoUrl: 'https://github.com/usharma123/OpenTrace',
  },
  {
    name: 'CodeCLI',
    description:
      'AI coding assistant CLI with multi-agent architecture, test generation, and Ink-based terminal UI',
    previewImage: '/codecli.png',
    repoUrl: 'https://github.com/usharma123/CodeCLI',
  },
  {
    name: 'DataTUI',
    description:
      'Terminal data analysis agent with DuckDB, Python sandboxing, and LLM natural-language queries',
    previewImage: '/datatui.png',
    repoUrl: 'https://github.com/usharma123/DataTUI',
  },
  {
    name: 'GSuiteTUI',
    description: 'Rust terminal UI for Google Calendar, Gmail, and Drive',
    previewImage: '/gsuite-tui.png',
    repoUrl: 'https://github.com/usharma123/GSuiteTUI',
  },
  {
    name: 'Grammarly WASM Editor',
    description:
      'Client-side writing assistant with TipTap, Rust/WASM lint engine, and WebWorker-backed suggestions',
    liveLink: 'https://grammarly-editor.vercel.app',
    previewImage: '/grammarly.png',
    repoUrl: 'https://github.com/usharma123/Grammarly',
  },
  {
    name: 'GoogleDoc-Convex',
    description:
      'Collaborative essay editor with Convex realtime sync, TipTap, and AI research/coaching',
    previewImage: '/google-doc-convex.png',
    repoUrl: 'https://github.com/usharma123/GoogleDoc-Convex',
  },
  {
    name: 'BlueSkyTrading',
    description:
      'Retail FX order-matching platform scaffold — Spring Boot microservices, IBM MQ, Postgres, React trader UI',
    previewImage: '/bluesky-trading.png',
    repoUrl: 'https://github.com/usharma123/BlueSkyTrading',
  },
  {
    name: 'SSFF',
    description:
      'Startup Success Forecasting Framework — ML + LLM pipeline for evaluating early-stage startup viability (published research)',
    previewImage: '/ssff.png',
    repoUrl: 'https://github.com/usharma123/Startup-Success-Forecasting-Framework',
  },
]

export default PROJECTS

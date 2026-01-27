const PROJECTS: {
  name: string
  description: string
  previewImage: string
  repoUrl: string
  liveLink: string
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
]

export default PROJECTS

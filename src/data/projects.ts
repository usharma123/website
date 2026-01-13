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
]

export default PROJECTS

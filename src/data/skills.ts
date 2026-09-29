import type { BrandIconKey } from './brand-icons'

export type Skill = {
  name: string
  /** Brand mark, when one exists; otherwise the skill gets a monogram. */
  icon?: BrandIconKey
}

const SKILLS: { field: string; skills: Skill[] }[] = [
  {
    field: 'Frontend',
    skills: [
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'SolidJS', icon: 'solid' },
      { name: 'TanStack', icon: 'tanstack' },
      { name: 'StyleX' },
      { name: 'HTML', icon: 'html' },
      { name: 'CSS', icon: 'css' },
    ],
  },
  {
    field: 'Backend & infra',
    skills: [
      { name: 'Node.js', icon: 'node' },
      { name: 'Bun', icon: 'bun' },
      { name: 'Python', icon: 'python' },
      { name: 'Java', icon: 'java' },
      { name: 'Spring Boot', icon: 'spring' },
      { name: 'Rust', icon: 'rust' },
      { name: 'PostgreSQL', icon: 'postgres' },
      { name: 'DuckDB', icon: 'duckdb' },
      { name: 'Convex', icon: 'convex' },
      { name: 'Docker', icon: 'docker' },
      { name: 'AWS' },
      { name: 'OpenTelemetry', icon: 'otel' },
    ],
  },
  {
    field: 'ML & research',
    skills: [
      { name: 'PyTorch', icon: 'pytorch' },
      { name: 'MONAI' },
      { name: 'OpenCV', icon: 'opencv' },
      { name: 'MediaPipe', icon: 'mediapipe' },
      { name: 'XGBoost' },
      { name: 'Diffusion models' },
      { name: 'GANs' },
      { name: 'RAG' },
    ],
  },
]

export default SKILLS

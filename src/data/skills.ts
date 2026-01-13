import {
  type IconType,
  SiCss,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiPython,
  SiJava,
} from '@icons-pack/react-simple-icons'
import { Cloud, LucideIcon } from 'lucide-react'

type SkillIcon = IconType | LucideIcon

const SKILLS: { field: string; skills: { skill: string; icon: SkillIcon }[] }[] = [
  {
    field: 'Frontend',
    skills: [
      { skill: 'html', icon: SiHtml5 },
      { skill: 'css', icon: SiCss },
      { skill: 'javascript', icon: SiJavascript },
      { skill: 'react', icon: SiReact },
      { skill: 'tailwind', icon: SiTailwindcss },
      { skill: 'nextjs', icon: SiNextdotjs },
    ],
  },
  {
    field: 'Backend',
    skills: [
      { skill: 'nodejs', icon: SiNodedotjs },
      { skill: 'postgresql', icon: SiPostgresql },
      { skill: 'python', icon: SiPython },
      { skill: 'java', icon: SiJava },
      { skill: 'docker', icon: SiDocker },
      { skill: 'aws', icon: Cloud },
    ],
  },
]

export default SKILLS

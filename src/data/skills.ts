import {
  type IconType,
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiPython,
  SiAmazonwebservices,
} from '@icons-pack/react-simple-icons'

const SKILLS: { field: string; skills: { skill: string; icon: IconType }[] }[] = [
  {
    field: 'Frontend',
    skills: [
      { skill: 'html', icon: SiHtml5 },
      { skill: 'css', icon: SiCss3 },
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
      { skill: 'docker', icon: SiDocker },
      { skill: 'aws', icon: SiAmazonwebservices },
    ],
  },
]

export default SKILLS

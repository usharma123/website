'use client'

import Image from 'next/image'

import PROJECTS from '@/data/projects'
import { PROFILE } from '@/data/resume'
import type { AppId } from '../apps'
import { useDesktop } from '../context'
import { Icon, type IconName } from '../icons'

export default function Readme() {
  const { open, posts } = useDesktop()

  const starts: { id: AppId; icon: IconName; label: string; note: string }[] = [
    {
      id: 'projects',
      icon: 'folder',
      label: 'Projects',
      note: `${PROJECTS.length} things I've built`,
    },
    {
      id: 'writing',
      icon: 'notebook',
      label: 'Writing',
      note: `${posts.length} long-form posts`,
    },
    {
      id: 'resume',
      icon: 'clipboard',
      label: 'Résumé',
      note: 'work, research, school',
    },
    {
      id: 'terminal',
      icon: 'terminal',
      label: 'Terminal',
      note: 'if you’d rather type',
    },
  ]

  return (
    <article className="px-7 py-6">
      <header className="flex items-center gap-4">
        <Image
          src="/avatar.png"
          alt=""
          width={76}
          height={84}
          className="border-ink bg-chrome h-[84px] w-[76px] shrink-0 rounded-md border-[1.5px] object-cover"
        />
        <div>
          <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em]">
            {PROFILE.name}
          </h1>
          <p className="text-[15px]">{PROFILE.headline}</p>
          <p className="text-muted font-mono text-[12px]">{PROFILE.location}</p>
        </div>
      </header>

      <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed">
        <p>
          <mark className="bg-marker px-1">I just like doing things.</mark>{' '}
          Mostly that means building software, which is funny, because I studied
          biochemistry.
        </p>
        <p>
          Right now I’m a Senior Associate – Software Engineer at CLS, working
          on the CLSnet platform, and finishing a master’s in computer science
          at Penn. On the side I build developer tools — usually ones that live
          in a terminal or help AI agents test and reason about code.
        </p>
        <p>
          Before that I co-founded Vetra, where we built retrieval and scraping
          agents for patent search, and ran research teams at Dream Team
          Engineering — including a diffusion model that turns CT scans into
          synthetic MRIs, which I presented at Yale.
        </p>
      </div>

      <h2 className="text-muted mt-7 mb-2 font-mono text-[12px]">
        ## start here
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {starts.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => open(s.id)}
            className="border-ink bg-paper hover:bg-chrome flex items-center gap-3 rounded-md border-[1.5px] p-2.5 text-left active:translate-y-px"
          >
            <Icon name={s.icon} size={32} />
            <span>
              <span className="block text-[14px] font-semibold">{s.label}</span>
              <span className="text-muted block text-[12.5px]">{s.note}</span>
            </span>
          </button>
        ))}
      </div>

      <h2 className="text-muted mt-7 mb-2 font-mono text-[12px]">
        ## elsewhere
      </h2>
      <p className="flex flex-wrap gap-x-5 gap-y-1 text-[14.5px]">
        <a className="link" href={`mailto:${PROFILE.email}`}>
          {PROFILE.email}
        </a>
        <a
          className="link"
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
        <a
          className="link"
          href={PROFILE.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn ↗
        </a>
      </p>
    </article>
  )
}

'use client'

import Image from 'next/image'

import type { Project } from '@/data/projects'
import { ProjectMock } from './mocks'

const CARD_BG: Record<Project['kind'], string> = {
  agents: 'bg-accent text-paper',
  terminal: 'bg-ink text-paper',
  web: 'bg-clay text-ink',
  research: 'bg-marker text-ink',
}

/** Real screenshot if there is one, then a generated mock of the tool, then
 *  a typeset card as a last resort. */
export default function ProjectPreview({
  project,
  tall,
  eager,
}: {
  project: Project
  tall?: boolean
  /** Load immediately — for previews that are visible on first paint. */
  eager?: boolean
}) {
  const h = tall ? 'h-[240px]' : 'h-[140px]'

  if (project.screenshot) {
    return (
      <div className={`${h} bg-chrome relative w-full overflow-hidden`}>
        <Image
          src={project.screenshot}
          alt={`Screenshot of ${project.name}`}
          fill
          loading={eager ? 'eager' : 'lazy'}
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover object-top"
        />
      </div>
    )
  }

  return (
    <ProjectMock
      slug={project.slug}
      className={h}
      fallback={
        <div
          className={`${h} ${CARD_BG[project.kind]} flex flex-col justify-between p-4 font-mono`}
        >
          <span className="text-[11.5px] opacity-70">
            $ open {project.slug}
          </span>
          <span
            className={`${tall ? 'text-[34px]' : 'text-[24px]'} leading-none font-semibold tracking-[-0.03em]`}
          >
            {project.name}
          </span>
        </div>
      }
    />
  )
}

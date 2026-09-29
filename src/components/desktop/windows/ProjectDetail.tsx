'use client'

import PROJECTS from '@/data/projects'
import { useDesktop } from '../Desktop'
import { KIND_LABEL, Preview } from './Projects'

export default function ProjectDetail({ slug }: { slug: string }) {
  const { openPost, posts } = useDesktop()
  const p = PROJECTS.find((p) => p.slug === slug)
  if (!p)
    return (
      <p className="text-muted p-6">This project has moved or been deleted.</p>
    )
  const post = p.post ? posts.find((x) => x.slug === p.post) : undefined

  return (
    <article>
      <div className="border-ink border-b-[1.5px]">
        <Preview project={p} tall />
      </div>
      <div className="space-y-4 px-6 py-5">
        <div>
          <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">
            {p.name}
          </h1>
          <p className="text-muted font-mono text-[12px]">
            {KIND_LABEL[p.kind]}
          </p>
        </div>
        <p className="text-[15.5px] leading-relaxed">{p.description}.</p>

        <div className="flex flex-wrap gap-2">
          {p.liveLink ? (
            <a
              href={p.liveLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Try it live ↗
            </a>
          ) : null}
          <a href={p.repoUrl} target="_blank" rel="noreferrer" className="btn">
            Source on GitHub ↗
          </a>
        </div>

        {post ? (
          <button
            type="button"
            onClick={() => openPost(post.slug)}
            className="border-ink hover:bg-chrome block w-full rounded-md border-[1.5px] border-dashed p-3 text-left"
          >
            <span className="text-muted font-mono text-[11.5px]">
              the write-up →
            </span>
            <span className="block font-semibold">{post.title}</span>
            <span className="text-muted block text-[13.5px]">
              {post.description}
            </span>
          </button>
        ) : null}
      </div>
    </article>
  )
}

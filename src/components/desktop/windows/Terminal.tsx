'use client'

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import EXPERIENCE from '@/data/experience'
import PROJECTS from '@/data/projects'
import { PROFILE } from '@/data/resume'
import { APPS, DESKTOP_APPS, type AppId } from '../apps'
import { useDesktop } from '../Desktop'

type Line = { id: number; input?: string; output?: ReactNode }
type Ctx = ReturnType<typeof useDesktop>

const PROMPT = 'utsav@desk ~ %'
const dim = (s: ReactNode) => <span className="text-[#7f8a9c]">{s}</span>

const COMMANDS: Record<
  string,
  { help: string; run: (args: string[], d: Ctx) => ReactNode | 'clear' }
> = {
  help: {
    help: 'this list',
    run: () => (
      <div className="grid grid-cols-[10ch_1fr] gap-x-3">
        {Object.entries(COMMANDS).map(([name, c]) => (
          <div key={name} className="contents">
            <span className="text-marker">{name}</span>
            {dim(c.help)}
          </div>
        ))}
      </div>
    ),
  },
  ls: {
    help: 'what’s on the desktop',
    run: () => (
      <div className="flex flex-wrap gap-x-6">
        {DESKTOP_APPS.map((id) => (
          <span key={id}>{APPS[id].label}</span>
        ))}
      </div>
    ),
  },
  open: {
    help: 'open <app | project | post>',
    run: ([target], d) => {
      if (!target) return dim('usage: open <name> — try `ls` or `projects`')
      const q = target.toLowerCase()
      const app = DESKTOP_APPS.find(
        (id) => id === q || APPS[id].label?.toLowerCase().startsWith(q),
      )
      if (app) return (d.open(app as AppId), dim(`opening ${APPS[app].label}…`))
      const project = PROJECTS.find(
        (p) => p.slug.startsWith(q) || p.name.toLowerCase().startsWith(q),
      )
      if (project)
        return (d.openProject(project.slug), dim(`opening ${project.name}…`))
      const post = d.posts.find((p) => p.slug.startsWith(q))
      if (post) return (d.openPost(post.slug), dim(`opening “${post.title}”…`))
      return dim(`open: nothing called “${target}”`)
    },
  },
  projects: {
    help: 'list projects',
    run: () => (
      <div className="grid grid-cols-[22ch_1fr] gap-x-3">
        {PROJECTS.map((p) => (
          <div key={p.slug} className="contents">
            <span className="text-marker">{p.slug}</span>
            {dim(p.description)}
          </div>
        ))}
        <div className="col-span-2 mt-1">
          {dim('`open <name>` for details')}
        </div>
      </div>
    ),
  },
  posts: {
    help: 'list blog posts',
    run: (_, d) => (
      <div>
        {d.posts.map((p) => (
          <div key={p.slug}>
            {dim(p.pubDate)} <span className="text-marker">{p.slug}</span>
          </div>
        ))}
      </div>
    ),
  },
  whoami: {
    help: 'the short version',
    run: () => (
      <div>
        <div className="font-semibold">{PROFILE.name}</div>
        <div>{PROFILE.headline}</div>
        {dim(
          `previously: ${EXPERIENCE.slice(1, 3)
            .map((r) => `${r.role}, ${r.company}`)
            .join('; ')}`,
        )}
      </div>
    ),
  },
  contact: {
    help: 'email and links',
    run: () => (
      <div>
        <div>{PROFILE.email}</div>
        <div>{PROFILE.github}</div>
        <div>{PROFILE.linkedin}</div>
      </div>
    ),
  },
  clear: { help: 'clear the screen', run: () => 'clear' },
  exit: {
    help: 'close this window',
    run: (_, d) => {
      d.close('terminal')
      return null
    },
  },
}

export default function Terminal() {
  const desktop = useDesktop()
  const [lines, setLines] = useState<Line[]>([
    {
      id: 0,
      output: dim(
        'Every window on this desktop can be opened from here. Type `help`.',
      ),
    },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const nextId = useRef(1)
  const input = useRef<HTMLInputElement>(null)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    input.current?.focus()
  }, [])
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  function run(raw: string) {
    const [name = '', ...args] = raw.trim().split(/\s+/)
    if (raw.trim()) setHistory((h) => [raw, ...h])
    setCursor(-1)
    const cmd = COMMANDS[name.toLowerCase()]
    const output = !name
      ? null
      : cmd
        ? cmd.run(args, desktop)
        : name === 'sudo'
          ? dim('Nice try.')
          : dim(`zsh: command not found: ${name}`)
    if (output === 'clear') return setLines([])
    setLines((l) => [...l, { id: nextId.current++, input: raw, output }])
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      run(value)
      setValue('')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const hit = Object.keys(COMMANDS).find(
        (c) => value && c.startsWith(value),
      )
      if (hit) setValue(`${hit} `)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const i = Math.max(
        -1,
        Math.min(cursor + (e.key === 'ArrowUp' ? 1 : -1), history.length - 1),
      )
      setCursor(i)
      setValue(i >= 0 ? history[i] : '')
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      className="bg-ink min-h-full p-4 font-mono text-[13px] leading-relaxed text-[#e6ebf2]"
      onClick={() => input.current?.focus()}
    >
      {lines.map((l) => (
        <div key={l.id} className="mb-2">
          {l.input !== undefined ? (
            <div>
              {dim(PROMPT)} {l.input}
            </div>
          ) : null}
          {l.output}
        </div>
      ))}
      <label className="flex gap-2">
        {dim(PROMPT)}
        <input
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal input"
          data-autofocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="caret-marker min-w-0 flex-1 bg-transparent outline-none"
        />
      </label>
      <div ref={end} />
    </div>
  )
}

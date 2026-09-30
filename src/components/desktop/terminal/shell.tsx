import type { ReactNode } from 'react'

import EXPERIENCE from '@/data/experience'
import PROJECTS, { KIND_LABEL } from '@/data/projects'
import { EDUCATION, PROFILE } from '@/data/resume'
import SKILLS from '@/data/skills'
import { formatDate, shortMonth } from '@/lib/format'
import { APPS, DESKTOP_APPS, GAMES } from '../apps'
import type { DesktopApi } from '../context'
import { displayPath, resolve, type Dir, type FsNode } from './fs'

/* ---- Types ---------------------------------------------------------------- */

export type ShellState = { cwd: string[]; prev: string[] }

export type ShellEnv = {
  desktop: DesktopApi
  root: Dir
  history: string[]
  /** Run a command as if the visitor had typed it (used by clickable output). */
  run: (cmd: string) => void
}

export type ShellResult = {
  out: ReactNode
  state: ShellState
  clear?: boolean
}

type Step = {
  out?: ReactNode
  ok?: boolean
  state?: ShellState
  clear?: boolean
}
type Ctx = { env: ShellEnv; state: ShellState; raw: string }
type Command = {
  summary: string
  usage?: string
  run: (args: string[], ctx: Ctx) => Step
}

/* ---- Output pieces ---------------------------------------------------------- */

const tone = {
  dim: 'text-[#7f8a9c]',
  dir: 'text-[#cdbdff]',
  path: 'text-[#9cc0ff]',
  ok: 'text-[#7fd1a4]',
  num: 'text-[#e9c6ad]',
  err: 'text-[#ff9a8a]',
}

function Dim({ children }: { children: ReactNode }) {
  return <span className={tone.dim}>{children}</span>
}

function Err({ children }: { children: ReactNode }) {
  return <span className={tone.err}>{children}</span>
}

/** Output you can click to run a follow-up command. */
function Run({
  env,
  cmd,
  className = '',
  children,
}: {
  env: ShellEnv
  cmd: string
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={cmd}
      onClick={() => env.run(cmd)}
      className={`${className} rounded-sm text-left underline decoration-[#7f8a9c]/60 decoration-dotted underline-offset-[3px] hover:bg-white/5 hover:decoration-solid`}
    >
      {children}
    </button>
  )
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noreferrer"
      className={`${tone.path} underline decoration-dotted underline-offset-[3px] hover:decoration-solid`}
    >
      {children}
    </a>
  )
}

function Suggest({ env, cmds }: { env: ShellEnv; cmds: string[] }) {
  return (
    <div className="mt-1">
      <Dim>try </Dim>
      {cmds.map((c, i) => (
        <span key={c}>
          {i ? <Dim> · </Dim> : null}
          <Run env={env} cmd={c} className={tone.ok}>
            {c}
          </Run>
        </span>
      ))}
    </div>
  )
}

/* ---- Files ------------------------------------------------------------------ */

function fileBody(node: FsNode, env: ShellEnv): ReactNode {
  if (node.kind === 'dir') return null
  const f = node.file
  switch (f.type) {
    case 'readme':
      return (
        <div className="space-y-2">
          <div>
            <span className="font-semibold"># {PROFILE.name}</span>
            <div>{PROFILE.headline}</div>
            <Dim>{PROFILE.location}</Dim>
          </div>
          <p>
            I just like doing things. Mostly that means building software, which
            is funny, because I studied biochemistry.
          </p>
          <p>
            On the side I build developer tools — usually ones that live in a
            terminal or help AI agents test and reason about code.
          </p>
          <Suggest env={env} cmds={['ls projects', 'cat resume.md']} />
        </div>
      )
    case 'resume':
      return (
        <div>
          <div className="font-semibold"># experience</div>
          {EXPERIENCE.map((r) => (
            <div
              key={`${r.company}-${r.role}`}
              className="grid grid-cols-[1fr_auto] gap-x-4"
            >
              <span>
                {r.role} <Dim>@ {r.company}</Dim>
              </span>
              <span className={tone.num}>
                {shortMonth(r.startDate)} – {shortMonth(r.endDate)}
              </span>
            </div>
          ))}
          <div className="mt-2 font-semibold"># education</div>
          {EDUCATION.map((e) => (
            <div key={e.school} className="grid grid-cols-[1fr_auto] gap-x-4">
              <span>
                {e.school}{' '}
                <Dim>
                  · {e.degree}, {e.field}
                </Dim>
              </span>
              <span className={tone.num}>
                {e.startDate} – {e.endDate}
              </span>
            </div>
          ))}
          <Suggest env={env} cmds={['open resume.md']} />
        </div>
      )
    case 'skills':
      return (
        <div className="grid grid-cols-[16ch_1fr] gap-x-3">
          {SKILLS.map((g) => (
            <div key={g.field} className="contents">
              <span className={tone.dir}>{g.field.toLowerCase()}</span>
              <span>{g.skills.map((s) => s.name).join(', ')}</span>
            </div>
          ))}
        </div>
      )
    case 'contact':
      return (
        <div className="grid grid-cols-[10ch_1fr] gap-x-3">
          <Dim>email</Dim>
          <Ext href={`mailto:${PROFILE.email}`}>{PROFILE.email}</Ext>
          <Dim>github</Dim>
          <Ext href={PROFILE.github}>
            {PROFILE.github.replace('https://', '')}
          </Ext>
          <Dim>linkedin</Dim>
          <Ext href={PROFILE.linkedin}>
            {PROFILE.linkedin.replace('https://www.', '')}
          </Ext>
        </div>
      )
    case 'project': {
      const p = PROJECTS.find((x) => x.slug === f.slug)
      if (!p) return null
      return (
        <div>
          <div>
            <span className="font-semibold"># {p.name}</span>{' '}
            <Dim>({KIND_LABEL[p.kind]})</Dim>
          </div>
          <div>{p.description}.</div>
          <div className="mt-1 grid grid-cols-[8ch_1fr] gap-x-3">
            <Dim>source</Dim>
            <Ext href={p.repoUrl}>{p.repoUrl.replace('https://', '')}</Ext>
            {p.liveLink ? (
              <>
                <Dim>live</Dim>
                <Ext href={p.liveLink}>
                  {p.liveLink.replace('https://', '')}
                </Ext>
              </>
            ) : null}
          </div>
          <Suggest
            env={env}
            cmds={[
              `open ~/projects/${p.slug}`,
              ...(p.post ? [`cat ~/writing/${p.post}.md`] : []),
            ]}
          />
        </div>
      )
    }
    case 'post': {
      const p = env.desktop.posts.find((x) => x.slug === f.slug)
      if (!p) return null
      return (
        <div>
          <div className="font-semibold"># {p.title}</div>
          <Dim>
            {formatDate(p.pubDate)}
            {p.tags.length ? ` · ${p.tags.join(', ')}` : ''}
          </Dim>
          <p className="mt-1">{p.description}</p>
          <Suggest env={env} cmds={[`open ~/writing/${p.slug}.md`]} />
        </div>
      )
    }
  }
}

/** Open whatever a node represents in its own window. */
function openNode(node: FsNode, env: ShellEnv): string | null {
  const d = env.desktop
  if (node.kind === 'dir') {
    if (!node.app) return null
    if (node.app.startsWith('project:'))
      d.openProject(node.app.slice('project:'.length))
    else d.open(node.app)
    return node.note ?? node.name
  }
  const f = node.file
  if (f.type === 'readme') d.open('readme')
  else if (f.type === 'resume' || f.type === 'skills') d.open('resume')
  else if (f.type === 'contact') d.open('contact')
  else if (f.type === 'project') d.openProject(f.slug)
  else d.openPost(f.slug)
  return node.note ?? node.name
}

/* ---- Commands ----------------------------------------------------------------- */

const pathOf = (dir: string[], name: string) => displayPath([...dir, name])

function listing(dir: Dir, at: string[], env: ShellEnv, long: boolean) {
  const kids = [...dir.children].sort((a, b) =>
    a.kind === b.kind
      ? a.name.localeCompare(b.name)
      : a.kind === 'dir'
        ? -1
        : 1,
  )
  if (!kids.length) return <Dim>(empty)</Dim>
  const entry = (c: FsNode) => {
    const p = pathOf(at, c.name)
    return c.kind === 'dir' ? (
      <Run env={env} cmd={`cd ${p} && ls`} className={tone.dir}>
        {c.name}/
      </Run>
    ) : (
      <Run env={env} cmd={`cat ${p}`}>
        {c.name}
      </Run>
    )
  }
  if (long) {
    return (
      <div className="grid grid-cols-[11ch_auto_1fr] gap-x-3">
        {kids.map((c) => (
          <div key={c.name} className="contents">
            <Dim>{c.kind === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'}</Dim>
            <span>{entry(c)}</span>
            <Dim>
              <span className="line-clamp-1">{c.note ?? ''}</span>
            </Dim>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-0.5">
      {kids.map((c) => (
        <span key={c.name}>{entry(c)}</span>
      ))}
    </div>
  )
}

function treeLines(dir: Dir, depth: number, prefix = ''): string[] {
  const out: string[] = []
  dir.children.forEach((c, i) => {
    const last = i === dir.children.length - 1
    out.push(
      `${prefix}${last ? '└── ' : '├── '}${c.name}${c.kind === 'dir' ? '/' : ''}`,
    )
    if (c.kind === 'dir' && depth > 1)
      out.push(...treeLines(c, depth - 1, `${prefix}${last ? '    ' : '│   '}`))
  })
  return out
}

function notFound(cmd: string, path: string, ctx: Ctx): Step {
  const here = resolve(ctx.env.root, ctx.state.cwd, '.')
  const names =
    here?.node.kind === 'dir' ? here.node.children.map((c) => c.name) : []
  const near = closest(path.split('/').pop() ?? path, names)
  return {
    ok: false,
    out: (
      <div>
        <Err>
          {cmd}: no such file or directory: {path}
        </Err>
        {near ? (
          <div>
            <Dim>did you mean </Dim>
            <Run env={ctx.env} cmd={`${cmd} ${near}`} className={tone.ok}>
              {near}
            </Run>
            <Dim>?</Dim>
          </div>
        ) : null}
      </div>
    ),
  }
}

const readOnly = (cmd: string): Step => ({
  ok: false,
  out: <Err>{cmd}: read-only file system — this is a guest account</Err>,
})

const COMMANDS: Record<string, Command> = {
  help: {
    summary: 'this list',
    run: (_, { env }) => ({
      out: (
        <div>
          <div className="grid grid-cols-[14ch_1fr] gap-x-3 @xl:grid-cols-[14ch_1fr_14ch_1fr]">
            {Object.entries(COMMANDS)
              .filter(([name]) => !HIDDEN.has(name))
              .map(([name, c]) => (
                <div key={name} className="contents">
                  <Run env={env} cmd={name} className={tone.ok}>
                    {c.usage ?? name}
                  </Run>
                  <Dim>{c.summary}</Dim>
                </div>
              ))}
          </div>
          <div className="mt-2">
            You can also just ask — <Dim>“what are you working on?”</Dim>,{' '}
            <Dim>“how do I reach you?”</Dim>
          </div>
          <Dim>
            tab completes · ↑↓ history · → accepts a suggestion · ctrl-c cancels
            · ctrl-l clears · click anything underlined
          </Dim>
        </div>
      ),
    }),
  },
  ls: {
    summary: 'list a directory',
    usage: 'ls [-l] [dir]',
    run: (args, ctx) => {
      const long = args.some((a) => /^-\w*l/.test(a))
      const target = args.find((a) => !a.startsWith('-')) ?? '.'
      const hit = resolve(ctx.env.root, ctx.state.cwd, target)
      if (!hit) return notFound('ls', target, ctx)
      if (hit.node.kind === 'file') return { out: hit.node.name }
      return { out: listing(hit.node, hit.path, ctx.env, long) }
    },
  },
  cd: {
    summary: 'change directory',
    usage: 'cd <dir>',
    run: (args, ctx) => {
      const target = args[0] ?? '~'
      if (target === '-')
        return {
          out: <Dim>{displayPath(ctx.state.prev)}</Dim>,
          state: { cwd: ctx.state.prev, prev: ctx.state.cwd },
        }
      const hit = resolve(ctx.env.root, ctx.state.cwd, target)
      if (!hit) return notFound('cd', target, ctx)
      if (hit.node.kind !== 'dir')
        return { ok: false, out: <Err>cd: not a directory: {target}</Err> }
      return { state: { cwd: hit.path, prev: ctx.state.cwd } }
    },
  },
  cat: {
    summary: 'print a file',
    usage: 'cat <file>',
    run: (args, ctx) => {
      if (!args[0])
        return { ok: false, out: <Err>cat: which file? try `ls`</Err> }
      const outs: { key: string; node: ReactNode }[] = []
      for (const a of args) {
        const hit = resolve(ctx.env.root, ctx.state.cwd, a)
        if (!hit) return notFound('cat', a, ctx)
        if (hit.node.kind === 'dir') {
          // A project directory is really "its README".
          const readme = hit.node.children.find((c) => c.name === 'README.md')
          if (!readme)
            return {
              ok: false,
              out: (
                <div>
                  <Err>cat: {a}: is a directory</Err>{' '}
                  <Suggest env={ctx.env} cmds={[`ls ${a}`]} />
                </div>
              ),
            }
          outs.push({ key: a, node: fileBody(readme, ctx.env) })
        } else outs.push({ key: a, node: fileBody(hit.node, ctx.env) })
      }
      return {
        out: (
          <div className="space-y-3">
            {outs.map((o) => (
              <div key={o.key}>{o.node}</div>
            ))}
          </div>
        ),
      }
    },
  },
  open: {
    summary: 'open in a window',
    usage: 'open [thing]',
    run: (args, ctx) => {
      const target = args.join(' ') || '.'
      const hit = resolve(ctx.env.root, ctx.state.cwd, target)
      const opened = hit
        ? openNode(hit.node, ctx.env)
        : openByName(target, ctx.env)
      return opened
        ? { out: <Dim>opening {opened}…</Dim> }
        : { ok: false, out: <Err>open: nothing called “{target}”</Err> }
    },
  },
  tree: {
    summary: 'everything at once',
    run: (args, ctx) => {
      const hit = resolve(ctx.env.root, ctx.state.cwd, args[0] ?? '.')
      if (!hit || hit.node.kind !== 'dir')
        return notFound('tree', args[0] ?? '.', ctx)
      return {
        out: (
          <pre className="font-mono">
            <span className={tone.dir}>{displayPath(hit.path)}</span>
            {'\n'}
            {treeLines(hit.node, 2).join('\n')}
          </pre>
        ),
      }
    },
  },
  grep: {
    summary: 'search projects, posts, work',
    usage: 'grep <word>',
    run: (args, ctx) => {
      const q = args
        .join(' ')
        .replace(/^["']|["']$/g, '')
        .toLowerCase()
      if (!q) return { ok: false, out: <Err>grep: search for what?</Err> }
      const hits: { where: string; text: string; cmd: string }[] = []
      for (const p of PROJECTS)
        if (`${p.name} ${p.description}`.toLowerCase().includes(q))
          hits.push({
            where: `projects/${p.slug}`,
            text: p.description,
            cmd: `cat ~/projects/${p.slug}`,
          })
      for (const p of ctx.env.desktop.posts)
        if (
          `${p.title} ${p.description} ${p.tags.join(' ')}`
            .toLowerCase()
            .includes(q)
        )
          hits.push({
            where: `writing/${p.slug}.md`,
            text: p.title,
            cmd: `cat ~/writing/${p.slug}.md`,
          })
      for (const r of EXPERIENCE)
        if (`${r.role} ${r.company} ${r.description}`.toLowerCase().includes(q))
          hits.push({
            where: 'resume.md',
            text: `${r.role} @ ${r.company}`,
            cmd: 'cat ~/resume.md',
          })
      if (!hits.length)
        return { ok: false, out: <Dim>no matches for “{q}”</Dim> }
      return {
        out: (
          <div>
            {hits.map((h) => (
              <div key={`${h.where}-${h.text}`} className="line-clamp-1">
                <Run env={ctx.env} cmd={h.cmd} className={tone.dir}>
                  {h.where}
                </Run>
                <Dim>: </Dim>
                <Highlight text={h.text} q={q} />
              </div>
            ))}
          </div>
        ),
      }
    },
  },
  whoami: {
    summary: 'who you are here',
    run: (_, { env }) => ({
      out: (
        <div>
          <div>guest</div>
          <Dim>
            …on {PROFILE.name}’s machine. {EXPERIENCE[0].role} at CLS.
          </Dim>
          <Suggest env={env} cmds={['cat README.md']} />
        </div>
      ),
    }),
  },
  neofetch: {
    summary: 'system info',
    run: (_, { env }) => ({
      out: (
        <div className="flex gap-6">
          <pre className={`${tone.dir} leading-[1.25]`}>
            {[
              '  _   _     __  ___ ',
              ' | | | |   / / / __|',
              ' | |_| |  / /  \\__ \\',
              '  \\___/  /_/   |___/',
            ].join('\n')}
          </pre>
          <div>
            <div>
              <span className={tone.ok}>guest</span>@
              <span className={tone.ok}>utsav</span>
            </div>
            <Dim>───────────</Dim>
            {[
              ['OS', 'Desktop 1.0 (Next.js 16)'],
              ['Host', PROFILE.location],
              ['Role', `${EXPERIENCE[0].role} @ CLS`],
              ['Edu', `MS CS @ Penn ’${EDUCATION[0].endDate.slice(2)}`],
              ['Shell', 'guest-sh'],
              ['Projects', String(PROJECTS.length)],
              ['Posts', String(env.desktop.posts.length)],
              ['Langs', 'TypeScript, Python, Rust, Java'],
            ].map(([k, v]) => (
              <div key={k}>
                <span className={tone.dir}>{k}</span>: {v}
              </div>
            ))}
            <div className="mt-1 flex gap-1">
              {[
                '#e6ebf2',
                '#cdbdff',
                '#9cc0ff',
                '#7fd1a4',
                '#e9c6ad',
                '#ff9a8a',
              ].map((c) => (
                <span
                  key={c}
                  className="inline-block h-3 w-5"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
    }),
  },
  history: {
    summary: 'what you’ve typed',
    run: (_, { env }) => ({
      out: env.history.length ? (
        <div>
          {[...env.history].reverse().map((h, i) => (
            <div key={h}>
              <span className={`${tone.num} inline-block w-8 text-right`}>
                {i + 1}
              </span>{' '}
              <Run env={env} cmd={h}>
                {h}
              </Run>
            </div>
          ))}
        </div>
      ) : (
        <Dim>nothing yet</Dim>
      ),
    }),
  },
  pwd: {
    summary: 'where you are',
    run: (_, { state }) => ({ out: displayPath(state.cwd) }),
  },
  echo: {
    summary: 'say something',
    run: (args) => ({ out: args.join(' ').replace(/^["']|["']$/g, '') }),
  },
  date: {
    summary: 'the time',
    run: () => ({ out: new Date().toString() }),
  },
  man: {
    summary: 'how a command works',
    usage: 'man <cmd>',
    run: (args, { env }) => {
      const name = args[0]
      if (!name)
        return { ok: false, out: <Err>What manual page do you want?</Err> }
      if (name === 'man')
        return {
          out: <Dim>man: a manual for manuals. you’re already reading it.</Dim>,
        }
      const c = COMMANDS[name] ?? COMMANDS[ALIASES[name]?.split(' ')[0] ?? '']
      if (!c) return { ok: false, out: <Err>No manual entry for {name}</Err> }
      return {
        out: (
          <div>
            <span className="font-semibold">{c.usage ?? name}</span>{' '}
            <Dim>— {c.summary}</Dim>
            <Suggest env={env} cmds={[name]} />
          </div>
        ),
      }
    },
  },
  clear: { summary: 'clear the screen', run: () => ({ clear: true }) },
  exit: {
    summary: 'close the terminal',
    run: (_, { env }) => {
      env.desktop.close('terminal')
      return {}
    },
  },
  sudo: {
    summary: '',
    run: () => ({
      ok: false,
      out: (
        <Err>
          guest is not in the sudoers file. This incident will be reported.
        </Err>
      ),
    }),
  },
  rm: {
    summary: '',
    run: (args) =>
      args.some((a) => a.includes('r') && a.startsWith('-'))
        ? {
            ok: false,
            out: <Err>rm: nice try. this machine is read-only.</Err>,
          }
        : readOnly('rm'),
  },
}

const HIDDEN = new Set(['sudo', 'rm'])

for (const cmd of ['mkdir', 'touch', 'mv', 'cp', 'chmod'])
  COMMANDS[cmd] = { summary: '', run: () => readOnly(cmd) }
for (const cmd of ['vim', 'vi', 'nano', 'emacs'])
  COMMANDS[cmd] = {
    summary: '',
    run: (args, { env }) => ({
      out: (
        <div>
          <Dim>
            {cmd}: this is a read-only machine
            {cmd === 'vim' ? ' (and you’d never get out)' : ''}.
          </Dim>
          <Suggest env={env} cmds={[`cat ${args[0] ?? 'README.md'}`]} />
        </div>
      ),
    }),
  }
for (const cmd of [
  'mkdir',
  'touch',
  'mv',
  'cp',
  'chmod',
  'vim',
  'vi',
  'nano',
  'emacs',
])
  HIDDEN.add(cmd)

/** Shorthands and the words people type out of habit. */
const ALIASES: Record<string, string> = {
  ll: 'ls -l',
  la: 'ls -l',
  dir: 'ls',
  '..': 'cd ..',
  home: 'cd ~',
  about: 'cat ~/README.md',
  readme: 'cat ~/README.md',
  resume: 'cat ~/resume.md',
  cv: 'cat ~/resume.md',
  skills: 'cat ~/skills.txt',
  contact: 'cat ~/contact.txt',
  projects: 'ls ~/projects',
  work: 'ls ~/projects',
  blog: 'ls ~/writing',
  posts: 'ls ~/writing',
  writing: 'ls ~/writing',
  search: 'grep',
  find: 'grep',
  cls: 'clear',
  q: 'exit',
  quit: 'exit',
  logout: 'exit',
}

const ALL_NAMES = [...Object.keys(COMMANDS), ...Object.keys(ALIASES)]

/* ---- Natural language ------------------------------------------------------- */

const QUESTION_START =
  /^(what|who|where|when|why|how|can|could|do|does|did|are|is|tell|show|give|list|any|which|i|im|i'm|hey|hi|hello|yo|sup|thanks|thank|please|whats|what's)\b/

function looksLikeQuestion(raw: string) {
  const t = raw.trim().toLowerCase()
  return t.endsWith('?') || QUESTION_START.test(t) || t.split(/\s+/).length >= 4
}

/** Answer plain-English questions by routing them to the right output. */
function ask(raw: string, ctx: Ctx): Step | null {
  const t = ` ${raw.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ')} `
  const env = ctx.env
  const say = (text: ReactNode, cmds: string[] = []) => ({
    out: (
      <div>
        <div>{text}</div>
        {cmds.length ? <Suggest env={env} cmds={cmds} /> : null}
      </div>
    ),
  })
  const has = (re: RegExp) => re.test(t)
  const cat = (path: string) => COMMANDS.cat.run([path], ctx)

  // A project mentioned by name wins over everything else.
  const squashed = t.replace(/[\s-]/g, '')
  const project = PROJECTS.find(
    (p) =>
      squashed.includes(p.slug.replace(/-/g, '')) ||
      squashed.includes(p.name.toLowerCase().replace(/[\s-]/g, '')),
  )
  if (project) return cat(`~/projects/${project.slug}`)

  if (has(/\b(help|commands|what can (i|you) do)\b/))
    return COMMANDS.help.run([], ctx)
  if (has(/\bwhere\b.*\b(live|based|from|located|you at)\b/))
    return say(`${PROFILE.location}.`, ['cat README.md'])
  if (
    has(
      /\b(this (site|website|desktop)|built this|made this|how.*(made|built))\b/,
    )
  )
    return say(
      'This desktop is Next.js 16 and Tailwind, with a hand-rolled window manager — no UI libraries. The terminal you’re in is about as real as it looks: a small filesystem built from the site’s data.',
      ['tree'],
    )
  if (
    has(/\b(hi|hey|hello|yo|sup|howdy|hola)\b/) &&
    t.trim().split(/\s+/).length <= 3
  )
    return say(
      `Hey! You’re a guest on ${PROFILE.name.split(' ')[0]}’s machine. Ask me about projects, writing, work, or how to get in touch.`,
      ['ls', 'help'],
    )
  if (has(/\b(thanks|thank you|thx|ty|cheers)\b/)) return say('Anytime.')
  if (
    has(/\b(who\b.*\b(you|utsav|this|he)|about (you|utsav|yourself)|introduce)/)
  )
    return cat('~/README.md')
  if (
    has(
      /\b(school|study|studied|studying|education|degree|penn|upenn|college|university|masters?|biochem)/,
    )
  )
    return say(
      <>
        {EDUCATION.map((e) => (
          <div key={e.school}>
            {e.school}{' '}
            <Dim>
              · {e.degree}, {e.field} · {e.startDate}–{e.endDate}
            </Dim>
          </div>
        ))}
      </>,
      ['cat resume.md'],
    )
  if (
    has(
      /\b(working on|work on|doing|building|build|current|currently|job|day job|what do you do|right now|these days)\b/,
    )
  )
    return say(
      <>
        Right now: {EXPERIENCE[0].role} at CLS, on CLS Settlement and AI. On the
        side:{' '}
        {PROJECTS.filter((p) => p.featured).map((p, i, all) => (
          <span key={p.slug}>
            <Run
              env={env}
              cmd={`cat ~/projects/${p.slug}`}
              className={tone.dir}
            >
              {p.name}
            </Run>
            {i < all.length - 1 ? ', ' : '.'}
          </span>
        ))}
      </>,
      [`cat ~/writing/${env.desktop.posts[0]?.slug}.md`],
    )
  if (has(/\b(resume|cv|experience|background|career|worked|jobs|history)\b/))
    return cat('~/resume.md')
  if (
    has(
      /\b(contact|email|mail|reach|hire|hiring|talk|connect|linkedin|github|touch)\b/,
    )
  )
    return cat('~/contact.txt')
  if (has(/\b(blog|posts?|write|writing|wrote|written|articles?|read)\b/))
    return COMMANDS.ls.run(['-l', '~/writing'], ctx)
  if (
    has(
      /\b(projects?|built|made|portfolio|side projects?|show me|apps?|tools?)\b/,
    )
  )
    return COMMANDS.ls.run(['-l', '~/projects'], ctx)
  if (has(/\b(skills?|stack|languages?|tech|technologies|frameworks?|know)\b/))
    return cat('~/skills.txt')
  return null
}

/* ---- Helpers ---------------------------------------------------------------- */

function Highlight({ text, q }: { text: string; q: string }) {
  const i = text.toLowerCase().indexOf(q)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <span className="bg-[#cdbdff]/30">{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  )
}

function openByName(target: string, env: ShellEnv): string | null {
  const q = target
    .toLowerCase()
    .replace(/^(my|the|your)\s+/, '')
    .trim()
  const app = [...DESKTOP_APPS, ...GAMES, 'trash' as const].find(
    (id) => id === q || APPS[id].label?.toLowerCase().startsWith(q),
  )
  if (app) {
    env.desktop.open(app)
    return APPS[app].label ?? APPS[app].title
  }
  const squash = q.replace(/[\s-]/g, '')
  const project = PROJECTS.find(
    (p) =>
      p.slug.replace(/-/g, '').startsWith(squash) ||
      p.name.toLowerCase().replace(/[\s-]/g, '').startsWith(squash),
  )
  if (project) {
    env.desktop.openProject(project.slug)
    return project.name
  }
  const post = env.desktop.posts.find((p) => p.slug.startsWith(q))
  if (post) {
    env.desktop.openPost(post.slug)
    return `“${post.title}”`
  }
  return null
}

function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
        // An adjacent swap ("sl" → "ls") is one typo, not two.
        i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]
          ? d[i - 2][j - 2] + 1
          : Infinity,
      )
  return d[a.length][b.length]
}

function closest(word: string, options: string[]) {
  let best: string | null = null
  let bestD = Math.max(2, Math.floor(word.length / 3)) + 1
  for (const o of options) {
    const dd = distance(word.toLowerCase(), o.toLowerCase())
    if (dd < bestD) {
      best = o
      bestD = dd
    }
  }
  return best
}

function tokenize(line: string) {
  return line.match(/"[^"]*"|'[^']*'|\S+/g) ?? []
}

/* ---- Entry points ----------------------------------------------------------- */

/** Run one input line — which may chain commands with && or ; — and return
 *  the combined output plus the shell's next state. */
export function execute(
  raw: string,
  state: ShellState,
  env: ShellEnv,
): ShellResult {
  const outs: { key: string; node: ReactNode }[] = []
  const seen = new Map<string, number>()
  let current = state
  let clear = false

  // Split into commands, keeping each one's separator: && stops the chain
  // on failure, ; always continues.
  const parts = raw.split(/(&&|;)/)
  for (let i = 0; i < parts.length; i += 2) {
    const part = parts[i].trim()
    const sep = parts[i + 1]
    if (!part) continue
    const [first = '', ...rest] = tokenize(part)
    const name = first.toLowerCase()
    const expanded = ALIASES[name]
    const [cmdName = name, ...aliasArgs] = expanded
      ? tokenize(expanded)
      : [name]
    const args = [...aliasArgs, ...rest]
    const cmd = COMMANDS[cmdName]
    const ctx: Ctx = { env, state: current, raw: part }

    let step: Step
    if (cmd && !(looksLikeQuestion(part) && !expanded && rest.length >= 3)) {
      step = cmd.run(args, ctx)
    } else {
      step =
        ask(part, ctx) ??
        (() => {
          const near = closest(
            name,
            ALL_NAMES.filter((n) => !HIDDEN.has(n)),
          )
          return {
            ok: false,
            out: (
              <div>
                <Err>guest-sh: command not found: {first}</Err>
                {near ? (
                  <div>
                    <Dim>did you mean </Dim>
                    <Run
                      env={env}
                      cmd={[near, ...rest].join(' ')}
                      className={tone.ok}
                    >
                      {near}
                    </Run>
                    <Dim>? or just ask a question — </Dim>
                    <Run env={env} cmd="help" className={tone.ok}>
                      help
                    </Run>
                  </div>
                ) : (
                  <Dim>
                    I don’t know that one. Try `help`, or ask about projects,
                    writing, work or how to reach me.
                  </Dim>
                )}
              </div>
            ),
          }
        })()
    }

    if (step.clear) {
      clear = true
      outs.length = 0
    }
    if (step.out) {
      // The same command can appear twice in one line; count repeats.
      const n = (seen.get(part) ?? 0) + 1
      seen.set(part, n)
      outs.push({ key: `${part}#${n}`, node: step.out })
    }
    if (step.state) current = step.state
    if (step.ok === false && sep === '&&') break
  }

  return {
    out: outs.length ? (
      <div className="space-y-1.5">
        {outs.map((o) => (
          <div key={o.key}>{o.node}</div>
        ))}
      </div>
    ) : null,
    state: current,
    clear,
  }
}

const PATH_COMMANDS = new Set(['ls', 'cd', 'cat', 'open', 'tree', 'll'])

/** Tab completion: commands in first position, paths after path commands.
 *  Returns the new input plus every candidate when there's more than one. */
export function complete(
  value: string,
  state: ShellState,
  root: Dir,
): { value: string; options: string[] } {
  const tokens = value.split(/\s+/)
  const last = tokens[tokens.length - 1] ?? ''

  if (tokens.length === 1) {
    const hits = ALL_NAMES.filter(
      (n) => !HIDDEN.has(n) && n.startsWith(last.toLowerCase()),
    ).sort()
    if (hits.length === 1) return { value: `${hits[0]} `, options: [] }
    return { value: commonPrefix(hits, last), options: hits }
  }

  const cmd = tokens[0].toLowerCase()
  if (cmd === 'man') {
    const hits = Object.keys(COMMANDS).filter(
      (n) => !HIDDEN.has(n) && n.startsWith(last),
    )
    if (hits.length === 1)
      return { value: replaceLast(value, hits[0]), options: [] }
    return {
      value: replaceLast(value, commonPrefix(hits, last)),
      options: hits,
    }
  }
  if (!PATH_COMMANDS.has(cmd)) return { value, options: [] }

  const slash = last.lastIndexOf('/')
  const dirPart = slash >= 0 ? last.slice(0, slash + 1) : ''
  const base = slash >= 0 ? last.slice(slash + 1) : last
  const dir = resolve(root, state.cwd, dirPart || '.')
  if (!dir || dir.node.kind !== 'dir') return { value, options: [] }

  const hits = dir.node.children
    .filter((c) => (cmd === 'cd' ? c.kind === 'dir' : true))
    .filter((c) => c.name.toLowerCase().startsWith(base.toLowerCase()))
    .map((c) => `${c.name}${c.kind === 'dir' ? '/' : ''}`)
    .sort()
  if (hits.length === 1)
    return {
      value: replaceLast(
        value,
        `${dirPart}${hits[0]}${hits[0].endsWith('/') ? '' : ' '}`,
      ),
      options: [],
    }
  return {
    value: replaceLast(value, `${dirPart}${commonPrefix(hits, base)}`),
    options: hits,
  }
}

function replaceLast(value: string, token: string) {
  return value.replace(/\S*$/, token)
}

function commonPrefix(words: string[], fallback: string) {
  if (!words.length) return fallback
  let p = words[0]
  for (const w of words)
    while (!w.toLowerCase().startsWith(p.toLowerCase())) p = p.slice(0, -1)
  return p.length >= fallback.length ? p : fallback
}

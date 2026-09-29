'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { useDesktop } from '../context'
import { buildFs, displayPath } from '../terminal/fs'
import {
  complete,
  execute,
  type ShellEnv,
  type ShellState,
} from '../terminal/shell'

type Line = { id: number; cwd?: string[]; input?: string; output?: ReactNode }

const HISTORY_KEY = 'guest-sh:history'
const LOGIN_KEY = 'guest-sh:last-login'
const HOME: ShellState = { cwd: [], prev: [] }

function Prompt({ cwd }: { cwd: string[] }) {
  return (
    <span className="shrink-0 whitespace-pre">
      <span className="text-[#7fd1a4]">guest@utsav</span>{' '}
      <span className="text-[#9cc0ff]">{displayPath(cwd)}</span>
      <span className="text-[#7f8a9c]"> % </span>
    </span>
  )
}

export default function Terminal() {
  const desktop = useDesktop()
  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const [shell, setShell] = useState<ShellState>(HOME)

  // History and counters never render directly, so they live in refs.
  const history = useRef<string[]>([])
  const cursor = useRef(-1)
  const draft = useRef('')
  const nextId = useRef(0)
  const shellRef = useRef(shell)
  const submitRef = useRef<(cmd: string) => void>(() => {})
  const input = useRef<HTMLInputElement>(null)
  const end = useRef<HTMLDivElement>(null)
  const screen = useRef<HTMLDivElement>(null)

  // Clicking anywhere focuses the prompt, unless you're selecting text to
  // copy. Keyboard users already land in the input, so this is mouse-only.
  useEffect(() => {
    const el = screen.current
    if (!el) return
    const onUp = () => {
      if (!window.getSelection()?.toString()) input.current?.focus()
    }
    el.addEventListener('mouseup', onUp)
    return () => el.removeEventListener('mouseup', onUp)
  }, [])

  const root = useMemo(() => buildFs(desktop.posts), [desktop.posts])

  // Clickable output from earlier commands calls back through a ref, so old
  // lines always run against the shell's current state.
  const env = useMemo<ShellEnv>(
    () => ({
      desktop,
      root,
      history: [],
      run: (cmd) => submitRef.current(cmd),
    }),
    [desktop, root],
  )

  function push(line: Omit<Line, 'id'>) {
    const id = nextId.current++
    setLines((l) => [...l, { ...line, id }])
  }

  function submit(raw: string) {
    const current = shellRef.current
    if (raw.trim()) {
      history.current = [
        raw,
        ...history.current.filter((h) => h !== raw),
      ].slice(0, 100)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.current))
    }
    cursor.current = -1
    const res = execute(raw, current, { ...env, history: history.current })
    if (res.clear) {
      setLines([])
      if (res.out) push({ output: res.out })
    } else push({ cwd: current.cwd, input: raw, output: res.out })
    shellRef.current = res.state
    setShell(res.state)
  }

  useEffect(() => {
    submitRef.current = submit
  })

  // A real shell greets you with your last login, so this one does too.
  useEffect(() => {
    try {
      history.current = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    } catch {
      history.current = []
    }
    const last = localStorage.getItem(LOGIN_KEY)
    localStorage.setItem(LOGIN_KEY, new Date().toISOString())
    const when = last
      ? new Date(last).toLocaleString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null
    const id = nextId.current++
    setLines([
      {
        id,
        output: (
          <div className="text-[#7f8a9c]">
            <div>
              {when
                ? `Last login: ${when} on ttys001`
                : 'First login. Welcome, guest.'}
            </div>
            <div className="mt-1 text-[#e6ebf2]">
              Try <span className="text-[#7fd1a4]">ls</span>,{' '}
              <span className="text-[#7fd1a4]">cat README.md</span>, or just ask
              — “what are you working on?”
            </div>
          </div>
        ),
      },
    ])
  }, [])

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  // Fish-style suggestion: the most recent matching command, else the single
  // tab completion, shown dimmed after the cursor.
  const ghost = useMemo(() => {
    if (!value.trim()) return ''
    const fromHistory = history.current.find(
      (h) => h.startsWith(value) && h !== value,
    )
    if (fromHistory) return fromHistory.slice(value.length)
    const c = complete(value, shell, root)
    return c.options.length === 0 && c.value.startsWith(value)
      ? c.value.slice(value.length).trimEnd()
      : ''
  }, [value, shell, root])

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const atEnd = e.currentTarget.selectionStart === value.length

    if (e.key === 'Enter') {
      e.preventDefault()
      submit(value)
      setValue('')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const c = complete(value, shell, root)
      if (c.options.length > 1)
        push({
          output: (
            <div className="flex flex-wrap gap-x-5 text-[#cdbdff]">
              {c.options.map((o) => (
                <span key={o}>{o}</span>
              ))}
            </div>
          ),
        })
      setValue(c.value)
    } else if ((e.key === 'ArrowRight' || e.key === 'End') && atEnd && ghost) {
      e.preventDefault()
      setValue((v) => v + ghost)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (cursor.current === -1) draft.current = value
      const i = Math.max(
        -1,
        Math.min(
          cursor.current + (e.key === 'ArrowUp' ? 1 : -1),
          history.current.length - 1,
        ),
      )
      cursor.current = i
      setValue(i >= 0 ? history.current[i] : draft.current)
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      push({ cwd: shell.cwd, input: `${value}^C` })
      setValue('')
      cursor.current = -1
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault()
      setLines([])
    } else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault()
      setValue('')
    }
  }

  return (
    <div
      className="bg-ink min-h-full cursor-text p-4 font-mono text-[13px] leading-relaxed text-[#e6ebf2]"
      ref={screen}
    >
      {lines.map((l) => (
        <div key={l.id} className="mb-2">
          {l.input !== undefined && l.cwd ? (
            <div className="flex">
              <Prompt cwd={l.cwd} />
              <span className="break-all whitespace-pre-wrap">{l.input}</span>
            </div>
          ) : null}
          {l.output}
        </div>
      ))}

      <label className="flex">
        <Prompt cwd={shell.cwd} />
        <span className="relative min-w-0 flex-1">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre"
          >
            <span className="invisible">{value}</span>
            <span className="text-[#7f8a9c]/70">{ghost}</span>
          </span>
          <input
            ref={input}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              cursor.current = -1
            }}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            data-autofocus
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="relative w-full bg-transparent caret-[#cdbdff] outline-none"
          />
        </span>
      </label>
      <div ref={end} />
    </div>
  )
}

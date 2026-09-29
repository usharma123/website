'use client'

import { useEffect, useRef, useState } from 'react'

export default function CopyCodeButton() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    [],
  )

  return (
    <button
      type="button"
      aria-label="Copy code"
      onClick={async (event) => {
        const code = event.currentTarget.parentElement?.querySelector('pre')
        if (!code) return
        if (timeout.current) clearTimeout(timeout.current)
        try {
          await navigator.clipboard.writeText(code.textContent ?? '')
          setStatus('copied')
        } catch {
          setStatus('failed')
        }
        timeout.current = setTimeout(() => setStatus('idle'), 1200)
      }}
      className="bg-ink absolute top-2 right-2 rounded border border-[#3a4558] px-2 py-0.5 font-mono text-[11px] text-[#e6ebf2] opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
    >
      <span aria-live="polite">
        {status === 'copied'
          ? 'copied'
          : status === 'failed'
            ? 'copy failed'
            : 'copy'}
      </span>
    </button>
  )
}

'use client'

import { useRef, useState, type ComponentProps } from 'react'

export default function CodeBlock(props: ComponentProps<'pre'>) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(ref.current?.innerText ?? '')
          setCopied(true)
          setTimeout(() => setCopied(false), 1200)
        }}
        className="bg-ink absolute top-2 right-2 rounded border border-[#4a5750] px-2 py-0.5 font-mono text-[11px] text-[#e6ede7] opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? 'copied' : 'copy'}
      </button>
      <pre ref={ref} {...props} />
    </div>
  )
}

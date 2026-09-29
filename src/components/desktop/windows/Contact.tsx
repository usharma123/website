'use client'

import { useState } from 'react'

import { PROFILE } from '@/data/resume'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  return (
    <div className="space-y-4 px-6 py-5">
      <p className="text-[15px] leading-relaxed">
        Email is the fastest way to reach me. Happy to talk about agent tooling,
        terminals, or whatever you’re building.
      </p>
      <div className="border-ink bg-chrome flex items-center gap-2 rounded-md border-[1.5px] p-1.5 pl-3">
        <span className="min-w-0 flex-1 truncate font-mono text-[13px]">
          {PROFILE.email}
        </span>
        <button
          type="button"
          className="btn"
          onClick={() => {
            void navigator.clipboard.writeText(PROFILE.email)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <a className="btn btn-primary" href={`mailto:${PROFILE.email}`}>
          Write
        </a>
      </div>
      <p className="flex gap-5 text-[14.5px]">
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
    </div>
  )
}

'use client'

import { useState } from 'react'

import { Toolbar } from '../Window'

const ITEMS = [
  {
    name: 'portfolio-v1-neobrutalism/',
    note: 'Six accent colors, 14px hard shadows, and a tape decoration on every card.',
  },
  {
    name: 'portfolio-v2-terminal/',
    note: 'A terminal in a fake Mac window. You had to type `help` to see anything.',
  },
]

export default function Trash() {
  const [refused, setRefused] = useState(false)
  return (
    <div>
      <Toolbar>
        <span className="text-muted font-mono text-[12px]">
          {ITEMS.length} items
        </span>
        <button
          type="button"
          className="btn ml-auto"
          onClick={() => setRefused(true)}
        >
          Empty Trash
        </button>
      </Toolbar>
      {refused ? (
        <p className="border-rule bg-marker border-b px-4 py-2 text-[13.5px]">
          Couldn’t empty the trash: these are load-bearing mistakes.
        </p>
      ) : null}
      <ul>
        {ITEMS.map((i) => (
          <li key={i.name} className="border-rule border-b px-4 py-3">
            <div className="font-mono text-[13px] font-medium">{i.name}</div>
            <div className="text-muted text-[14px]">{i.note}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

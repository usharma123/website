'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/* Generated previews for projects without a real screenshot. Each one is a
   600×300 mock of the actual tool, drawn from its README or blog post, then
   scaled to cover whatever box it's placed in. */

const W = 600
const H = 300

export function Scaled({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.57)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.max(width / W, height / H))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className={`${className} relative w-full overflow-hidden`}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

// Terminal palette, tuned to sit next to the site's sage and lilac.
const dim = 'text-[#7f8a9c]'
const grn = 'text-[#7fd1a4]'
const lil = 'text-[#cdbdff]'
const cly = 'text-[#e9c6ad]'
const red = 'text-[#ff9a8a]'

function Term({
  title,
  right,
  children,
}: {
  title: string
  right?: string
  children: ReactNode
}) {
  return (
    <div className="flex h-full flex-col bg-[#0f1520] font-mono text-[12px] leading-[1.6] text-[#e1e7f0]">
      <div className="flex items-center gap-3 border-b border-[#253044] px-4 py-1.5 text-[11px]">
        <span className={lil}>●</span>
        <span>{title}</span>
        {right ? <span className={`ml-auto ${dim}`}>{right}</span> : null}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}

function Prompt({ children, p = '$' }: { children: ReactNode; p?: string }) {
  return (
    <div>
      <span className={grn}>{p}</span> {children}
    </div>
  )
}

function Bar({
  w,
  className = 'bg-[#dde4ee]',
}: {
  w: string
  className?: string
}) {
  return (
    <div className={`h-[7px] rounded-full ${className}`} style={{ width: w }} />
  )
}

const SiteFS = () => (
  <Term title="sitefs shell — .sitefs" right="chromium · headed">
    <div className="grid h-full grid-cols-[1fr_190px]">
      <div className="px-4 py-2">
        <Prompt>sitefs shell --session .sitefs --headed</Prompt>
        <Prompt p="sitefs>">tabs</Prompt>
        <div className={dim}>&nbsp; [0] * utsav.sh</div>
        <Prompt p="sitefs>">ls</Prompt>
        <div>
          &nbsp;{' '}
          <span className={lil}>banner/ navigation/ main/ contentinfo/</span>
        </div>
        <Prompt p="sitefs>">cd main</Prompt>
        <Prompt p="sitefs>">find --type link</Prompt>
        <div className={cly}>
          &nbsp; home_link work_link blog_link github_link
        </div>
        <Prompt p="sitefs>">web check-all</Prompt>
        <div>
          &nbsp; <span className={grn}>✓</span> snapshot → site/current
        </div>
        <div>
          &nbsp; <span className={grn}>✓</span> report → site/reports/
        </div>
      </div>
      <div className="border-l border-[#253044] px-4 py-2">
        <div className={dim}>evidence</div>
        <div className={lil}>site/</div>
        {[
          'README.md',
          'current/',
          'history/<id>/',
          'pages/<slug>/',
          '  issues.json',
          'reports/',
          'crawl/',
          '  manifest.json',
          'flows/<name>.json',
        ].map((l) => (
          <div key={l} className="whitespace-pre">
            {'  '}
            {l}
          </div>
        ))}
      </div>
    </div>
  </Term>
)

const Packet28 = () => (
  <Term title="packet28d" right="suite.diff.analyze.v1">
    <div className="grid h-full grid-cols-[170px_1fr]">
      <div className="border-r border-[#253044] px-4 py-2">
        <div className={dim}>reducers</div>
        {['diffy', 'covy', 'testy', 'stacky', 'buildy', 'mapy', 'proxy'].map(
          (r, i) => (
            <div key={r}>
              <span className={i < 2 ? grn : dim}>{i < 2 ? '●' : '○'}</span> {r}
            </div>
          ),
        )}
        <div className={`mt-2 ${dim}`}>budget</div>
        <div>
          <span className={cly}>800</span> est_tokens
        </div>
        <div>
          <span className={cly}>12</span> ms
        </div>
      </div>
      <pre className="px-4 py-2 text-[11.5px] leading-[1.55]">
        {'{\n  '}
        <span className={lil}>"packet_type"</span>:{' '}
        <span className={grn}>"suite.diff.analyze.v1"</span>
        {',\n  '}
        <span className={lil}>"summary"</span>:{' '}
        <span className={grn}>
          "3 files changed, coverage{'\n'}
          {'    '}dropped 2.1% in AuthService"
        </span>
        {',\n  '}
        <span className={lil}>"files"</span>: [{'{ '}
        <span className={lil}>"path"</span>:{' '}
        <span className={grn}>"src/auth.rs"</span>,{' '}
        <span className={lil}>"relevance"</span>:{' '}
        <span className={cly}>0.75</span>
        {' }],\n  '}
        <span className={lil}>"symbols"</span>: [{'{ '}
        <span className={lil}>"name"</span>:{' '}
        <span className={grn}>"AuthService"</span>,{' '}
        <span className={lil}>"relevance"</span>:{' '}
        <span className={cly}>0.9</span>
        {' }],\n  '}
        <span className={lil}>"provenance"</span>: {'{ '}
        <span className={lil}>"git_base"</span>:{' '}
        <span className={grn}>"origin/main"</span>
        {' }\n}'}
      </pre>
    </div>
  </Term>
)

const GSuiteTUI = () => (
  <Term title="GSuiteTUI" right="user@gmail">
    <div className="flex h-full flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-[140px_1fr]">
        <div className="border-r border-[#253044] px-4 py-3">
          <div className={lil}>▸ Calendar</div>
          <div className="pl-3">Gmail</div>
          <div className="pl-3">Drive</div>
        </div>
        <div className="px-5 py-3">
          <div className={dim}>Today — Feb 2, 2026</div>
          <div className="mt-1 bg-[#1b2536] px-1">
            <span className={cly}>09:00</span> (30 min) — Team Standup
          </div>
          <div className="px-1">
            <span className={cly}>11:00</span> (60 min) — Design Review
          </div>
          <div className="px-1">
            <span className={cly}>14:00</span> (45 min) — 1:1 with PM
          </div>
          <div className={`mt-3 ${dim}`}>Tomorrow</div>
          <div className="px-1">
            <span className={cly}>10:00</span> (90 min) — Sprint Plan
          </div>
        </div>
      </div>
      <div
        className={`border-t border-[#253044] px-4 py-1.5 text-[11px] ${dim}`}
      >
        [j/k] Navigate · [Enter] Details · [q] Quit
      </div>
    </div>
  </Term>
)

const CodeCLI = () => (
  <Term title="CodeCLI" right="MiniMax M2.1 · OpenRouter">
    <div className="px-4 py-2">
      <Prompt p="›">generate tests for UserService</Prompt>
      <div className={`mt-1 ${dim}`}>Spring Boot service detected · Maven</div>
      <div className="mt-1.5 rounded border border-[#253044] px-3 py-1.5">
        <div className={dim}>agents</div>
        <div>
          <span className={grn}>✓</span> FileSystemAgent{' '}
          <span className={dim}>read src/main/…/UserService.java</span>
        </div>
        <div>
          <span className={grn}>✓</span> AnalysisAgent{' '}
          <span className={dim}>mapped 6 public methods</span>
        </div>
        <div>
          <span className={lil}>◐</span> writing UserServiceTest.java
        </div>
      </div>
      <div className="mt-1.5">
        <span className={grn}>+ </span>
        <span className={dim}>@Test void createsUserWithHashedPassword()</span>
      </div>
      <div>
        <span className={grn}>+ </span>
        <span className={dim}>@Test void rejectsDuplicateEmail()</span>
      </div>
      <div className={`mt-1.5 ${dim}`}>
        session saved → ~/.codecli/sessions/
      </div>
    </div>
  </Term>
)

const DataTUI = () => (
  <Term title="DataTUI" right="duckdb · sandboxed python">
    <div className="px-4 py-2">
      <Prompt p="›">which region grew fastest this quarter?</Prompt>
      <div className="my-1.5 rounded border border-[#253044] px-3 py-1 text-[11px]">
        <span className={lil}>SELECT</span> region,{' '}
        <span className={lil}>sum</span>(revenue){' '}
        <span className={lil}>FROM</span>{' '}
        <span className={cly}>'data/sales.csv'</span>{' '}
        <span className={lil}>GROUP BY</span> 1{' '}
        <span className={lil}>ORDER BY</span> 2{' '}
        <span className={lil}>DESC</span>
      </div>
      {[
        ['west', 20],
        ['north', 15],
        ['east', 11],
        ['south', 7],
      ].map(([r, n]) => (
        <div key={r} className="flex gap-3">
          <span className="w-12">{r}</span>
          <span
            className="my-[3px] rounded-sm bg-[#7fd1a4]"
            style={{ width: (n as number) * 12 }}
          />
        </div>
      ))}
      <div className={`mt-1.5 ${dim}`}>
        no network · writes only to ./outputs/
      </div>
    </div>
  </Term>
)

const QAMVP = () => (
  <div className="flex h-full flex-col bg-[#f3f6fa] font-sans text-[12.5px] text-[#141b26]">
    <div className="border-b border-[#d0d8e3] px-4 py-2 font-mono text-[11px] text-[#566173]">
      toolsV3 · governed QA workflow
    </div>
    <div className="flex-1 space-y-2 px-4 py-3">
      <div className="ml-auto w-fit rounded-md bg-[#141b26] px-3 py-1.5 font-mono text-[#e6ebf2]">
        /qa test-doc
      </div>
      <div className="rounded-md border border-[#d0d8e3] bg-white px-3 py-2">
        {[
          ['ingestion', 'source documents audited'],
          ['python-orchestrator', 'locator workbook validated'],
          ['java-framework', 'Selenium run vs. mock-trading-app'],
          ['test_data', 'run evidence written'],
        ].map(([k, v], i) => (
          <div key={k} className="flex items-center gap-2 py-0.5">
            <span className={i < 3 ? 'text-[#1e4f9e]' : 'text-[#8a7fb8]'}>
              {i < 3 ? '✓' : '◐'}
            </span>
            <span className="w-[150px] font-mono text-[11.5px]">{k}</span>
            <span className="text-[#566173]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const Grammarly = () => (
  <div className="flex h-full flex-col bg-white font-sans text-[#141b26]">
    <div className="flex gap-3 border-b border-[#e2e8f0] px-4 py-2 text-[12px] font-semibold text-[#566173]">
      <span>B</span>
      <span className="italic">I</span>
      <span>H1</span>
      <span>H2</span>
      <span>“ ”</span>
      <span className="ml-auto font-mono text-[10.5px] font-normal">
        rust/wasm · worker
      </span>
    </div>
    <div className="grid flex-1 grid-cols-[1fr_190px]">
      <p className="px-5 py-4 text-[15px] leading-[1.9]">
        <span className="underline decoration-[#e0604a] decoration-wavy decoration-[1.5px] underline-offset-4">
          Their
        </span>{' '}
        going to ship the editor{' '}
        <span className="bg-[#fbe3dd] underline decoration-[#e0604a] decoration-wavy decoration-[1.5px] underline-offset-4">
          tomorow
        </span>
        , and it{' '}
        <span className="underline decoration-[#8a7fb8] decoration-wavy decoration-[1.5px] underline-offset-4">
          run
        </span>{' '}
        entirely in the browser without sending a keystroke to a server.
      </p>
      <div className="border-l border-[#e2e8f0] p-3">
        <div className="rounded-md border border-[#d0d8e3] p-2.5 shadow-sm">
          <div className="text-[10.5px] font-semibold tracking-wide text-[#e0604a] uppercase">
            Spelling
          </div>
          <div className="mt-1 text-[13px]">
            <span className="text-[#7f8a9c] line-through">tomorow</span> →{' '}
            <span className="font-semibold">tomorrow</span>
          </div>
          <div className="mt-2 w-fit rounded bg-[#1e4f9e] px-2 py-0.5 text-[11px] text-white">
            Accept
          </div>
        </div>
        <div className="mt-2 text-[11px] text-[#7f8a9c]">
          2 more suggestions
        </div>
      </div>
    </div>
  </div>
)

const OpenTrace = () => {
  const node =
    'absolute rounded-md border-[1.5px] bg-white px-2.5 py-1 font-mono text-[11px] shadow-sm'
  return (
    <div className="flex h-full flex-col bg-[#f3f6fa] text-[#141b26]">
      <div className="flex gap-4 border-b border-[#d0d8e3] px-4 py-2 text-[12px]">
        <span className="font-semibold">Flow</span>
        <span className="text-[#7f8a9c]">Jaeger</span>
        <span className="text-[#7f8a9c]">Ask agent</span>
        <span className="ml-auto font-mono text-[10.5px] text-[#7f8a9c]">
          OpenTelemetry → ReactFlow
        </span>
      </div>
      <div
        className="relative flex-1"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        <svg
          className="absolute inset-0"
          width="600"
          height="260"
          fill="none"
          stroke="#7f8a9c"
          strokeWidth="1.5"
        >
          <path d="M165 60 C 230 60, 230 40, 300 40" />
          <path d="M165 60 C 230 60, 230 110, 300 110" />
          <path d="M165 60 C 230 60, 230 180, 300 180" />
          <path d="M420 110 C 450 110, 450 150, 480 150" />
        </svg>
        <div className={`${node} top-[46px] left-[20px] border-[#141b26]`}>
          GET /demo/parallel
        </div>
        <div className={`${node} top-[26px] left-[300px] border-[#1e4f9e]`}>
          http.client fetch_a
        </div>
        <div className={`${node} top-[96px] left-[300px] border-[#1e4f9e]`}>
          http.client fetch_b
        </div>
        <div className={`${node} top-[136px] left-[480px] border-[#1e4f9e]`}>
          db.query
        </div>
        <div
          className={`${node} top-[166px] left-[300px] border-[#e0604a] text-[#c2412d]`}
        >
          ✕ fetch_c · error
        </div>
      </div>
    </div>
  )
}

const GoogleDocConvex = () => (
  <div className="grid h-full grid-cols-[120px_1fr_150px] bg-white text-[#141b26]">
    <div className="border-r border-[#e2e8f0] bg-[#f3f6fa] px-3 py-3 text-[11.5px]">
      <div className="mb-1 font-semibold">Workspace</div>
      <div className="text-[#566173]">▾ Essays</div>
      <div className="rounded bg-[#dbe5f5] px-1.5 pl-3">Why this school</div>
      <div className="pl-3 text-[#566173]">Activities</div>
      <div className="pl-3 text-[#566173]">Diversity</div>
    </div>
    <div className="px-5 py-3">
      <div className="mb-3 rounded border border-[#e9c6ad] bg-[#fbf1ea] px-2 py-1 text-[11px]">
        <span className="font-semibold">Prompt</span> · Why are you applying to
        this program?
      </div>
      <div className="space-y-2.5">
        <Bar w="92%" />
        <Bar w="85%" />
        <Bar w="88%" />
        <Bar w="60%" />
        <div className="h-1" />
        <Bar w="90%" />
        <Bar w="78%" />
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[10.5px] text-[#566173]">
        <span className="size-2 rounded-full bg-[#1e4f9e]" /> 2 editing · synced
      </div>
    </div>
    <div className="border-l border-[#e2e8f0] px-3 py-3 text-[11px]">
      <div className="mb-2 flex gap-2">
        <span className="font-semibold">Research</span>
        <span className="text-[#7f8a9c]">Coach</span>
      </div>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="mb-2 space-y-1.5 rounded border border-[#e2e8f0] p-2"
        >
          <Bar w="80%" className="bg-[#141b26]/70" />
          <Bar w="95%" />
          <Bar w="70%" />
          <div className="text-[10px] text-[#1e4f9e]">key insight · cite</div>
        </div>
      ))}
    </div>
  </div>
)

const BlueSky = () => {
  const asks = ['1.08462', '1.08458', '1.08455']
  const bids = ['1.08449', '1.08446', '1.08441']
  return (
    <div className="grid h-full grid-cols-[1fr_210px] bg-[#0f1520] font-mono text-[11.5px] text-[#e1e7f0]">
      <div className="px-4 py-3">
        <div className="mb-2 flex items-baseline gap-3">
          <span className="font-semibold">EUR/USD</span>
          <span className={dim}>order book · FIX 4.4</span>
        </div>
        <div className={`grid grid-cols-3 ${dim}`}>
          <span>price</span>
          <span>size</span>
          <span>side</span>
        </div>
        {asks.map((p, i) => (
          <div key={p} className="grid grid-cols-3">
            <span className={red}>{p}</span>
            <span>{(i + 2) * 250}k</span>
            <span className={dim}>ask</span>
          </div>
        ))}
        <div className="my-1 border-t border-dashed border-[#253044]" />
        {bids.map((p, i) => (
          <div key={p} className="grid grid-cols-3">
            <span className={grn}>{p}</span>
            <span>{(3 - i) * 300}k</span>
            <span className={dim}>bid</span>
          </div>
        ))}
      </div>
      <div className="border-l border-[#253044] px-4 py-3">
        <div className={dim}>services</div>
        {[
          'GXFIXGateway',
          'GXTradeProcessor',
          'GXRateEngine',
          'GXOrderManager',
          'GXMatchingEngine',
          'GXNotificationProcessor',
          'GXTraderUI',
        ].map((s) => (
          <div key={s}>
            <span className={grn}>●</span> {s}
          </div>
        ))}
      </div>
    </div>
  )
}

const SSFF = () => {
  const box =
    'rounded-md border-[1.5px] border-[#141b26] bg-white px-2.5 py-1 font-mono text-[11px]'
  return (
    <div className="relative h-full bg-[#f3f6fa] px-5 py-4 text-[#141b26]">
      <div className="flex items-baseline justify-between">
        <span className="text-[14px] font-semibold">
          Startup Success Forecasting Framework
        </span>
        <span className="font-mono text-[10.5px] text-[#566173]">
          arXiv:2405.19456
        </span>
      </div>
      <div className="mt-5 grid grid-cols-[150px_40px_150px_40px_1fr] items-center">
        <div className="space-y-2">
          {[
            'founder_agent',
            'market_agent',
            'product_agent',
            'vc_scout_agent',
          ].map((a) => (
            <div key={a} className={box}>
              {a}
            </div>
          ))}
        </div>
        <div className="text-center text-[#7f8a9c]">→</div>
        <div className={`${box} bg-[#cdbdff]`}>integration_agent</div>
        <div className="text-center text-[#7f8a9c]">→</div>
        <div className="space-y-2">
          <div className={`${box} bg-[#dbe5f5]`}>random forest</div>
          <div className={`${box} bg-[#dbe5f5]`}>neural net</div>
          <div className={`${box} bg-[#e9c6ad]`}>forecast</div>
        </div>
      </div>
    </div>
  )
}

export const MOCKS: Record<string, () => ReactNode> = {
  sitefs: SiteFS,
  packet28: Packet28,
  gsuitetui: GSuiteTUI,
  codecli: CodeCLI,
  datatui: DataTUI,
  qamvp: QAMVP,
  'grammarly-wasm-editor': Grammarly,
  opentrace: OpenTrace,
  'googledoc-convex': GoogleDocConvex,
  blueskytrading: BlueSky,
  ssff: SSFF,
}

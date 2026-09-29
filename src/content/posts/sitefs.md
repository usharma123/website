---
title: "SiteFS: A CLI-First QA Agent Runtime for the Web"
description: "Two layers — a live accessibility-tree shell and persistent /site evidence — for agent-driven QA, crawl, and CI-grade reports."
pubDate: "2026-06-02"
tags: ["qa", "playwright", "cli", "accessibility", "mcp", "testing", "typescript"]
---

Browser QA tools usually fall into two camps: brittle Playwright scripts that break when a button moves, or opaque automation that agents can't inspect mid-run. I wanted something in between — a runtime where an agent (or a human) can `ls`, `cd`, `grep`, and `click` through a website the same way they'd navigate a filesystem, with durable evidence written to disk for CI and review.

That's **SiteFS**: a CLI-first QA agent runtime with two cooperating layers — a live accessibility-tree shell and a persistent `/site` evidence store.

**Repo:** [github.com/usharma123/SiteFS](https://github.com/usharma123/SiteFS)

## Why a Filesystem Metaphor?

Playwright is powerful but opaque to agents. Sending `page.click('#submit')` gives no intermediate structure — just success or failure. Agents need navigable state: what's on this page, where can I go, what changed since the last snapshot?

SiteFS maps the browser's accessibility tree into a virtual filesystem. Each interactive element gets a path. Commands like `ls`, `cd`, `find`, and `grep` operate on that tree — the same primitives agents already understand from code exploration.

The second layer persists everything under `/site`: snapshots, axe results, link checks, crawl manifests, visual diffs, and viewer manifests. CI gets artifacts; humans get a local viewer.

## Two-Layer Design

| Layer | Commands or artifacts | Connection |
| --- | --- | --- |
| Live accessibility shell | `tabs`, `here`, `ls`, `cd`, `click`, `find`, `grep` | Reads and acts through the Playwright worker |
| Persistent evidence | Snapshots, reports, crawl results, diffs | Saves worker output in the session directory |
| Local viewer | `viewer-manifest.json` | Opens saved runs and diffs |

### Layer 1: Live AX Shell

Inspired by DOMShell-style navigation, the live shell exposes custom commands via `just-bash`:

```bash
sitefs shell --session .sitefs --headed

tabs
here
ls
cd main
click home_link
find --type link
grep "Sign up"
web check-all
```

Under the hood, `@sitefs/axfs` converts the Playwright CDP accessibility tree into virtual paths. `@sitefs/live` dispatches commands through `BrowserHost`. Write actions can auto-snapshot to `/site/current`.

Shell extras match DOMShell ergonomics: `goto` (alias for `navigate`), `cd tabs/github` (substring tab match), `ls --after`/`--before`/`--meta`, `find --content`, `extract_table [--format csv]`, and `!n` history replay.

### Layer 2: Evidence `/site`

Every session gets a durable directory:

Paths below are relative to the session directory.

| Path | Contents |
| --- | --- |
| `config.json` | Session settings |
| `viewer-manifest.json` | Index used by the local viewer |
| `site/README.md` | Session overview |
| `site/current/` | Latest snapshot |
| `site/history/<snapshotId>/` | Immutable snapshots |
| `site/pages/<slug>/` | Named page copies and `issues.json` |
| `site/reports/` | Markdown and JSON reports, plus diffs |
| `site/crawl/manifest.json` | Crawl results |
| `site/flows/<name>.json` | Saved flows |

`@sitefs/sitefs` handles snapshot I/O, page diffs, run registry, and viewer manifests. `@sitefs/qa` runs static checks, link probes, and report builders. Two diff modules serve different needs:

- **`snapshot-diff`** — compares persisted `PageSnapshot` (links, buttons, screenshots)
- **`filesystem-diff`** — compares live `AxFilesystem` trees in real time

## Monorepo Packages

| Package | Role |
|---------|------|
| `sitefs` (cli) | Entrypoints: `shell`, `mcp`, `test`, `view`, `doctor` |
| `@sitefs/session` | `createSessionContext()` — store, worker, `WebRuntime`, `BrowserHost` |
| `@sitefs/live` | Live AX shell and command dispatch |
| `@sitefs/commands` | Shared command catalog for shell, host, and MCP |
| `@sitefs/browser` | Playwright backend + worker subprocess |
| `@sitefs/sitefs` | Session disk layout, snapshots, registry |
| `@sitefs/axfs` | CDP tree → virtual filesystem |
| `@sitefs/qa` | QA checks and report builders |
| `@sitefs/viewer` | Local React UI for runs and diffs |

Dependency rules keep layers clean: `@sitefs/sitefs` and `@sitefs/axfs` never import browser or CLI code. Orchestration flows down: `cli` → `session` → `live` / `browser` / `sitefs` / `qa` / `axfs`.

## Browser Worker Protocol

Playwright runs in a **child process** so the main CLI/MCP process stays light:

- Parent spawns `browser-worker.js`, speaks **newline-delimited JSON**
- Request: `{ "id": number, "method": string, "args": unknown[] }`
- Response: `{ "id": number, "ok": boolean, "result"?: unknown, "error"?: string }`

Methods mirror the live backend: `open`, `clickAx`, `getAccessibilityTree`, `snapshot`, and others. Multi-tab support is first-class — `tabs` and `cd tabs/<name>` switch context without losing state.

## MCP Surface

SiteFS exposes the same command surface as MCP tools for Codex, Cursor, or any MCP client:

```bash
sitefs mcp --session .sitefs --allow-write
```

Tools include:

- **Navigation:** `sitefs_ls`, `sitefs_cd`, `sitefs_click`, `sitefs_goto`
- **Search:** `sitefs_find`, `sitefs_grep`, `sitefs_extract_table`
- **QA:** `sitefs_check_all`, `sitefs_crawl`, `sitefs_web`
- **Evidence:** `sitefs_read_site`, `sitefs_screenshot`, `sitefs:///` resources

`sitefs_screenshot` saves a PNG under the session and returns it inline in MCP responses — useful for vision-driven agents.

## One-Shot QA

For CI or quick checks without an interactive shell:

```bash
sitefs test https://example.com --session .sitefs-run
sitefs test https://example.com --crawl --session .sitefs-run
sitefs doctor
sitefs demo --session .sitefs-demo
```

`test` runs checks and writes reports under the session. `view` opens the local viewer against `viewer-manifest.json`.

Session config (`config.json`) controls behavior: link scope, crawl limits, auto-snapshot on write, fail-on-warnings, and sensitive-data handling.

## Relationship to UI-tester

These projects solve different layers of the same problem:

| | **UI-tester** | **SiteFS** |
| --- | --- | --- |
| Interface | Ink TUI with LLM planner/judge | CLI shell + MCP tools |
| Intelligence | LLM generates adaptive test plans | Agent brings its own reasoning |
| Evidence | `.ui-qa-runs/<id>/` | `/site` session layout |
| Best for | "Test this URL and score it" | "Give agents a navigable browser runtime" |

[UI-tester](/blog/ui-tester) is the opinionated QA product — point it at a URL, watch it plan and execute tests, get a scored report. SiteFS is the infrastructure underneath: structured browser state, persistent evidence, and MCP primitives that any agent can compose.

For repo-side context when fixing what QA finds, [Packet28](/blog/packet28) handles the other half — reducing diffs, logs, and coverage into bounded packets so agents don't burn context exploring the codebase.

## Try It

```bash
git clone https://github.com/usharma123/SiteFS.git
cd SiteFS
node scripts/pnpm.mjs install
node scripts/pnpm.mjs --filter @sitefs/browser exec playwright install chromium
node scripts/pnpm.mjs -r build
node packages/cli/dist/index.js doctor
node packages/cli/dist/index.js test https://utsav.sh --session .sitefs-demo
```

The repo bootstraps without global npm/pnpm — `node scripts/pnpm.mjs` handles everything.

---

**SiteFS** treats the browser like a filesystem agents can explore, with CI-grade evidence on disk. If you're building agent-driven QA, the missing piece might not be another LLM wrapper — it might be structured state the agent can actually navigate.

**Source code:** [github.com/usharma123/SiteFS](https://github.com/usharma123/SiteFS)

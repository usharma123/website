---
title: 'SiteFS: a browser shell with saved QA evidence'
description: 'Navigating the accessibility tree with shell commands and saving snapshots, checks, and diffs for later review.'
pubDate: '2026-06-02'
tags:
  ['qa', 'playwright', 'cli', 'accessibility', 'mcp', 'testing', 'typescript']
---

When an agent operates a browser, I want to inspect what it can see and keep the evidence after the run. A successful click alone doesn't tell me what changed on the page.

SiteFS gives the agent a shell over the browser's accessibility tree. It can navigate with `ls`, `cd`, `find`, and `grep`, then save snapshots and reports in a session directory.

[Source code](https://github.com/usharma123/SiteFS)

## Live state and saved evidence

SiteFS maps interactive elements to virtual paths. The live tree answers questions about the current page; the files under `/site` preserve what happened during a run.

| Layer                    | Commands or artifacts                               | Connection                                   |
| ------------------------ | --------------------------------------------------- | -------------------------------------------- |
| Live accessibility shell | `tabs`, `here`, `ls`, `cd`, `click`, `find`, `grep` | Reads and acts through the Playwright worker |
| Persistent evidence      | Snapshots, reports, crawl results, diffs            | Saves worker output in the session directory |
| Local viewer             | `viewer-manifest.json`                              | Opens saved runs and diffs                   |

## Exploring a page

The shell exposes browser commands through `just-bash`:

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

`@sitefs/axfs` converts the accessibility tree obtained through Playwright's CDP connection into virtual paths. `@sitefs/live` dispatches commands through `BrowserHost`. Write actions can save a snapshot to `/site/current`.

Other commands include `goto`, substring matching for `cd tabs/github`, metadata and ordering flags on `ls`, `find --content`, `extract_table`, and `!n` history replay.

## What a session saves

Paths below are relative to the session directory.

| Path                         | Contents                              |
| ---------------------------- | ------------------------------------- |
| `config.json`                | Session settings                      |
| `viewer-manifest.json`       | Index used by the local viewer        |
| `site/README.md`             | Session overview                      |
| `site/current/`              | Latest snapshot                       |
| `site/history/<snapshotId>/` | Immutable snapshots                   |
| `site/pages/<slug>/`         | Named page copies and `issues.json`   |
| `site/reports/`              | Markdown and JSON reports, plus diffs |
| `site/crawl/manifest.json`   | Crawl results                         |
| `site/flows/<name>.json`     | Saved flows                           |

`@sitefs/sitefs` handles snapshot storage, the run registry, and viewer manifests. `@sitefs/qa` runs checks and builds reports.

There are two kinds of diff. `snapshot-diff` compares saved `PageSnapshot` records, including links, buttons, and screenshots. `filesystem-diff` compares live `AxFilesystem` trees.

## Package boundaries

| Package            | Role                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------ |
| `sitefs` (cli)     | Entrypoints: `shell`, `mcp`, `test`, `view`, `doctor`                                |
| `@sitefs/session`  | `createSessionContext()` connects the store, worker, `WebRuntime`, and `BrowserHost` |
| `@sitefs/live`     | Live AX shell and command dispatch                                                   |
| `@sitefs/commands` | Shared command catalog for shell, host, and MCP                                      |
| `@sitefs/browser`  | Playwright backend + worker subprocess                                               |
| `@sitefs/sitefs`   | Session disk layout, snapshots, registry                                             |
| `@sitefs/axfs`     | CDP tree → virtual filesystem                                                        |
| `@sitefs/qa`       | QA checks and report builders                                                        |
| `@sitefs/viewer`   | Local React UI for runs and diffs                                                    |

The storage and accessibility-tree packages don't import the browser or CLI packages. The CLI creates a session, and the session connects the live shell, browser, storage, and QA code.

## Keeping the browser in a worker

Playwright runs in a child process. The parent exchanges newline-delimited JSON with `browser-worker.js`:

- Requests contain an ID, method name, and arguments.
- Responses carry the same ID, an `ok` flag, and a result or error.

Methods include `open`, `clickAx`, `getAccessibilityTree`, and `snapshot`. The `tabs` command and `cd tabs/<name>` switch the active tab.

## Using MCP

The MCP server exposes the command catalog to an agent:

```bash
sitefs mcp --session .sitefs --allow-write
```

| Task               | Tools                                                           |
| ------------------ | --------------------------------------------------------------- |
| Navigate           | `sitefs_ls`, `sitefs_cd`, `sitefs_click`, `sitefs_goto`         |
| Search and extract | `sitefs_find`, `sitefs_grep`, `sitefs_extract_table`            |
| Run checks         | `sitefs_check_all`, `sitefs_crawl`, `sitefs_web`                |
| Inspect evidence   | `sitefs_read_site`, `sitefs_screenshot`, `sitefs:///` resources |

`sitefs_screenshot` saves a PNG in the session and returns an inline image for clients that can read it.

## Running a check without the shell

```bash
sitefs test https://example.com --session .sitefs-run
sitefs test https://example.com --crawl --session .sitefs-run
sitefs doctor
sitefs demo --session .sitefs-demo
```

`test` writes reports to the session. `view` opens the local viewer using `viewer-manifest.json`. Session configuration controls link scope, crawl limits, snapshots after writes, warning behavior, and sensitive-data handling.

## How it relates to UI-tester

|              | **UI-tester**                     | **SiteFS**                                |
| ------------ | --------------------------------- | ----------------------------------------- |
| Interface    | Ink TUI with LLM planner/judge    | CLI shell + MCP tools                     |
| Intelligence | LLM generates adaptive test plans | Agent brings its own reasoning            |
| Evidence     | `.ui-qa-runs/<id>/`               | `/site` session layout                    |
| Best for     | "Test this URL and score it"      | "Give agents a navigable browser runtime" |

[UI-tester](/blog/ui-tester) plans and judges a QA run. SiteFS supplies commands and evidence that an agent can use with its own plan. [Packet28](/blog/packet28) covers a separate part of the investigation: reducing repository artifacts after a browser check finds a problem.

## Running from source

```bash
git clone https://github.com/usharma123/SiteFS.git
cd SiteFS
node scripts/pnpm.mjs install
node scripts/pnpm.mjs --filter @sitefs/browser exec playwright install chromium
node scripts/pnpm.mjs -r build
node packages/cli/dist/index.js doctor
node packages/cli/dist/index.js test https://utsav.sh --session .sitefs-demo
```

`node scripts/pnpm.mjs` provides the repository's package-manager bootstrap. After a run, the session files are the place to check what the browser did and what the report is based on.

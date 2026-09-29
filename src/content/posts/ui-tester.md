---
title: 'Building UI-tester for browser QA from the terminal'
description: 'An LLM planner and judge, a Playwright executor, and an Ink interface that saves the evidence behind each QA report.'
pubDate: '2026-01-27'
tags: ['testing', 'playwright', 'llm', 'terminal-ui', 'qa', 'automation']
---

I wanted a website QA tool that could propose checks from the page in front of it. Maintaining a script for every exploratory path takes time, and I wanted to see how much of that planning an LLM could handle.

UI-tester pairs an LLM planner and judge with a Playwright executor. An Ink terminal interface shows the run as it progresses, and local files preserve its evidence.

## Planning, execution, and review

| Stage    | Input                         | Output                                 |
| -------- | ----------------------------- | -------------------------------------- |
| Planner  | Page structure and test goals | A structured test plan                 |
| Executor | Planned steps                 | Browser actions, screenshots, and logs |
| Judge    | Recorded evidence             | A scored report with findings          |

`qa/planner.ts` sends page structure and test goals to the model after redaction and truncation. The model returns structured steps: which interactions to exercise and which outcomes to examine. A changed page can produce a different plan, though that plan still needs to be checked against the site's intended behavior.

`qa/executor.ts` runs steps in Chromium. It clicks controls, fills forms with test data, navigates, and captures screenshots and logs. Timeouts and missing elements become evidence for the report rather than disappearing from the run.

`qa/judge.ts` reviews that evidence and produces findings grouped by severity. It can flag possible accessibility, usability, content, and performance issues, with reproduction steps and suggested fixes. A model's score is a review aid; it doesn't establish accessibility compliance or replace measured performance data.

## Finding pages

`utils/sitemap.ts` looks for sitemaps, reads sitemap references from `robots.txt`, and crawls internal links. Crawl depth can be limited. A run covers the pages it discovers and reaches, so its report shouldn't be read as proof that every page was tested.

## Running checks concurrently

`qa/parallelTester.ts` schedules pages across a pool of browsers. The pool caps concurrency and reuses instances. This can shorten a multi-page run, but the result depends on browser resources, page behavior, and model latency.

## Watching a run

The Ink interface in `ink/App.tsx` displays progress, logs, retry controls, and a result summary. It reports these phases:

| Phase      | Work                                           |
| ---------- | ---------------------------------------------- |
| Init       | Start the browser and capture the initial page |
| Discovery  | Find candidate pages                           |
| Planning   | Generate test steps                            |
| Traversal  | Visit discovered pages                         |
| Execution  | Run planned actions                            |
| Evaluation | Build the final report                         |

`qa/run-streaming.ts` emits updates as work progresses, so the terminal can show which phase is waiting or failing.

## Keeping the evidence

Each run writes to `.ui-qa-runs/<run-id>/`:

| File            | Contents                           |
| --------------- | ---------------------------------- |
| `run.json`      | Run metadata                       |
| `report.json`   | Structured findings and scores     |
| `evidence.json` | Execution evidence                 |
| `report.md`     | Readable report                    |
| `llm-fix.txt`   | Instructions for a follow-up agent |
| `screenshots/`  | Captured page images               |

The saved files let me revisit a finding after the terminal process exits and compare its claim with the recorded browser state.

## Limiting unintended actions

The executor uses dummy form values, skips detected payment submissions, applies operation timeouts, and limits navigation to internal links. Redaction removes sensitive text before model processing, and discovery respects the configured crawl rules.

Those checks reduce risk; they don't guarantee that an unfamiliar site's actions are harmless. I use the tool on sites I'm authorized to test and inspect the recorded actions when reviewing a run.

## Implementation problems

Large pages can exceed a model's input budget. Truncation needs to preserve enough page structure for a useful plan. Concurrent browsers need lifecycle management so a failed page doesn't leave processes behind. Network failures and missing controls need explicit reporting so the rest of a run can continue without hiding what failed.

The next work I want to do is compare reports across runs, add CI integration and more precise test goals, support additional browser engines, and collect measured performance data through Lighthouse.

## Running it

```bash
npx @utsav/ui-qa https://example.com
```

Or run from source:

```bash
git clone https://github.com/usharma123/UI-tester-
cd UI-tester-
bun install
bun start https://example.com
```

After the run, start with `report.md`, then inspect the evidence behind any finding you intend to act on.

[Source code](https://github.com/usharma123/UI-tester-)

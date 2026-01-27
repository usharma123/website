---
title: "Building UI-tester: An AI-Powered Terminal UI for Website QA"
description: "Creating an intelligent terminal-based QA tool that combines browser automation, LLM analysis, and beautiful TUI design to test websites automatically."
pubDate: "2026-01-27"
tags: ["testing", "playwright", "llm", "terminal-ui", "qa", "automation"]
---

I've always been frustrated with manual website testing. Clicking through pages, filling out forms, checking responsiveness—it's tedious and error-prone. But existing automated testing tools felt either too rigid (scripted tests that break on any UI change) or too complex (requiring extensive setup and maintenance). I wanted something smarter: a tool that could understand a website like a human tester would, adapt to changes, and provide meaningful feedback.

That's how **UI-tester** was born—an AI-powered terminal UI that tests websites using real browser automation and LLM analysis. It drives a real browser, generates intelligent test plans based on page content, and produces comprehensive quality reports with actionable insights.

## The Vision: Intelligent Testing, Beautiful Interface

The core idea was simple: combine three powerful technologies:

1. **Real Browser Automation** (Playwright) - Actually interact with websites like a user would
2. **LLM Intelligence** (OpenRouter) - Understand page content and generate adaptive test plans
3. **Beautiful Terminal UI** (Ink) - Make the whole process enjoyable to watch and use

Instead of writing brittle test scripts, you just point it at a URL and watch it discover pages, plan tests, execute them, and generate reports—all in a beautiful terminal interface.

## Architecture: The Three-Stage Pipeline

The system follows a clean three-stage pipeline:

```
Planner (LLM) → Executor (Browser) → Judge (LLM)
```

### 1. Planner: Understanding Before Testing

The planner (`qa/planner.ts`) is where the magic starts. It analyzes the DOM structure of a page and uses an LLM to generate an intelligent test plan. Instead of blindly clicking around, it understands:

- What the page is trying to accomplish
- What key interactions should be tested
- What potential issues to look for

The LLM receives the page HTML (with sensitive data redacted), the site's goals, and generates a structured test plan with specific steps. This makes the tests adaptive—if you redesign your homepage, the planner will understand the new structure and create appropriate tests.

```typescript
// Simplified planner flow
async function generateTestPlan(pageContent: string, goals: string) {
  const prompt = `
    Analyze this page and create a test plan focusing on: ${goals}
    Page content: ${redactSensitiveData(pageContent)}
  `;
  
  const plan = await llm.generate(prompt);
  return parseTestPlan(plan);
}
```

### 2. Executor: Real Browser Interaction

The executor (`qa/executor.ts`) takes the test plan and runs it step-by-step using Playwright. This isn't just checking if elements exist—it's actually:

- Clicking buttons and links
- Filling out forms (with safe test data)
- Navigating between pages
- Capturing screenshots at key moments
- Recording evidence of what happened

Each step is executed in a real Chromium browser, so you're testing what users actually experience. The executor also handles edge cases gracefully—timeouts, missing elements, navigation issues—and captures evidence for later analysis.

### 3. Judge: Comprehensive Evaluation

After execution, the judge (`qa/judge.ts`) analyzes all the evidence—screenshots, DOM snapshots, execution logs—and generates a scored report. The LLM evaluates:

- **Accessibility issues** - Missing alt text, poor contrast, keyboard navigation problems
- **Usability problems** - Confusing flows, broken interactions, unclear CTAs
- **Performance concerns** - Slow loading, layout shifts, rendering issues
- **Content quality** - Broken links, missing content, unclear messaging

Each issue is categorized by severity (critical, high, medium, low) and includes reproduction steps, suggested fixes, and screenshot evidence.

## Discovery: Finding All the Pages

One of the trickiest parts was page discovery. The tool needs to find all pages on a site to test comprehensively. I implemented a multi-strategy approach:

1. **Sitemap.xml** - If available, parse it for all URLs
2. **Robots.txt** - Extract sitemap references
3. **Link Crawling** - Follow internal links from the homepage

The discovery phase (`utils/sitemap.ts`) respects robots.txt rules and can be configured with depth limits to avoid crawling entire massive sites.

## Parallel Testing: Speed Meets Quality

Testing pages sequentially would be too slow. I built a parallel testing system (`qa/parallelTester.ts`) that:

- Maintains a pool of browser instances
- Tests multiple pages concurrently
- Manages resource limits (max parallel browsers)
- Aggregates results from all pages

This means testing 10 pages takes roughly the same time as testing 1 page (within browser resource limits).

## Terminal UI: Making It Beautiful

The terminal interface (`ink/App.tsx`) was crucial for making the tool enjoyable to use. Built with Ink (React for CLIs), it provides:

- **Real-time progress** - Watch phases progress live
- **Colorful logs** - Different colors for different log levels
- **Interactive controls** - Scroll through logs, retry on errors
- **Results summary** - Quick overview of score and issues

The UI shows six distinct phases:
1. **Init** - Browser startup and initial screenshot
2. **Discovery** - Finding pages to test
3. **Planning** - LLM generating test plans
4. **Traversal** - Testing discovered pages
5. **Execution** - Running planned tests
6. **Evaluation** - Generating final report

Each phase updates in real-time, so you always know what's happening.

## Storage: Local-First Results

All results are saved locally in `.ui-qa-runs/<run-id>/`:

- **run.json** - Metadata about the run
- **report.json** - Full structured report with scores
- **evidence.json** - Detailed execution evidence
- **report.md** - Human-readable markdown report
- **llm-fix.txt** - Instructions for AI to fix issues
- **screenshots/** - All captured screenshots

This local-first approach means you own your data and can review results even after the run completes.

## Safety First: Ethical Testing

I built several safety features to ensure the tool never causes harm:

- **Dummy data only** - Forms are filled with `test@example.com`, "Test User", etc.
- **No payment submission** - Detects payment forms and skips submission
- **Sensitive data redaction** - Removes emails, phone numbers, etc. before LLM processing
- **Timeouts everywhere** - All browser operations have timeouts
- **Controlled navigation** - Only follows internal links, respects robots.txt

## Technical Challenges

Building this wasn't without challenges:

**LLM Token Limits**: Page HTML can be massive. I had to implement smart truncation—keeping the structure and key content while removing noise.

**Browser Resource Management**: Running multiple browsers in parallel requires careful resource management. I implemented a browser pool (`utils/browserPool.ts`) that reuses instances and manages lifecycle.

**Streaming Updates**: The terminal UI needs to update in real-time as tests run. I built a streaming architecture (`qa/run-streaming.ts`) that emits events as phases progress.

**Error Recovery**: Tests can fail for many reasons—network issues, timeouts, missing elements. The executor needs to gracefully handle failures and continue testing other pages.

## What's Next

The tool is already useful, but there's more I want to add:

- **CI/CD Integration** - Run as part of deployment pipelines
- **Regression Detection** - Compare reports across runs to catch regressions
- **Custom Test Goals** - More granular control over what to test
- **Multi-browser Testing** - Test across Chrome, Firefox, Safari
- **Performance Metrics** - Lighthouse integration for performance scores

## Try It Out

If you want to test your website (or any website), you can install and run:

```bash
npx @utsav/ui-qa https://example.com
```

Or clone the repo and run locally:

```bash
git clone https://github.com/usharma123/UI-tester-
cd UI-tester-
bun install
bun start https://example.com
```

The tool will discover pages, generate test plans, execute them, and produce a comprehensive report—all while showing beautiful progress in your terminal.

---

**UI-tester** demonstrates that testing doesn't have to be boring or brittle. By combining browser automation with LLM intelligence, we can create tools that understand websites like humans do, adapt to changes, and provide meaningful feedback. It's been a fun project to build, and I'm excited to see how it evolves.

**Source code:** [github.com/usharma123/UI-tester-](https://github.com/usharma123/UI-tester-)

---
title: 'How I Built a Grammarly-Like Editor with React, TipTap, and Rust/WASM'
description: 'A deep dive into building a client-side writing assistant that keeps the UI responsive by running grammar and rewrite scoring inside a WebWorker-backed Rust/WASM engine.'
pubDate: '2026-02-18'
tags: ['rust', 'wasm', 'react', 'tiptap', 'webworker', 'nlp']
---

I wanted to see how close I could get to a Grammarly-style experience without sending every keystroke to a server. The goal was simple: catch grammar and style issues quickly, keep suggestions useful, and never make typing feel laggy.

That project became **Grammarly-like Desktop Lint Engine**: a monorepo with a React + TipTap editor, a Rust-to-WASM lint engine, and a worker-based architecture that keeps heavy text analysis off the main thread.

**Repo:** [github.com/usharma123/Grammarly](https://github.com/usharma123/Grammarly)  
**Live demo:** [grammarly-editor.vercel.app](https://grammarly-editor.vercel.app)

## The Core Idea

The core design is:

1. Keep editing/rendering on the browser main thread.
2. Move all expensive linting/scoring into a WebWorker.
3. Run the actual language engine inside Rust/WASM.
4. Return only compact lint results (offsets, message, severity, suggestions).

That way, the editor stays smooth even when linting frequently.

## Monorepo Layout

The project is structured as a pnpm workspace:

| Directory | Contents |
| --- | --- |
| `apps/editor/` | React and TipTap web app |
| `apps/extension/` | Chrome extension build |
| `packages/engine-wasm/` | Rust crate compiled to WebAssembly |

This split made development cleaner: UI iteration happened in `apps/editor`, while engine logic stayed isolated in `packages/engine-wasm`.

## Frontend: TipTap + Lint Decorations

In the editor app, the central piece is a custom TipTap plugin (`LintExtension.ts`) that:

- debounces lint requests,
- decides between full-document linting vs paragraph-window linting,
- sends text to the worker,
- maps returned UTF-16 spans back into ProseMirror positions,
- paints inline decorations (wavy underlines) by severity.

Two practical optimizations made a big difference:

1. **200ms debounce** to avoid firing on every single keystroke.
2. **Paragraph windowing for larger docs** so only the active region is re-linted, reducing latency and cost.

## Worker Boundary: Keeping the Main Thread Free

`lintWorker.ts` lazily initializes the WASM module and engine instance, then handles request/response messaging with the UI.

Important detail: the worker always returns a response (including empty results on error) so the UI never hangs waiting for a promise that never resolves.

## Rust/WASM Engine: Real Linting + Suggestion Ranking

Inside `packages/engine-wasm/src/lib.rs`, the engine:

1. Parses text with Harper.
2. Runs curated lint rules (spelling, grammar, punctuation, style).
3. Deduplicates overlaps.
4. Converts spans from char indices to UTF-16 offsets.
5. Featurizes each candidate.
6. Scores whether to show it (plus rewrite scoring for generated rewrites).
7. Returns top-ranked suggestions.

The engine also includes custom style rules (Weir-based) and rewrite candidates gated by semantic/quality checks.

## A Subtle but Critical Problem: Text Offsets

One of the easiest ways to break this kind of product is mishandling text offsets.

- Rust-side processing naturally works in character indices.
- Browser/editor APIs usually work in UTF-16 code units.

If these don't match (especially with emoji or non-Latin scripts), underlines appear in the wrong place and replacements corrupt text. The project fixes this by converting to UTF-16 offsets in Rust before crossing the WASM boundary, then mapping offsets carefully in the TipTap plugin.

## Stale Results and Version Gating

Linting is asynchronous, so results can arrive out of order. The editor uses `docVersion` checks to ignore stale responses. That prevents classic bugs like:

- suggestion cards for text that no longer exists,
- underlines jumping to old positions,
- applying a fix to the wrong content.

## Build + Deployment Workflow

The developer loop is:

```bash
pnpm install
pnpm run build:wasm
pnpm run dev
```

The WASM package is built with `wasm-pack`, and the editor app is bundled with Vite. The repository also keeps extension output isolated from the website deploy path, so web and extension builds don't interfere with each other.

## What I Learned

- **Threading model matters as much as model quality.** A slightly weaker model with responsive UX feels far better than a stronger model that blocks typing.
- **Offset hygiene is non-negotiable.** UTF-16 conversion and mapping logic are foundational for correctness.
- **Local scoring gates reduce noise.** Even simple per-rule thresholds and ranking filters dramatically improve trust in suggestions.
- **Monorepo boundaries help velocity.** Keeping editor, extension, and engine separated made iteration faster.

## Closing

This was a great systems project because it sits at the intersection of UI engineering, compiler/runtime constraints (WASM), and language tooling. If you're building writing tools, I'd strongly recommend starting with architecture and latency budgets first, then layering smarter scoring models after the feedback loop feels instant.

If you want to explore the code, start with these files:

- `apps/editor/src/tiptap/LintExtension.ts`
- `apps/editor/src/engine/lintWorker.ts`
- `packages/engine-wasm/src/lib.rs`

And here is the full repository again: [github.com/usharma123/Grammarly](https://github.com/usharma123/Grammarly)

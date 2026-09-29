---
title: 'Building a grammar editor with React, TipTap, and Rust/WASM'
description: 'Moving text analysis into a worker, mapping UTF-16 offsets, and keeping stale lint results out of a TipTap editor.'
pubDate: '2026-02-18'
tags: ['rust', 'wasm', 'react', 'tiptap', 'webworker', 'nlp']
---

I wanted grammar suggestions without sending every keystroke to a server. The harder requirement was keeping typing responsive while the text was being analyzed.

I built a React and TipTap editor backed by a Rust/WASM lint engine in a Web Worker. The main thread owns editing and rendering. The worker returns issue locations, messages, severity, and suggested replacements.

[Source code](https://github.com/usharma123/Grammarly) · [Demo](https://grammarly-editor.vercel.app)

## Where the work runs

| Step             | Location                | Result                                                  |
| ---------------- | ----------------------- | ------------------------------------------------------- |
| Edit text        | Main thread             | A new document version                                  |
| Request analysis | TipTap plugin           | Text and version sent to the worker                     |
| Lint and rank    | Rust/WASM in the worker | Issues with UTF-16 offsets                              |
| Apply results    | Main thread             | Underlines and suggestion cards for the current version |

The pnpm workspace separates the editor, extension, and engine:

| Directory               | Contents                           |
| ----------------------- | ---------------------------------- |
| `apps/editor/`          | React and TipTap web app           |
| `apps/extension/`       | Chrome extension build             |
| `packages/engine-wasm/` | Rust crate compiled to WebAssembly |

## Connecting TipTap to the engine

`LintExtension.ts` debounces requests by 200 ms. For larger documents it can lint a paragraph window instead of the entire document. It sends that text to the worker, maps returned spans into ProseMirror positions, and draws underlines by severity.

`lintWorker.ts` initializes the WASM module lazily. It also responds on error, even if the result is empty, so a request doesn't leave the interface waiting indefinitely.

## Linting and ranking

The engine in `packages/engine-wasm/src/lib.rs` uses Harper to parse text and run spelling, grammar, punctuation, and style rules. It deduplicates overlapping results, converts their offsets, computes features, and ranks candidates before returning suggestions.

I also added custom style rules and checks on rewrite candidates. Filtering matters: a suggestion that fires too often is easy to stop trusting, even when some of its matches are useful.

## Getting text offsets right

Rust's text processing and the browser's editor APIs don't use the same units for positions. The engine converts character indices into UTF-16 offsets before returning results. The TipTap plugin then maps those offsets into editor positions.

Emoji are an easy way to expose mistakes here. If the conversion is wrong, an underline can land on the next character or a replacement can delete the wrong span. The editor needs correct offsets to replace the intended text.

## Rejecting stale results

A lint request can finish after the user has changed the document. Each request carries a `docVersion`, and the editor ignores responses for an older version. That keeps old underlines and suggestions from being applied to new text.

## Running the project

```bash
pnpm install
pnpm run build:wasm
pnpm run dev
```

`wasm-pack` builds the engine and Vite bundles the editor. Extension output stays separate from the website build.

Most of the integration is in these files:

- `apps/editor/src/tiptap/LintExtension.ts`
- `apps/editor/src/engine/lintWorker.ts`
- `packages/engine-wasm/src/lib.rs`

The work I would prioritize in another editor is the same: move analysis off the typing path, make positions unambiguous, and discard obsolete responses before they reach the document.

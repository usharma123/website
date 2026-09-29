---
title: "Packet28: Context Engineering for AI Agents and CI"
description: "Building a Rust context layer that turns diffs, coverage, logs, and stack traces into bounded packets so agents reason instead of explore."
pubDate: "2026-06-02"
tags: ["rust", "ai-agents", "context-engineering", "mcp", "ci", "devtools"]
---

Ask an AI agent to "fix the coverage regression in AuthService" and watch it burn context before it writes a single line of code. It greps for config files, hunts down the coverage XML (often megabytes), reads the git diff, then opens test files to see what's covered. That routine costs 10–20 tool calls and 5–50K tokens of raw, redundant content — most of it stale by the time the agent actually starts reasoning.

**Packet28** is my answer to that tax: a Rust context engineering layer that reduces development artifacts into bounded, machine-readable packets, persists them across tasks, and manages token budgets so agents spend context on reasoning instead of exploration.

**Repo:** [github.com/usharma123/Packet28](https://github.com/usharma123/Packet28)

## The Core Idea

Instead of letting agents read raw artifacts directly, Packet28 sits between the agent and the repo:

| Step | Result |
| --- | --- |
| Read artifacts | Diffs, coverage, logs, or stack traces |
| Run reducers | Extract the relevant evidence |
| Wrap the result | An `EnvelopeV1` packet with cost and provenance |
| Cache the packet | Persist it for later requests |
| Return to the agent | Supply evidence within a context budget |

Each packet is wrapped in a universal `EnvelopeV1` schema with token estimates, file/symbol references, provenance (git refs, input paths), and a blake3 hash for deduplication. Agents get structured summaries — not megabyte XML dumps.

The live turn stays cheap. Thicker memory assembly moves out of the worker loop:

- **PreToolUse hooks** rewrite supported Bash commands through Packet28 reducers
- **Fallback hooks** capture native tool activity into compact persisted packets
- **MCP** exposes semantic control-plane tools (`packet28.write_intention`, handoff inspection)
- **`packet28.prepare_handoff`** assembles a denoised handoff packet after threshold or stop boundaries
- A fresh worker relaunches from that handoff instead of growing the session forever

## Architecture: Five Layers

Packet28 is a Rust workspace of 25 crates organized into five layers:

| Layer | Components |
| --- | --- |
| Agent interface | `packet28-agent`, prompt generator, MCP tools |
| CLI and daemon | `Packet28`, `packet28d`, task and watch protocols |
| Context runtime | Kernel, scheduler, recall, assembly, policy, agent state |
| Reducers | `diffy`, `covy`, `testy`, `stacky`, `buildy`, `mapy`, proxy |
| Shared contracts | `EnvelopeV1`, `BudgetCost`, file and symbol references, provenance |

### Reducers: Raw Artifacts In, Bounded Packets Out

Each reducer takes a specific artifact type and produces a typed packet:

| Reducer | Input | What it produces |
| --- | --- | --- |
| `covy-ingest` | JaCoCo, LCOV, Cobertura, gocov | Normalized coverage model |
| `diffy-core` | Git diff + coverage | Diff analysis against quality gate |
| `testy-core` | Testmap + git diff | Impacted tests from file changes |
| `stacky-core` | Log text / stack traces | Deduplicated failure slices |
| `buildy-core` | Compiler / linter output | Grouped diagnostics by root cause |
| `mapy-core` | Repository root + focus hints | Ranked repo map with tree-sitter symbols |
| `suite-proxy-core` | Shell command + output limits | Safe command execution with caps |

Every output shares the same envelope shape:

```json
{
  "schema_version": "suite.packet.v1",
  "packet_type": "suite.diff.analyze.v1",
  "packet": {
    "summary": "3 files changed, coverage dropped 2.1% in AuthService",
    "files": [{ "path": "src/auth.rs", "relevance": 0.75 }],
    "symbols": [{ "name": "AuthService", "kind": "class", "relevance": 0.9 }],
    "budget_cost": {
      "est_tokens": 800,
      "est_bytes": 3200,
      "runtime_ms": 12
    },
    "provenance": {
      "inputs": ["src/auth.rs"],
      "git_base": "origin/main",
      "git_head": "HEAD"
    }
  }
}
```

The agent knows the cost before reading the payload. That's the whole point.

### Context Runtime: Kernel, Cache, and Recall

The kernel dispatches `KernelRequest` objects to registered reducers — `diffy.analyze`, `testy.impact`, `stacky.slice`, `mapy.repo`, and others. It supports single requests and multi-step DAG sequences with budget enforcement and reactive replanning.

Persisted packets live in `.packet28/packet-cache-v2.bin` with six indexes:

- **BM25 full-text** for semantic recall
- **File ref, basename alias, symbol, test, and task** indexes for structured lookup

A query like "coverage gap in AuthService" matches both text terms and the symbol index. Results come back ranked by BM25 score, path/symbol bonuses, and recency — scoped to the current task first, then global.

Assembly (`contextq-core`) merges multiple packets into one bounded context packet, correlates them across shared files/symbols/tests, and produces budget-aware guidance on what to keep or evict.

### Daemon: Persistent State for Long-Running Workflows

`packet28d` is a Unix socket daemon that holds persistent state, file watchers, task streaming, and command routing:

1. The agent sends a request through a Unix socket.
2. `packet28d` routes it to the kernel, watchers, task registry, or cache.
3. The daemon returns the result or streams task events to the agent.

File changes debounce and trigger reactive replanning. Tasks stream per-step lifecycle events. The `--via-daemon` flag routes any Packet28 command through the daemon instead of spinning up fresh state each time.

Persistence layout:

- `.packet28/daemon/packet28d.sock` — Unix socket
- `.packet28/packet-cache-v2.bin` — Packet cache with recall indexes
- `.packet28/daemon/tasks/<id>/events.jsonl` — Per-task event log

## Agent Integration

Three entry points wire Packet28 into agent runtimes:

**Setup and MCP:**

```bash
Packet28 setup --runtime all --yes
Packet28 mcp serve --root .
```

MCP exposes slim reducer search, handoff assembly, memory store/recall, and agent health checks. Hooks keep reducer traffic out of the visible MCP loop so the worker writes intent only when the objective changes materially.

**Agent prompt fragments:**

```bash
Packet28 agent-prompt --format claude    # CLAUDE.md fragment
Packet28 agent-prompt --format cursor    # Cursor rule fragment
```

These tell the agent to use Packet28's slim reducer loop before broad file reads, with fallback to direct reads for trivial edits.

**Handoff wrapper:**

```bash
packet28-agent \
  --task "investigate flaky parser test" \
  -- codex exec "review the failure"
```

The wrapper resolves a task ID, waits for a checkpointed handoff packet, exports `PACKET28_*` environment variables, and relaunches a fresh worker — propagating the delegated command's exit code.

## Design Tradeoffs

**Token budgets vs completeness.** Every packet carries `budget_cost` estimates. The scheduler stops DAG sequences when budget is exhausted. Assembly truncates sections to fit caps. The goal is "enough context to act," not "everything that exists."

**Provenance and staleness.** Packets record git refs and input paths. File watchers trigger replanning when artifacts change. Cached packets can be pruned by age or task scope.

**Policy governance.** Optional `context.yaml` configures tool allowlists, path filters, token caps, redaction patterns, and human-review gates. Guard evaluates packets before assembly.

**Broker vs direct reads.** Packet28 is a reducer layer, not a replacement for reading source. Trivial one-line edits should skip the broker. The agent-prompt fragments encode when to use each path.

## Where This Fits

Packet28 is infrastructure for agent-heavy workflows — CI coverage gates, flaky test investigation, large-repo onboarding. It pairs naturally with browser QA tools like [UI-tester](/blog/ui-tester) and [SiteFS](/blog/sitefs): those handle the web surface; Packet28 handles the repo artifacts agents need to fix what QA finds.

If you're building agents that spend more time exploring than reasoning, the fix might not be a better model — it might be better context.

---

**Source code:** [github.com/usharma123/Packet28](https://github.com/usharma123/Packet28)

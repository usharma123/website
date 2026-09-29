---
title: 'Packet28: bounded context for agents and CI'
description: 'Reducing diffs, coverage, logs, and stack traces into packets with cost estimates, provenance, and persistent recall.'
pubDate: '2026-06-02'
tags: ['rust', 'ai-agents', 'context-engineering', 'mcp', 'ci', 'devtools']
---

An agent investigating a coverage regression may read a diff, search for the relevant class, open a coverage report, and inspect test files before it can make a change. Much of that output repeats information or contains details unrelated to the task.

I built Packet28 to reduce those artifacts into bounded packets. It records where the evidence came from, estimates its context cost, and keeps packets available across requests.

[Source code](https://github.com/usharma123/Packet28)

## From artifacts to packets

| Step                | Result                                          |
| ------------------- | ----------------------------------------------- |
| Read artifacts      | Diffs, coverage, logs, or stack traces          |
| Run reducers        | Extract the relevant evidence                   |
| Wrap the result     | An `EnvelopeV1` packet with cost and provenance |
| Cache the packet    | Persist it for later requests                   |
| Return to the agent | Supply evidence within a context budget         |

Each packet uses an `EnvelopeV1` format with token estimates, file and symbol references, Git provenance, and a BLAKE3 hash for deduplication.

Hooks can reduce command output before it reaches the agent. Fallback hooks capture other tool activity, and MCP tools let the agent record an intention or request a handoff. `packet28.prepare_handoff` assembles context for a fresh worker when a run reaches a handoff boundary.

## The workspace

The workspace described here has 25 Rust crates across five layers:

| Layer            | Components                                                         |
| ---------------- | ------------------------------------------------------------------ |
| Agent interface  | `packet28-agent`, prompt generator, MCP tools                      |
| CLI and daemon   | `Packet28`, `packet28d`, task and watch protocols                  |
| Context runtime  | Kernel, scheduler, recall, assembly, policy, agent state           |
| Reducers         | `diffy`, `covy`, `testy`, `stacky`, `buildy`, `mapy`, proxy        |
| Shared contracts | `EnvelopeV1`, `BudgetCost`, file and symbol references, provenance |

## What the reducers produce

| Reducer            | Input                          | What it produces                         |
| ------------------ | ------------------------------ | ---------------------------------------- |
| `covy-ingest`      | JaCoCo, LCOV, Cobertura, gocov | Normalized coverage model                |
| `diffy-core`       | Git diff + coverage            | Diff analysis against quality gate       |
| `testy-core`       | Testmap + git diff             | Impacted tests from file changes         |
| `stacky-core`      | Log text / stack traces        | Deduplicated failure slices              |
| `buildy-core`      | Compiler / linter output       | Grouped diagnostics by root cause        |
| `mapy-core`        | Repository root + focus hints  | Ranked repo map with tree-sitter symbols |
| `suite-proxy-core` | Shell command + output limits  | Safe command execution with caps         |

The shared envelope lets callers inspect cost and provenance without handling a different format for every reducer. A simplified example:

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

The values above illustrate the format; they aren't benchmark results.

## Scheduling and recall

The kernel dispatches `KernelRequest` objects to reducers such as `diffy.analyze`, `testy.impact`, `stacky.slice`, and `mapy.repo`. It supports individual requests and dependency-ordered sequences, with budget checks and replanning.

Packets persist in `.packet28/packet-cache-v2.bin`. BM25 supports text search; additional indexes look up file references, basename aliases, symbols, tests, and tasks. A query for a coverage gap can match both the words in a packet and its symbol references.

`contextq-core` combines packets that refer to the same files, symbols, or tests. It fits the result to a budget and supplies guidance about which context to retain or remove.

## Keeping state in a daemon

1. The agent sends a request through a Unix socket.
2. `packet28d` routes it to the kernel, watchers, task registry, or cache.
3. The daemon returns the result or streams task events to the agent.

The `--via-daemon` flag reuses that process instead of creating fresh state for each command. Watchers debounce file changes before triggering replanning.

| Path                                       | Purpose                    |
| ------------------------------------------ | -------------------------- |
| `.packet28/daemon/packet28d.sock`          | Unix socket                |
| `.packet28/packet-cache-v2.bin`            | Packets and recall indexes |
| `.packet28/daemon/tasks/<id>/events.jsonl` | Task event log             |

## Connecting an agent

Setup installs the runtime integration; the MCP command starts the tool server:

```bash
Packet28 setup --runtime all --yes
Packet28 mcp serve --root .
```

The MCP tools cover reducer discovery, memory storage and recall, handoff assembly, and health checks. Prompt fragments explain when the agent should use the reducers and when a direct source read is enough:

```bash
Packet28 agent-prompt --format claude    # CLAUDE.md fragment
Packet28 agent-prompt --format cursor    # Cursor rule fragment
```

For longer tasks, the wrapper can restart a worker with a checkpointed handoff:

```bash
packet28-agent \
  --task "investigate flaky parser test" \
  -- codex exec "review the failure"
```

It resolves the task ID, waits for the handoff packet, sets `PACKET28_*` environment variables, and propagates the delegated command's exit code.

## Tradeoffs

A bounded packet necessarily leaves something out. `budget_cost` is an estimate, and truncating to a cap can remove evidence an agent later needs. Source paths and Git references give it a way to go back to the original material.

Cached evidence can also become stale. Watchers, age-based pruning, and task scopes help manage that, but the packet's provenance still matters when interpreting it.

An optional `context.yaml` configures tool allowlists, path filters, token caps, redaction, and review gates. Those controls belong alongside the reduction step because the agent may otherwise receive material it wasn't meant to use.

For a one-line edit, a direct read can be cheaper than invoking this machinery. Packet28 is most useful when several artifacts must be correlated or the same evidence is needed over a long task.

[UI-tester](/blog/ui-tester) and [SiteFS](/blog/sitefs) collect browser evidence. Packet28 covers the repository side: the diffs, logs, coverage, and test results used to investigate a finding.

---
title: AI agent integration
description: AI Agent IPC and LSP Proxy MCP via the built-in MCP server.
sidebar:
  order: 7
---

Calyx ships with an MCP server that integrates with CLI AI agents (Claude Code, Codex CLI, OpenCode, Hermes).
It exposes peer-to-peer messaging between agents across tabs/panes, LSP-backed symbol lookup tools, cockpit tools for driving Calyx itself, and a terminal command log.

## AI Agent IPC

Agents running in different tabs or panes can exchange messages with each other.

### Enable

1. Open the command palette (`Cmd+Shift+P`) and run **Enable AI Agent IPC**.
2. Start agents (Claude Code / Codex / OpenCode / Hermes) in two or more terminal panes.
3. Each instance registers itself as a peer and can send/receive messages.

Config files are written automatically based on which agents are installed.

| Agent | Config file |
|---|---|
| Claude Code | `~/.claude.json` |
| Codex CLI | `~/.codex/config.toml` |
| OpenCode | `~/.config/opencode/opencode.json`, `AGENTS.md` |
| Hermes | `~/.hermes/config.yaml` |

Restart any already-running agent instances so they pick up the new MCP server.

### Available MCP tools

- `register_peer`
- `list_peers`
- `send_message`
- `broadcast`
- `receive_messages` — deletes each returned message from the inbox, so any message is delivered exactly once
- `get_peer_status`

See the [demo video](https://www.youtube.com/watch?v=Xty0ad9gGcM).

### Disable

Run **Disable AI Agent IPC** from the command palette.

## Agents Sidebar

The sidebar includes an **Agents** tab that shows every connected AI agent in the current window along with its live status.

Each agent row shows:

- A state dot: red (waiting on the user), yellow (working), green (idle), blue (done).
- An unread message badge, if the agent has queued output the user has not yet seen.
- A last-seen timestamp.

Click a row to focus the pane running that agent.

The view supports Claude Code, Codex CLI, OpenCode, and Hermes. Once you have run **Enable AI Agent IPC** and started an agent in a pane, that agent appears in the sidebar automatically.

## Resuming agents in persistent sessions

With persistent sessions enabled, reattaching a session can offer to resume the agent CLI conversation that was running in it.
See [Persistent sessions](/usage/sessions/) for the toggles.

## Cockpit tools

Agents can drive Calyx itself through the same MCP server.

Three tools run immediately, without confirmation:

- `pane_list` — list the terminal panes in the current window
- `pane_split` — split a pane to the right or down
- `tab_create` — open a new tab, optionally in a given group and working directory

Three tools type into your terminal or execute app commands, so each call is gated behind your approval:

- `pane_run` — run a command in a pane
- `pane_send_keys` — send keystrokes to a pane
- `palette_execute` — execute a command palette action

When a gated tool is called, a banner appears at the top of the window showing the tool name and its target pane.
**Allow** and **Deny** resolve only that one request; the decision is not remembered.
**Always Allow** approves everything pending in the window and turns on auto-approval for future calls.
A denied call returns `{"status": "denied"}` to the agent, and a request left unanswered for 55 seconds returns `{"status": "approval_timeout"}` — a normal result either way, not an error.

Auto-approval can also be toggled as **Auto-approve agent commands** in the **Agents** pane of Settings.
It is off by default, so every gated call asks first.

## Approving agent tool calls

When several agents run in parallel, their permission prompts are scattered across panes.
With approval routing on, Claude Code and Codex send each tool call's permission request to Calyx before running the tool, and Calyx shows it in the same banner used by cockpit tools.

### Enable

1. Run **Enable AI Agent IPC** from the command palette (re-run it after updating Calyx so the approval hook is installed).
2. Turn on **Show agent tool prompts in the approval banner** in the **Agents** pane of Settings (off by default).
3. Restart running agent CLI instances.

### Using the banner

The banner names the agent and tool (for example "Claude Code · Bash"), the target pane, and a one-line summary of what the tool will do.
**Allow** and **Deny** decide that single request.
**Always Allow \<tool\> in This Pane** auto-approves that tool for that pane only.
The menu at the right edge offers **Allow All Pending**, which approves everything currently queued, and **Always Allow \<tool\> in All Panes**.
Always Allow choices last only for the current IPC session and are forgotten when the pane closes or the server stops.

When more than one request is pending, previous/next chevrons and an "i / N" position label appear next to the action buttons.
Browse the queue and decide any request in any order; deciding the displayed request advances to the nearest remaining one.
Cockpit tool requests share the same queue.
With a single pending request the navigator disappears and the banner looks exactly as before.

A macOS notification is posted for each new request.
Secrets in the notification summary are masked, while the banner itself shows the exact text so you can judge what you are approving.

### Fallback behavior

Nothing is ever auto-approved on failure.
If you do not respond within about 10 minutes, or Calyx is unreachable, the agent falls back to its own in-pane prompt.
Cancelling the tool call on the agent side clears its banner immediately.
Supported agents: Claude Code and Codex. Other agents keep prompting in their own pane.

## Terminal command log

Calyx can keep a structured log of the commands run in each terminal — the command line, exit status, and captured output — and expose it to agents.
This lets an agent read a build's output or wait for a long-running command without scraping the screen.

- `terminal_list_commands` — list the recorded commands for a pane, oldest first
- `terminal_read_output` — fetch the captured output of one command
- `terminal_await_command` — wait until a running command finishes (default timeout 30 seconds, maximum 55; on timeout it returns `{"status": "timeout"}` and can simply be called again)

### Requirements

The log is fed by shell integration, currently for **zsh and fish** only.
Calyx installs the integration automatically while **Track shell commands** (Settings, **Agents** pane) is on; the toggle is on by default and applies to newly opened terminals only.

### What is stored

Records are kept in memory only: up to 200 commands per pane, with captured output capped at 256 KB per pane.
Nothing is written to disk, and the log is discarded when Calyx quits.
Commands that run full-screen TUIs (the alternate screen) or whose output cannot be captured are reported with `output_unavailable: true`.

Command lines and captured output are checked for known secret patterns (API tokens, passwords, `Authorization` headers, cloud provider keys, JWTs) before they are stored, and any match is replaced with `[redacted]`.
This runs automatically and cannot be turned off.

Redacting a large capture happens in the background so the terminal is never blocked waiting for it.
While that is in progress, the command still reports as running: `terminal_read_output` returns `{"output_pending": true}` instead of the output (call it again shortly), and `terminal_list_commands` withholds the exit code and duration until redaction finishes.

## LSP Proxy MCP

LSP features are exposed via the same MCP server used by AI Agent IPC.
Agents can get symbol-aware results instead of relying on `grep`.

### Tools

- `lsp_hover` — hover info for a symbol
- `lsp_definition` — jump to definition
- `lsp_references` — list references
- `lsp_rename` — rename a symbol
- `lsp_diagnostics` — fetch diagnostics (errors and warnings)

Additional tools are also provided.

### Setup

1. Run **Enable AI Agent IPC** from the command palette (the LSP proxy shares this server).
2. Restart or reconnect your agent so it picks up the `calyx-ipc` MCP server.
3. (Optional) In Settings, open the **LSP** pane and enable auto-install for missing language servers.

Calyx keeps language servers running in the background, syncs file changes from disk, and starts the right server on the first `lsp_*` call for a workspace.

### Supported languages

TypeScript, Python, Rust, Go, Swift, and others.
Per-language auto-install support is shown in Settings under the **LSP** pane.

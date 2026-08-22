---
title: AI agent integration
description: AI Agent IPC and LSP Proxy MCP via the built-in MCP server.
sidebar:
  order: 7
---

Calyx ships with an MCP server that integrates with CLI AI agents (Claude Code, Codex CLI, OpenCode, Hermes, Grok, pi).
It exposes peer-to-peer messaging between agents across tabs/panes, LSP-backed symbol lookup tools, cockpit tools for driving Calyx itself, and a terminal command log.

## AI Agent IPC

Agents running in different tabs or panes can exchange messages with each other.

### Enable

1. Open the command palette (`Cmd+Shift+P`) and run **Enable AI Agent IPC**.
2. Start agents (Claude Code / Codex / OpenCode / Hermes / Grok / pi) in two or more terminal panes.
3. Each instance registers itself as a peer and can send/receive messages.

Config files are written automatically based on which agents are installed.

| Agent | Config file |
|---|---|
| Claude Code | `~/.claude.json` |
| Codex CLI | `~/.codex/config.toml` |
| OpenCode | `~/.config/opencode/opencode.json`, `AGENTS.md` |
| Hermes | `~/.hermes/config.yaml` |
| Grok | `~/.grok/config.toml`, `~/.grok/hooks/calyx.json` |
| pi | `~/.pi/agent/extensions/calyx.ts` |

Restart any already-running agent instances so they pick up the new MCP server.

If you install another supported agent later, run **Reconfigure AI Agent IPC**.
It writes that agent's config and hooks against the server that is already running, so agents already connected keep working.
**Enable AI Agent IPC** is in the palette only while the server is stopped; once it is up, **Reconfigure AI Agent IPC** and **Disable AI Agent IPC** take its place.

pi is the one supported agent with no MCP client configuration of its own, so Calyx reaches it through a TypeScript extension that pi loads on startup.
That single file carries the whole integration: the sidebar row, the approval gate, and a `calyx` tool that dispatches to the MCP tools below (call it with `{"tool": "list"}` to enumerate them).
A pi started outside Calyx, or inside a herdr pane, registers nothing.

### After updating Calyx

Run **Enable AI Agent IPC** again after an update.
Calyx repairs its own hook scripts at launch, but the MCP server entries in the files above are written only by this command, and an update can change what belongs in them.
Hermes in particular needs the re-run. Its MCP connection is the only channel that tells Calyx which pane it runs in, so without the headers that connection carries, Hermes stays anonymous and never gets a sidebar row.

Re-running is safe for config you maintain yourself.
Calyx moves any hook entry it does not own back out of its managed block instead of replacing it, and skips writing a file at all when nothing needs to change.

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

Each agent row is named after the pane it runs in, on three lines:

1. The pane's title.
2. Its working directory, shown as the last path component.
3. The agent, for example "Claude Code" or "Grok".

Anything Calyx cannot resolve reads `N/A`.
Rows are named after the pane rather than the repository so that several agents working in one checkout stay distinguishable.

Alongside the name, a row shows:

- A state dot: red (waiting on the user), yellow (working), green (idle), blue (done).
- An unread message badge, if the agent has queued output the user has not yet seen.
- A last-seen timestamp.

Click a row to focus the pane running that agent.

The view supports Claude Code, Codex CLI, OpenCode, Hermes, Grok, and pi. Once you have run **Enable AI Agent IPC** and started an agent in a pane, that agent appears in the sidebar automatically.

### Subagent rows

An agent that runs subagents shows them as child rows under its own.
A pane row with children gains a count badge at its right edge and a disclosure chevron next to it.
A pane whose agent reports no subagents looks exactly as it did before.

Children start collapsed.
Click the chevron to expand them.
The chevron is a separate target from the row body, so expanding never moves focus to the pane.
The expansion is remembered only while the sidebar stays open, and resets when you hide it or relaunch Calyx.

Each child row is indented under its parent and carries a state dot in the same four colors, the subagent's type, the tool it is currently running, and how long ago it last reported.
A CLI that reports only a subagent's lifecycle leaves the type and tool lines out rather than filling them with placeholders, so those rows are a dot and a timestamp.
Clicking a child focuses the parent's pane, because a subagent has no pane of its own.

| Agent | Subagent rows | Current tool |
|---|---|---|
| Claude Code | yes | yes |
| Grok | yes | yes |
| Codex | yes | no |
| OpenCode | yes | no |
| Hermes, pi, herdr panes | no | no |

A child row exists only while its CLI reports the subagent.
It disappears when that subagent stops, when the parent session ends, and when the pane closes.
Calyx keeps no history of its own, so nothing lingers once the CLI stops reporting it.

An agent CLI reads its hook configuration once, at session start.
Subagent rows therefore appear in sessions you start after Calyx has installed the hooks, not in one that was already running.

### When a row settles

A row turns blue (done) when the agent's session ends.
Most supported CLIs report their own session end.
For the ones that do not, and for an agent that was killed or crashed, Calyx settles the row when the pane's shell returns to its prompt.

That fallback has two routes.
Ghostty's own end-of-command report covers every shell, including bash, elvish, and nushell, and needs no setup.
Calyx's shell integration covers zsh and fish while **Track shell commands** is on, and additionally expires any approval requests still pending for that pane, so an approval banner never outlives the process that raised it.

A command you suspend with Ctrl-Z does not settle the row.

### herdr-hosted agents

Agents running inside herdr's own panes show up here too, labeled "via herdr" in the subtitle.
They need none of the setup native rows do: no **Enable AI Agent IPC**, no config file to write. Calyx reads them straight from herdr's own status stream, so they appear automatically whenever herdr is installed and running.

A herdr row you have already opened as a Calyx tab is clickable like any other: it focuses that pane.
A row for a herdr pane you have not opened in Calyx has nothing to focus, so it is drawn as plain text with no hover highlight. Open that workspace from the [Session Browser](/usage/sessions/#herdr-workspaces) first.

When an agent CLI exits while herdr keeps its shell pane alive, the row turns blue (done) instead of holding whatever state it had last.

If **AI Agent IPC** is off, herdr rows keep showing, with a note underneath that Calyx's own agents aren't being monitored until you turn it on.

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
With approval routing on, a supported agent sends each tool call's permission request to Calyx before running the tool, and Calyx shows it in the same banner used by cockpit tools.

Which calls reach the banner depends on the agent:

- **Claude Code and Codex**: only the calls the CLI would have prompted you about itself. Anything its own permission system settles, such as a read in Plan mode or a tool you have already allowlisted, runs without a banner.
- **Grok**: only in always-approve mode (`bypassPermissions`). In its other modes Grok keeps prompting in its own pane, so the same question is never asked twice.
- **pi**: every tool call. pi ships no permission prompt of its own, so the banner is the only gate. With approval routing off, pi's tool calls run unreviewed.
- **OpenCode and Hermes**: none. They keep prompting in their own pane.

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
Click the position label to see the whole queue at once: every pending request for the window, oldest first, each row reading `3. Claude Code · Bash: npm test` with a `▸` marking the one on screen.
Picking a row jumps straight to that request, which saves paging through a backlog to reach the one you care about.
Cockpit tool requests share the same queue.
With a single pending request the navigator disappears and the banner looks exactly as before.

A macOS notification is posted for each new request.
Secrets in the notification summary are masked, while the banner itself shows the exact text so you can judge what you are approving.

### Fallback behavior

Nothing is ever auto-approved on failure.
If Calyx is unreachable, or you do not respond within about 10 minutes, the request expires, and what happens next depends on the agent.
Claude Code and Codex fall back to their own in-pane prompt, so the decision comes back to you there.
Grok in always-approve mode and pi have no prompt of their own to fall back to, so an expired request is denied.
Cancelling the tool call on the agent side clears its banner immediately.

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

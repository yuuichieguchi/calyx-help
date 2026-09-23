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

1. Open Settings (`Cmd+,`), select the **Agents** pane, and turn on **Enable AI Agent IPC** in the **AI Agent IPC** section at the top.
2. Start agents (Claude Code / Codex / OpenCode / Hermes / Grok / pi) in two or more terminal panes.
3. Each instance registers itself as a peer and can send/receive messages.

Turning the switch on starts the MCP server and writes config files based on which agents are installed.

| Agent | Config file |
|---|---|
| Claude Code | `~/.claude.json` |
| Codex CLI | `~/.codex/config.toml` |
| OpenCode | `~/.config/opencode/opencode.json`, `AGENTS.md` |
| Hermes | `~/.hermes/config.yaml` |
| Grok | `~/.grok/config.toml`, `~/.grok/hooks/calyx.json` |
| pi | `~/.pi/agent/extensions/calyx.ts` |

Restart any already-running agent instances so they pick up the new MCP server.

After you flip the switch, a status line under it reports the result: `Running on port <port> · all agents configured`, or `Running on port <port> · <n> of <total> configured` (`Running on port <port> · no agents configured` when none succeeded) followed by one line per config or hook that failed (`✗`) or was skipped because its agent is not installed (`–`).
If the server cannot start, the line reads `Could not start:` with the reason, and the Agents sidebar shows the same failure.

If you install another supported agent later, click **Refresh** below the switch.
It writes that agent's config and hooks against the server that is already running, so agents already connected keep working.

pi is the one supported agent with no MCP client configuration of its own, so Calyx reaches it through a TypeScript extension that pi loads on startup.
That single file carries the whole integration: the sidebar row, the approval gate, and a `calyx` tool that dispatches to the MCP tools below (call it with `{"tool": "list"}` to enumerate them).
A pi started outside Calyx, or inside a herdr pane, registers nothing.

### At launch and after updating Calyx

Calyx remembers the switch.
While it is on, every launch starts the server and rewrites the config entries and hooks above, so an update that changes what belongs in them needs no step from you.
Calyx reuses the previous run's port and token when it can, so an agent in a persistent session that outlives a Calyx restart keeps connecting.

Calyx 0.41.0 and earlier did not remember the setting, so after updating from one of them the switch starts off.
If you used AI Agent IPC before, turn it on once in Settings.

Rewriting at launch leaves config you maintain yourself intact.
Calyx edits only its own entry and keeps the rest of each file byte for byte, including key order, indentation, and line endings.
The Codex hooks block in `~/.codex/config.toml` and the Calyx block in `~/.hermes/config.yaml` are rewritten where they already sit, and anything inside one of them that Calyx does not own is moved out to just above the block instead of being replaced.
A file is not written at all when nothing needs to change.

### Available MCP tools

- `register_peer`
- `list_peers`
- `send_message`
- `broadcast`
- `receive_messages` — deletes each returned message from the inbox, so any message is delivered exactly once
- `get_peer_status`

See the [demo video](https://www.youtube.com/watch?v=Xty0ad9gGcM).

### Disable

Turn off **Enable AI Agent IPC** in the **Agents** pane of Settings.
Calyx stops the server and removes its own entries and hooks.
Files that belong to Calyx alone (`~/.grok/hooks/calyx.json` and `~/.pi/agent/extensions/calyx.ts`) are deleted.
A shared file that ends up empty stays on disk as an empty file, and a file that did not exist is never created.

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

The view supports Claude Code, Codex CLI, OpenCode, Hermes, Grok, and pi. Once **Enable AI Agent IPC** is on and you start an agent in a pane, that agent appears in the sidebar automatically.
While the switch is off, the sidebar reads **AI Agent IPC is disabled** and points to Settings → Agents.

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

The tool line names the tool and what that call is working on, as `Bash: git status --short`.
Calyx reads the arguments the CLI reported: the command for a shell tool, the path for a read or a write, the URL for a fetch, and everything else as `key: value` pairs.
A run of whitespace collapses to a single space, so a heredoc still reads on one line, and a long line is cut at 500 characters.
Narrow the sidebar and the line is trimmed from its end, keeping the tool name and the start of the command in view, while the elapsed time on the right keeps its width.
Hover the row to read the whole line in a tooltip.
A tool with nothing to summarize shows its name alone.

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
Calyx's shell integration covers zsh and fish while **Track shell commands** is on, and additionally expires any approval requests still pending for that pane, so an approval request never outlives the process that raised it.

A command you suspend with Ctrl-Z does not settle the row.

### herdr-hosted agents

Agents running inside herdr's own panes show up here too, labeled "via herdr" in the subtitle.
They need none of the setup native rows do: no **Enable AI Agent IPC** switch, no config file to write. Calyx reads them straight from herdr's own status stream, so they appear automatically whenever herdr is installed and running.

Calyx watches for herdr rather than asking on a timer, so the order you start things in does not matter.
Start herdr while Calyx is already running and the rows fill in on their own, even with Calyx frontmost and the sidebar already open.
Install herdr, or put it on `PATH`, after Calyx launched and it is picked up without a relaunch.
A herdr server that restarts at the same socket path is recognized as a new session and reconnected to.

Calyx retries the connection a few times over the first seconds after herdr's socket appears, because the file existing does not prove the server is listening yet.
A server slower than that to start listening stays unreported until something else changes in its directory.

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

When a gated tool is called, the [approval panel](#using-the-approval-panel) shows the tool name and the tab that owns its target pane (for `palette_execute`, which has no target pane, the current window's active tab).
**Allow** runs that one call; the decision is not remembered.
The **Options** menu holds **Deny** and **Always Allow**.
**Always Allow** turns on auto-approval for future calls and approves every cockpit request already pending; agent tool prompts waiting in the same queue are left for you to decide.
A denied call returns `{"status": "denied"}` to the agent, a dismissed one returns `{"status": "dismissed"}`, and a request left unanswered for 55 seconds returns `{"status": "approval_timeout"}`.
Each is a normal result, not an error, and the tool does not run.

Auto-approval is the same setting as **Auto-approve agent commands** in the **Agents** pane of Settings.
It is off by default, so every gated call asks first.

## Approving agent tool calls

When several agents run in parallel, their permission prompts are scattered across panes.
With approval routing on, a supported agent sends each tool call's permission request to Calyx before running the tool, and Calyx shows it in the same approval panel used by cockpit tools.

Which calls reach the panel depends on the agent:

- **Claude Code and Codex**: only the calls the CLI would have prompted you about itself. Anything its own permission system settles, such as a read in Plan mode or a tool you have already allowlisted, runs without reaching the panel.
- **Grok**: only in always-approve mode (`bypassPermissions`). In its other modes Grok keeps prompting in its own pane, so the same question is never asked twice.
- **pi**: every tool call. pi ships no permission prompt of its own, so the panel is the only gate. With approval routing off, pi's tool calls run unreviewed.
- **OpenCode and Hermes**: none. They keep prompting in their own pane.

### Enable

1. Turn on **Enable AI Agent IPC** in the **Agents** pane of Settings (while it is on, Calyx reinstalls the approval hook at every launch, so updates need no extra step).
2. Turn on **Show agent tool prompts in the approval banner** in the **Agents** pane of Settings (off by default).
3. Restart running agent CLI instances.

### Using the approval panel

Requests appear in a floating panel styled like a macOS notification, at the top-right of the screen that holds the Calyx window you are using.
The panel shows on every Space, including full-screen ones, and stays above other apps' windows even while Calyx is in the background.
Clicking its buttons and menus never takes focus, so deciding a request does not pull you out of what you are typing.
Only typing an **Other…** answer or a note into a question takes focus, and focus returns to the pane afterwards.
The panel hides itself once nothing is pending.

The title names the agent and tool (for example "Claude Code · Bash") and the tab that owns the target pane.
Below it, two lines summarize what the tool will do.
Hover the summary to read the full text in a tooltip, or click it to expand the full text inside the panel.

**Yes** approves that single request.
The **Options** menu holds every other choice:

- The CLI's own always-allow suggestions, such as "Yes, and don't ask again for Bash: npm test for this session". Each lasts for the scope the CLI names (session, project, or user).
- **Always Allow \<tool\> in This Pane**, shown only when the CLI offered no suggestions of its own. It auto-approves that tool for that pane until the pane closes or the server stops.
- **No**, which denies the request.

Hover the panel to reveal a dismiss button on its top-left corner.
Dismissing hands the request back to the agent without an answer from Calyx: Claude Code and Codex show their own prompt in the pane, and you answer there.
Grok and pi have no prompt to hand back to, so the button is disabled for them and the decision stays in the panel.

A Claude Code question (AskUserQuestion) appears in the same panel.
Pick an answer from **Options**, or from an inline list when the question allows several answers or carries previews.
**Other…** takes a free-text answer, **Add notes** attaches a note, **Back** returns to the previous question when there are several, and **Chat about this** hands the conversation back to the CLI.

When more than one request is pending, previous/next chevrons and an "N / M" position label appear at the right end of the title.
Browse the queue and decide any request in any order; deciding the displayed request advances to the nearest remaining one.
Click the position label to see the whole queue at once: every pending request across all windows, oldest first, each row reading `3. Claude Code · Bash: npm test` with a `▸` marking the one on screen.
Picking a row jumps straight to that request, which saves paging through a backlog to reach the one you care about.
Cockpit tool requests share the same queue.
With a single pending request the navigator disappears.

A macOS notification is posted for each new request.
Secrets in the notification summary are masked, while the panel itself shows the exact text so you can judge what you are approving.

### Fallback behavior

Nothing is ever auto-approved on failure.
If Calyx is unreachable, or you do not respond within about 10 minutes, the request expires, and what happens next depends on the agent.
Claude Code and Codex fall back to their own in-pane prompt, so the decision comes back to you there.
Grok in always-approve mode and pi have no prompt of their own to fall back to, so an expired request is denied.
Cancelling the tool call on the agent side removes it from the panel immediately.

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

1. Turn on **Enable AI Agent IPC** in the **Agents** pane of Settings (the LSP proxy shares this server).
2. Restart or reconnect your agent so it picks up the `calyx-ipc` MCP server.
3. (Optional) In Settings, open the **LSP** pane and enable auto-install for missing language servers.

Calyx keeps language servers running in the background, syncs file changes from disk, and starts the right server on the first `lsp_*` call for a workspace.

### Supported languages

TypeScript, Python, Rust, Go, Swift, and others.
Per-language auto-install support is shown in Settings under the **LSP** pane.

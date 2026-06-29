---
title: AI agent integration
description: AI Agent IPC and LSP Proxy MCP via the built-in MCP server.
sidebar:
  order: 7
---

Calyx ships with an MCP server that integrates with CLI AI agents (Claude Code, Codex CLI, OpenCode, Hermes).
It exposes two features: peer-to-peer messaging between agents across tabs/panes, and LSP-backed symbol lookup tools.

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
- `receive_messages`
- `ack_messages`
- `get_peer_status`

See the [demo video](https://www.youtube.com/watch?v=Xty0ad9gGcM).

### Disable

Run **Disable AI Agent IPC** from the command palette.

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
3. (Optional) In Settings, open **LSP Proxy** and enable auto-install for missing language servers.

Calyx keeps language servers running in the background, syncs file changes from disk, and starts the right server on the first `lsp_*` call for a workspace.

### Supported languages

TypeScript, Python, Rust, Go, Swift, and others.
Per-language auto-install support is shown in Settings under **LSP Proxy**.

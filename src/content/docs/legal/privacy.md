---
title: Privacy Policy
description: What Calyx handles and what it sends over the network.
sidebar:
  order: 3
---

Last updated: September 25, 2026

Calyx is a macOS terminal application that runs locally.
This page describes the data Calyx handles and the network traffic it generates.

## User information collected

Calyx does not collect any user identifiers, usage logs, or crash reports.
No analytics or telemetry is sent.

The developer has no way to observe your launch times, feature usage, or input.

## Information stored locally

Calyx stores the following on your machine to restore state and run features.
None of it is sent off your machine.

- Open tabs, splits, and per-tab working directories (for session restore) — for a tab opened from a herdr workspace, this also includes herdr's socket path and its own pane id, so the tab can reconnect after relaunch; herdr's terminal ids are never stored
- Persistent-session bookkeeping kept by the local `calyx-session` daemon (session list and working directories) — only when persistent sessions are enabled (off by default)
- Session history files under `~/.calyx/state/history/` — only when **Persist session history to disk** is enabled (off by default)
- Terminal scrollback (in memory, within the session)
- Command log records (command line, exit status, and captured output) — in memory only, while **Track shell commands** is on (on by default); capped per pane, never written to disk, discarded when Calyx quits; known secret patterns (tokens, passwords, API keys, JWTs) are redacted before being stored
- Shell integration scripts for command tracking (`~/Library/Application Support/Calyx/shell-integration`)
- AI agent integration configs, written into each agent's own configuration directory (`~/.claude.json`, `~/.codex/`, `~/.config/opencode/`, `~/.hermes/`, `~/.grok/`) as a `calyx-ipc` entry and a `calyx-mcp` entry, each carrying the local server's bearer token; for pi, which has no configuration file of its own, this is instead a TypeScript extension at `~/.pi/agent/extensions/calyx.ts` that pi loads and runs
- The MCP servers you add in Settings under **MCP Apps** (`~/Library/Application Support/Calyx/mcp-servers.json`, readable by your user only), with their environment values, request headers, OAuth tokens, client secrets, and registered client IDs kept in the login Keychain
- Images an MCP App sends to an agent, written under a `calyx-mcp-apps` folder in the temporary directory
- Browser server connection info (`~/.config/calyx/browser.json`)
- Background language server processes for the LSP proxy
- Browser tab storage (non-persistent — discarded when the tab closes)

## Outbound network traffic

The only outbound traffic Calyx initiates is the following.

### 1. Auto-update (Sparkle)

The directly-downloaded build fetches the Appcast on launch to check for new versions.

- URL: `https://yuuichieguchi.github.io/Calyx/appcast.xml`
- Content: version info, release notes, and download URLs
- Downloads are verified against a public key signature before installation

### 2. Release asset download

When you accept an update, Calyx downloads the new build from GitHub Releases.
This happens only after you confirm in the update dialog.

### 3. Language server auto-install (optional)

If you enable auto-install in Settings under **LSP Proxy**, Calyx downloads missing language servers via package managers.
This feature is off by default.

### 4. Browser tab requests initiated by you

URLs you load in a browser tab generate normal browser traffic.
Storage is non-persistent and is discarded when the tab closes.

### 5. Remote session SSH connections initiated by you

Creating or attaching to a remote session, and `calyx-session remote-install`, spawn `ssh` to the host you choose.
Remote sessions generate no other traffic, and nothing connects unless you initiate it.

### 6. MCP servers you add in Settings

The **MCP Apps** pane of Settings holds MCP servers you add or import yourself.
Calyx connects to them only while **Enable AI Agent IPC** is on and the server's own switch is on, and it ships with none configured.

- An HTTP server is connected to at the URL you entered, with the headers you entered. Calyx sends the calling pane's working directory to a server that asks for the workspace roots.
- A stdio server is started as a local process with the command and environment you entered. What it connects to is up to that process.
- Signing in to a server that requires OAuth fetches the server's authorization metadata, may register Calyx as a client with the authorization server (identifying itself with `https://getcalyx.app/oauth/mcp-client.json` where that form is supported, otherwise by dynamic registration), opens the authorization page in your default browser, and exchanges the code for tokens. The redirect returns to a listener on the loopback interface, on a random port or on port 41890 when you turn that option on. Signing out deletes the tokens locally and sends nothing to the server.
- A view an MCP App shows is rendered from HTML the server provides over that connection; Calyx fetches nothing from the web to display it. The view can make requests only to the domains its server declares for it, and none when it declares none. The view is told the theme colors and font, the locale and time zone, and the tool's arguments and result.
- A link an app asks to open goes to your default browser only after you approve it.

## Locally-running servers

Calyx hosts several servers inside its own process.
They listen on the loopback interface (`localhost`) and are not exposed to the network.

- **AI Agent IPC MCP server**: used by AI agents on the same machine; the same port also serves the `/calyx-mcp` endpoint that republishes the MCP servers configured under **MCP Apps**
- **OAuth redirect listener**: opened on the loopback interface only for the duration of an MCP server sign-in
- **Browser automation server**: `localhost:41840`, used by the `calyx browser` CLI
- **Session daemon (`calyx-session`)**: a separate local process reachable only over a Unix domain socket; it opens no network port

They do not accept connections from outside the machine, so no firewall-crossing traffic is generated.

## Connecting to herdr

If herdr, a separate terminal multiplexer, is installed and running on your machine, Calyx detects it and connects automatically. There is no setting to turn this off; not running herdr avoids it entirely.

The connection is a local Unix domain socket only (for example `~/.config/herdr/herdr.sock`), never a network connection, and nothing about it leaves your machine.
Calyx uses it to list herdr's workspaces in the Session Browser and to show herdr-hosted agents in the Agents Sidebar.

## Interactions with AI agents

When you use AI agents (Claude Code, Codex CLI, OpenCode, Hermes, Grok, pi) through Calyx, the prompts you type and the responses you receive flow through Calyx and appear in the terminal, but Calyx itself does not record or transmit them.

What each agent sends to its provider's API is governed by that agent's own privacy policy.

## Diff review comments

Review comments you create from the sidebar Git view are sent only to the AI agent tab you select with **Submit Review**.
They are not sent to GitHub or any other external service.

## Differences by install type

- **Homebrew install**: Sparkle auto-update is disabled. Updates flow through `brew upgrade`. The Appcast is not fetched.
- **Direct download**: "Auto-update" and "Release asset download" above apply.

## Changes to this policy

This policy may be updated as features change. Updated versions take effect when published on this help site.

## Contact

Questions about privacy can be filed on [GitHub Issues](https://github.com/yuuichieguchi/Calyx/issues).

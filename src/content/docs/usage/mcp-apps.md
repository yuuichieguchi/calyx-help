---
title: MCP Apps
description: Host MCP servers in Calyx, republish their tools to every agent CLI, and show the interactive apps their tools return next to the agent that called them.
sidebar:
  order: 8
---

MCP Apps lets an MCP server's tool return an interactive view alongside its result.
Calyx hosts those servers itself: you add a server once in Settings, Calyx connects to it, republishes its tools to every agent CLI, and when a tool comes with a view, shows that view docked next to the pane whose agent called it.

Calyx implements the MCP Apps extension (`io.modelcontextprotocol/ui`).
A server takes part by declaring a `ui://` resource on a tool, and Calyx reads that resource from the server and renders it in a sandboxed web view.

## Requirements

MCP Apps runs on the same server as [AI Agent IPC](/usage/ai-agents/), so **Enable AI Agent IPC** in the **Agents** pane of Settings must be on.
While it is off, the **MCP Apps** pane shows a banner saying so, and agents cannot reach the servers you add.

While the switch is on, Calyx writes a `calyx-mcp` entry next to its `calyx-ipc` entry in each agent's configuration (Claude Code, Codex, OpenCode, Hermes, Grok).
pi has no configuration file, so its Calyx extension gains a `calyx_mcp` tool instead: call it with `{"tool": "list"}` to enumerate the republished tools, or with a tool name and `args` to call one.
Restart agent instances that were already running so they pick up the new entry.
Updating from a release before 0.43.0 needs no step of its own: with the switch on, Calyx rewrites the entries at every launch.

## Adding a server

Open Settings (`Cmd+,`) and select the **MCP Apps** pane.
Only the servers listed here are hosted.
A server that an agent CLI already connects to on its own, for example one in `~/.claude.json`, is not picked up until you add or import it here.

### Add Server

**Add Server** opens a sheet.

- **Name** is what Calyx shows for the server.
- **Alias** is the short prefix under which the server's tools are published (see [How tools appear to agents](#how-tools-appear-to-agents)). It follows the name until you edit it, must be a lowercase letter followed by up to 9 lowercase letters or digits, and cannot be changed after saving.
- **Transport** is `stdio` or `HTTP`.

For a `stdio` server, enter the **Command**, its **Arguments** (separated with spaces; quote values that contain spaces), and optionally a **Working directory**.
The **Environment** section takes variables for the process; their values are masked once entered.

For an `HTTP` server, enter the **URL**.
Turn on **Legacy HTTP+SSE server** for a server that still uses the HTTP+SSE transport rather than Streamable HTTP.
The **Headers** section takes request headers, masked once entered.
The **OAuth** section is only needed for a server that requires sign-in with a pre-registered client: **Client ID**, **Client authentication** (None, Client secret (POST), or Client secret (Basic)), and **Client secret**.
**Use fixed redirect port 41890** makes the sign-in redirect land on that port instead of a random one; turn it on only for an authorization server that requires an exact redirect port.

### Import JSON

**Import JSON** takes the configuration an agent CLI already uses for its own MCP servers.
Paste a `{"mcpServers": {...}}` object, a map of servers, or a single server.
`${VAR}` references are filled in from Calyx's environment.

A preview lists each server's alias, any `${VAR}` that could not be resolved, and keys Calyx ignores.
When an alias is already taken, **When an alias is taken** offers **Replace**, **Rename** (the default), or **Skip**, applied to every server whose alias is taken.

The text field accepts what you type as is: quotes stay straight and `--` stays two hyphens, so JSON pasted or typed by hand parses.

### Server rows

Each server has a row with a switch that enables or disables it, and a status line:

- `Disabled`, `Connecting`, `N tools, M with UI`, `Sign-in required`, `Signing in`, or `Disconnected (reconnecting)`
- a sentence describing a failure, followed by the tail of a `stdio` server's error output where there is one

Below it the row names the alias, the transport, and the command or URL, and for a signed-in server `Signed in`.
The buttons are **Retry**, **Sign In**, **Cancel Sign-In**, **Sign Out**, **Edit**, and **Remove**, as they apply.
**Remove** deletes the server and its stored secrets immediately, without a confirmation.

**Details** opens a list of the server's excluded tools with the reason for each, and the instructions the server sent.
A tool that needs task support (`execution.taskSupport`) is excluded, since Calyx does not run tools as tasks.

## Signing in to an HTTP server

An HTTP server that answers with an OAuth challenge shows `Sign-in required` in its row.
Click **Sign In**: Calyx opens the authorization page in your default browser and listens on the loopback interface for the redirect back.
Once signed in, the row reads `Signed in`, and the server's tools become available.

When an agent calls a tool on a server that needs sign-in, a floating prompt titled `<server> requires sign-in` appears with **Sign In** and **Cancel**.
The tool call waits for up to two minutes for you to finish.

Calyx picks the OAuth client it identifies as, in this order:

1. The **Client ID** you entered in **Edit**.
2. A client ID metadata document (`https://getcalyx.app/oauth/mcp-client.json`), when the authorization server supports that form of registration.
3. A dynamic registration Calyx already made with that authorization server.
4. A new dynamic client registration (RFC 7591), as a native client named Calyx.

When none of these is possible, the row explains that the authorization server does not support automatic client registration and asks for the client ID of an OAuth app registered with it, which you enter in **Edit**.

Tokens and any client secret are kept in your login Keychain.
**Sign Out** deletes the tokens from the Keychain; the client secret stays until you change it in **Edit** or remove the server. It sends no revocation request to the server.

## How tools appear to agents

Calyx publishes each server's tools on its own MCP endpoint, which agents reach through the `calyx-mcp` entry.
A tool is named `<alias>-<tool>`; in Claude Code that reads `mcp__calyx-mcp__<alias>-<tool>`.
A name that would exceed 48 characters, or contains characters outside letters, digits, `_`, and `-`, is shortened and given a short hash suffix.

Two more kinds of tool appear:

- `app_context` returns the latest context reported by the MCP App views open in the calling pane, so an agent can read what you did in a view.
- `<alias>-app_<name>` is a tool that a running view registers itself, visible only to agents in the pane that hosts the view.

A tool call is forwarded to the server and its result is returned to the agent, whether or not the tool has a view.
Calyx adds no approval prompt of its own to these calls; your agent's own permission prompt, and [approval routing](/usage/ai-agents/#approving-agent-tool-calls) if you use it, apply as before.

## The app view

When an agent in a pane calls a tool that declares a view, the view opens in a dock to the right of that pane's terminal.
The dock takes 40% of the pane to start with; drag the divider between the terminal and the dock to resize it, and Calyx remembers the width for that pane while the dock exists.
The dock works in the Quick Terminal too, and a pane in a persistent session keeps its views across a reconnect.

Each view is a card with a header naming the tool, the server, and the calling agent (`show-map · map · claude-code`), a state such as `Loading`, `Running`, or `Completed`, and a **Close** button.
A view that stopped or could not be loaded offers **Reload**.
When a pane has more than one view, a segmented switcher above the card selects between them.
A tab with a running view shows a small accent-colored dot in the tab bar and sidebar (its tooltip reads "An MCP App is running in this tab").

An app can ask for a different display mode.
`fullscreen` covers the tab's whole split area with the view (the window itself stays as it is), and `pip` moves the view into a small floating window at the bottom-right of the window; closing that window returns the view to the dock.
There is no Calyx control for switching modes; the app requests them, and only the modes it declares are available.

A view called by an agent that is not running in a Calyx pane, for example a CLI started in another terminal, opens in a standalone window instead.

Views take Calyx's colors and font: the terminal background and foreground, the font size, the accent color, and light or dark appearance, and they update when you change the theme.

### When a view closes

A view is removed when you click **Close**, when the app asks to be torn down, when its pane is closed, or when its server is disabled or removed in Settings.
It is also removed when the calling agent's conversation ends, which for Claude Code includes `/clear`.
A new tool call with a view in the same pane clears that pane's finished views (completed, cancelled, or rejected because the resource was invalid) and keeps the ones still running.

## Consent prompts

Three things an app may ask for go through the [approval panel](/usage/ai-agents/#using-the-approval-panel), the same one that shows agent permission prompts.
Each prompt names the server in its title.

- **Open Link**: the app wants to open a URL in your browser. The body shows the whole link. **Open** opens it in your default browser; **Options** holds **Always Allow for This View** and **Cancel**. Only `http`, `https`, and `mailto` links are allowed.
- **Send Message**: the app wants to send text back to the agent. **Send** pastes the message into the calling pane and submits it; **Options** holds **Always Allow for This View** and **Don't Send**. An image in the message is saved to a temporary file and its path is pasted instead.
- **Copy Message**: the app wants to send a message but its window has no pane. **Copy** puts the message on the clipboard; **Options** holds **Dismiss**.

Dismissing a prompt with its × counts as **Cancel** or **Don't Send**, and so does leaving it unanswered for an hour.
A newer prompt from the same view replaces the pending one.
**Always Allow for This View** lasts as long as the view, including across **Reload**, and is forgotten when the view is removed.
It never turns on **Auto-approve agent commands**.

Two requests use their own floating panel rather than the approval panel.
When a server asks you for input (an elicitation), a window titled `<server> request` and headed `<server> asks` shows either a form with **Cancel**, **Decline**, and **Accept**, or a URL with **Cancel**, **Decline**, and **Open**, followed by **Done** once the URL has been opened.
When an app offers a file, a macOS Save panel opens for each file, defaulting to `~/Downloads`.

## What a view can reach

The view's HTML comes from the MCP server over the MCP connection; Calyx fetches nothing from the web to display it.
Each view runs in a non-persistent web store that is discarded when the view closes.
The page cannot navigate away, open windows, or start downloads on its own, and it is never granted the camera, microphone, or location.
The only permission it is offered is writing to the clipboard.

Network access from inside the view is limited to the domains the server declares for it (`https` or `wss`, or `http` and `ws` on loopback only).
A server that declares none gets a view that makes no external requests.
Entries Calyx cannot honor, such as a wildcard for every host, are dropped and listed in the card header as `Ignored CSP entries`.

## What is stored

- The server list is kept in `~/Library/Application Support/Calyx/mcp-servers.json`, readable by your user only.
- Environment values, headers, OAuth tokens, client secrets, and the client IDs Calyx registered are kept in the login Keychain. **Remove** deletes the server's items; a client ID registered with an authorization server is kept so the next server on the same issuer can reuse it.
- Images from a **Send Message** are written under a `calyx-mcp-apps` folder in the temporary directory.

See the [privacy policy](/legal/privacy/) for the network traffic these servers generate.

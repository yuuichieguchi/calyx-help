---
title: Persistent sessions
description: Daemon-backed terminal sessions that survive quit and crash, the Session Browser, remote sessions over SSH, and herdr workspaces.
sidebar:
  order: 11
---

Persistent sessions keep your shells alive outside the Calyx app process.
A local daemon (`calyx-session`) owns each shell, so quitting or crashing Calyx does not kill what's running — you reattach later and continue.

This is separate from [layout restore](/usage/tabs-and-splits/#session-restore), which restores tabs, splits, and working directories but starts fresh shells.

## Enabling

In Settings, open the **Sessions** pane and turn on **Enable persistent sessions**.
The toggle is off by default and applies to newly created panes; panes that already have a persistent session keep it either way.

## Quitting and coming back

When you quit while persistent sessions are running, Calyx asks for confirmation and explains that sessions will be detached and kept running in the background.
On the next launch, Calyx reattaches your panes to those sessions.

If the automatic restore is skipped or fails, a recovery bar appears at the top of the window — "Your previous session was preserved." — with **Restore** and **Dismiss** buttons.
The same restore is available later from the command palette as **Recover Previous Session**.

## Session Browser

Open it from **View > Session Browser** (`Cmd+Shift+B`) or run **Session Browser…** from the command palette.
It lists every session the daemon knows about, across all Calyx windows and launches.
Sessions with no window attached carry a **Detached** badge.

- **Attach** opens the session as a new tab, titled after the session's working directory.
- **Kill** terminates the session.

For the focused pane, the command palette also offers **Detach Session** (keep it running, release the pane) and **Kill Session**.

## Remote sessions

Persistent sessions can also live on another machine over SSH.

1. Deploy the daemon to the host once, from a Calyx terminal:

   ```bash
   calyx-session remote-install <host>
   ```

   This copies the bundled `calyx-session` binary over `ssh` to `~/.calyx/bin/` on the remote host.

2. Open the Session Browser (or run **New Remote Session…** from the palette) and pick the host.
   Host candidates are read from your `~/.ssh/config`.

All traffic is ordinary `ssh` initiated by you; the daemon never opens network connections on its own.

## Session history on disk

By default, a persistent session's output history lives only in the daemon's memory.
Turn on **Persist session history to disk** in the **Sessions** pane of Settings to also write it to `~/.calyx/state/history/<session-id>.raw` (rotated at 10 MB).
Because this writes terminal output to disk, it stays off until you enable it.

## Resuming agent CLIs

If an agent CLI (such as Claude Code) was running in a session, reattaching can offer to resume that conversation.
Turn on **Offer to resume agent CLI conversations** in the **Agents** pane of Settings.
Add **Auto-execute resume (skip confirmation)** if you want the resume command submitted without a prompt.

## The `calyx-session` CLI

The daemon ships with a CLI, available on `PATH` inside Calyx terminals: `calyx-session ls`, `attach`, `new`, `kill`, `history`, `remote-install`, and more.
Everything above works from the UI; the CLI is there for scripting.

## herdr workspaces

Calyx can also show and open workspaces from herdr, a separate terminal multiplexer with its own background server, independent of the `calyx-session` daemon described above.
If herdr is installed, its workspaces appear in the Session Browser automatically; if it isn't, nothing else on this page changes.
Installing or starting herdr after Calyx has launched works the same way: Calyx notices it and picks it up without a relaunch.

Each herdr server appears as its own row, stating how many workspaces and panes it currently holds, with its workspaces listed underneath.

- **New** creates a workspace on that server and opens it (herdr picks the directory: the currently focused workspace's, or your home directory if none is focused).
- Each workspace row has its own **Attach** and **Kill**. **Attach** reads **Show** once that workspace is already open as a tab in the current window.

Opening a workspace creates a Calyx tab split into one pane per herdr pane, matching herdr's own layout.
Closing that tab, or a pane in it, only detaches Calyx from herdr; the workspace and its processes keep running on herdr's side.
Use **Kill** in the Session Browser to actually end it.

If you quit and relaunch Calyx, a herdr tab reconnects automatically as long as herdr, its socket, and that pane are all still there; otherwise the tab opens as a plain shell instead.

The command palette also offers **Attach herdr TUI**, which opens herdr's own full-screen interface in a single tab instead of Calyx's native split panes.
It appears once you've opened the Session Browser at least once, and always targets the first herdr session Calyx finds.

Agents running inside herdr panes also show up in the [Agents Sidebar](/usage/ai-agents/#herdr-hosted-agents).

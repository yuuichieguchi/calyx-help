---
title: Mission Map
description: A full-window view of every pane in the window, with each agent's state, pending approvals, and the messages agents send each other.
sidebar:
  order: 8
---

Mission Map lays every terminal pane in the current window out as a card, on top of the window.
Use it when agents are running across several tabs and you want to see which one is working, which one is waiting for you, and which ones are talking to each other, without switching tabs.

## Opening and closing

Open Mission Map in any of these ways:

- Press `Cmd+Shift+M`. It works even while a terminal pane has focus.
- Choose **View → Mission Map** in the menu bar.
- Run **Mission Map** from the [command palette](/usage/command-palette/).
- Right-click a tab in the tab bar or the sidebar and choose **Show All Tabs**.
- Press a key you bound to Ghostty's `toggle_tab_overview` action (see [Keybind actions](/usage/customization/#keybind-actions)). No key is bound to it by default.

The map covers the whole window, sidebar and tab bar included, and scrolls vertically when the cards do not fit.
Each window has its own map, showing only that window's panes.

Press `Esc` to close it, as the "esc to close" hint in the bottom-right corner says.
While a card or a line is selected, the first `Esc` clears the selection and the second closes the map.
Pressing `Cmd+Shift+M` again, or opening the command palette or the compose overlay, also closes it.
Clicking empty space only clears the selection, so a stray click never closes the map.

## Cards

Every split pane of every tab in the window gets a card.
Cards are grouped into one band per tab group, headed by the group's name.
Browser tabs and diff tabs have no card.

A card shows:

- A state dot in the same colors as the [Agents Sidebar](/usage/ai-agents/#agents-sidebar): red (waiting on the user), yellow (working), green (idle), blue (done).
- The agent's name, for example Claude Code or Codex, and a badge counting its unread AI Agent IPC messages.
- The pane's title and its working directory.
- For a working directory inside a Git repository, the branch (or the short commit hash when no branch is checked out) and, when there are any, the number of changed files. This line refreshes every 5 seconds while the map is open.
- The tool the agent is running right now.
- One row per running subagent, with a state dot and its current tool, or its state when it is not running one.

A pane with no agent in it reads **Terminal**, with a hollow dot, and is dimmed.
Agents hosted by herdr also appear this way (see [Known limitations](/reference/known-limitations/#herdr-agents-in-mission-map)).

## Approvals on cards

When a pane has a pending [approval request](/usage/ai-agents/#approving-agent-tool-calls), its card gains an orange **Waiting for approval** row and an orange border that pulses (it stays steady when Reduce Motion is on).
If the pane has several pending requests, the card shows the oldest.

For a tool permission request, **Allow** approves it without leaving the map.
**Open** closes the map and brings the request up in the approval panel, where the other choices (the **Options** menu and **No**) are.
A question from the agent, and a consent prompt from an [MCP App](/usage/mcp-apps/), offer only **Open**.

## Lines between panes

When agents message each other over [AI Agent IPC](/usage/ai-agents/#ai-agent-ipc), a line joins the sender's card to the recipient's.
Dots travel along it from sender to recipient, one per message, for up to eight of the newest messages.
All messages sent in one direction between the same two panes share one line, and messages going the other way get their own line running beside it.
A broadcast draws a line from the sender to every other pane in the window whose agent has registered as a peer.
Lines bend at right angles to run around the cards.

A line stays solid for 10 seconds after its newest message, then fades out, and disappears two minutes after that message.
Calyx records messages as they are sent, so a map you open now still shows the last two minutes of traffic.
Messages to or from a pane in another window draw no line.

A red line with a file name joins two panes whose agents both edited the same file in the last five minutes, which is how you catch two agents working on the same file.
Calyx learns about edits from the file-writing tool calls agents report to it, such as Claude Code's Write and Edit or Codex's `apply_patch`; reading a file does not count.
Unlike a message line, a red line does not fade.

### Reading a line

Click a line to select it and open a popover beside it.

- A line carrying one message shows its text, titled **Message** or **Broadcast**.
- A line carrying several messages lists them newest first, each with how long ago it was sent. Up to eight appear, followed by "+N more".
- A red line shows the path of the file both agents edited.

Clicking inside the popover keeps it open.
Close it with its **×** button, with `Esc`, or by clicking empty space or a card.
Clicking another line moves the popover to that line, and the popover also closes when its line disappears.

## Selecting and opening a pane

Click a card to select it.
Only one card or one line is selected at a time, so selecting one clears the other.

Double-click a card, or click the open button at its top-right corner, to close the map and go to that pane.
Calyx switches to its tab, un-zooms the tab if another split is zoomed, and gives the pane keyboard focus.

## Arranging cards

Drag a card to move it.
Lines follow the card and re-route around it as you drag.

Calyx remembers where you moved each card and saves it with the window layout, so the arrangement survives closing the map and relaunching Calyx with [session restore](/usage/tabs-and-splits/#session-restore).
A position is kept relative to the card's automatic place, so a moved card shifts along with the layout when you resize the window or add and close panes.
There is no command to reset the arrangement; a card's position is forgotten when its pane closes.

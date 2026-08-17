---
title: Known limitations
description: Currently-known bugs and constraints.
sidebar:
  order: 3
---

## Click-to-move cursor on full-width text

On lines containing full-width characters (Japanese, CJK, etc.), the cursor may not land exactly where you clicked.

This is not a Calyx-specific issue.
Ghostty's cursor-click-to-move translates the click position into a sequence of arrow-key inputs counted in terminal cells.
Because full-width characters span multiple cells, the translation accumulates rounding error.

There's no workaround.
On lines with many full-width characters, move the cursor with the keyboard instead.

## Ghostty config keys overridden by Calyx

To make the Liquid Glass UI work coherently, Calyx overrides the following keys.
Setting them in the Ghostty config file has no effect.

- `background-opacity`
- `background-blur`
- `background-opacity-cells`
- `font-codepoint-map`
- `foreground`

The current full list of Calyx-managed keys is shown in Settings under **Ghostty Config Compatibility**.

## Enabling AI Agent IPC on a pi-only machine

**Enable AI Agent IPC** writes the MCP client configs first and the pi extension afterwards.
pi is the one supported agent with no MCP client config of its own, so on a machine where pi is the only supported agent installed, the command finds nothing to configure, reports "No agent configs found", and stops the MCP server it just started before writing `~/.pi/agent/extensions/calyx.ts`.

Writing the extension by hand does not help, because it needs a running MCP server to reach.
Install any other supported agent to work around this.

## Browser tab constraints

- http and https only
- Non-persistent storage (cookies and local storage are discarded when the tab closes)
- Popups are blocked automatically

It's a developer-and-automation view, not a general-purpose browser.

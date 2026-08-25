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

`background-opacity-cells` is still overridden here, but Calyx exposes it: set it from its own switch in Settings under Appearance, described in [Glass opacity](/usage/customization/#glass-opacity).

## Agent rows and suspended fish jobs

Calyx settles an agent row when the pane's shell returns to its prompt, and deliberately ignores a command you suspended with Ctrl-Z.
fish exposes no way to tell which command a stopped job belongs to, so while any job sits stopped in a fish pane, Calyx treats every later command in that pane as suspended too, and the agent row there stays live instead of settling.
Resume the stopped job with `fg`, or end it, to clear this.
The command log is unaffected: each command still records its own real exit code.

## Codex subagent rows

Calyx subscribes to the `SubagentStart` and `SubagentStop` hooks that Codex documents, but has never managed to capture one from a real Codex run.
Subagent rows for Claude Code, Grok, and OpenCode were verified against live sessions; Codex rows may not appear.

## Browser tab constraints

- http and https only
- Non-persistent storage (cookies and local storage are discarded when the tab closes)
- Popups are blocked automatically

It's a developer-and-automation view, not a general-purpose browser.

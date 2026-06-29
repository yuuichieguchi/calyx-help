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

## Browser tab constraints

- http and https only
- Non-persistent storage (cookies and local storage are discarded when the tab closes)
- Popups are blocked automatically

It's a developer-and-automation view, not a general-purpose browser.

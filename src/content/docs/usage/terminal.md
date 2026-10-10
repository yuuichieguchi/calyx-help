---
title: Terminal features
description: Scrollback search, drag-and-drop, click-to-move cursor, VoiceOver.
sidebar:
  order: 4
---

## Scrollback search

`Cmd+F` searches the terminal scrollback.
Matches are highlighted; `Cmd+G` jumps to the next match and `Cmd+Shift+G` to the previous.
`Escape` closes the search bar.

## Smooth scrolling

Trackpad scrolling uses full smooth pixel scrolling via sub-row CALayer transforms.
A notched mouse wheel adds a velocity-based animation for smoother transitions.
You can disable it from Settings if you prefer raw line steps.

## Native scrollbar

Terminal scrollback uses the system overlay scrollbar — the same one you see in other macOS apps.

## Drag-and-drop

Drop a file, URL, or text onto the terminal to insert it.
File paths are shell-escaped automatically, so paths with spaces or special characters work without manual quoting.

## Click-to-move cursor

Click a prompt line to reposition the cursor.
Under the hood this is Ghostty's cursor-click-to-move, which translates clicks into arrow-key steps over terminal cells — shell integration must be enabled.

:::caution[Known limitation]
On lines containing full-width characters (Japanese, CJK, etc.), the cursor may land slightly off from the click position. See [Known limitations](/reference/known-limitations/).
:::

## VoiceOver

Every terminal pane is exposed to VoiceOver and other accessibility clients as a text area named **Terminal**.
Focus a pane and VoiceOver reads the text on screen line by line, one terminal row per line, so a long line that wraps is read as several lines.
Japanese and other full-width text, as well as emoji, read as written, with no padding artifacts.
The text you select with the mouse is what VoiceOver reports as the selection.

Only the visible part of the terminal is exposed.
Scrollback above it is not, but once you scroll back, the rows now on screen are what gets read.
New output is not announced on its own; VoiceOver reads the pane when you focus it or move through it.
Every pane carries the same name.
There is no setting for this; it is always on.

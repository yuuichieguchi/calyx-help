---
title: Tabs, groups, and splits
description: Working with tabs and groups, and splitting panes in Calyx.
sidebar:
  order: 2
---

A Calyx window is structured as three layers: groups → tabs → splits (panes).

## Tabs

| Action | Shortcut |
|---|---|
| New tab | `Cmd+T` |
| Close focused pane (closes the tab when it is the last pane) | `Cmd+W` |
| Close tab | `Cmd+Option+W` |
| Switch by number | `Cmd+1` – `Cmd+9` |
| Next tab | `Cmd+Shift+]` |
| Previous tab | `Cmd+Shift+[` |

Double-click a tab to rename it.
The `prompt_surface_title` [keybind action](/usage/customization/#keybind-actions) opens the same rename editor from a custom key.
Drag tabs in the tab bar or sidebar to reorder them.

Right-click a tab (or Ctrl+click it) in the tab bar or the sidebar to open its context menu: **Close Tab**, **Close Other Tabs**, **Close Tabs to the Right**, and **Rename Tab...**.
Every item acts on the tab you right-clicked, and opening the menu does not switch to that tab, so from the sidebar you can close or rename a tab in another group without leaving the one you are working in.
**Close Other Tabs** and **Close Tabs to the Right** cover the tabs in that tab's group, and are disabled when there is nothing for them to close.

## Groups

Groups are containers that hold tabs.
There are 10 color presets, and groups can be collapsed or expanded from the sidebar using the chevron.

| Action | Shortcut |
|---|---|
| New group | `Ctrl+Shift+N` |
| Close current group | `Ctrl+Shift+W` |
| Next group | `Ctrl+Shift+]` |
| Previous group | `Ctrl+Shift+[` |

Double-click a group heading in the sidebar to rename it.

## Splits

You can split a tab horizontally or vertically to lay out multiple panes.

| Action | Shortcut |
|---|---|
| Split right | `Cmd+D` |
| Split down | `Cmd+Shift+D` |
| Focus adjacent pane | `Cmd+Option+arrow` |

Focus moves by direction (left, right, up, down), which stays intuitive even with complex layouts.

Bind `toggle_split_zoom` in the Ghostty config to zoom the focused pane to the whole tab; the same key restores the layout.
See [Keybind actions](/usage/customization/#keybind-actions) for how to set it up.

## Windows

Open as many windows as you need with **File > New Window** (`Cmd+N`).

| Action | Shortcut |
|---|---|
| New window | `Cmd+N` |
| Close window | `Cmd+Shift+W` |
| Close all windows | `Cmd+Shift+Option+W` |
| Toggle full screen | `Cmd+Enter` (or `Ctrl+Cmd+F`) |

Closing the last window does not quit Calyx.
The app keeps running, and clicking the Dock icon or choosing **File > New Window** opens a fresh window.
The `goto_window:next` / `goto_window:previous` [keybind actions](/usage/customization/#keybind-actions) switch between windows.

## Session restore

When you quit Calyx, the open tabs, splits, and working directory for each tab are saved.
On the next launch, the state is restored so you can pick up where you left off.
This restores the layout with fresh shells — running processes are not preserved.
To keep the shells themselves alive across a quit or crash, see [Persistent sessions](/usage/sessions/).

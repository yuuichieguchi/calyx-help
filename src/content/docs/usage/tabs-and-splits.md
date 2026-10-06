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
In the sidebar you can also drag a tab into another group, as described under [Moving groups and tabs by dragging](#moving-groups-and-tabs-by-dragging).

Right-click a tab (or Ctrl+click it) in the tab bar or the sidebar to open its context menu: **Close Tab**, **Close Other Tabs**, **Close Tabs to the Right**, **Show All Tabs**, and **Rename Tab...**.
Every item except **Show All Tabs** acts on the tab you right-clicked, and opening the menu does not switch to that tab, so from the sidebar you can close or rename a tab in another group without leaving the one you are working in.
**Close Other Tabs** and **Close Tabs to the Right** cover the tabs in that tab's group, and are disabled when there is nothing for them to close.
**Show All Tabs** opens [Mission Map](/usage/mission-map/), which shows every pane of every tab in the window.

## Groups

Groups are containers that hold tabs.
Each group gets one of 10 color presets when it is created, and groups can be collapsed or expanded from the sidebar using the chevron.

| Action | Shortcut |
|---|---|
| New group | `Ctrl+Shift+N` |
| Close current group | `Ctrl+Shift+W` |
| Next group | `Ctrl+Shift+]` |
| Previous group | `Ctrl+Shift+[` |

Double-click a group heading in the sidebar to rename it.

Right-click a group heading in the sidebar (or Ctrl+click it) to open its context menu:

- **Close Group** closes every tab in the group and removes the group.
- **Close Other Groups** closes every other group, and is disabled when there is only one group.
- **Close Groups Below** closes every group below this one, and is disabled on the last group.
- **Rename Group...** opens the same inline editor as a double-click.
- **Color** sets the group's color to one of the 10 presets, with a checkmark on the current one.

Like the tab menu, every item acts on the group you right-clicked, and opening the menu does not switch to that group.

Closing a group asks for confirmation only when one of its diff tabs holds review comments you have not sent.
This applies to every way of closing a group, including the context menu and `Ctrl+Shift+W`.
Cancel keeps that diff tab open, so its group stays with that tab while the group's other tabs still close.

### Moving groups and tabs by dragging

With two or more groups in the window, you can rearrange groups and tabs by dragging them in the sidebar.

- Drag a group heading up or down to reorder the groups. The group moves with all of its tabs, and a collapsed group can be dragged too.
- Drag a tab to move it into another group. Dropping it between two tabs places it there. Dropping it on a group heading makes it the first tab of that group, or the last one when the group is collapsed.

An accent-colored line shows where the tab or group will land, and a heading you are about to drop a tab on gains an accent-colored border.
The order does not change until you release the mouse button.

A group whose last tab you moved away is removed.
When you move the tab that is on screen, it stays on screen and its new group becomes the current group.
Moving any other tab leaves the tab on screen as it is.
The new order is saved with the window layout (see [Session restore](#session-restore)).

Dragging is the only way to do either move: there is no shortcut, menu item, or palette command for them.
A tab cannot be dragged to another window, and the tabs of a collapsed group cannot be dragged because their rows are hidden.
Dragging in the tab bar still reorders tabs within the current group only.

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

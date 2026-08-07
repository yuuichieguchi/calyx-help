---
title: Customization
description: Theme color, Ghostty config compatibility, and Calyx-managed keys.
sidebar:
  order: 5
---

Settings is organized into four panes: **Appearance**, **Sessions**, **Agents**, and **LSP**.
The items on this page live in the Appearance pane.

## Theme color

The Liquid Glass theme color is set from Settings.
Eight presets are available, and you can also pick a custom HEX value or use the color picker.

A special **Ghostty** preset reads `background` from `~/.config/ghostty/config`.
Text color (foreground) adapts automatically:

- **Ghostty preset**: follows Ghostty's `foreground` setting
- **Other presets**: chooses white or black based on the theme color's luminance

See the [demo video](https://www.youtube.com/watch?v=cUYc7yzI_eM).

## Ghostty config compatibility

Calyx reads the Ghostty config file at `~/.config/ghostty/config`.
Most keys hot-reload on save.
`window-width` and `window-height` apply to newly created windows.
Restored windows keep their saved size.

Some keys that conflict with the Liquid Glass UI are overridden by Calyx and won't take effect.

### Calyx-managed keys

- `background-opacity`
- `background-blur`
- `background-opacity-cells`
- `font-codepoint-map`
- `foreground`

These are managed by Calyx to keep the Glass UI consistent.
The full current list is shown in Settings under **Ghostty Config Compatibility**.

## Keybind actions

`keybind` lines in the Ghostty config work in Calyx.
Alongside standard terminal actions (`new_tab`, `new_split`, `goto_split`, `goto_tab`, `toggle_fullscreen`, and so on), these app-level actions are supported:

| Action | Effect |
|---|---|
| `toggle_split_zoom` | Zoom the focused split to fill the tab; run again to restore the layout |
| `prompt_surface_title` | Open the rename editor for the focused tab |
| `set_tab_title:<title>` | Set the focused tab's title |
| `copy_title_to_clipboard` | Copy the current title to the clipboard |
| `move_tab:1` / `move_tab:-1` | Move the focused tab right or left |
| `goto_window:next` / `goto_window:previous` | Switch between Calyx windows |
| `close_all_windows` | Close all terminal windows |
| `toggle_maximize` | Toggle the window's maximized state |
| `reset_window_size` | Reset the window to its default size |
| `toggle_command_palette` | Open or close the command palette |
| `check_for_updates` | Check for Calyx updates |

For example:

```
keybind = super+shift+enter=toggle_split_zoom
keybind = super+ctrl+r=prompt_surface_title
```

## Clipboard paste confirmation

Calyx prompts before pasting potentially unsafe clipboard content.
The behavior follows Ghostty's `clipboard-paste-protection` setting.
See [Security & notifications](/usage/security/) for details.

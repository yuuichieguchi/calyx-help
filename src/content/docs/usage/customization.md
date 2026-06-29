---
title: Customization
description: Theme color, Ghostty config compatibility, and Calyx-managed keys.
sidebar:
  order: 5
---

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

Some keys that conflict with the Liquid Glass UI are overridden by Calyx and won't take effect.

### Calyx-managed keys

- `background-opacity`
- `background-blur`
- `background-opacity-cells`
- `font-codepoint-map`
- `foreground`

These are managed by Calyx to keep the Glass UI consistent.
The full current list is shown in Settings under **Ghostty Config Compatibility**.

## Clipboard paste confirmation

Calyx prompts before pasting potentially unsafe clipboard content.
The behavior follows Ghostty's `clipboard-paste-protection` setting.
See [Security & notifications](/usage/security/) for details.

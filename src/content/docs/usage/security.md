---
title: Security & notifications
description: Clipboard paste confirmation, Secure Keyboard Entry, and desktop notifications.
sidebar:
  order: 10
---

## Clipboard paste confirmation

When the clipboard contains potentially unsafe content (for instance, text with embedded newlines), Calyx asks for confirmation before pasting.
This guards against accidentally executing pasted commands.

The behavior follows Ghostty's `clipboard-paste-protection` setting.
To disable it, edit `~/.config/ghostty/config`.

## Secure Keyboard Entry

Enable **Secure Keyboard Entry** to prevent other apps from intercepting Calyx's keystrokes.
Use it when entering sensitive input such as passwords or SSH passphrases.

Toggle from the app menu.

## Desktop notifications

Calyx supports OSC 9 / 99 / 777 escape sequences and forwards notifications to macOS Notification Center.
A built-in rate limit prevents notification floods.

### Jump to unread notification tab

| Action | Shortcut |
|---|---|
| Jump to the most recent unread notification tab | `Cmd+Shift+U` |

Useful when you have many tabs open and one of them just pinged you.

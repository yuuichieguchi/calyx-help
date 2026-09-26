---
title: Security & notifications
description: Clipboard paste confirmation, Secure Keyboard Entry, and desktop notifications.
sidebar:
  order: 12
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

Even with the menu item off, Calyx turns Secure Keyboard Entry on by itself while the focused pane is at a password prompt (for example `sudo`, an `ssh` password prompt, or `read -s`), and shows a lock icon in the pane's top-right corner.
Click the icon for an explanation.
This also works in panes backed by a local [persistent session](/usage/sessions/): the session daemon notices the password prompt and tells Calyx.
Remote persistent sessions are not covered; see [Known limitations](/reference/known-limitations/).

## Desktop notifications

Calyx supports OSC 9 / 99 / 777 escape sequences and forwards notifications to macOS Notification Center.
A built-in rate limit prevents notification floods.

### Jump to unread notification tab

| Action | Shortcut |
|---|---|
| Jump to the most recent unread notification tab | `Cmd+Shift+U` |

Useful when you have many tabs open and one of them just pinged you.

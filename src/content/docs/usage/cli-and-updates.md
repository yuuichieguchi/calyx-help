---
title: CLI & auto-updates
description: Installing the calyx CLI and the Sparkle-based auto-update system.
sidebar:
  order: 9
---

## The `calyx` CLI

The `calyx` CLI ships inside `Calyx.app/Contents/Resources/bin/calyx`.
It provides browser scripting (`calyx browser ...`) and helpers for opening tabs from outside the app.

### Install into PATH

Run **Install CLI to PATH** from the command palette (`Cmd+Shift+P`).
A symlink is created at `/usr/local/bin/calyx` (or similar), making `calyx` available from any terminal.

Run `calyx --help` to see the available subcommands.

### Open from Finder

Calyx registers an NSServices entry, so right-clicking a folder or text file in Finder shows **Open in Calyx**.

## The `calyx-session` CLI

Persistent sessions are managed by a second bundled binary, `calyx-session` (`Calyx.app/Contents/Resources/bin/calyx-session`).
It is on `PATH` inside Calyx terminals and provides subcommands such as `ls`, `attach`, `new`, `kill`, `history`, and `remote-install`.
See [Persistent sessions](/usage/sessions/) for how they are used.

## Auto-update

The directly-downloaded build (installed via `.zip`) checks for updates via Sparkle.

- Appcast URL: `https://yuuichieguchi.github.io/Calyx/appcast.xml`
- Updates are verified against a public key signature

### When updates happen

Sparkle checks periodically. When a new version is available, you'll see a notification inside the window from which you can apply the update.

### If you installed via Homebrew

Homebrew installs do not use Sparkle. Update through Homebrew instead:

```bash
brew upgrade --cask calyx
```

Stick with one channel — Homebrew or direct download — to avoid mixed installs.

## Checking your version and getting help

Choose **About Calyx** from the app menu to see which build you are running.
The window shows the version, the build number, and the git commit the build was made from.
Click the commit hash to open that commit on GitHub, which pins down the exact build when you report an issue.
A build made outside a git checkout has no commit row.
You can select and copy the version and build number.
**Docs** opens this help center, and **GitHub** opens the Calyx repository.
Press `Esc` or `Cmd+W` to close the window.

**Help → Calyx Help** (`Cmd+?`) opens this help center in your default browser.
macOS also adds its own search field at the top of the Help menu.

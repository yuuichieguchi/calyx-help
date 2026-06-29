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

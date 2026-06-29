---
title: Getting Started
description: Install Calyx and walk through the first launch.
sidebar:
  order: 1
---

Calyx is a native terminal for macOS 26 (Tahoe) and later.
It runs libghostty on Metal under a Liquid Glass UI.

## Requirements

- macOS 26 Tahoe or later
- Universal binary (Apple Silicon and Intel)

## Install

### Homebrew

```bash
brew tap yuuichieguchi/calyx
brew install --cask calyx
```

Update with `brew upgrade --cask calyx`.

### Manual `.zip` install

1. Download `Calyx.zip` from the [latest release](https://github.com/yuuichieguchi/Calyx/releases/latest).
2. Double-click to unzip.
3. Drag `Calyx.app` into `/Applications`.

The manual build checks for updates via Sparkle. The Homebrew install updates through `brew upgrade`.

## First launch

1. Launch from Launchpad or `/Applications/Calyx.app`.
2. macOS prompts you for permissions (folders, notifications) the first time Calyx touches them. Grant only what you intend to use.
3. Press `Cmd+Shift+P` to open the command palette. Every major action is reachable from here.

## Install the CLI (optional)

To call the `calyx` CLI (used for browser scripting and `open`-style helpers) from any terminal, run **Install CLI to PATH** from the command palette.
The CLI binary ships inside `Calyx.app/Contents/Resources/bin/`; the command symlinks it into `/usr/local/bin/calyx` or similar.

## What's next

- [Usage overview](/en/usage/) — feature-by-feature guides
- [Keyboard shortcuts](/en/reference/shortcuts/) — the cheatsheet

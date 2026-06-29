---
title: Browser tabs and automation
description: WKWebView-based browser tabs and the calyx browser CLI.
sidebar:
  order: 6
---

Calyx can open browser tabs alongside terminal tabs.
The browser is built on WKWebView and comes with a CLI for AI agents to control.

## Browser tab properties

- Supports http and https only
- Non-persistent storage (cookies and local storage are discarded when the tab closes)
- Popup windows are blocked

The design optimizes for quick reference and automation rather than as a general-purpose browser.

## `calyx browser` CLI

The `calyx browser` subcommands let you control browser tabs from the CLI.
No enable step is required — the browser server starts automatically with Calyx.

### Connection

- Listens on `localhost:41840`
- Connection info written to `~/.config/calyx/browser.json`

### Selected commands

```bash
calyx browser list                         # List browser tabs
calyx browser snapshot --tab-id <id>       # Accessibility tree with element refs
calyx browser get-text h1 --tab-id <id>    # Get element text
calyx browser click a --tab-id <id>        # Click element
calyx browser fill input --value "text"    # Fill an input
calyx browser eval 'document.title'        # Run JavaScript
calyx browser screenshot                   # Save a screenshot to a temp file
calyx browser wait --selector ".loaded"    # Wait for a condition
calyx browser get-attribute a href         # Get element attribute
calyx browser get-links                    # JSON list of all links
calyx browser get-inputs                   # JSON list of all inputs
calyx browser is-visible '#sidebar'        # Check visibility
calyx browser hover '#menu-item'           # Hover
calyx browser scroll down --amount 500     # Scroll
```

There are 25 subcommands total. Run `calyx browser --help` for the full list.

## Intended use

The browser is designed primarily for AI agents (Claude Code, Codex CLI, etc.) automating UI verification.
It's optimized for an agent loop rather than human browsing.

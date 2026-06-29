---
title: Git source control
description: Sidebar Changes view, commit graph, and inline diff review comments.
sidebar:
  order: 8
---

Calyx's sidebar includes a built-in Git view of the current repository.
You can review changes and leave comments without leaving the terminal.

## Changes view

The Changes tab shows three things:

- **Working tree**: staged, unstaged, and untracked files
- **Commit graph**: branch-visualized commit history
- **Inline diff viewer**: per-line diff for the selected file

## Review comments

Click the gutter `+` button next to a diff line to add an inline comment.
You can add multiple comments and then click **Submit Review** to send them straight to an AI agent's terminal tab.

### Targets

- Claude Code
- Codex CLI
- OpenCode
- Hermes

The review is delivered as a message inside the agent's conversation, ready to be taken up as a fix task.

See the [demo video](https://www.youtube.com/watch?v=_O2Lr4oFf4c).

## Intended workflow

Pull in a branch to review, scan the diff, mark spots that need work, and hand the batch off to an agent to fix.
Review comments are not sent to GitHub or any external service.

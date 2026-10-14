---
title: Worktree tasks
description: Give an agent its own branch and linked worktree, launch it there, and merge or discard the result.
sidebar:
  order: 12
---

A worktree task gives an agent a branch and a working directory of its own, so it can work without touching the files in your checkout.
Calyx creates the branch and a linked Git worktree, opens a tab with the agent already running in that directory, and later merges the branch into its base or discards it.

## Creating a task

Open the **New Worktree Task** sheet in any of these ways:

- **File → New Worktree Task…**, or `Cmd+Shift+N`
- **New Worktree Task…** in the [command palette](/usage/command-palette/)
- The **+** button in the header of the Changes sidebar

The sheet works on the current directory of the focused pane.
If that directory is not inside a Git repository, the sheet says **Not inside a git repository** and **Create & Launch** stays disabled.

The sheet has these fields:

- **Branch**: the name of the new branch, for example `task/my-change`. It must be a valid Git branch name that does not exist yet.
- **Base**: the local branch the task starts from. It defaults to the branch checked out in the pane's directory.
- **Agent**: Claude Code, Codex, OpenCode, Hermes Agent, Grok, or pi.
- **Arguments**: extra command-line options for the agent, for example `--model opus --effort high`. They are split into words the way a shell would, but no shell runs, so `$`, `~`, globs, and `;` reach the agent as they are. An unterminated quote or a trailing backslash disables **Create & Launch**. Arguments are not remembered between tasks.
- **Initial prompt**: optional text handed to the agent as its first prompt. Hermes Agent starts without one, so the field is disabled for it.

**Create & Launch** (Return) creates the worktree under `~/.calyx/worktrees/<repository>/<branch>` (slashes in the branch name become hyphens), records the base branch in the repository's Git config as `branch.<branch>.calyxbase`, and opens a new tab in the current group.
If the directory already exists or the base branch is missing, nothing is created and the sheet shows the error.
**Cancel** (Escape) closes the sheet, also while the prompt editor has focus.

## How the agent runs

The agent is the pane's own process rather than a command typed into a shell, so the tab is the agent from its first line.
With [persistent sessions](/usage/sessions/) enabled, it runs inside a persistent session.
Calyx starts it through your login shell so that `PATH` changes from `.zshrc` and similar files apply; when the login shell is csh, tcsh, fish, or nu, `/bin/zsh` is used instead.

The command line is the agent's CLI, then your arguments, then the prompt as a single argument.
OpenCode receives the prompt as `--prompt`, and Hermes Agent receives none.
For Claude Code, Codex, and Grok, `--` separates the prompt from the options when arguments are given or the prompt begins with `-`; pi gets the `--` only when the prompt begins with `-`.

When the agent exits, the pane continues as an interactive shell in the worktree directory, so you can inspect the result or run the agent again.
If the agent removed the worktree, the shell starts in the repository the task was created from.
When that shell exits, the tab closes.

The pane's [Mission Map](/usage/mission-map/) card shows a **Task → \<base>** row from the moment the tab opens.

## Merging or discarding a task

Both the Changes sidebar and Mission Map offer the two actions:

- In the Changes sidebar, the section header of a task worktree carries a checklist icon (tooltip **Worktree Task → \<base>**). Its menu has **Merge into \<base>** and **Discard**.
- On the Mission Map card, the **Task → \<base>** row has **Merge** and **Discard** buttons.

Only linked worktrees that Calyx created as tasks (those whose branch has the `calyxbase` entry) get these actions.
Other worktrees appear in the sidebar as before.

**Merge** runs `git merge --no-ff` of the task branch in the worktree where the base branch is checked out.
It is refused when the task worktree has uncommitted changes (untracked files count), when the base branch is not checked out in any worktree, or when a merge is already in progress there.
A merge that fails, for example on conflicts, is aborted and Git's message is shown, with the task left in place.
After a successful merge, Calyx removes the worktree, deletes the branch, and closes every pane whose directory is inside the worktree, in every window, ending their persistent sessions.
If a window would be left without panes, Calyx first opens a new tab in the base worktree.

**Discard** asks for confirmation, then removes the worktree together with its uncommitted changes, force-deletes the branch, and closes the panes the same way.

Errors from either action appear in an alert titled **Worktree Task**.
Starting a second merge or discard on a task that is still being processed is reported as already in progress.

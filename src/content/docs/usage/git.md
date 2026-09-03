---
title: Git source control
description: Sidebar Changes view, commit graph, and inline diff review comments.
sidebar:
  order: 8
---

Calyx's sidebar includes a built-in Git view of the repositories open in the window.
You can review changes and leave comments without leaving the terminal.

## Changes view

The Changes tab lists every repository the window can reach, as one collapsible section each.
Calyx reads the working directory of every terminal tab in the window, and for each repository it finds there it also adds that repository's other linked worktrees, any superproject above it, and its checked-out submodules.

A section header shows the directory's name, the branch it is on (or a short commit hash when the branch is unknown), a badge counting its changed files, and a filter button that chooses which references the commit graph covers.
An icon marks what kind of section it is: a folder for a repository, a branch for a linked worktree, a box for a submodule.
Sections are grouped by the repository they belong to rather than nested inside it, and within a group they run in order: the repository, then its linked worktrees, then its submodules.
So a submodule gets a section of its own, and you can review its uncommitted work without moving a pane into it.

Sections start collapsed.
The section holding the pane you are working in is expanded for you the first time it appears; collapse it and it stays collapsed.

An expanded section shows three things, scoped to that repository:

- **Working tree**: staged, unstaged, and untracked files
- **Commit graph**: branch-visualized commit history
- **Inline diff viewer**: per-line diff for the selected file

Opening a file's diff uses that section's repository, so a file inside a submodule or a second repository opens against the right one.

### Choosing which commits the graph shows

By default the commit graph uses the **Auto** scope, modelled on VSCode's: the branch you have checked out, its upstream, and the default branch of the upstream's remote (`origin` when the branch has no upstream).
Commits that exist only on other branches stay out of the graph, so what you see is the history you are working on.
On a detached HEAD, Auto shows the history of the checked-out commit.
In a repository with no commits yet, the graph is empty.

Click the filter button in a section header to change the scope for that repository:

- **Auto**: the default described above
- **All references**: every branch, remote branch, and tag, as `git log --all` shows them
- **Branches**, **Remotes**, **Tags**: only the history of the references you pick

You can pick more than one reference.
Picking one while on Auto or All references narrows the graph to that reference, picking another adds it, and picking a selected one again removes it.
Removing the last one returns the scope to Auto.

The button is drawn in the accent color while a scope other than Auto is active.
Calyx remembers the choice per repository, so it applies again the next time that repository appears in a window.
A remembered reference that has since been deleted is dropped, and when none of the remembered references remain the scope returns to Auto.

Each commit row shows a badge for every branch and tag that points at that commit.

### Refreshing

Each section watches its own repository and refreshes on its own.
Committing in one worktree also updates the history shown for the other worktrees that share it.

A refresh never blanks the view.
The file list and commit graph stay on screen and update in place, and only a refresh you triggered yourself replaces the header's refresh button with a spinner.

A refresh that fails leaves the contents on screen and adds a warning icon whose tooltip carries the error: next to the **Changes** title when finding the repositories itself failed, and on any individual section whose own refresh failed.
A repository Calyx could not reach is kept in the list rather than dropped, and a section that failed to load offers a **Retry** button.
The next successful refresh clears the warning.

## Review comments

Click the gutter `+` button next to a diff line to add an inline comment.
You can add multiple comments and then click **Submit Review** to send them straight to an AI agent's terminal tab.

### Targets

- Claude Code
- Codex CLI
- OpenCode
- Hermes
- Grok

The review is delivered as a message inside the agent's conversation, ready to be taken up as a fix task.

See the [demo video](https://www.youtube.com/watch?v=_O2Lr4oFf4c).

## Intended workflow

Pull in a branch to review, scan the diff, mark spots that need work, and hand the batch off to an agent to fix.
Review comments are not sent to GitHub or any external service.

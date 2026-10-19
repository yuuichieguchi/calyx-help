---
title: Git source control
description: Sidebar Changes view, commit graph, the diff view and its preview tab, and inline diff review comments.
sidebar:
  order: 11
---

Calyx's sidebar includes a built-in Git view of the repositories open in the window.
You can review changes and leave comments without leaving the terminal.

## Changes view

The Changes tab lists every repository the window can reach, as one collapsible section each.
Calyx reads the working directory of every terminal tab in the window, and for each repository it finds there it also adds that repository's other linked worktrees, any superproject above it, and its checked-out submodules.

A section header shows the directory's name, the branch it is on (or a short commit hash when the branch is unknown), a badge counting its changed files, and a filter button that chooses which references the commit graph covers.
An icon marks what kind of section it is: a folder for a repository, a branch for a linked worktree, a box for a submodule.
A linked worktree that Calyx created as a [worktree task](/usage/worktree-tasks/) also carries a checklist icon whose menu merges or discards the task, and the **+** button next to the **Changes** title opens the sheet that creates one.
Sections are grouped by the repository they belong to rather than nested inside it, and within a group they run in order: the repository, then its linked worktrees, then its submodules.
So a submodule gets a section of its own, and you can review its uncommitted work without moving a pane into it.

Sections start collapsed.
The section holding the pane you are working in is expanded for you the first time it appears; collapse it and it stays collapsed.

An expanded section shows two things, scoped to that repository:

- **Working tree**: staged, unstaged, and untracked files
- **Commit graph**: branch-visualized commit history

Clicking a file in either one opens its diff in a tab, described under [The diff view](#the-diff-view).
Opening a file's diff uses that section's repository, so a file inside a submodule or a second repository opens against the right one.

### Opening a diff in a preview tab

A single click on a file (staged, unstaged, untracked, or inside an expanded commit) opens its diff in the group's preview tab, the way VS Code's preview editor does.
The tab's title is shown in italic.
Each group has at most one preview tab: the next single click opens the new file in the same tab, and if the file's diff is already open in a tab of the active group, that tab is activated instead.

To keep a diff tab, do any of the following:

- Double-click the file in the Changes sidebar.
- Double-click the preview tab in the tab bar or the sidebar.
- Choose **Keep Open** in the tab's context menu (shown for preview tabs only), or run **Keep Tab Open** from the command palette.
- Add a review comment to the diff.

A kept tab is an ordinary diff tab, and the next single click opens a new preview tab.

**Open diffs in a preview tab**, under **Changes** in the **Appearance** pane of Settings, is on by default.
Turn it off to have every click open a diff tab of its own.

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

The graph loads commits a page at a time and requests the next page shortly before you scroll to the end of the loaded ones, so a long history scrolls through without pausing at each page.

### Refreshing

Each section watches its own repository and refreshes on its own.
Committing in one worktree also updates the history shown for the other worktrees that share it.

A refresh never blanks the view.
The file list and commit graph stay on screen and update in place, and only a refresh you triggered yourself replaces the header's refresh button with a spinner.

A refresh that fails leaves the contents on screen and adds a warning icon whose tooltip carries the error: next to the **Changes** title when finding the repositories itself failed, and on any individual section whose own refresh failed.
A repository Calyx could not reach is kept in the list rather than dropped, and a section that failed to load offers a **Retry** button.
The next successful refresh clears the warning.

## The diff view

A diff tab shows the whole file, not only the lines around each change.

Changed lines get a light red or green background.
When a deleted line is paired with an added line, the characters that actually differ get a stronger highlight, so a one-word edit stands out inside a long line.
Lines that were only added or only deleted get the line background alone.

At the right end of the diff's toolbar sit up and down chevron buttons for moving between changes and a **…** menu with the options described below.

### Choosing a layout

The diff can be laid out in three ways:

- **Inline**: one pane with two line-number columns, original and modified. Each change lists its deleted lines in red, then its added lines in green.
- **Side by Side**: the original file on the left and the modified file on the right, each with its own line numbers. Drag the divider between them to resize the panes, which always scroll up and down together. Where one side has no matching line, hatched rows fill the gap so the two sides stay level.
- **Automatic**: side by side while the diff area is wider than 900 points, inline at 900 points or narrower. This is the default. The layout switches as you resize the window or the sidebar, and the line at the top of the view stays in place.

Choose a layout from the **Diff View** submenu of the **…** menu, from **Diff layout** under **Changes** in the **Appearance** pane of Settings, or with the **Diff View: Automatic**, **Diff View: Inline**, and **Diff View: Side by Side** commands in the command palette.
**Toggle Inline View** in the command palette switches to Side by Side from Inline and to Inline from either of the other two.
The choice applies to every diff tab.

### Collapsing unchanged regions

Turn on **Collapse Unchanged Regions** in the **…** menu, or **Collapse unchanged regions** in Settings, to hide long runs of unchanged lines.
Calyx keeps three lines next to each change and replaces the rest of the run with a gray row that reads "⋯ N unchanged lines ⋯", as long as that hides at least three lines.
A run that holds a review comment is never collapsed.
The option is off by default.

The gutter of a collapsed row has three buttons:

- ▲ shows 20 more lines at the top of the hidden run.
- ▼ shows 20 more lines at its bottom.
- ↕ shows the whole run. Clicking the row's label does the same.

The command palette also has **Toggle Collapse Unchanged Regions**, **Collapse All Unchanged Regions**, and **Show All Unchanged Regions**.

### Ignoring leading and trailing whitespace

**Ignore Trim Whitespace** is on by default.
While it is on, lines that differ only in leading or trailing whitespace count as unchanged, so re-indented lines and stripped trailing spaces do not show up as changes.
A file whose only changes are of that kind shows no changes at all.

Turn it off in the **…** menu, with **Ignore trim whitespace** in Settings, or with **Toggle Ignore Trim Whitespace** in the command palette.
Every open diff tab is recomputed in place when you change it.

### Moving between changes

When a diff tab opens, or a tab starts showing a different file, the view scrolls so that the first change is in the middle.
A refresh of the same file keeps the scroll position.

To jump from one change to another:

- **Go to Next Change**: `Option+F5`, the down chevron in the diff's toolbar, the **View** menu, or the command palette
- **Go to Previous Change**: `Option+Shift+F5`, the up chevron, the **View** menu, or the command palette

Each jump centers the change it lands on.
Navigation wraps around: going forward from the last change returns to the first, and going back from the first change moves to the last.
On a Mac keyboard whose top row controls brightness and volume, hold `Fn` with `F5` unless **Use F1, F2, etc. keys as standard function keys** is turned on in the macOS keyboard settings.

### Overview ruler

A narrow strip along the right edge of the diff maps the whole file: deleted lines are marked in red on its left half and added lines in green on its right half.
A translucent slider shows which part of the file is on screen, and clicking or dragging in the strip scrolls there.
Turn the ruler off with **Show overview ruler** in Settings; it is on by default.

### Word wrap

Word wrap is on by default, so long lines wrap at the width of their pane instead of scrolling sideways.
The continuation rows of a wrapped line are indented to match the line, and only its first row carries the line number.
In Side by Side, each pane wraps at its own width, and the shorter side of each block gets hatched rows so the two sides stay level.

Toggle it with **View → Word Wrap** (`Option+Z`), **Word Wrap** in the **…** menu, **Word wrap** in Settings, or **Toggle Word Wrap** in the command palette.
The setting applies to every diff tab and is kept across launches.
With word wrap off, long lines scroll sideways, and in Side by Side the two panes scroll sideways together.

`Option+F5`, `Option+Shift+F5`, and `Option+Z` act on the diff only while a diff tab is active.
In any other tab the keys reach the focused pane, so a program running in the terminal still receives them.

### Selecting and finding text

Select text by dragging, double-clicking a word, or triple-clicking a line, then copy it with `Cmd+C`.
With the diff text focused, `Cmd+F` opens a find bar for that pane, and `Cmd+G` and `Cmd+Shift+G` move to the next and previous match.
In Side by Side, the search covers the pane that has focus.

### Very large diffs

- When git's output for a file is larger than 50 MB, Calyx shows the two versions without comparing them, under the banner "File too large to compare (> 50 MB)".
- When the comparison runs for 5 seconds, Calyx stops and shows the result so far, under the banner "Diff computation stopped early (5000 ms)".
- A line longer than 10,000 characters is cut off and ends in "[truncated]".

## Review comments

Hover over a line in the diff and click the `+` button that appears in the gutter to add an inline comment.
Because the diff shows the whole file, any line on screen can take a comment, in either pane of Side by Side.
A line inside a collapsed region can take one once you show it.
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

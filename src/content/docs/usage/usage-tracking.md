---
title: Usage tracking
description: Record Claude Code's own token counts per model, effort, thread, and project, and read them in the Usage window, on Mission Map cards, or from an agent.
sidebar:
  order: 10
---

Usage Tracking records how many tokens Claude Code uses, as Claude Code itself counts them.
Use it to see where the tokens of a day or a month went: which model, at which effort, in the main conversation or in subagents, and in which project.
It covers Claude Code only, and it is off by default.

Calyx shows the numbers in three places: the [Usage window](#the-usage-window), a line on each [Mission Map](/usage/mission-map/#cards) card, and the [`usage_report`](#asking-from-an-agent) tool that agents can call.

## Turning it on

1. Open Settings (`Cmd+,`) and select the **Agents** pane.
2. Turn on **Enable AI Agent IPC** if it is off. Claude Code sends its counts to the same local server that [AI Agent IPC](/usage/ai-agents/#ai-agent-ipc) runs.
3. In the **Usage Tracking** section at the bottom of the pane, turn on **Track Claude Code usage**.
4. Restart the Claude Code sessions that were already running. Claude Code reads the telemetry settings when it starts, so only sessions started while tracking is on are counted.

A status line under the switch says whether counts are arriving.
[Reception status](#reception-status) lists what it can say.

## What turning it on changes

While tracking is on, Calyx adds telemetry settings to `~/.claude/settings.json`, Claude Code's settings file for your user account.
They make Claude Code send its token counts to Calyx's server on `127.0.0.1` every 5 seconds.
That file applies to every Claude Code session on the Mac, so sessions you start outside Calyx are counted too.

Calyx writes nine entries under `env` and one top-level `otelHeadersHelper` entry:

| Entry | Value |
|---|---|
| `CLAUDE_CODE_ENABLE_TELEMETRY` | `1` |
| `OTEL_METRICS_EXPORTER` | `otlp` |
| `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL` | `http/json` |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | `http://127.0.0.1:<port>/usage/v1/metrics` |
| `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE` | `cumulative` |
| `OTEL_EXPORTER_OTLP_METRICS_COMPRESSION` | `none` |
| `OTEL_METRIC_EXPORT_INTERVAL` | `5000` |
| `OTEL_METRICS_INCLUDE_SESSION_ID` | `true` |
| `OTEL_METRICS_INCLUDE_ACCOUNT_UUID` | `false` |
| `otelHeadersHelper` | The `calyx-usage-headers` helper in `~/Library/Application Support/Calyx/bin/`, called with the server's port; it prints the token header only while the Calyx that wrote `agent-endpoint.json` is running on that port, and `{}` otherwise |

Only the metrics exporter is configured, and only with that loopback address.
The bearer token Claude Code presents to Calyx is kept in `usage-otel-credential.json`, readable by your user only, and is not written into `settings.json`.
It is renewed together with the IPC token when a Calyx restart finds its previous port taken.
Calyx 0.47.0 and earlier kept it in `usage-otel-headers.json`; that file is deleted, so a Claude Code session started under one of those versions sends no token until it is restarted.
Calyx changes nothing else in the file, and creates nothing when `~/.claude` does not exist.

If `settings.json` already holds telemetry settings of your own (any of the entries above, any other `OTEL_` variable, or an `otelHeadersHelper`), Calyx leaves the file as it is, and the status line names the entries it found.
To use Usage Tracking, remove them, then turn the switch off and on again.

### Turning it off

Turning off **Track Claude Code usage**, or **Enable AI Agent IPC**, removes the ten entries again.
The recorded usage stays, and so do the database and `usage-otel-credential.json`.

Quitting Calyx does not remove the entries.
What a tracked session uses while Calyx is not running is counted when Calyx next hears from that Claude Code process.
If the process ended before that, the tokens are added as [unreported rows](#unreported-rows).

## What is recorded

Calyx keeps the counts in a database on your Mac, `~/Library/Application Support/Calyx/usage/usage.sqlite`, readable by your user only.
It holds token counts (input, cache read, cache write, output) with the model, effort, thread, agent type, and session ID they belong to, and each session's project path.
The project is the root of the Git repository that contains the session's working directory, or the working directory itself when it is not inside a repository.
The database never holds prompts, responses, or any other conversation text.

To fill in what it did not receive, Calyx also reads the transcript file Claude Code keeps for each tracked session under `~/.claude/projects/`.
From it Calyx takes the timestamps, the working directory, and the per-model token totals Claude Code writes there, and it records the file's path.
The conversation in the file is not stored.

Nothing is deleted automatically.
The data stays until you choose **Delete Usage Data…** in the Usage window, and none of it is sent off your Mac (see the [privacy policy](/legal/privacy/)).
If Calyx cannot read the database, it moves the file aside as `usage.sqlite.corrupt-…` in the same folder and starts an empty one, and **Delete Usage Data…** does not erase the moved file.

## The Usage window

Open it with **View → Usage** in the menu bar, with `Cmd+Option+U`, or by running **Usage…** from the [command palette](/usage/command-palette/).

The table has one row for each combination of **Model**, **Effort**, **Thread**, and **Project**, with that combination's **Input**, **Cache Read**, **Cache Write**, and **Output** tokens, and a **Total** row at the bottom.
Thinking tokens are part of **Output**.
**Thread** says where the requests came from: `main` is the conversation itself, `subagent` is its subagents, and `auxiliary` is the requests Claude Code makes on the side, such as generating a session title.
A dash (`—`) in **Effort** means Claude Code reported no effort for those requests.

The controls above the table choose what it shows:

- **Period**: **Today**, **Last 7 Days** (the default), **Last 30 Days**, or **All Time**. Days are calendar days in your time zone.
- **Project**: **All Projects**, one project, or **Unattributed** for usage whose project could not be determined, such as a session whose transcript Calyx could not find.
- **Thread**: **All**, **Main**, **Subagents**, or **Auxiliary**.
- **Columns**: which of Model, Effort, Thread, Project, and Day the rows are split by. Turning one off merges the rows that differed only in it. **Day** is off to begin with, and turning it on adds one row per day.
- **Refresh**: reads the numbers again. While the window is open, it also refreshes by itself as new counts arrive.

Tokens are dated by the time Calyx received them, not the time they were used.

### Unreported rows

A row with **unreported** in the Effort column holds tokens that Claude Code counted in a tracked session but that Calyx did not receive, for example because Calyx was not running.
Calyx takes them from the totals in the session's transcript, so their model is known but their effort and thread are not.
They are dated at the end of the run they belong to, and they are left out of results filtered by thread.

### Reception status

A line under the controls, and another under the switch in Settings, says whether counts are arriving.

| Status | Meaning |
|---|---|
| `Receiving. Last export at <time>.` | Counts are arriving. |
| `Waiting for Claude Code. …` | The settings are in place, but no session has reported since Calyx started. Sessions that were running before tracking was turned on report after a restart. |
| `Setting up…` | Calyx has not finished checking the settings. |
| `Not receiving: AI Agent IPC is off.` | **Enable AI Agent IPC** is off. |
| `Not receiving: The IPC server is not running.` | The server did not start. The status line under **Enable AI Agent IPC** gives the reason. |
| `Not receiving: Claude Code's settings already contain telemetry settings (…). Calyx did not change them.` | `settings.json` holds telemetry settings of your own, named in the parentheses. |
| `Not receiving: Claude Code is not set up on this Mac (~/.claude was not found).` | `~/.claude` does not exist, so there is no settings file to add to. |
| `Not receiving: Claude Code's settings could not be updated: …` | Writing `settings.json` failed, for the reason shown. |
| `The last export (<time>) was refused: …` | Calyx rejected the latest export, for the reason shown. When the token was not accepted or the export was larger than 16 MB, restart that Claude Code session. |

While tracking is off, the window shows the recorded data under a notice with an **Open Settings** button instead of a status line.

### Deleting the data

**Delete Usage Data…** at the bottom of the window erases everything recorded, after a confirmation.
Sessions that are still running are counted from that moment on, and what they used before is not restored.

## On Mission Map cards

With tracking on, the card of a pane running Claude Code shows that session's total, for example `45.2k out · 1.2M in`.
`out` is the output tokens, and `in` is the input tokens together with cache reads and cache writes.
After you turn tracking off, the line keeps its last total until Calyx quits or you delete the usage data.
See [Cards](/usage/mission-map/#cards).

## Asking from an agent

Agents can read the same numbers with the `usage_report` tool of the `calyx-ipc` MCP server (see [AI agent integration](/usage/ai-agents/)).
Every argument is optional.

| Argument | Meaning |
|---|---|
| `group_by` | The dimensions to group by: any of `model`, `effort`, `thread`, `agent_type`, `day`, `project`, and `session`. The default is `["model", "effort"]`, and `[]` returns the totals as at most two rows, recorded and unreported. |
| `days` | Only the last N calendar days, today included, from 1 to 100000. Cannot be combined with `since` or `until`. |
| `since`, `until` | A time range in UTC, written as `YYYY-MM-DDTHH:MM:SS[.fff]Z`. `since` is inclusive and `until` is exclusive. |
| `session_id` | One Claude Code session. `"current"` is the session in the calling pane. |
| `project` | Only sessions whose project root is exactly this path. |
| `thread` | `main`, `subagent`, or `auxiliary`. |
| `limit` | The maximum number of rows, from 1 to 1000 (200 by default). |

The result lists one row per group, with its input, cache read, cache creation, and output tokens and whether it is unreported, followed by totals.
The totals cover every matching row, even when `limit` cut the list.
`agent_type` and `session` are available here but not in the Usage window.
Called while tracking is off, the tool returns an error that says to turn on Usage Tracking.

## What is not counted

- Agents other than Claude Code.
- Sessions that were already running when tracking was turned on, until you restart them.
- What a session used while tracking was off.
- A session that starts and ends while Calyx is not running.

[Known limitations](/reference/known-limitations/#claude-code-usage-totals) has the details.

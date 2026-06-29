---
title: AI エージェント連携
description: MCP サーバーによる AI Agent IPC と LSP Proxy MCP の使い方。
sidebar:
  order: 7
---

Calyx には、複数の CLI AI エージェント（Claude Code、Codex CLI、OpenCode、Hermes など）を統合するための MCP サーバーが組み込まれています。
タブやペインをまたいだエージェント同士の通信と、LSP のシンボル解析機能をエージェントから利用する機能の二つを提供します。

## AI Agent IPC

異なるタブ・ペインで動いている AI エージェントが、お互いにメッセージをやり取りできます。

### 有効化の手順

1. コマンドパレット (`Cmd+Shift+P`) で **Enable AI Agent IPC** を実行
2. 二つ以上のターミナルペインでエージェントを起動（Claude Code / Codex / OpenCode / Hermes のいずれか）
3. 各インスタンスは自動的にピアとして登録され、メッセージの送受信が可能になる

設定ファイルは、インストールされているエージェントに応じて自動的に書き込まれます。

| エージェント | 設定ファイル |
|---|---|
| Claude Code | `~/.claude.json` |
| Codex CLI | `~/.codex/config.toml` |
| OpenCode | `~/.config/opencode/opencode.json`、`AGENTS.md` |
| Hermes | `~/.hermes/config.yaml` |

設定の書き込み後、すでに起動しているエージェントは再起動して新しい MCP サーバーを読み込ませてください。

### 利用可能な MCP ツール

- `register_peer`
- `list_peers`
- `send_message`
- `broadcast`
- `receive_messages`
- `ack_messages`
- `get_peer_status`

[デモ動画](https://www.youtube.com/watch?v=Xty0ad9gGcM) で動作を確認できます。

### 無効化

コマンドパレットで **Disable AI Agent IPC** を実行します。

## LSP Proxy MCP

AI Agent IPC と同じ MCP サーバー上に、言語サーバー（LSP）の機能を公開します。
エージェントは `grep` の代わりに、シンボルを理解した結果を取得できます。

### 提供されるツール

- `lsp_hover` — シンボル上のホバー情報
- `lsp_definition` — 定義へジャンプ
- `lsp_references` — 参照箇所の列挙
- `lsp_rename` — シンボルのリネーム
- `lsp_diagnostics` — 診断（エラー・警告）の取得

ほかにも複数のツールが提供されます。

### セットアップ

1. コマンドパレットで **Enable AI Agent IPC** を実行（同じ MCP サーバーを共有するため）
2. AI エージェントを再起動するか、`calyx-ipc` MCP サーバーを再接続
3. （任意）Settings の **LSP Proxy** から、不足している言語サーバーの自動インストールを有効化

Calyx は言語サーバーをバックグラウンドで常駐させ、ディスク上のファイル変更を取り込みつつ、最初の `lsp_*` 呼び出し時に該当ワークスペース向けの言語サーバーを立ち上げます。

### 対応する言語サーバー

TypeScript、Python、Rust、Go、Swift などをサポートします。
個別の言語の自動インストール対応状況は Settings の **LSP Proxy** で確認できます。

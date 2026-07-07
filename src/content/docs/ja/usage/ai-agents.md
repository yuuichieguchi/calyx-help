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
- `receive_messages` — 返却したメッセージを受信箱から自動的に削除するため、同じメッセージが二度届くことはありません
- `get_peer_status`

[デモ動画](https://www.youtube.com/watch?v=Xty0ad9gGcM) で動作を確認できます。

### 無効化

コマンドパレットで **Disable AI Agent IPC** を実行します。

## エージェントサイドバー

サイドバーの **Agents** タブには、現在のウィンドウで動いている AI エージェントとそのステータスが一覧で並びます。

各行に次の情報が表示されます。

- ステータスドット。赤 (ユーザー入力待ち)、黄 (処理中)、緑 (待機)、青 (完了) の四色。
- 未読メッセージバッジ。エージェントの新しい出力をユーザーがまだ確認していないときに出ます。
- 最終確認時刻。

行をクリックすると、そのエージェントが動いているペインにフォーカスが移ります。

対応するのは Claude Code、Codex CLI、OpenCode、Hermes の四つです。コマンドパレットで **Enable AI Agent IPC** を実行してからペインでエージェントを起動すれば、自動的にサイドバーに並びます。

## 永続セッションでのエージェント再開

永続セッションを有効にしている場合、再接続時にそのセッションで動いていたエージェント CLI の会話再開を提案できます。
設定項目は[永続セッション](/ja/usage/sessions/)を参照してください。

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
3. （任意）Settings の **LSP** ペインから、不足している言語サーバーの自動インストールを有効化

Calyx は言語サーバーをバックグラウンドで常駐させ、ディスク上のファイル変更を取り込みつつ、最初の `lsp_*` 呼び出し時に該当ワークスペース向けの言語サーバーを立ち上げます。

### 対応する言語サーバー

TypeScript、Python、Rust、Go、Swift などをサポートします。
個別の言語の自動インストール対応状況は Settings の **LSP** ペインで確認できます。

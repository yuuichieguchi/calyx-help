---
title: トークン使用量の記録
description: Claude Code が自身で数えたトークン数をモデル、effort、スレッド、プロジェクトごとに記録し、Usage ウィンドウ、Mission Map のカード、エージェントから読めるようにします。
sidebar:
  order: 10
---

Usage Tracking は、Claude Code が使ったトークン数を、Claude Code 自身が数えたとおりに記録します。
一日や一か月のトークンが、どのモデルの、どの effort で、メインの会話とサブエージェントのどちらで、どのプロジェクトで使われたのかを確認できます。
対象は Claude Code だけで、標準ではオフです。

記録した数値は、[Usage ウィンドウ](#usage-ウィンドウ)、[Mission Map](/ja/usage/mission-map/#カード) の各カードの一行、エージェントが呼び出せる [`usage_report`](#エージェントから問い合わせる) ツールの三か所で読めます。

## 有効化の手順

1. Settings (`Cmd+,`) を開き、**Agents** ペインを選ぶ
2. **Enable AI Agent IPC** がオフならオンにする
3. ペインの一番下にある **Usage Tracking** セクションで、**Track Claude Code usage** をオンにする
4. すでに動いていた Claude Code のセッションを再起動する

Claude Code は [AI Agent IPC](/ja/usage/ai-agents/#ai-agent-ipc) と同じローカルサーバーにトークン数を送るため、Usage Tracking には AI Agent IPC が必要です。
Claude Code はテレメトリの設定を起動時に読むので、記録の対象になるのは、オンの間に開始したセッションだけです。

スイッチの下のステータス行には、トークン数が届いているかどうかが表示されます。
表示される文言は[受信の状態](#受信の状態)にまとめています。

## オンにすると変わること

オンの間、Calyx は Claude Code の利用者ごとの設定ファイル `~/.claude/settings.json` にテレメトリの設定を追加します。
この設定により、Claude Code はトークン数を 5 秒ごとに `127.0.0.1` 上の Calyx のサーバーへ送ります。
このファイルは Mac 上のすべての Claude Code セッションに適用されるため、Calyx の外で開始したセッションも記録の対象になります。

Calyx が書き込むのは、`env` の下の九つの項目と、トップレベルの `otelHeadersHelper` です。

| 項目 | 値 |
|---|---|
| `CLAUDE_CODE_ENABLE_TELEMETRY` | `1` |
| `OTEL_METRICS_EXPORTER` | `otlp` |
| `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL` | `http/json` |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | `http://127.0.0.1:<ポート>/usage/v1/metrics` |
| `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE` | `cumulative` |
| `OTEL_EXPORTER_OTLP_METRICS_COMPRESSION` | `none` |
| `OTEL_METRIC_EXPORT_INTERVAL` | `5000` |
| `OTEL_METRICS_INCLUDE_SESSION_ID` | `true` |
| `OTEL_METRICS_INCLUDE_ACCOUNT_UUID` | `false` |
| `otelHeadersHelper` | `~/Library/Application Support/Calyx/bin/` の補助スクリプト `calyx-usage-headers` をサーバーのポートを引数にして呼ぶコマンド。`agent-endpoint.json` を書いた Calyx がそのポートで動いている間だけトークンのヘッダーを出力し、それ以外は `{}` を出力する |

設定するのはメトリクスのエクスポーターだけで、送信先はこのループバックアドレスだけです。
Claude Code が Calyx に提示するベアラートークンは、利用者本人だけが読める `usage-otel-credential.json` に保存され、`settings.json` には書き込まれません。
Calyx の再起動時に前回のポートが使われていた場合は、IPC のトークンと一緒に更新されます。
Calyx 0.47.0 以前は `usage-otel-headers.json` に保存していました。
このファイルは削除されるため、それらのバージョンで始めた Claude Code のセッションは、再起動するまでトークンを送りません。
Calyx はファイルのほかの部分を変更せず、`~/.claude` が存在しないときは何も作成しません。

`settings.json` に利用者自身のテレメトリ設定（上の表のいずれかの項目、ほかの `OTEL_` 変数、`otelHeadersHelper`）がすでにある場合、Calyx はファイルを変更せず、見つけた項目の名前をステータス行に表示します。
Usage Tracking を使うには、それらを取り除いたうえで、スイッチを一度オフにしてからオンにします。

### オフにしたとき

**Track Claude Code usage** か **Enable AI Agent IPC** をオフにすると、Calyx は追加した十個の項目を取り除きます。
記録済みの使用量は残り、データベースと `usage-otel-credential.json` も残ります。

Calyx を終了しても、設定は取り除かれません。
記録対象のセッションが Calyx の停止中に使ったトークンは、Calyx がその Claude Code のプロセスから次に受信したときに加算されます。
その前にプロセスが終了していた場合は、[unreported の行](#unreported-の行)として加わります。

## 記録される内容

Calyx はトークン数を Mac 上のデータベース `~/Library/Application Support/Calyx/usage/usage.sqlite` に保存します。
このファイルは利用者本人だけが読めます。
保存されるのは、トークン数（入力、キャッシュの読み出し、キャッシュの書き込み、出力）と、それが属するモデル、effort、スレッド、エージェントの種類、セッション ID、および各セッションのプロジェクトのパスです。
プロジェクトは、セッションの作業ディレクトリを含む Git リポジトリのルートです。
リポジトリの中にない場合は、作業ディレクトリそのものがプロジェクトになります。
プロンプトや応答などの会話の本文は保存されません。

受信できなかった分を補うため、Calyx は、記録対象の各セッションについて Claude Code が `~/.claude/projects/` 以下に保存しているトランスクリプトファイルも読みます。
そこから取り出すのは、タイムスタンプ、作業ディレクトリ、Claude Code が書き込んだモデルごとのトークン合計で、あわせてファイルのパスを記録します。
ファイル内の会話は保存されません。

自動で削除されるものはありません。
データは Usage ウィンドウの **Delete Usage Data…** で消すまで残り、Mac の外には送信されません（[プライバシーポリシー](/ja/legal/privacy/)を参照）。
Calyx がデータベースを読めない場合は、そのファイルを同じフォルダの `usage.sqlite.corrupt-…` に退避し、空のデータベースで記録を続けます。
退避したファイルは **Delete Usage Data…** では消えません。

## Usage ウィンドウ

メニューバーの **View → Usage**、`Cmd+Option+U`、または[コマンドパレット](/ja/usage/command-palette/)の **Usage…** で開きます。

表は **Model**、**Effort**、**Thread**、**Project** の組み合わせごとに一行で、その組み合わせの **Input**、**Cache Read**、**Cache Write**、**Output** のトークン数が並び、最後に **Total** の行があります。
思考トークンは **Output** に含まれます。
**Thread** はリクエストの出どころを示します。
`main` は会話そのもの、`subagent` はサブエージェント、`auxiliary` はセッションのタイトル生成のように、会話とは別に Claude Code が行うリクエストです。
**Effort** の列が `—` の行は、Claude Code が effort を報告しなかったリクエストです。

表の上のコントロールで、表示する範囲を選びます。

- **Period**: **Today**、**Last 7 Days**（初期値）、**Last 30 Days**、**All Time** のいずれか。日は、利用者のタイムゾーンでの暦日で区切ります。
- **Project**: **All Projects**、特定のプロジェクト、**Unattributed** のいずれか。**Unattributed** は、トランスクリプトが見つからないセッションなど、プロジェクトを決められなかった使用量です。
- **Thread**: **All**、**Main**、**Subagents**、**Auxiliary** のいずれか。
- **Columns**: Model、Effort、Thread、Project、Day のうち、どれで行を分けるかを選びます。オフにした項目だけが異なる行は一行にまとまります。初期状態でオフの **Day** をオンにすると、日ごとに行が分かれます。
- **Refresh**: 数値を読み直します。ウィンドウを開いている間は、新しいトークン数が届いたときにも自動で更新されます。

トークンの日付は、使われた時刻ではなく、Calyx が受信した時刻で決まります。

### unreported の行

Effort の列が **unreported** の行は、記録対象のセッションで Claude Code が数えたものの、Calyx が受信できなかったトークンです。
Calyx が動いていなかった場合などに生じます。
Calyx はこの分をセッションのトランスクリプトにある合計から求めるため、モデルはわかりますが、effort とスレッドはわかりません。
日付はその実行が終わった時点になり、スレッドで絞り込んだ結果には含まれません。

### 受信の状態

コントロールの下の一行と、Settings のスイッチの下の一行に、トークン数が届いているかどうかが表示されます。

| 表示 | 意味 |
|---|---|
| `Receiving. Last export at <時刻>.` | トークン数が届いています。 |
| `Waiting for Claude Code. …` | 設定は入っていますが、Calyx の起動後にまだどのセッションからも届いていません。Usage Tracking をオンにする前から動いていたセッションは、再起動すると届くようになります。 |
| `Setting up…` | Calyx が設定の確認を終えていません。 |
| `Not receiving: AI Agent IPC is off.` | **Enable AI Agent IPC** がオフです。 |
| `Not receiving: The IPC server is not running.` | サーバーが起動していません。原因は **Enable AI Agent IPC** の下のステータス行に出ます。 |
| `Not receiving: Claude Code's settings already contain telemetry settings (…). Calyx did not change them.` | `settings.json` に利用者自身のテレメトリ設定があります。括弧の中がその項目名です。 |
| `Not receiving: Claude Code is not set up on this Mac (~/.claude was not found).` | `~/.claude` が存在しないため、設定を追加する先がありません。 |
| `Not receiving: Claude Code's settings could not be updated: …` | `settings.json` への書き込みに失敗しました。理由が続けて表示されます。 |
| `The last export (<時刻>) was refused: …` | Calyx が直近の送信を拒否しました。理由が続けて表示されます。ベアラートークンが受け付けられなかった場合と、送信が 16 MB を超えた場合は、その Claude Code セッションを再起動します。 |

Usage Tracking がオフの間は、ステータス行の代わりに **Open Settings** ボタン付きの通知が出て、記録済みのデータが表示されます。

### データの削除

ウィンドウ下部の **Delete Usage Data…** を押して確認に応じると、記録したデータがすべて消えます。
動作中のセッションはその時点から数え直され、それ以前の使用量は戻りません。

## Mission Map のカード

Usage Tracking がオンの間、Claude Code が動いているペインのカードに、そのセッションの合計が `45.2k out · 1.2M in` のような形で表示されます。
`out` は出力トークン、`in` は入力トークンにキャッシュの読み出しと書き込みを加えた数です。
Usage Tracking をオフにしたあとも、Calyx を終了するか使用量のデータを削除するまでは、最後の合計が表示されたままです。
カードのほかの表示は[カード](/ja/usage/mission-map/#カード)を参照してください。

## エージェントから問い合わせる

エージェントは、`calyx-ipc` MCP サーバーの `usage_report` ツールで同じ数値を取得できます（[AI エージェント連携](/ja/usage/ai-agents/)を参照）。
引数はすべて省略できます。

| 引数 | 意味 |
|---|---|
| `group_by` | 分類に使う項目。`model`、`effort`、`thread`、`agent_type`、`day`、`project`、`session` から選びます。既定は `["model", "effort"]` で、`[]` を渡すと、合計が記録分と unreported の最大二行で返ります。 |
| `days` | 今日を含む直近 N 日（暦日）に絞ります。1 から 100000 までです。`since` や `until` とは併用できません。 |
| `since`、`until` | UTC での期間。`YYYY-MM-DDTHH:MM:SS[.fff]Z` の形式で書きます。`since` はその時刻を含み、`until` は含みません。 |
| `session_id` | 一つの Claude Code セッションに絞ります。`"current"` は呼び出し元ペインのセッションです。 |
| `project` | プロジェクトのルートがこのパスと完全に一致するセッションに絞ります。 |
| `thread` | `main`、`subagent`、`auxiliary` のいずれか。 |
| `limit` | 返す行数の上限。1 から 1000 までで、既定は 200 です。 |

結果には、グループごとに入力、キャッシュの読み出し、キャッシュの作成、出力のトークン数と unreported かどうかが一行ずつ並び、続いて合計が付きます。
合計は、`limit` で行が切り捨てられた場合でも、条件に合うすべての行を対象にします。
`agent_type` と `session` は、Usage ウィンドウにはなく、このツールでだけ使える分類です。
Usage Tracking がオフの間に呼び出すと、オンにするよう促すエラーが返ります。

## 記録されないもの

- Claude Code 以外のエージェント
- Usage Tracking をオンにする前から動いていたセッション（再起動するまで）
- Usage Tracking がオフの間に使われたトークン
- Calyx が動いていない間に開始して終了したセッション

詳細は[既知の制約](/ja/reference/known-limitations/#claude-code-の使用量の合計)にあります。

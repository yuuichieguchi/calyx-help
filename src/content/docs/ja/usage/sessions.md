---
title: 永続セッション
description: 終了やクラッシュ後もシェルを維持するデーモン方式のセッション、Session Browser、SSH 経由のリモートセッション。
sidebar:
  order: 11
---

永続セッションは、シェルを Calyx 本体とは別のローカルデーモン（`calyx-session`）に持たせる仕組みです。
Calyx を終了したりクラッシュしたりしてもシェルのプロセスは生き残り、あとから再接続して続きを操作できます。

[レイアウトの自動復元](/ja/usage/tabs-and-splits/#セッションの自動復元)がタブ構成、スプリット、作業ディレクトリを復元して新しいシェルを起動するのに対し、永続セッションはシェルそのものを維持します。

## 有効化

Settings の **Sessions** ペインで **Enable persistent sessions** をオンにします。
標準ではオフで、オンにしたあとに作られたペインから永続セッションになります。
すでに永続セッションを持つペインは、トグルを戻しても影響を受けません。

## 終了と再開

永続セッションが動いている状態で Calyx を終了しようとすると、確認ダイアログが表示されます。
そのまま終了すると、セッションは切り離されてバックグラウンドで動き続けます。
次回起動時に、各ペインが元のセッションへ再接続されます。

自動復元が行われなかった場合や失敗した場合は、ウィンドウ上部に「Your previous session was preserved.」というリカバリーバーが表示され、**Restore** で復元、**Dismiss** で破棄を選べます。
コマンドパレットの **Recover Previous Session** からも同じ復元を実行できます。

## Session Browser

**View > Session Browser**（`Cmd+Shift+B`）またはコマンドパレットの **Session Browser…** で開きます。
デーモンが管理しているセッションが、ウィンドウや起動をまたいで一覧表示されます。
どのウィンドウにも接続されていないセッションには **Detached** バッジが付きます。

- **Attach**: セッションを新しいタブとして開きます。タブ名はセッションの作業ディレクトリから付きます。
- **Kill**: セッションを終了します。

フォーカス中のペインに対しては、コマンドパレットから **Detach Session**（セッションを動かしたままペインを切り離す）と **Kill Session** も実行できます。

## リモートセッション

SSH で接続できるホスト上にも永続セッションを作れます。

1. 対象ホストに一度だけデーモンを配備します。Calyx のターミナルで次を実行します。

   ```bash
   calyx-session remote-install <host>
   ```

   同梱の `calyx-session` バイナリが `ssh` 経由でリモートの `~/.calyx/bin/` にコピーされます。

2. Session Browser を開くか、コマンドパレットで **New Remote Session…** を実行してホストを選びます。
   ホスト候補は `~/.ssh/config` から読み取られます。

通信はすべて利用者が開始する `ssh` であり、デーモンが自発的にネットワーク接続を張ることはありません。

## 履歴のディスク保存

永続セッションの出力履歴は、標準ではデーモンのメモリ上にだけ保持されます。
Settings の **Sessions** ペインで **Persist session history to disk** をオンにすると、履歴が `~/.calyx/state/history/<セッション ID>.raw` に書き込まれます（10 MB でローテーション）。
ターミナル出力をディスクに書き出す設定のため、標準ではオフになっています。

## エージェント CLI の再開

セッション内で Claude Code などのエージェント CLI が動いていた場合、再接続時に会話の再開を提案できます。
Settings の **Sessions** ペインで **Offer to resume agent CLI conversations** をオンにします。
**Auto-execute resume (skip confirmation)** もオンにすると、確認なしで再開コマンドが送信されます。

## `calyx-session` CLI

デーモンには CLI が付属し、Calyx 内のターミナルでは PATH が通っています。
`calyx-session ls`、`attach`、`new`、`kill`、`history`、`remote-install` などのサブコマンドがあります。
上記の操作はすべて GUI から行えるため、CLI はスクリプト化したい場合に使います。

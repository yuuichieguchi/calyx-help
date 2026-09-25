---
title: CLI と自動アップデート
description: calyx CLI のインストール、Sparkle ベースの自動アップデート。
sidebar:
  order: 11
---

## `calyx` CLI

`calyx` CLI は、`Calyx.app/Contents/Resources/bin/calyx` に同梱されています。
ブラウザ自動化（`calyx browser ...`）や、外部からタブを開く操作などを提供します。

### PATH へのインストール

コマンドパレット (`Cmd+Shift+P`) で **Install CLI to PATH** を実行すると、`/usr/local/bin/calyx` などへのシンボリックリンクが作られ、任意のターミナルから `calyx` コマンドが使えるようになります。

`calyx --help` で利用可能なサブコマンドの一覧を確認できます。

### Finder からファイルを開く

Calyx は Info.plist に NSServices を登録しているため、Finder の右クリックメニューに **Open in Calyx** が出ます。
フォルダや テキストファイルを Calyx で開くショートカットになります。

## `calyx-session` CLI

永続セッションは、もう一つの同梱バイナリ `calyx-session`（`Calyx.app/Contents/Resources/bin/calyx-session`）が管理します。
Calyx 内のターミナルでは PATH が通っており、`ls`、`attach`、`new`、`kill`、`history`、`remote-install` などのサブコマンドを提供します。
使い方は[永続セッション](/ja/usage/sessions/)を参照してください。

## 自動アップデート

直接ダウンロード版（`.zip` 経由でインストールしたもの）は、Sparkle が更新を確認します。

- Appcast URL: `https://yuuichieguchi.github.io/Calyx/appcast.xml`
- 公開鍵による署名検証あり（不正な配布物を排除）

### 更新のタイミング

Sparkle が自動で更新の有無を定期チェックします。
新しいバージョンがある場合は、ウィンドウ内に通知が出るので、そこから更新を進められます。

### Homebrew でインストールした場合

Homebrew で入れた場合は Sparkle ではなく `brew upgrade` 経由で更新します。

```bash
brew upgrade --cask calyx
```

混在を避けるため、Homebrew 版と直接ダウンロード版は片方に揃えて運用することをおすすめします。

## バージョンの確認とヘルプ

実行中のビルドを確かめるには、アプリケーションメニューから **About Calyx** を選びます。
ウィンドウには、バージョン、ビルド番号、ビルド元の git コミットが表示されます。
コミットのハッシュをクリックすると、GitHub でそのコミットが開きます。
不具合を報告するときは、これでビルドを正確に特定できます。
git のチェックアウトの外でビルドしたものには、コミットの行が出ません。
バージョンとビルド番号は、選択してコピーできます。
**Docs** はこのヘルプセンターを、**GitHub** は Calyx のリポジトリを開きます。
ウィンドウは `Esc` か `Cmd+W` で閉じます。

**Help** メニューの **Calyx Help**（`Cmd+?`）は、このヘルプセンターを既定のブラウザで開きます。
Help メニューの先頭には、macOS が用意する検索欄も表示されます。

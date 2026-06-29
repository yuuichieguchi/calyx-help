---
title: CLI と自動アップデート
description: calyx CLI のインストール、Sparkle ベースの自動アップデート。
sidebar:
  order: 9
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

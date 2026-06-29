---
title: はじめに
description: Calyx のインストール方法と初回起動の手順。
sidebar:
  order: 1
---

Calyx は macOS 26 (Tahoe) 以降向けのネイティブターミナルです。
libghostty を Metal GPU で動かしつつ、Liquid Glass の UI でラップしています。

## 動作環境

- macOS 26 Tahoe 以降
- Apple Silicon と Intel の両方をサポート（ユニバーサルバイナリ）

## インストール

### Homebrew でインストールする

```bash
brew tap yuuichieguchi/calyx
brew install --cask calyx
```

更新は `brew upgrade --cask calyx` で行います。

### `.zip` から手動でインストールする

1. [最新リリース](https://github.com/yuuichieguchi/Calyx/releases/latest) から `Calyx.zip` をダウンロード
2. ダブルクリックで解凍
3. `Calyx.app` を `/Applications` にドラッグ

手動インストール版は Sparkle で自動更新を確認します（Homebrew 版は `brew upgrade` 経由になります）。

## 初回起動

1. Launchpad または `/Applications/Calyx.app` から起動します。
2. はじめてアクセスする系統のリソース（フォルダ、通知など）には macOS の権限ダイアログが表示されます。利用したい機能の範囲で許可してください。
3. 起動直後の画面で `Cmd+Shift+P` を押すとコマンドパレットが開きます。ここから主要な操作にアクセスできます。

## CLI を PATH に通す（任意）

`calyx` CLI（ブラウザ自動化や `open` コマンドを提供）をターミナルから使えるようにするには、コマンドパレットで **Install CLI to PATH** を実行します。
CLI 本体は `Calyx.app/Contents/Resources/bin/` に同梱されており、`/usr/local/bin/calyx` などにシンボリックリンクが作られます。

## 次に読むもの

- [使い方の概要](/ja/usage/) — 機能別のガイド
- [ショートカット一覧](/ja/reference/shortcuts/) — キーボード操作の早見表

---
title: ブラウザタブと自動化
description: WKWebView ベースのブラウザタブと、calyx browser CLI による自動化。
sidebar:
  order: 6
---

Calyx は、ターミナルタブと同じ並びにブラウザタブを開けます。
WKWebView を使った軽量なブラウザで、AI エージェントから操作するための CLI も用意されています。

## ブラウザタブの仕様

- 対応プロトコルは http / https のみ
- ストレージは非永続（タブを閉じると Cookie やローカルストレージは破棄）
- ポップアップウィンドウはブロック

開発作業中に確認用のページを開きつつ、ターミナル作業を中断せずに済むよう設計されています。

## `calyx browser` CLI

`calyx browser` 系のコマンドで、ブラウザタブを CLI から操作できます。
事前の有効化は不要で、ブラウザサーバーは Calyx 起動時に自動で立ち上がります。

### 接続情報

- リッスンアドレス: `localhost:41840`
- 接続情報ファイル: `~/.config/calyx/browser.json`

### 利用可能なコマンド（抜粋）

```bash
calyx browser list                         # ブラウザタブの一覧
calyx browser snapshot --tab-id <id>       # 要素参照付きのアクセシビリティツリー
calyx browser get-text h1 --tab-id <id>    # 要素のテキストを取得
calyx browser click a --tab-id <id>        # 要素をクリック
calyx browser fill input --value "text"    # 入力欄に値を入れる
calyx browser eval 'document.title'        # JavaScript を実行
calyx browser screenshot                   # 一時ファイルにスクリーンショット
calyx browser wait --selector ".loaded"    # 条件を待つ
calyx browser get-attribute a href         # 要素属性を取得
calyx browser get-links                    # 全リンクの JSON
calyx browser get-inputs                   # 全入力欄の JSON
calyx browser is-visible '#sidebar'        # 表示状態を取得
calyx browser hover '#menu-item'           # ホバー
calyx browser scroll down --amount 500     # スクロール
```

合計 25 個のサブコマンドが用意されています。
全コマンドの一覧は `calyx browser --help` で確認できます。

## 想定する用途

このブラウザ機能は、Claude Code や Codex CLI のような AI エージェントが、UI を伴うアプリケーションの動作確認を自動化する用途を主に想定しています。
人手でのウェブブラウジングよりも、エージェントの実行ループからの利用に最適化されています。

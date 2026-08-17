---
title: 既知の制限
description: 現時点で把握している不具合や仕様上の制約。
sidebar:
  order: 3
---

## カーソルクリック移動と全角文字

全角文字（日本語など）を含む行では、クリックした位置とカーソルが移動する位置がずれることがあります。

これは Calyx 固有の問題ではなく、Ghostty の cursor-click-to-move が、クリック座標を「ターミナルセル単位の矢印キー入力」に変換する仕組みに起因します。
全角文字が複数セルを占めるため、変換時に誤差が出ます。

回避策はありません。
全角を多用する行ではキー入力でカーソルを移動してください。

## Calyx が上書きする Ghostty 設定キー

Liquid Glass UI を成立させるため、次のキーは Calyx が上書きします。
Ghostty 設定ファイルに書いても反映されません。

- `background-opacity`
- `background-blur`
- `background-opacity-cells`
- `font-codepoint-map`
- `foreground`

現時点で Calyx が管理しているキーの完全な一覧は、Settings の **Ghostty Config Compatibility** で確認できます。

## pi だけの環境での AI Agent IPC

**Enable AI Agent IPC** は、先に MCP クライアントの設定ファイルを書き、そのあとで pi の拡張を書きます。
pi は対応エージェントのなかで唯一 MCP クライアントの設定ファイルを持たないため、対応エージェントとして pi しかインストールされていない環境では、設定する対象が一つも見つかりません。
その結果、コマンドは "No agent configs found" を返し、`~/.pi/agent/extensions/calyx.ts` を書く前に、起動した MCP サーバーを停止して終了します。

拡張を手で作成しても解決しません。
拡張には接続先の MCP サーバーが必要で、この経路ではそれが動いていないためです。
対応エージェントをもう一つインストールしてください。

## ブラウザタブの制約

- 対応プロトコルは http / https のみ
- ストレージは非永続（タブを閉じると Cookie やローカルストレージは破棄）
- ポップアップウィンドウは自動でブロック

汎用ブラウザではなく、開発・自動化向けのビューと位置づけられています。

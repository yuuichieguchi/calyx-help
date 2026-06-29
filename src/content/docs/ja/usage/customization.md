---
title: カスタマイズ
description: テーマカラーの変更、Ghostty 設定との互換性、Calyx 管理キーの説明。
sidebar:
  order: 5
---

## テーマカラー

Liquid Glass UI のテーマカラーは、Settings から変更できます。
プリセットが 8 種類用意されており、加えて任意の HEX 値やカラーピッカーで指定もできます。

特別なプリセットとして **Ghostty** があり、これは `~/.config/ghostty/config` の `background` を読み込みます。
文字色（前景色）はテーマカラーに応じて自動調整されます。

- **Ghostty プリセット**: Ghostty の `foreground` 設定に追従
- それ以外のプリセット: テーマカラーの明度に応じて白 / 黒を切り替え

[デモ動画](https://www.youtube.com/watch?v=cUYc7yzI_eM) で挙動を確認できます。

## Ghostty 設定との互換性

Calyx は Ghostty の設定ファイル `~/.config/ghostty/config` を読み込みます。
ほとんどのキーは保存時にホットリロードされます。

ただし、Liquid Glass UI に関わる一部のキーは Calyx 側で上書きします。

### Calyx が上書きするキー

- `background-opacity`
- `background-blur`
- `background-opacity-cells`
- `font-codepoint-map`
- `foreground`

これらは Glass UI の見た目と整合させるため、Calyx が独自に管理しています。
Settings の **Ghostty Config Compatibility** に、現時点で Calyx が管理しているキーの一覧が表示されます。

## クリップボード貼り付け確認

Ghostty の `clipboard-paste-protection` 設定に従って、危険な可能性のある内容を貼り付ける前に確認ダイアログを表示します。
詳細は [セキュリティと通知](/ja/usage/security/) を参照してください。

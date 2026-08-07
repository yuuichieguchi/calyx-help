---
title: カスタマイズ
description: テーマカラーの変更、Ghostty 設定との互換性、Calyx 管理キーの説明。
sidebar:
  order: 5
---

Settings のウィンドウは **Appearance**、**Sessions**、**Agents**、**LSP** の四つのペインに分かれています。
このページで扱う項目は Appearance ペインにあります。

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
`window-width` と `window-height` は新しく作るウィンドウのサイズに適用されます。
復元されたウィンドウは保存時のサイズを維持します。

ただし、Liquid Glass UI に関わる一部のキーは Calyx 側で上書きします。

### Calyx が上書きするキー

- `background-opacity`
- `background-blur`
- `background-opacity-cells`
- `font-codepoint-map`
- `foreground`

これらは Glass UI の見た目と整合させるため、Calyx が独自に管理しています。
Settings の **Ghostty Config Compatibility** に、現時点で Calyx が管理しているキーの一覧が表示されます。

## キーバインドアクション

Ghostty 設定の `keybind` 行は Calyx でも機能します。
標準的なターミナル操作（`new_tab`、`new_split`、`goto_split`、`goto_tab`、`toggle_fullscreen` など）に加えて、次のアプリレベルのアクションに対応しています。

| アクション | 効果 |
|---|---|
| `toggle_split_zoom` | フォーカス中のスプリットをタブ全体に拡大し、再実行で元に戻す |
| `prompt_surface_title` | フォーカス中のタブの名前編集を開く |
| `set_tab_title:<title>` | フォーカス中のタブ名を設定する |
| `copy_title_to_clipboard` | 現在のタイトルをクリップボードにコピーする |
| `move_tab:1` / `move_tab:-1` | フォーカス中のタブを右または左に移動する |
| `goto_window:next` / `goto_window:previous` | Calyx のウィンドウを切り替える |
| `close_all_windows` | すべてのターミナルウィンドウを閉じる |
| `toggle_maximize` | ウィンドウの最大化を切り替える |
| `reset_window_size` | ウィンドウを既定サイズに戻す |
| `toggle_command_palette` | コマンドパレットを開閉する |
| `check_for_updates` | Calyx のアップデートを確認する |

設定例:

```
keybind = super+shift+enter=toggle_split_zoom
keybind = super+ctrl+r=prompt_surface_title
```

## クリップボード貼り付け確認

Ghostty の `clipboard-paste-protection` 設定に従って、危険な可能性のある内容を貼り付ける前に確認ダイアログを表示します。
詳細は [セキュリティと通知](/ja/usage/security/) を参照してください。

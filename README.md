# Calyx Help

macOS 向けターミナルアプリ [Calyx](https://github.com/yuuichieguchi/Calyx) の公式ヘルプサイト。  
Astro + Starlight で構築し、Cloudflare Workers Static Assets にデプロイ。

## 開発コマンド

```bash
npm install       # 依存関係インストール
npm run dev       # ローカル開発サーバー起動 (http://localhost:4321)
npm run build     # 本番ビルド (./dist に出力)
npm run deploy    # Cloudflare Workers にデプロイ
```

## デプロイ設定

GitHub Actions (`main` ブランチへの push または手動実行) で自動デプロイ。  
リポジトリの Secrets に以下を設定すること:

| Secret | 説明 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API トークン (Workers デプロイ権限) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare アカウント ID |

## コンテンツ追加

`src/content/docs/` 以下に `.md` / `.mdx` ファイルを置くと自動的にサイドバーに反映される。  
日本語: ルート直下、英語: `en/` サブディレクトリ。

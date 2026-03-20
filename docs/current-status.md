# 現在の作業状況

## 概要

2026-03-20 時点の、実装進捗と未解決事項をまとめる。

## 完了済み

### 仕様整理

- 全体設計書を作成済み
- DB 設計書を作成済み
- API 仕様書を作成済み
- SPA 仕様書を作成済み
- 実装計画書を作成済み
- コーディングルールを作成済み

### 開発環境

- `Nuxt 4.1.3` を採用
- `pnpm` を採用
- `Supabase` ローカル開発環境を利用
- `.env` でローカル接続設定を管理
- `Tailwind CSS + PostCSS + Autoprefixer` の構成へ変更済み
- `i18n` は日本語のみで設定済み

### Supabase / DB

- 初期 schema migration 作成済み
  - `areas`
  - `property_types`
  - `developers`
  - `users`
  - `imports`
  - `properties`
  - `property_transactions`
- 初期 seed 作成済み
  - `Condominium/Apartment`
- 初期参照権限 migration 作成済み

### Edge Functions

- `import-transactions` Edge Function 作成済み
- 実装済み範囲:
  - UTF-16LE デコード
  - TSV パース
  - `Condominium/Apartment` のみ抽出
  - dry-run 用サマリー返却
  - スキップ理由返却

### フロント実装

- 公開画面のベースレイアウト作成済み
- 管理画面レイアウト作成済み
- CSV dry-run 画面の UI 実装済み
- CSV dry-run 結果画面の UI 実装済み
- 物件一覧画面の UI 実装済み
- 物件一覧の Supabase 参照処理を実装済み

## 現在の未完了

### 起動・表示確認

- `pnpm dev` で Nuxt サーバー起動までは確認済み
- ただし、現時点ではページ表示確認がまだ不安定
- コンポーネント自動読込のズレを疑い、主要ページは明示 import に切替中
- まだ実行時にどこかで描画が詰まっている可能性がある

### CSV import 永続化

- まだ未実装:
  - `imports` レコード作成
  - `properties` upsert
  - `property_transactions` 登録
  - 住所解決
  - 郵便番号解決
  - `areas` 自動登録

### 管理画面

- 物件一覧は取得処理を入れたが、表示確認は未完了
- 物件編集画面はまだプレースホルダ
- 管理者一覧 / メンバー一覧はまだプレースホルダ

## 直近で対応した問題

- `@nuxtjs/tailwindcss` と `Nuxt 4.1.3` の相性問題
  - Nuxt module 利用をやめ、標準 Tailwind 構成へ変更
- `app/` 構成での CSS 配置ミス
  - `app/assets/css/main.css` に移動
- `i18n` locale の配置ミス
  - `i18n/locales/ja.json` に移動
- `Pug` と Tailwind クラス記法の衝突
  - `hover:*`
  - `lg:*`
  - `tracking-[...]`
  - `bg-[...]`
  などを `class=""` または `style=""` に修正
- `import.meta.client` 使用箇所を安全なランタイム判定へ変更

## 次にやること

1. `pnpm dev` 起動後の描画エラーを特定して、ホーム画面と `/admin/properties` を安定表示させる
2. 物件一覧画面の表示確認を完了する
3. `import-transactions` に DB 永続化処理を追加する
4. 物件編集画面を実データ接続する

## 現在のローカル前提

- Supabase API URL: `http://127.0.0.1:55321`
- Supabase Studio URL: `http://127.0.0.1:55323`
- Nuxt dev は `3100` 指定で起動するが、空きポートがなければ別ポートへフォールバックする

## 備考

- `docs/coding-rules.md` に、今回踏んだ Nuxt / Pug / Tailwind / i18n の落とし穴を追記済み
- 以後は、起動確認が取れた段階でこまめにコミットする

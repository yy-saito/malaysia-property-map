# 現在の作業状況

## 概要

2026-03-20 時点の、実装進捗・現在動いている範囲・残務をまとめる。

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
- `Node 22.20.0` を `nodenv` ローカル設定で利用
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
- ローカル開発用の管理者アカウントを seed 済み
  - メール: `yusei.yusry@gmail.com`
  - パスワード: `Test@12345`
- 初期参照権限 migration 作成済み

### Edge Functions

- `import-transactions` Edge Function 作成済み
- 実装済み範囲:
  - `UTF-16LE + TSV` の読み込み
  - `UTF-8 + CSV` の読み込み
  - CSV クォート付きセルの読み込み
  - `Condominium/Apartment` のみ抽出
  - dry-run 用サマリー返却
  - スキップ理由返却
  - ローカル開発用に `verify_jwt = false` 設定済み
  - `dryRun: false` 時の本 import
    - `imports` レコード作成
    - `areas` の州レベル自動作成
    - `properties` 作成
    - `property_transactions` 作成

### 認証 / 権限

- `Supabase Auth` を利用した管理画面ログイン実装済み
- `public.users.role = admin` を前提に `/admin` 配下を保護済み
- 管理画面ログインページ実装済み
- 管理画面レイアウトにログアウト導線を実装済み

### フロント実装

- 公開画面のベースレイアウト作成済み
- 管理画面レイアウト作成済み
- `/souba`
  - ベースレイアウト実装済み
  - 地図 / フィルタ / サマリー / 一覧のダミー UI 実装済み
- `/admin`
  - ダッシュボードのベース UI 実装済み
- `/admin/import`
  - CSV dry-run 実行 UI 実装済み
- `/admin/import/result/[id]`
  - dry-run 結果表示 UI 実装済み
- `/admin/properties`
  - 物件一覧画面の UI 実装済み
  - Supabase 参照処理を実装済み
- `/admin/properties/[id]`
  - 物件編集フォームの UI 実装済み
- `/admin/admins`
  - 一覧プレースホルダ実装済み
- `/admin/members`
  - 一覧プレースホルダ実装済み

## 現在の未完了

### CSV import 本処理

- 本 import は関数側で実装済み
- 未実装:
  - 住所解決
  - 郵便番号解決
  - `postal_code_area` レベルの `areas` 自動登録
  - 既存物件更新時の補完ロジック強化
  - dry-run 結果から本 import 実行へ進む導線

### 管理画面

- ダッシュボード数値はまだ固定値
- 物件一覧は取得処理まで実装済みだが、検索条件や表示内容の詰めは未完
- 物件編集画面は UI のみで、実データ取得・保存未接続
- 管理者一覧 / メンバー一覧はプレースホルダのまま

### 公開画面

- `souba` はダミー UI 段階
- 実データ取得未接続
- 地図ライブラリ未接続
- 州 / 郵便番号エリアの表示切替未実装

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
- `import-transactions` の `401 Unauthorized`
  - ローカル開発用に `supabase/config.toml` で `verify_jwt = false` を設定
- CSV 0 件問題
  - `UTF-16LE + TSV` 固定をやめ、`UTF-8 + CSV` も読めるように修正
- 本 import 動作確認
  - `Open Transaction Data (3).csv` で `imports=1`, `properties=5`, `property_transactions=9`, `areas=1` を確認

## 次にやること

1. 住所解決と郵便番号解決を `import-transactions` に追加する
2. `postal_code_area` レベルの `areas` 登録を追加する
3. 物件編集画面を実データ取得・保存に接続する
4. 管理画面ダッシュボードの数値を実データ化する
5. `souba` 公開画面を実データに接続する

## 現在のローカル前提

- Supabase API URL: `http://127.0.0.1:55321`
- Supabase Studio URL: `http://127.0.0.1:55323`
- Nuxt dev は `3100` 指定で起動するが、空きポートがなければ別ポートへフォールバックする
- ローカル関数確認時は `supabase functions serve import-transactions --env-file .env --no-verify-jwt` を使う

## 備考

- `docs/coding-rules.md` に、今回踏んだ Nuxt / Pug / Tailwind / i18n の落とし穴を追記済み
- 最新コミット: 作業中
- 以後は、起動確認が取れた段階でこまめにコミットする

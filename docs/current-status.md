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
    - `Nominatim` による住所解決
    - `properties.resolved_address` / `properties.postal_code` 更新
    - `areas` の郵便番号エリアレベル自動作成
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
  - ダッシュボードの実データ表示を実装済み
- `/admin/import`
  - CSV dry-run 実行 UI 実装済み
- `/admin/import/result/[id]`
  - dry-run 結果表示 UI 実装済み
- `/admin/properties`
  - 物件一覧画面の UI 実装済み
  - Supabase 直結の参照処理を実装済み
- `/admin/properties/[id]`
  - 物件編集フォームの UI 実装済み
  - Supabase 直結の実データ取得・保存実装済み
- `/admin/admins`
  - 一覧プレースホルダ実装済み
- `/admin/members`
  - 一覧プレースホルダ実装済み

## 現在の未完了

### CSV import 本処理

- 本 import は関数側で実装済み
- 未実装:
  - 既存物件更新時の補完ロジック強化
  - dry-run 結果から本 import 実行へ進む導線
  - Nominatim 問い合わせ件数の最適化と再試行戦略

### 管理画面

- ダッシュボードは Supabase 直結で実データ表示済み
- 物件一覧は Supabase 直結へ寄せ直し中
- 管理画面テンプレートの `Pug` 廃止を開始済み
- 管理者一覧 / メンバー一覧はプレースホルダのまま

### 公開画面

- `souba` は実データ接続済み
- 州 / 郵便番号エリアの表示切替実装済み
- 価格帯フィルタ実装済み
- `Leaflet` による実地図表示を実装済み
- エリア一覧と地図マーカーの選択連動を実装済み
- ただし初期実装では `property_transactions` をフロント側で集計しており、大量データ時は RPC / 集計ビュー化が必要

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
- 管理画面の取得不安定
  - 一部の Nuxt server API 依存をやめ、SPA から Supabase 直結へ再統一中
  - `auth` 初期化の待ち方を軽量化
  - 管理画面テンプレートを標準 Vue テンプレートへ移行中
- ダッシュボード実データ化
  - `properties`
  - `imports`
  - `users`
  を Supabase REST 直結で集計する repository / composable を追加
- 公開 `souba` 実データ化
  - `property_transactions -> areas` を Supabase REST 直結で取得
  - 州 / 郵便番号エリア単位の集計をフロントで実装
  - `Leaflet` の円マーカーで地図表示を実装
- `import.meta.client` 使用箇所を安全なランタイム判定へ変更
- `import-transactions` の `401 Unauthorized`
  - ローカル開発用に `supabase/config.toml` で `verify_jwt = false` を設定
- CSV 0 件問題
  - `UTF-16LE + TSV` 固定をやめ、`UTF-8 + CSV` も読めるように修正
- 本 import 動作確認
  - `Open Transaction Data (3).csv` で `imports=1`, `properties=5`, `property_transactions=9`, `areas=1` を確認
- ジオコーディング動作確認
  - `Open Transaction Data (3).csv` の本 import で `6 CAPSQUARE`, `2 HAMPSHIRE` に `postal_code` と `resolved_address` を付与
  - `area_level=2` の `areas` に `50100`, `50450` が登録されることを確認
- 物件編集動作確認
  - 管理者アクセストークンで `633 RESIDENCY` の `postal_code`, `completed_year`, `note` 更新を確認
  - 更新後に `is_data_complete = true` へ変わることを確認

## 次にやること

1. `souba` 集計を RPC / 集計ビュー化するかを検討し、必要なら切り替える
2. Nominatim の再試行・キャッシュ戦略を追加する
3. 管理者一覧 / メンバー一覧を実データ接続する

## 現在のローカル前提

- Supabase API URL: `http://127.0.0.1:55321`
- Supabase Studio URL: `http://127.0.0.1:55323`
- Nuxt dev は `3100` 指定で起動するが、空きポートがなければ別ポートへフォールバックする
- ローカル関数確認時は `supabase functions serve import-transactions --env-file .env --no-verify-jwt` を使う

## 備考

- `docs/coding-rules.md` に、今回踏んだ Nuxt / Pug / Tailwind / i18n の落とし穴を追記済み
- 最新コミット: 作業中
- 以後は、起動確認が取れた段階でこまめにコミットする

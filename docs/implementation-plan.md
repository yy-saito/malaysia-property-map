# 実装計画

## 概要

本ドキュメントは、マレーシア不動産マップの初期実装を進めるための実装計画です。

前提スタック:

- Nuxt 4.1.3
- Pug
- Tailwind CSS
- Supabase
- Supabase Edge Functions / RPC
- i18n（現時点は日本語のみ）

## 実装方針

- 公開画面は [souba](https://city-development-research.vercel.app/souba) に近い操作感を優先する
- 管理画面は標準的なダッシュボード UI で実装する
- フロントはできるだけ軽量な SPA とする
- サーバー処理は Supabase 側へ寄せる

## 実装フェーズ

### Phase 1. プロジェクト基盤構築

- Nuxt 4.1.3 プロジェクト作成
- Pug 導入
- Tailwind CSS 導入
- i18n 導入
- Supabase クライアント設定
- 共通レイアウト作成
- ルーティングと基本ページ雛形作成

### Phase 2. DB / Supabase 基盤

- Supabase プロジェクト初期化
- テーブル作成
  - `areas`
  - `property_types`
  - `developers`
  - `properties`
  - `property_transactions`
  - `imports`
  - `users`
- 初期インデックス・制約設定
- RLS は初期フェーズでは最小構成とする

### Phase 3. 取り込み基盤

- CSV 取り込み Edge Function 実装
- UTF-16LE → UTF-8 変換
- TSV パース
- `Condominium/Apartment` のみ抽出
- `Scheme Name/Area` から物件キー生成
- 住所候補取得
- 郵便番号エリアへの正規化
- `is_data_complete` 更新
- `imports` 記録保存

### Phase 4. 公開相場画面

- `/souba` 実装
- 地図表示実装
- フィルタパネル実装
- 集計サマリー実装
- 一覧表示実装
- API / RPC 接続

### Phase 5. 管理画面

- `/admin/properties`
- `/admin/properties/:id`
- `/admin/import`
- `/admin/import/result/:id`
- `/admin/admins`
- `/admin/members`

### Phase 6. 認証・ロール対応の下地

- Supabase Auth 連携
- `users` テーブル同期
- `role` ベースの制御土台作成
- 初期は公開状態を維持

### Phase 7. 仕上げ

- ローディングとエラー表示調整
- モバイル最適化
- UI 微調整
- ドキュメント更新

## 優先順位

初期実装では以下を先に完成させる。

1. CSV 取り込み
2. 物件マスター編集
3. `/souba` の公開相場画面
4. 管理者・メンバー管理

## 完了条件

初期版として以下を満たせば完了とする。

- CSV を取り込める
- 物件マスターを手動補完できる
- `/souba` で州 / 郵便番号エリア単位の相場が見られる
- 管理画面から不足情報のある物件を一覧化できる

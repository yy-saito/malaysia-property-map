# API 設計書

## 概要

本ドキュメントは、マレーシア不動産マップの API 設計書です。公開サイトの相場マップと、最小構成の管理画面を支える API を対象とします。

詳細な API 仕様は以下を参照します。

- [公開｜相場マップ API](./public/api-map.md)
- [管理｜CSV 取り込み API](./admin/api-import.md)
- [管理｜物件管理 API](./admin/api-property.md)
- [管理｜管理者管理 API](./admin/api-admin-user.md)
- [管理｜メンバー管理 API](./admin/api-member.md)

## 設計方針

- フロントエンドは Nuxt 4 SPA とする
- API は Supabase Edge Functions / RPC を第一候補とする
- DB は Supabase Postgres を利用する
- 初期リリースでは認証なしで全ユーザーが全機能へアクセス可能とする
- 将来的には会員レベル別のアクセス制御を追加可能な構造にする
- 初期の相場対象データは `Property Type = Condominium/Apartment` のみとする
- 将来的なログインユーザー管理は Supabase Auth を利用し、アプリ側では `users` にロールを保持する

## API 区分

| 区分 | 主な用途 |
| ------ | ------ |
| 公開 API | 相場マップ、エリア一覧、集計表示 |
| 管理 API | CSV 取り込み、物件補完、管理者管理、メンバー管理 |

## 認証・認可方針

- 初期フェーズでは公開 API、管理 API ともに認証必須にはしない
- 初期フェーズでは全ユーザーが全機能へアクセス可能
- 将来的には会員テーブル、会員レベル、権限制御を導入できるようエンドポイント設計を保つ
- 将来的に保護が必要な API は `/api/member/*` や `/api/admin/*` に整理できる余地を残す

### 想定会員レベル

- `guest`
- `member`
- `premium`
- `admin`

## 1. 公開 API

### 1.1 相場マップ取得

- `GET /api/map/areas`
- 用途: 州または郵便番号エリア単位の価格 × 取引件数を取得する

#### 主なクエリ

- `areaLevel`
  - `1`: 州
  - `2`: 郵便番号エリア
- `stateName`
- `postalCode`
- `tenure`
- `from`
- `to`
- `priceBandMode`

#### 固定条件

- `Property Type = Condominium/Apartment` のみを集計対象とする

#### 想定レスポンス

```json
{
  "filters": {
    "areaLevel": 1,
    "stateName": null,
    "postalCode": null,
    "tenure": null,
    "from": "2024-01",
    "to": "2025-12",
    "priceBandMode": "default"
  },
  "summary": {
    "transactionCount": 1200,
    "avgPrice": 650000,
    "avgPricePerSqm": 7200,
    "areaCount": 18
  },
  "areas": [
    {
      "areaId": "uuid",
      "areaLevel": 1,
      "displayName": "Kuala Lumpur",
      "stateName": "Kuala Lumpur",
      "postalCode": null,
      "latitude": 3.139,
      "longitude": 101.687,
      "transactionCount": 120,
      "avgPrice": 780000,
      "avgPricePerSqm": 8300,
      "priceBand": "high",
      "activeYears": 4,
      "avgBuildingAge": 9,
      "avgFloorArea": 96
    }
  ]
}
```

### 1.2 相場一覧取得

- `GET /api/map/area-list`
- 用途: 地図下部または横並びで表示する一覧データを取得する

#### 主なクエリ

- `areaLevel`
- `stateName`
- `postalCode`
- `tenure`
- `from`
- `to`
- `sort`

#### 想定レスポンス項目

- エリア名
- 取引件数
- 平均価格
- 平均単価
- 取引があった年数
- 平均完成年
- 平均面積

### 1.3 フィルタ用マスタ取得

- `GET /api/map/filters`
- 用途: フィルタ UI の選択肢を返す

#### 想定レスポンス項目

- 州一覧
- 郵便番号エリア一覧
- Tenure 一覧
- 期間候補

### 1.4 エリア詳細取得

- `GET /api/areas/:id`
- 用途: 選択したエリアの詳細集計を取得する

#### 想定レスポンス項目

- エリア基本情報
- 対象取引件数
- 平均価格
- 平均単価
- 取引があった年数
- 平均完成年
- 平均面積

## 2. 管理 API

### 2.1 CSV 取り込み実行

- `POST /api/admin/imports/transactions`
- 用途: 取引 CSV をアップロードし、DB に取り込む

#### 処理方針

- UTF-16LE を UTF-8 に変換する
- TSV としてパースする
- `Property Type = Condominium/Apartment` のみ取り込み対象にする
- `Scheme Name/Area` から物件キーを生成する
- `Scheme Name/Area` から住所候補を解決し、郵便番号エリアへ正規化する
- 未登録エリアがあれば自動登録する
- 未登録物件があれば自動登録する
- 完成年や物件ノートなどの手動補完項目は既存物件マスタを参照する

#### 想定レスポンス

```json
{
  "importId": "uuid",
  "status": "completed",
  "totalRows": 2600,
  "importedRows": 820,
  "skippedRows": 1780,
  "newAreas": 12,
  "newProperties": 54,
  "unresolvedAddresses": 6,
  "unresolvedCoordinates": 3
}
```

### 2.2 取り込み結果取得

- `GET /api/admin/imports/:id`
- 用途: CSV 取り込み結果画面の表示に利用する

#### 想定レスポンス項目

- 取り込み件数
- 成功件数
- スキップ件数
- 新規登録エリア数
- 新規登録物件数
- 住所未解決件数
- 緯度経度未補完件数

### 2.3 物件一覧取得

- `GET {SUPABASE_URL}/rest/v1/properties`
- 用途: 管理画面の物件一覧表示
- 実装方針: SPA から Supabase REST へ直接アクセスする

#### 主なクエリ

- `keyword`
- `completionFilter`
- `limit`

#### 想定レスポンス項目

- 物件 ID
- `schemeName`
- `postalCode`
- `completedYear`
- `isDataComplete`
- `updatedAt`

### 2.4 物件詳細取得

- `GET {SUPABASE_URL}/rest/v1/properties?id=eq.{id}`
- 用途: 物件編集画面の初期表示
- 実装方針: SPA から Supabase REST へ直接アクセスする

### 2.5 物件更新

- `PATCH {SUPABASE_URL}/rest/v1/properties?id=eq.{id}`
- 用途: 物件情報の手動補完・修正
- 実装方針: SPA から Supabase REST へ直接更新する

#### 更新対象項目

- `postalCode`
- `completedYear`
- `note`

### 2.6 管理者一覧取得

- `GET /api/admin/admins`
- 用途: 管理者一覧表示

### 2.7 管理者追加

- `POST /api/admin/admins`
- 用途: 管理者アカウント作成

#### 入力項目

- `name`
- `email`
- `password`

### 2.8 メンバー一覧取得

- `GET /api/admin/members`
- 用途: メンバー一覧表示

### 2.9 メンバー更新

- `PATCH /api/admin/members/:id`
- 用途: 会員レベルや状態の更新

#### 更新対象項目

- `memberLevel`
- `status`

## 3. レスポンス設計方針

- 初期フェーズでは JSON を返す
- 一覧系はフロントで扱いやすいフラット構造を優先する
- フィルタ条件はレスポンスにも含め、再描画時の整合性を取りやすくする

## 4. 未確定事項

- 管理 API の認証導入タイミング
- CSV アップロードの非同期ジョブ化
- エラーレスポンス形式の統一仕様
- API バージョニング要否
- 住所解決失敗時の再試行 API を切るかどうか

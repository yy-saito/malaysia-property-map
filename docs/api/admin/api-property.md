# 管理｜物件管理 API 仕様

## 概要

物件一覧画面と物件編集画面で利用するデータアクセス仕様です。完成年や住所、物件ノートなど、CSV に含まれない補完情報の管理に利用します。初期実装では Nuxt 独自 API を挟まず、SPA から Supabase REST へ直接アクセスします。

---

## API 一覧

| メソッド | エンドポイント | 説明 | 使用者 | 認証 |
| -------- | -------------- | ---- | ------ | ---- |
| GET | `{SUPABASE_URL}/rest/v1/properties` | 物件一覧取得 | 管理者、物件情報一覧画面 | 不要 |
| GET | `{SUPABASE_URL}/rest/v1/properties?id=eq.{id}` | 物件詳細取得 | 管理者、物件情報編集画面 | 不要 |
| PATCH | `{SUPABASE_URL}/rest/v1/properties?id=eq.{id}` | 物件更新 | 管理者、物件情報編集画面 | 必要 |

---

## 1. 物件一覧取得

### エンドポイント

```http
GET {SUPABASE_URL}/rest/v1/properties
```

### 説明

物件一覧画面に表示する一覧データを返却します。

### 使用者

- 管理者
- SPA: [管理｜物件情報一覧](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/admin-property-list.md)

### Query Parameters

| パラメータ名 | 型 | 必須 | 説明 |
| ------------ | -- | ---- | ---- |
| keyword | string | 任意 | 物件名検索 |
| completionFilter | enum(`all`,`complete`,`incomplete`) | 任意 | 補完状態 |
| limit | integer | 任意 | 取得件数上限 |

### レスポンス項目

- 物件 ID
- `schemeName`
- `postalCode`
- `completedYear`
- `isDataComplete`
- `updatedAt`

---

## 2. 物件詳細取得

### エンドポイント

```http
GET {SUPABASE_URL}/rest/v1/properties?id=eq.{id}
```

### 説明

物件編集画面の初期表示データを返却します。

### 使用者

- 管理者
- SPA: [管理｜物件情報編集](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/admin-property-edit.md)

---

## 3. 物件更新

### エンドポイント

```http
PATCH {SUPABASE_URL}/rest/v1/properties?id=eq.{id}
```

### 説明

物件情報を手動補完・修正します。

### 使用者

- 管理者
- SPA: [管理｜物件情報編集](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/admin-property-edit.md)

### Body Parameters

| パラメータ名 | 型 | 必須 | 説明 |
| ------------ | -- | ---- | ---- |
| postalCode | string | 任意 | 郵便番号 |
| completedYear | integer | 任意 | 完成年 |
| note | string | 任意 | 補足説明 |

### 補足

- 一覧取得・詳細取得は `apikey + anon key` で参照する
- 更新はログイン済み管理者の `access_token` を `Authorization` に付与して実行する
- 実装上の呼び出しは [`propertyRepository.ts`](/Users/yys/Work/Mypro-capital/malaysia-property-map/app/repositories/propertyRepository.ts) に集約する

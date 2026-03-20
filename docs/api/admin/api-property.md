# 管理｜物件管理 API 仕様

## 概要

物件一覧画面と物件編集画面で利用する API 群です。完成年や住所、物件ノートなど、CSV に含まれない補完情報の管理に利用します。

---

## API 一覧

| メソッド | エンドポイント | 説明 | 使用者 | 認証 |
| -------- | -------------- | ---- | ------ | ---- |
| GET | /api/admin/properties | 物件一覧取得 | 管理者、物件情報一覧画面 | 不要 |
| GET | /api/admin/properties/:id | 物件詳細取得 | 管理者、物件情報編集画面 | 不要 |
| PATCH | /api/admin/properties/:id | 物件更新 | 管理者、物件情報編集画面 | 不要 |

---

## 1. 物件一覧取得

### エンドポイント

```http
GET /api/admin/properties
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
| stateName | string | 任意 | 州名 |
| postalCode | string | 任意 | 郵便番号 |
| propertyType | string | 任意 | 物件タイプ |
| hasCompletedYear | boolean | 任意 | 完成年設定有無 |
| page | integer | 任意 | ページ番号 |

### レスポンス項目

- 物件 ID
- `schemeName`
- `stateName`
- `postalCode`
- `propertyType`
- `developerName`
- `completedYear`
- `updatedAt`

---

## 2. 物件詳細取得

### エンドポイント

```http
GET /api/admin/properties/:id
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
PATCH /api/admin/properties/:id
```

### 説明

物件情報を手動補完・修正します。

### 使用者

- 管理者
- SPA: [管理｜物件情報編集](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/admin-property-edit.md)

### Body Parameters

| パラメータ名 | 型 | 必須 | 説明 |
| ------------ | -- | ---- | ---- |
| schemeName | string | 必須 | 物件名 |
| areaId | uuid | 必須 | エリア ID |
| propertyTypeId | uuid | 必須 | 物件タイプ ID |
| developerId | uuid | 任意 | developer ID |
| resolvedAddress | string | 任意 | 解決済み住所 |
| postalCode | string | 任意 | 郵便番号 |
| completedYear | integer | 任意 | 完成年 |
| note | string | 任意 | 補足説明 |

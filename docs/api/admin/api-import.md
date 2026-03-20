# 管理｜CSV 取り込み API 仕様

## 概要

CSV 取り込み画面と取り込み結果画面で利用する API 群です。初期フェーズでは認証なしですが、将来的には管理者限定に移行できる構造を前提とします。

---

## API 一覧

| メソッド | エンドポイント | 説明 | 使用者 | 認証 |
| -------- | -------------- | ---- | ------ | ---- |
| POST | /api/admin/imports/transactions | CSV 取り込み実行 | 管理者、CSV 取り込み画面 | 不要 |
| GET | /api/admin/imports/:id | 取り込み結果取得 | 管理者、CSV 取り込み結果画面 | 不要 |

---

## 1. CSV 取り込み実行

### エンドポイント

```http
POST /api/admin/imports/transactions
```

### 説明

取引 CSV をアップロードし、DB に取り込みます。

### 使用者

- 管理者
- SPA: [管理｜CSV取り込み](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/admin-import.md)

### 処理方針

- UTF-16LE を UTF-8 に変換
- TSV としてパース
- `Property Type = Condominium/Apartment` のみ取り込み対象
- `Scheme Name/Area` をもとに物件キー生成
- `Scheme Name/Area` から住所候補を解決
- 郵便番号エリアへ正規化
- 未登録エリアと未登録物件を自動登録
- 住所未解決でも取り込みは継続し、不足情報あり物件として扱う

### レスポンス

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

---

## 2. 取り込み結果取得

### エンドポイント

```http
GET /api/admin/imports/:id
```

### 説明

CSV 取り込み結果画面用の詳細情報を返却します。

### 使用者

- 管理者
- SPA: [管理｜CSV取り込み結果](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/admin-import-result.md)

### レスポンス項目

- 取り込み件数
- 成功件数
- スキップ件数
- 新規登録エリア数
- 新規登録物件数
- 住所未解決件数
- 緯度経度未補完件数

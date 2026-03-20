# 公開｜相場マップ API 仕様

## 概要

公開側の相場マップ画面と関連 UI で利用する API 群です。初期フェーズでは認証不要で、全ユーザーが利用可能です。対象データは `Property Type = Condominium/Apartment` のみとします。

---

## API 一覧

| メソッド | エンドポイント | 説明 | 使用者 | 認証 |
| -------- | -------------- | ---- | ------ | ---- |
| GET | /api/map/areas | 地図表示用のエリア集計取得 | 公開ユーザー、相場マップ画面 | 不要 |
| GET | /api/map/area-list | 一覧表示用のエリア集計取得 | 公開ユーザー、相場マップ画面 | 不要 |
| GET | /api/map/filters | フィルタ用マスタ取得 | 公開ユーザー、相場マップ画面 | 不要 |
| GET | /api/areas/:id | エリア詳細集計取得 | 公開ユーザー、相場マップ画面 | 不要 |

---

## 1. 地図表示用エリア集計取得

### エンドポイント

```http
GET /api/map/areas
```

### 説明

州または郵便番号エリア単位の価格 × 取引件数を返却します。相場マップの主データとして利用します。

### 使用者

- 公開ユーザー
- SPA: [相場｜価格×取引件数マップ](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/souba-map.md)

### Query Parameters

| パラメータ名 | 型 | 必須 | 説明 |
| ------------ | -- | ---- | ---- |
| areaLevel | integer | 必須 | 1=州, 2=郵便番号エリア |
| stateName | string | 任意 | 州名 |
| postalCode | string | 任意 | 郵便番号 |
| tenure | string | 任意 | Tenure |
| from | string | 任意 | 取引開始年月 `YYYY-MM` |
| to | string | 任意 | 取引終了年月 `YYYY-MM` |
| priceBandMode | string | 任意 | 価格帯表示モード |

### レスポンス

#### 成功 (200 OK)

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
      "avgCompletedYear": 2016,
      "avgFloorArea": 96
    }
  ]
}
```

---

## 2. 一覧表示用エリア集計取得

### エンドポイント

```http
GET /api/map/area-list
```

### 説明

地図と同条件の一覧データを返却します。

### 使用者

- 公開ユーザー
- SPA: [相場｜価格×取引件数マップ](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/souba-map.md)

### Query Parameters

| パラメータ名 | 型 | 必須 | 説明 |
| ------------ | -- | ---- | ---- |
| areaLevel | integer | 必須 | 1=州, 2=郵便番号エリア |
| stateName | string | 任意 | 州名 |
| postalCode | string | 任意 | 郵便番号 |
| tenure | string | 任意 | Tenure |
| from | string | 任意 | 取引開始年月 |
| to | string | 任意 | 取引終了年月 |
| sort | string | 任意 | 並び順 |

### レスポンス項目

- エリア名
- 取引件数
- 平均価格
- 平均単価
- 取引があった年数
- 平均完成年
- 平均面積

---

## 3. フィルタ用マスタ取得

### エンドポイント

```http
GET /api/map/filters
```

### 説明

フィルタ UI の選択肢を返却します。

### 使用者

- 公開ユーザー
- SPA: [相場｜価格×取引件数マップ](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/souba-map.md)

### レスポンス項目

- 州一覧
- 郵便番号エリア一覧
- Tenure 一覧
- 期間候補

---

## 4. エリア詳細集計取得

### エンドポイント

```http
GET /api/areas/:id
```

### 説明

選択したエリアの詳細集計を返却します。

### 使用者

- 公開ユーザー
- SPA: [相場｜価格×取引件数マップ](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/souba-map.md)

### レスポンス項目

- エリア基本情報
- 対象取引件数
- 平均価格
- 平均単価
- 取引があった年数
- 平均完成年
- 平均面積

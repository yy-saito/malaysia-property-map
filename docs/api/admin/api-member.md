# 管理｜メンバー管理 API 仕様

## 概要

メンバー管理画面で利用する API 群です。将来的な会員レベル管理のための受け皿として設計します。

---

## API 一覧

| メソッド | エンドポイント | 説明 | 使用者 | 認証 |
| -------- | -------------- | ---- | ------ | ---- |
| GET | /api/admin/members | メンバー一覧取得 | 管理者、メンバー管理画面 | 不要 |
| PATCH | /api/admin/members/:id | メンバー更新 | 管理者、メンバー管理画面 | 不要 |

---

## 1. メンバー一覧取得

### エンドポイント

```http
GET /api/admin/members
```

### 使用者

- 管理者
- SPA: [管理｜メンバー管理](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/admin-member-list.md)

### レスポンス項目

- id
- name
- email
- memberLevel
- status

---

## 2. メンバー更新

### エンドポイント

```http
PATCH /api/admin/members/:id
```

### 使用者

- 管理者
- SPA: [管理｜メンバー管理](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/admin-member-list.md)

### Body Parameters

| パラメータ名 | 型 | 必須 | 説明 |
| ------------ | -- | ---- | ---- |
| memberLevel | string | 必須 | `guest` `member` `premium` `admin` |
| status | string | 必須 | 状態 |

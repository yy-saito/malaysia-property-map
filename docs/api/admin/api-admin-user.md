# 管理｜管理者管理 API 仕様

## 概要

管理者一覧画面と管理者追加導線で利用する API 群です。管理者追加時は Supabase Auth に認証ユーザーを作成し、アプリ側の `users` に管理用プロフィールを保持します。

---

## API 一覧

| メソッド | エンドポイント | 説明 | 使用者 | 認証 |
| -------- | -------------- | ---- | ------ | ---- |
| GET | /api/admin/admins | 管理者一覧取得 | 管理者、管理者管理画面 | 不要 |
| POST | /api/admin/admins | 管理者追加 | 管理者、管理者管理画面 | 不要 |

---

## 1. 管理者一覧取得

### エンドポイント

```http
GET /api/admin/admins
```

### 使用者

- 管理者
- SPA: [管理｜管理者管理](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/admin-admin-list.md)

### レスポンス項目

- id
- name
- email
- role
- status

---

## 2. 管理者追加

### エンドポイント

```http
POST /api/admin/admins
```

### 使用者

- 管理者
- SPA: [管理｜管理者管理](/Users/yys/Work/Mypro-capital/malaysia-property-map/docs/spa/admin-admin-list.md)

### Body Parameters

| パラメータ名 | 型 | 必須 | 説明 |
| ------------ | -- | ---- | ---- |
| name | string | 必須 | 名前 |
| email | string | 必須 | メールアドレス |
| password | string | 必須 | パスワード |

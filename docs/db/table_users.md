# テーブル定義｜users

## 概要

アプリケーション側のユーザープロフィールとロール管理を行う。
認証ユーザー本体は Supabase Auth を利用し、本テーブルではアプリ固有の属性を扱う。

## カラム案

| カラム名 | 型 | 必須 | 説明 |
| ------ | ------ | ------ | ------ |
| id | uuid | ○ | 主キー |
| auth_user_id | uuid |  | Supabase Auth のユーザー ID |
| name | text | ○ | 表示名 |
| email | text | ○ | メールアドレス |
| role | text | ○ | `guest` `member` `premium` `admin` |
| status | text | ○ | 状態 |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

## 備考

- ロール管理は本テーブルで行う
- `admin_accounts` や `member_profiles` のような別ロールテーブルは作成しない
- 将来的な認可は `users.role` を参照して判定する

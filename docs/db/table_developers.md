# テーブル定義｜developers

## 概要

developer 情報を管理する。初期フェーズでは空でもよいが、将来の拡張を前提に先に定義しておく。

## カラム案

| カラム名 | 型 | 必須 | 説明 |
| ------ | ------ | ------ | ------ |
| id | uuid | ○ | 主キー |
| name | text | ○ | developer 名 |
| slug | text | ○ | URL 用識別子 |
| description_ja | text |  | 日本語説明 |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

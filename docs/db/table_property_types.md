# テーブル定義｜property_types

## 概要

物件タイプを管理する。

## カラム案

| カラム名 | 型 | 必須 | 説明 |
| ------ | ------ | ------ | ------ |
| id | uuid | ○ | 主キー |
| code | text | ○ | 内部コード |
| name_en | text | ○ | 元データ基準の名称 |
| name_ja | text |  | 日本語表示名 |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

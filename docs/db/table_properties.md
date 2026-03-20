# テーブル定義｜properties

## 概要

物件マスタ。`Scheme Name/Area` を物件名またはプロジェクト名として扱い、完成年や物件ノートなどの手動補完情報を一元管理する。
同じ `Scheme Name/Area` に紐づく取引には、同じ物件属性が適用される前提とする。

## カラム案

| カラム名 | 型 | 必須 | 説明 |
| ------ | ------ | ------ | ------ |
| id | uuid | ○ | 主キー |
| area_id | uuid | ○ | エリア ID |
| property_type_id | uuid |  | 物件タイプ ID |
| developer_id | uuid |  | developer ID |
| scheme_name | text | ○ | `Scheme Name/Area` を元にした物件名・プロジェクト名 |
| resolved_address | text |  | 解決済み住所 |
| postal_code | text |  | 解決済み郵便番号 |
| tenure | text |  | Tenure |
| completed_year | integer |  | 完成年 |
| note | text |  | 物件ノート |
| is_data_complete | boolean | ○ | 必須情報が揃っているかのフラグ |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

## 備考

- 物件の一意判定は `scheme_name` 一致を前提とする
- `completed_year` は物件単位で保持する
- 同じ `scheme_name` に紐づく取引では、同じ完成年が表示されるようにする
- `resolved_address` と `postal_code` は住所解決結果を保持する
- 値が不足している物件は `is_data_complete = false` とし、管理画面で一覧化して補完対象にする

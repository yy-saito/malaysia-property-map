# テーブル定義｜property_transactions

## 概要

CSV 由来の取引データ本体を管理する。

## カラム案

| カラム名 | 型 | 必須 | 説明 |
| ------ | ------ | ------ | ------ |
| id | uuid | ○ | 主キー |
| area_id | uuid | ○ | エリア ID |
| property_type_id | uuid | ○ | 物件タイプ ID |
| property_id | uuid | ○ | 物件 ID |
| import_id | uuid |  | 取込履歴 ID |
| transaction_month | date | ○ | 取引年月 |
| land_area | numeric |  | 土地面積 |
| land_area_unit | text |  | 土地面積単位 |
| floor_area | numeric |  | 延床面積 |
| floor_area_unit | text |  | 延床面積単位 |
| unit_level | integer |  | 取引対象ユニットの階数 |
| transaction_price | numeric | ○ | 取引価格 |
| source_file_name | text | ○ | 取込元ファイル名 |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

## 備考

- 価格集計、件数集計、単価計算の基礎テーブルとする
- 単価はクエリ計算または集計ビューで算出する
- `property_id` を通じて完成年や物件ノートなどの物件属性を参照する

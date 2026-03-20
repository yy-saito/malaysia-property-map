# テーブル定義｜imports

## 概要

CSV インポート処理の実行結果を管理する。

## カラム案

| カラム名 | 型 | 必須 | 説明 |
| ------ | ------ | ------ | ------ |
| id | uuid | ○ | 主キー |
| executed_by_user_id | uuid | ○ | 実行ユーザー ID |
| source_file_name | text | ○ | 取込元ファイル名 |
| total_rows | integer | ○ | 総行数 |
| imported_rows | integer | ○ | 取込成功行数 |
| skipped_rows | integer | ○ | スキップ行数 |
| new_areas_count | integer | ○ | 新規エリア数 |
| new_properties_count | integer | ○ | 新規物件数 |
| unresolved_addresses_count | integer | ○ | 住所未解決数 |
| unresolved_coordinates_count | integer | ○ | 座標未補完数 |
| status | text | ○ | 実行状態 |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

## 備考

- CSV 取り込み結果画面の表示元となる
- `property_transactions.import_id` と紐付ける
- 初期フェーズでも実行ユーザーは必ず記録する

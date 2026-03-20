# テーブル定義｜areas

## 概要

エリア情報を管理する。CSV 取り込み時に未登録エリアが存在した場合は本テーブルへ新規追加する。
また、地図表示のために各エリアレベルごとの代表緯度経度を保持する。

## カラム案

| カラム名 | 型 | 必須 | 説明 |
| ------ | ------ | ------ | ------ |
| id | uuid | ○ | 主キー |
| area_level | smallint | ○ | 表示レベル。`1=State` `2=Postal Code Area` |
| country | text | ○ | 国名。初期値は `Malaysia` |
| state_name | text |  | 州名 |
| postal_code | text |  | 郵便番号 |
| postal_area_name | text |  | 郵便番号エリア表示名 |
| display_name | text | ○ | 画面表示用名称 |
| latitude | numeric |  | 代表緯度 |
| longitude | numeric |  | 代表経度 |
| is_active | boolean | ○ | 有効フラグ |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

## 備考

- 初期フェーズでは `area_level` を含めた一意性を検討する
- `level_1` は `state_name`
- `level_2` は `postal_code`
- 緯度経度は各レベルの代表点を保持する
- 緯度経度は `Scheme Name/Area` から取得した住所情報をもとに補完する
- 将来的に多言語名称カラムや別翻訳テーブル追加を想定する

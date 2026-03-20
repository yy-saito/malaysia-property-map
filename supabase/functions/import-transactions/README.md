# import-transactions

CSV 取り込みの前段処理用 Edge Function。

現時点の責務:

- UTF-16LE を UTF-8 へ変換
- TSV をパース
- `Condominium/Apartment` のみ抽出
- 物件単位のプレビューとスキップ理由を返却

次フェーズで追加する責務:

- `imports` レコード作成
- `properties` / `property_transactions` 永続化
- ジオコーディングと `postal_code_area` 正規化

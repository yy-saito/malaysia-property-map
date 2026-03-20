# ER図

## 概要

本ドキュメントは、マレーシア不動産マップの主要テーブル関係を示す ER 図です。

初期フェーズでは相場マップと CSV 取り込みを中心に利用し、将来的に会員レベル制御や developer 管理を拡張できる構造を前提とします。

## ER図

```mermaid
erDiagram
    areas ||--o{ properties : "has"
    property_types ||--o{ properties : "has"
    developers ||--o{ properties : "has"
    properties ||--o{ property_transactions : "has"
    property_types ||--o{ property_transactions : "has"
    areas ||--o{ property_transactions : "has"
    areas ||--o{ area_notes : "has"
    imports ||--o{ property_transactions : "created"
    users ||--o{ imports : "executed by"

    areas {
        uuid id PK
        smallint area_level
        string country
        string state_name
        string postal_code
        string postal_area_name
        string display_name
        numeric latitude
        numeric longitude
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    property_types {
        uuid id PK
        string code
        string name_en
        string name_ja
        timestamp created_at
        timestamp updated_at
    }

    developers {
        uuid id PK
        string name
        string slug
        text description_ja
        timestamp created_at
        timestamp updated_at
    }

    properties {
        uuid id PK
        uuid area_id FK
        uuid property_type_id FK
        uuid developer_id FK
        string scheme_name
        text resolved_address
        string postal_code
        string tenure
        integer completed_year
        text note
        boolean is_data_complete
        timestamp created_at
        timestamp updated_at
    }

    property_transactions {
        uuid id PK
        uuid area_id FK
        uuid property_type_id FK
        uuid property_id FK
        uuid import_id FK
        date transaction_month
        numeric land_area
        string land_area_unit
        numeric floor_area
        string floor_area_unit
        integer unit_level
        numeric transaction_price
        string source_file_name
        timestamp created_at
        timestamp updated_at
    }

    area_notes {
        uuid id PK
        uuid area_id FK
        text summary_ja
        timestamp created_at
        timestamp updated_at
    }

    imports {
        uuid id PK
        uuid executed_by_user_id FK
        string source_file_name
        integer total_rows
        integer imported_rows
        integer skipped_rows
        integer new_areas_count
        integer new_properties_count
        integer unresolved_addresses_count
        integer unresolved_coordinates_count
        string status
        timestamp created_at
        timestamp updated_at
    }

    users {
        uuid id PK
        uuid auth_user_id
        string name
        string email
        string role
        string status
        timestamp created_at
        timestamp updated_at
    }
```

## 補足

- 初期の相場マップ対象は `property_types.name_en = Condominium/Apartment` のみとする
- `properties.scheme_name` は `Scheme Name/Area` を正規化した物件名・プロジェクト名として扱う
- `properties.completed_year` と `properties.note` は手動補完対象であり、同一物件に紐づく取引へ共通適用する
- `areas` は州レベルと郵便番号エリアレベルの 2 段階を扱う
- `imports` は CSV 取り込み結果の追跡に利用する
- `users` は Supabase Auth と連携するアプリ側プロフィール兼ロール管理テーブルとする

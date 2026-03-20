# コーディングルール / フォルダ構成

## 目的

本ドキュメントは、AI と人間が同じ前提で実装を進めるためのルールを定義する。

## 基本方針

- まず仕様書に従う
- 不明点はローカル判断で広げすぎず、既存仕様に寄せる
- 公開画面は参考サイトに寄せる
- 管理画面は標準的なダッシュボードで実装する
- 過剰抽象化より、読みやすい構成を優先する
- ただし責務分離は明確にし、1ファイルにロジックを詰め込みすぎない
- 画面・UI・状態管理・データ取得を分離する
- Nuxt の初期バージョンは `4.1.3` に固定する
- 初期段階では依存関係の自動更新で Nuxt を不用意に上げない

## フォルダ構成方針

```text
app/
  app.vue
  layouts/
    default.vue
    admin.vue
  pages/
    index.vue
    souba/
      index.vue
    admin/
      index.vue
      properties/
        index.vue
        [id].vue
      import/
        index.vue
        result/
          [id].vue
      admins/
        index.vue
      members/
        index.vue
  components/
    common/
    layout/
    souba/
    admin/
  composables/
    useSoubaMap.ts
    useAdminProperties.ts
    useImport.ts
    useAuthUser.ts
  repositories/
    mapRepository.ts
    propertyRepository.ts
    importRepository.ts
    userRepository.ts
  services/
    mapFilterService.ts
    propertyService.ts
    importService.ts
  lib/
    supabase/
      client.ts
      server.ts
    utils/
  types/
    api.ts
    models.ts
  plugins/
    i18n.ts
supabase/
  functions/
  migrations/
  seed/
docs/
```

## Nuxt 側ルール

- Nuxt の初期採用バージョンは `4.1.3`
- `pages/` は画面単位
- `components/` は再利用 UI 単位
- `composables/` は画面ロジック、状態、イベント制御をまとめる
- `repositories/` は API / Supabase アクセスをまとめる
- `services/` は業務ロジックやデータ整形をまとめる
- `lib/` は Supabase 接続や純粋ユーティリティを置く
- `types/` は API / DB モデルの型を置く

## コンポーネント設計ルール

- 1 コンポーネント 1 役割を原則とする
- 画面固有 UI は `components/souba/` または `components/admin/` に置く
- 汎用 UI は `components/common/` に置く
- 1ファイルが大きくなりすぎる場合は表示単位で分割する
- ページファイルに表示ロジックを詰め込まない
- 地図、フィルタ、サマリー、一覧、モーダルは原則別コンポーネントに分ける
- テーブル、フォーム、カードなども再利用可能なら分割する

## レイヤー分離ルール

- `pages/`
  - 画面の組み立てのみを担当する
- `components/`
  - 見た目とユーザー操作の受け口を担当する
- `composables/`
  - 画面状態、イベント処理、呼び出し順制御を担当する
- `repositories/`
  - Supabase RPC / Edge Functions / クエリ呼び出しを担当する
- `services/`
  - 条件変換、表示用整形、集計補助などの業務ロジックを担当する

## 実装イメージ

### `/souba`

- `pages/souba/index.vue`
  - 画面構成だけを持つ
- `components/souba/SoubaMapLayout.vue`
- `components/souba/SoubaMapCanvas.vue`
- `components/souba/SoubaMapFilters.vue`
- `components/souba/SoubaMapSummary.vue`
- `components/souba/SoubaAreaList.vue`
- `composables/useSoubaMap.ts`
- `repositories/mapRepository.ts`
- `services/mapFilterService.ts`

### `/admin/properties`

- `pages/admin/properties/index.vue`
- `components/admin/property/PropertyListTable.vue`
- `components/admin/property/PropertyListFilters.vue`
- `composables/useAdminProperties.ts`
- `repositories/propertyRepository.ts`
- `services/propertyService.ts`

## スタイリングルール

- Tailwind CSS を基本とする
- まずはユーティリティクラスで構築する
- 色や余白の繰り返しが増えたら共通クラス化する
- 公開画面は参考サイトの密度感・視線誘導を意識する
- 管理画面はシンプルで情報優先

## Pug 利用ルール

- ページと大きめコンポーネントで利用してよい
- ネストを深くしすぎない
- 条件分岐が複雑になる場合は script 側へ寄せる

## データ取得ルール

- フロントからの参照系は Supabase RPC / Edge Functions を利用する
- 直接クエリしてよい範囲と Function を使う範囲を分ける
- 重い処理や import は Edge Functions に寄せる
- コンポーネントから直接 Supabase を呼ばない
- データ取得は `repository` 経由に統一する

## 型ルール

- API レスポンス型は必ず `types/api.ts` に定義する
- DB モデル型は `types/models.ts` に定義する
- `any` は原則使わない

## 命名ルール

- コンポーネント名は PascalCase
- composable は `useXxx`
- 変数・関数は camelCase
- DB / API フィールドは snake_case を許容
- 画面表示文言は i18n キー経由で扱う

## 管理画面ルール

- 一覧画面はまず「検索」「絞り込み」「テーブル」を優先する
- 編集画面は縦並びの標準フォームでよい
- 不足情報フラグを確認しやすくする

## 公開画面ルール

- `/souba` は地図を主役にする
- 同一画面内でフィルタと表示切替を完結させる
- エリア比較が直感的にできることを優先する

## 実装時の注意

- `scheme_name` 一致で物件を同一扱いする前提を崩さない
- `is_data_complete` は `scheme_name` と `postal_code` が揃ったら true
- `completed_year` は物件マスターに持つ
- `unit_level` は取引データ側に持つ

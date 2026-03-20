<template lang="pug">
div.space-y-6(v-if="preview")
  div.grid.gap-6(class="lg:grid-cols-3")
    div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200(class="lg:col-span-2")
      div.flex.items-start.justify-between.gap-4
        div
          h2.text-lg.font-semibold.text-slate-900 取り込みサマリー
          p.mt-2.text-sm.leading-6.text-slate-600 {{ preview.message }}
        p.rounded-full.bg-amber-100.px-3.py-1.text-xs.font-semibold.text-amber-800(v-if="preview.summary.dryRun") DRY RUN
      div.mt-6.grid.gap-4(class="sm:grid-cols-2 xl:grid-cols-4")
        DashboardStatCard(title="対象行" :value="preview.summary.totalRows" description="入力行数")
        DashboardStatCard(title="取込候補" :value="preview.summary.importedRows" description="条件一致")
        DashboardStatCard(title="スキップ" :value="preview.summary.skippedRows" description="対象外または不正")
        DashboardStatCard(title="新規物件候補" :value="preview.summary.newProperties" description="scheme_name 単位")
    div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
      h2.text-lg.font-semibold.text-slate-900 不足情報
      dl.mt-4.space-y-4.text-sm
        div.flex.items-center.justify-between.gap-4
          dt.text-slate-500 住所未解決
          dd.font-semibold.text-slate-900 {{ preview.summary.unresolvedAddresses }}
        div.flex.items-center.justify-between.gap-4
          dt.text-slate-500 座標未補完
          dd.font-semibold.text-slate-900 {{ preview.summary.unresolvedCoordinates }}
        div.flex.items-center.justify-between.gap-4
          dt.text-slate-500 ファイル名
          dd.max-w-44.truncate.font-semibold.text-slate-900 {{ preview.summary.sourceFileName }}
  div.grid.gap-6(class="xl:grid-cols-3")
    div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200(class="xl:col-span-2")
      div.flex.items-center.justify-between
        h2.text-lg.font-semibold.text-slate-900 物件プレビュー
        p.text-sm.text-slate-500 {{ preview.properties.length }} 件
      div.mt-5.overflow-hidden.rounded-2xl.border.border-slate-200
        table.min-w-full.divide-y.divide-slate-200.text-sm
          thead.bg-slate-50
            tr
              th.px-4.py-3.text-left.font-medium.text-slate-500 物件名
              th.px-4.py-3.text-left.font-medium.text-slate-500 取引件数
              th.px-4.py-3.text-left.font-medium.text-slate-500 完了状態
          tbody.divide-y.divide-slate-100.bg-white
            tr(v-for="property in preview.properties" :key="property.schemeName")
              td.px-4.py-4.font-medium.text-slate-900 {{ property.schemeName }}
              td.px-4.py-4.text-slate-600 {{ property.transactionCount }}
              td.px-4.py-4
                span.rounded-full.px-3.py-1.text-xs.font-semibold(
                  :class="property.isDataComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'"
                ) {{ property.isDataComplete ? '補完済み' : '不足あり' }}
    div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
      h2.text-lg.font-semibold.text-slate-900 スキップ行
      div.mt-4.space-y-3(v-if="preview.skipped.length > 0")
        div.rounded-2xl.bg-slate-50.p-4(v-for="row in preview.skipped.slice(0, 20)" :key="`${row.rowNumber}-${row.reason}`")
          p.text-sm.font-semibold.text-slate-900 Row {{ row.rowNumber }}
          p.mt-1.text-sm.text-slate-600 {{ row.reason }}
      p.mt-4.text-sm.leading-6.text-slate-600(v-else) スキップ行はありません。
div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200(v-else)
  h2.text-lg.font-semibold.text-slate-900 取り込み結果
  p.mt-3.text-sm.leading-6.text-slate-600 指定された dry-run 結果が見つかりません。取り込み画面から再実行してください。
</template>

<script setup lang="ts">
import DashboardStatCard from '~/components/common/DashboardStatCard.vue'

const route = useRoute()
const { getPreview } = useImport()

const preview = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  if (!id) {
    return null
  }

  return getPreview(id)
})
</script>

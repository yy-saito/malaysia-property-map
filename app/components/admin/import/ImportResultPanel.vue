<template>
  <div v-if="preview" class="space-y-6">
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">取り込みサマリー</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ preview.message }}</p>
          </div>
          <p
            v-if="preview.summary.dryRun"
            class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
          >
            DRY RUN
          </p>
        </div>
        <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard title="対象行" :value="preview.summary.totalRows" description="入力行数" />
          <DashboardStatCard title="取込候補" :value="preview.summary.importedRows" description="条件一致" />
          <DashboardStatCard title="スキップ" :value="preview.summary.skippedRows" description="対象外または不正" />
          <DashboardStatCard title="新規物件候補" :value="preview.summary.newProperties" description="scheme_name 単位" />
        </div>
      </div>
      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 class="text-lg font-semibold text-slate-900">不足情報</h2>
        <dl class="mt-4 space-y-4 text-sm">
          <div class="flex items-center justify-between gap-4">
            <dt class="text-slate-500">住所未解決</dt>
            <dd class="font-semibold text-slate-900">{{ preview.summary.unresolvedAddresses }}</dd>
          </div>
          <div class="flex items-center justify-between gap-4">
            <dt class="text-slate-500">座標未補完</dt>
            <dd class="font-semibold text-slate-900">{{ preview.summary.unresolvedCoordinates }}</dd>
          </div>
          <div class="flex items-center justify-between gap-4">
            <dt class="text-slate-500">ファイル名</dt>
            <dd class="max-w-44 truncate font-semibold text-slate-900">{{ preview.summary.sourceFileName }}</dd>
          </div>
        </dl>
      </div>
    </div>
    <div class="grid gap-6 xl:grid-cols-3">
      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 xl:col-span-2">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">物件プレビュー</h2>
          <p class="text-sm text-slate-500">{{ preview.properties.length }} 件</p>
        </div>
        <div class="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <table class="min-w-full divide-y divide-slate-200 text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left font-medium text-slate-500">物件名</th>
                <th class="px-4 py-3 text-left font-medium text-slate-500">取引件数</th>
                <th class="px-4 py-3 text-left font-medium text-slate-500">完了状態</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="property in preview.properties" :key="property.schemeName">
                <td class="px-4 py-4 font-medium text-slate-900">{{ property.schemeName }}</td>
                <td class="px-4 py-4 text-slate-600">{{ property.transactionCount }}</td>
                <td class="px-4 py-4">
                  <span
                    class="rounded-full px-3 py-1 text-xs font-semibold"
                    :class="property.isDataComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'"
                  >
                    {{ property.isDataComplete ? '補完済み' : '不足あり' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 class="text-lg font-semibold text-slate-900">スキップ行</h2>
        <div v-if="preview.skipped.length > 0" class="mt-4 space-y-3">
          <div
            v-for="row in preview.skipped.slice(0, 20)"
            :key="`${row.rowNumber}-${row.reason}`"
            class="rounded-2xl bg-slate-50 p-4"
          >
            <p class="text-sm font-semibold text-slate-900">Row {{ row.rowNumber }}</p>
            <p class="mt-1 text-sm text-slate-600">{{ row.reason }}</p>
          </div>
        </div>
        <p v-else class="mt-4 text-sm leading-6 text-slate-600">スキップ行はありません。</p>
      </div>
    </div>
  </div>
  <div v-else class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <h2 class="text-lg font-semibold text-slate-900">取り込み結果</h2>
    <p class="mt-3 text-sm leading-6 text-slate-600">
      指定された dry-run 結果が見つかりません。取り込み画面から再実行してください。
    </p>
  </div>
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

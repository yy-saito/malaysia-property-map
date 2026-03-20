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
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <button
            v-if="preview.summary.dryRun"
            class="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            type="button"
            :disabled="!canImport || isImporting"
            @click="handleExecuteImport"
          >
            {{ isImporting ? '本取り込み実行中...' : '本取り込みを実行' }}
          </button>
          <p
            v-if="preview.summary.dryRun && !canImport"
            class="text-sm text-amber-700"
          >
            結果再表示のみのため本取り込みは実行できません。取り込み画面から再度 dry-run を行ってください。
          </p>
          <p
            v-if="!preview.summary.dryRun"
            class="text-sm font-medium text-emerald-700"
          >
            本取り込みは完了しています。
          </p>
        </div>
        <p v-if="actionMessage" class="mt-3 text-sm text-emerald-700">{{ actionMessage }}</p>
        <p v-if="errorMessage" class="mt-3 text-sm text-red-600">{{ errorMessage }}</p>
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
const { getPreview, canExecuteImport, executeImport, isImporting } = useImport()
const errorMessage = ref('')
const actionMessage = ref('')

const previewId = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  return id ?? ''
})

const preview = computed(() => {
  if (!previewId.value) {
    return null
  }

  return getPreview(previewId.value)
})

const canImport = computed(() => {
  if (!previewId.value || !preview.value?.summary.dryRun) {
    return false
  }

  return canExecuteImport(previewId.value)
})

const handleExecuteImport = async () => {
  if (!previewId.value) {
    return
  }

  errorMessage.value = ''
  actionMessage.value = ''

  try {
    await executeImport(previewId.value)
    actionMessage.value = '本取り込みを実行しました。物件管理画面で反映内容を確認できます。'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '本取り込みの実行に失敗しました。'
  }
}
</script>

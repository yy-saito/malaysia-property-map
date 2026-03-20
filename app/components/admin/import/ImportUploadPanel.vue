<template>
  <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <h2 class="text-lg font-semibold text-slate-900">CSVアップロード</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">
      UTF-16LE / TSV を想定し、Condominium/Apartment のみ取り込みます。
    </p>
    <div class="mt-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8">
      <div class="flex flex-col gap-4 text-center">
        <p class="text-sm text-slate-600">UTF-16LE / TSV ファイルを 1 件選択して dry-run を実行します。</p>
        <input
          ref="fileInputRef"
          class="hidden"
          type="file"
          accept=".csv,.tsv,.txt"
          @change="handleFileChange"
        >
        <div class="flex flex-wrap justify-center gap-3">
          <button
            class="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700"
            type="button"
            @click="openFileDialog"
          >
            ファイルを選択
          </button>
          <button
            class="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            type="button"
            :disabled="!selectedFile || isUploading"
            @click="submit"
          >
            {{ isUploading ? '処理中...' : 'dry-run 実行' }}
          </button>
        </div>
        <p v-if="selectedFile" class="text-sm font-medium text-slate-700">{{ selectedFile.name }}</p>
        <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>
    </div>
    <ul class="mt-6 space-y-2 text-sm leading-6 text-slate-600">
      <li>・対象は `Condominium/Apartment` のみです</li>
      <li>・住所解決と DB 永続化は次フェーズで接続します</li>
      <li>・この段階では取り込み結果のプレビューを返します</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { isUploading, startDryRun } = useImport()

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const errorMessage = ref('')

const openFileDialog = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
  errorMessage.value = ''
}

const submit = async () => {
  if (!selectedFile.value) {
    errorMessage.value = 'ファイルを選択してください。'
    return
  }

  try {
    const result = await startDryRun(selectedFile.value)
    await router.push(`/admin/import/result/${result.id}`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '取り込みプレビューの取得に失敗しました。'
  }
}
</script>

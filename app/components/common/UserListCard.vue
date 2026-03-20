<template>
  <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
      <button class="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white" type="button">追加</button>
    </div>
    <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left font-medium text-slate-500">名前</th>
            <th class="px-4 py-3 text-left font-medium text-slate-500">メール</th>
            <th class="px-4 py-3 text-left font-medium text-slate-500">ロール</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr>
            <td colspan="3" class="px-4 py-4 text-slate-500">データ接続後に一覧を表示します。</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

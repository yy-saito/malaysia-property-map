<template>
  <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
    <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
      <p class="text-sm font-medium text-slate-600">物件一覧</p>
      <p class="text-sm text-slate-500">{{ totalCount }} 件</p>
    </div>
    <table v-if="items.length > 0" class="min-w-full divide-y divide-slate-200 text-sm">
      <thead class="bg-slate-50">
        <tr>
          <th class="px-4 py-3 text-left font-medium text-slate-500">物件名</th>
          <th class="px-4 py-3 text-left font-medium text-slate-500">郵便番号</th>
          <th class="px-4 py-3 text-left font-medium text-slate-500">completed_year</th>
          <th class="px-4 py-3 text-left font-medium text-slate-500">完了フラグ</th>
          <th class="px-4 py-3 text-left font-medium text-slate-500">更新日時</th>
          <th class="px-4 py-3 text-left font-medium text-slate-500" />
        </tr>
      </thead>
      <tbody class="bg-white">
        <tr
          v-for="item in items"
          :key="item.id"
          class="border-t border-slate-100"
        >
          <td class="px-4 py-4 font-medium text-slate-900">{{ item.scheme_name }}</td>
          <td class="px-4 py-4 text-slate-600">{{ item.postal_code || '-' }}</td>
          <td class="px-4 py-4 text-slate-600">{{ item.completed_year || '-' }}</td>
          <td class="px-4 py-4">
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="item.is_data_complete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'"
            >
              {{ item.is_data_complete ? '補完済み' : '不足あり' }}
            </span>
          </td>
          <td class="px-4 py-4 text-slate-500">{{ formatUpdatedAt(item.updated_at) }}</td>
          <td class="px-4 py-4 text-right">
            <NuxtLink
              class="text-sm font-medium text-slate-700 hover:text-slate-900"
              :to="`/admin/properties/${item.id}`"
            >
              編集
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else-if="!isLoading && !errorMessage" class="px-4 py-10 text-center text-sm text-slate-500">
      条件に一致する物件はありません。
    </div>
    <div v-else-if="isLoading" class="px-4 py-10 text-center text-sm text-slate-500">
      読み込み中です。
    </div>
    <div v-else class="px-4 py-10 text-center text-sm text-red-600">
      {{ errorMessage }}
    </div>
    <div class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
      <p class="text-sm text-slate-500">
        {{ totalCount > 0 ? `${page} / ${totalPages} ページ` : '0 / 1 ページ' }}
      </p>
      <div class="flex items-center gap-2">
        <button
          class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          :disabled="!canGoPrev || isLoading"
          @click="$emit('prevPage')"
        >
          前へ
        </button>
        <button
          class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          :disabled="!canGoNext || isLoading"
          @click="$emit('nextPage')"
        >
          次へ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropertyListItem } from '~/types/models'

defineProps<{
  items: PropertyListItem[]
  page: number
  totalCount: number
  totalPages: number
  canGoPrev: boolean
  canGoNext: boolean
  isLoading: boolean
  errorMessage: string
}>()

defineEmits<{
  prevPage: []
  nextPage: []
}>()

const formatUpdatedAt = (value: string) => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
</script>

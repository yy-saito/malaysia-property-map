<template>
  <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
    <div class="grid gap-4 md:grid-cols-4">
      <input
        :value="keyword"
        class="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-0"
        placeholder="物件名で検索"
        @input="handleKeywordInput"
        @keyup.enter="emit('search')"
      >
      <select
        :value="completionFilter"
        class="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-0"
        @change="handleCompletionFilterChange"
      >
        <option value="all">すべて</option>
        <option value="incomplete">不足情報あり</option>
        <option value="complete">補完済み</option>
      </select>
      <select
        :value="pageSize"
        class="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-0"
        @change="handlePageSizeChange"
      >
        <option value="20">20件</option>
        <option value="50">50件</option>
        <option value="100">100件</option>
      </select>
      <button
        class="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
        type="button"
        @click="emit('search')"
      >
        検索
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropertyListFilter, PropertyListPageSize } from '~/types/models'

defineProps<{
  keyword: string
  completionFilter: PropertyListFilter
  pageSize: PropertyListPageSize
}>()

const emit = defineEmits<{
  'update:keyword': [value: string]
  'update:completionFilter': [value: PropertyListFilter]
  'update:pageSize': [value: PropertyListPageSize]
  search: []
}>()

const handleKeywordInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  emit('update:keyword', target?.value ?? '')
}

const handleCompletionFilterChange = (event: Event) => {
  const target = event.target as HTMLSelectElement | null
  emit('update:completionFilter', (target?.value ?? 'all') as PropertyListFilter)
}

const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement | null
  const nextValue = Number(target?.value ?? 20) as PropertyListPageSize
  emit('update:pageSize', nextValue)
}
</script>

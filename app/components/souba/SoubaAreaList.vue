<template>
  <div>
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-semibold text-slate-900">エリア一覧</h2>
      <p class="text-xs font-medium text-slate-500">{{ items.length }} 件</p>
    </div>
    <div class="mt-3 space-y-3">
      <button
        v-for="item in items"
        :key="item.id"
        class="block w-full rounded-2xl border bg-white p-4 text-left transition"
        :class="selectedAreaId === item.id ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'"
        type="button"
        @click="$emit('select', item.id)"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-slate-900">{{ item.name }}</p>
            <p class="mt-2 text-xs leading-5 text-slate-500">
              {{ item.postalCode || item.stateName || 'Malaysia' }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs font-medium text-slate-500">平均価格</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">RM {{ formatPrice(item.averagePrice) }}</p>
          </div>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{{ item.transactionCount }} 件</span>
          <span>{{ formatFloorArea(item.averageFloorArea) }}</span>
        </div>
      </button>
      <div v-if="items.length === 0" class="rounded-2xl border border-slate-200 bg-white p-4">
        <p class="text-sm font-semibold text-slate-900">表示できるエリアがありません</p>
        <p class="mt-2 text-xs leading-5 text-slate-500">取り込み済みデータとフィルタ条件を確認してください。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SoubaAreaStat } from '~/types/models'

defineProps<{
  items: SoubaAreaStat[]
  selectedAreaId: string | null
}>()

defineEmits<{
  select: [areaId: string]
}>()

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-MY', {
    maximumFractionDigits: 0,
  }).format(value)
}

const formatFloorArea = (value: number | null) => {
  if (!value) {
    return '面積データなし'
  }

  return `${new Intl.NumberFormat('en-MY', { maximumFractionDigits: 0 }).format(value)} sq ft`
}
</script>

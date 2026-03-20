<template>
  <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
    <div class="rounded-2xl bg-slate-50 p-4">
      <p class="text-xs font-medium text-slate-500">対象エリア</p>
      <p class="mt-2 text-xl font-semibold text-slate-900">{{ summary.areaCount }}</p>
    </div>
    <div class="rounded-2xl bg-slate-50 p-4">
      <p class="text-xs font-medium text-slate-500">取引件数</p>
      <p class="mt-2 text-xl font-semibold text-slate-900">{{ summary.transactionCount }}</p>
    </div>
    <div class="rounded-2xl bg-slate-50 p-4">
      <p class="text-xs font-medium text-slate-500">平均価格</p>
      <p class="mt-2 text-xl font-semibold text-slate-900">RM {{ formatPrice(summary.averagePrice) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SoubaSummary } from '~/types/models'

defineProps<{
  summary: SoubaSummary
}>()

const formatPrice = (value: number) => {
  if (!value) {
    return '-'
  }

  return new Intl.NumberFormat('en-MY', {
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <div
    class="relative h-full w-full overflow-hidden"
    style="min-height: 420px; background: radial-gradient(circle at top, rgba(45, 212, 191, 0.28), transparent 32%), linear-gradient(180deg, #0f172a 0%, #111827 100%);"
  >
    <div
      class="absolute inset-0"
      style="background-image: linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 48px 48px;"
    />
    <div class="relative grid h-full gap-4 p-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div class="flex items-end">
        <div class="max-w-xl rounded-3xl bg-white/10 p-8 backdrop-blur">
          <p class="text-xs font-semibold uppercase text-teal-300" style="letter-spacing: 0.28em;">Live Summary</p>
          <h2 class="mt-3 text-2xl font-semibold text-white">
            {{ selectedArea ? selectedArea.name : 'エリアを選択してください' }}
          </h2>
          <p class="mt-3 text-sm leading-6 text-slate-300">
            {{ selectedAreaDescription }}
          </p>
        </div>
      </div>
      <div class="grid content-start gap-3">
        <div class="rounded-3xl bg-white/10 p-5 backdrop-blur">
          <p class="text-xs font-medium text-slate-300">取引件数</p>
          <p class="mt-2 text-3xl font-semibold text-white">
            {{ selectedArea ? selectedArea.transactionCount : 0 }}
          </p>
        </div>
        <div class="rounded-3xl bg-white/10 p-5 backdrop-blur">
          <p class="text-xs font-medium text-slate-300">平均価格</p>
          <p class="mt-2 text-3xl font-semibold text-white">
            RM {{ selectedArea ? formatPrice(selectedArea.averagePrice) : '-' }}
          </p>
        </div>
        <div class="rounded-3xl bg-white/10 p-5 backdrop-blur">
          <p class="text-xs font-medium text-slate-300">平均面積</p>
          <p class="mt-2 text-3xl font-semibold text-white">
            {{ selectedArea ? formatFloorArea(selectedArea.averageFloorArea) : '-' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SoubaAreaStat } from '~/types/models'

const props = defineProps<{
  selectedArea: SoubaAreaStat | null
  isLoading: boolean
}>()

const selectedAreaDescription = computed(() => {
  if (props.isLoading) {
    return '相場データを読み込み中です。'
  }

  if (!props.selectedArea) {
    return '州または郵便番号エリアごとの取引データを読み込んだ後、ここに選択エリアの概要を表示します。'
  }

  return `${props.selectedArea.transactionCount} 件の取引から算出した相場です。${props.selectedArea.postalCode ? `郵便番号 ${props.selectedArea.postalCode} を中心に集計しています。` : '州単位で集計しています。'}`
})

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-MY', {
    maximumFractionDigits: 0,
  }).format(value)
}

const formatFloorArea = (value: number | null) => {
  if (!value) {
    return '-'
  }

  return `${new Intl.NumberFormat('en-MY', { maximumFractionDigits: 0 }).format(value)} sq ft`
}
</script>

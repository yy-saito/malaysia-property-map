<template>
  <div>
    <p
      class="text-xs font-semibold uppercase text-teal-700"
      style="letter-spacing: 0.24em"
    >
      相場マップ
    </p>
    <h1 class="mt-3 text-2xl font-semibold text-slate-900">
      マレーシアのコンド相場
    </h1>
    <p class="mt-3 text-sm leading-6 text-slate-600">
      州と駅エリアを切り替えながら、相場帯と取引状況を直感的に確認します。
    </p>
    <div class="mt-6 space-y-4">
      <div>
        <label class="text-xs font-medium text-slate-500">表示レベル</label>
        <div class="mt-2 grid grid-cols-2 gap-2">
          <button
            class="rounded-full px-4 py-2 text-sm font-medium"
            :class="
              areaLevel === 'state'
                ? 'bg-slate-900 text-white'
                : 'border border-slate-300 bg-white text-slate-700'
            "
            type="button"
            @click="$emit('update:areaLevel', 'state')"
          >
            州
          </button>
          <button
            class="rounded-full px-4 py-2 text-sm font-medium"
            :class="
              areaLevel === 'station_area'
                ? 'bg-slate-900 text-white'
                : 'border border-slate-300 bg-white text-slate-700'
            "
            type="button"
            @click="$emit('update:areaLevel', 'station_area')"
          >
            駅エリア
          </button>
        </div>
      </div>
      <div>
        <label class="text-xs font-medium text-slate-500">価格帯</label>
        <div class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="option in priceBandOptions"
            :key="option.value"
            class="rounded-full px-3 py-2 text-xs font-medium"
            :class="
              priceBand === option.value
                ? 'bg-teal-700 text-white'
                : 'border border-slate-300 bg-white text-slate-700'
            "
            type="button"
            @click="$emit('update:priceBand', option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SoubaAreaLevel, SoubaPriceBand } from "~/types/models";

defineProps<{
  areaLevel: SoubaAreaLevel;
  priceBand: SoubaPriceBand;
}>();

defineEmits<{
  "update:areaLevel": [value: SoubaAreaLevel];
  "update:priceBand": [value: SoubaPriceBand];
}>();

const priceBandOptions: Array<{ value: SoubaPriceBand; label: string }> = [
  { value: "all", label: "全価格帯" },
  { value: "low", label: "低価格" },
  { value: "mid", label: "中価格" },
  { value: "high", label: "高価格" },
];
</script>

<template lang="pug">
div.rounded-2xl.bg-white.p-5.shadow-sm.ring-1.ring-slate-200
  div.grid.gap-4(class="md:grid-cols-3")
    input.rounded-xl.border.border-slate-300.px-4.py-3.text-sm.outline-none.ring-0(
      :value="keyword"
      placeholder="物件名で検索"
      @input="emit('update:keyword', ($event.target as HTMLInputElement).value)"
      @keyup.enter="emit('search')"
    )
    select.rounded-xl.border.border-slate-300.px-4.py-3.text-sm.outline-none.ring-0(
      :value="completionFilter"
      @change="emit('update:completionFilter', ($event.target as HTMLSelectElement).value)"
    )
      option(value="all") すべて
      option(value="incomplete") 不足情報あり
      option(value="complete") 補完済み
    button.rounded-xl.bg-slate-900.px-4.py-3.text-sm.font-medium.text-white(type="button" @click="emit('search')") 検索
</template>

<script setup lang="ts">
import type { PropertyListFilter } from '~/types/models'

defineProps<{
  keyword: string
  completionFilter: PropertyListFilter
}>()

const emit = defineEmits<{
  'update:keyword': [value: string]
  'update:completionFilter': [value: PropertyListFilter]
  search: []
}>()
</script>

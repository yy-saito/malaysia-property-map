<template lang="pug">
div.overflow-hidden.rounded-2xl.bg-white.shadow-sm.ring-1.ring-slate-200
  div.flex.items-center.justify-between.border-b.border-slate-200.bg-slate-50.px-4.py-3
    p.text-sm.font-medium.text-slate-600 物件一覧
    p.text-sm.text-slate-500 {{ items.length }} 件
  table.min-w-full.divide-y.divide-slate-200.text-sm(v-if="items.length > 0")
    thead.bg-slate-50
      tr
        th.px-4.py-3.text-left.font-medium.text-slate-500 物件名
        th.px-4.py-3.text-left.font-medium.text-slate-500 郵便番号
        th.px-4.py-3.text-left.font-medium.text-slate-500 completed_year
        th.px-4.py-3.text-left.font-medium.text-slate-500 完了フラグ
        th.px-4.py-3.text-left.font-medium.text-slate-500 更新日時
        th.px-4.py-3.text-left.font-medium.text-slate-500
    tbody.bg-white
      tr.border-t.border-slate-100(v-for="item in items" :key="item.id")
        td.px-4.py-4.font-medium.text-slate-900 {{ item.scheme_name }}
        td.px-4.py-4.text-slate-600 {{ item.postal_code || '-' }}
        td.px-4.py-4.text-slate-600 {{ item.completed_year || '-' }}
        td.px-4.py-4
          span.rounded-full.px-3.py-1.text-xs.font-semibold(
            :class="item.is_data_complete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'"
          ) {{ item.is_data_complete ? '補完済み' : '不足あり' }}
        td.px-4.py-4.text-slate-500 {{ formatUpdatedAt(item.updated_at) }}
        td.px-4.py-4.text-right
          NuxtLink.text-sm.font-medium.text-slate-700(class="hover:text-slate-900" :to="`/admin/properties/${item.id}`") 編集
  div.px-4.py-10.text-center.text-sm.text-slate-500(v-else-if="!isLoading && !errorMessage")
    | 条件に一致する物件はありません。
  div.px-4.py-10.text-center.text-sm.text-slate-500(v-else-if="isLoading")
    | 読み込み中です。
  div.px-4.py-10.text-center.text-sm.text-red-600(v-else)
    | {{ errorMessage }}
</template>

<script setup lang="ts">
import type { PropertyListItem } from '~/types/models'

defineProps<{
  items: PropertyListItem[]
  isLoading: boolean
  errorMessage: string
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

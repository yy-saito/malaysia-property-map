<template lang="pug">
div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
  div.flex.items-center.justify-between
    h2.text-lg.font-semibold.text-slate-900 {{ title }}
    button.rounded-full.bg-slate-900.px-4.py-2.text-sm.font-medium.text-white(type="button") 追加
  div.mt-6.overflow-hidden.rounded-2xl.border.border-slate-200
    table.min-w-full.divide-y.divide-slate-200.text-sm
      thead.bg-slate-50
        tr
          th.px-4.py-3.text-left.font-medium.text-slate-500 名前
          th.px-4.py-3.text-left.font-medium.text-slate-500 メール
          th.px-4.py-3.text-left.font-medium.text-slate-500 ロール
      tbody.bg-white
        tr
          td.px-4.py-4.text-slate-500(colspan="3") データ接続後に一覧を表示します。
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

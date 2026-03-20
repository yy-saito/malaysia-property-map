<template lang="pug">
div.overflow-hidden.rounded-2xl.bg-white.shadow-sm.ring-1.ring-slate-200
  table.min-w-full.divide-y.divide-slate-200.text-sm
    thead.bg-slate-50
      tr
        th.px-4.py-3.text-left.font-medium.text-slate-500 物件名
        th.px-4.py-3.text-left.font-medium.text-slate-500 郵便番号
        th.px-4.py-3.text-left.font-medium.text-slate-500 completed_year
        th.px-4.py-3.text-left.font-medium.text-slate-500 完了フラグ
        th.px-4.py-3.text-left.font-medium.text-slate-500
    tbody.bg-white
      tr
        td.px-4.py-4.text-slate-500(colspan="5") データ接続後に物件一覧を表示します。
</template>

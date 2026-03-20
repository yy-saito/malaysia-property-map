<template lang="pug">
div
  div.flex.items-center.justify-between
    h2.text-sm.font-semibold.text-slate-900 エリア一覧
    button.text-xs.font-medium.text-slate-500(type="button") 並び替え
  div.mt-3.space-y-3
    div.rounded-2xl.border.border-slate-200.bg-white.p-4
      p.text-sm.font-semibold.text-slate-900 データ接続待ち
      p.mt-2.text-xs.leading-5.text-slate-500 RPC / Edge Functions 接続後にエリア一覧を表示します。
</template>

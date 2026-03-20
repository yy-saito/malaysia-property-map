<template lang="pug">
div.grid.gap-6.lg:grid-cols-[minmax(0,1fr)_320px]
  div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
    h2.text-lg.font-semibold.text-slate-900 取り込みサマリー
    div.mt-6.grid.gap-4.sm:grid-cols-3
      DashboardStatCard(title="対象行" value="0" description="取り込み対象")
      DashboardStatCard(title="登録物件" value="0" description="物件マスター")
      DashboardStatCard(title="不足情報" value="0" description="手動補完対象")
  div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
    h2.text-lg.font-semibold.text-slate-900 不足情報
    p.mt-3.text-sm.leading-6.text-slate-600 不足情報がある物件をここから一覧確認できるようにします。
</template>

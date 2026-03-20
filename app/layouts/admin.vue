<template lang="pug">
div.min-h-screen.bg-slate-100
  div.flex.min-h-screen
    aside.hidden.w-72.border-r.border-slate-200.bg-slate-950.text-slate-100.lg:block
      div.px-6.py-6.text-lg.font-semibold Malaysia Property Map
      nav.flex.flex-col.gap-1.px-3.pb-6.text-sm
        NuxtLink.rounded-lg.px-3.py-2.hover:bg-slate-900(to="/admin") ダッシュボード
        NuxtLink.rounded-lg.px-3.py-2.hover:bg-slate-900(to="/admin/properties") 物件管理
        NuxtLink.rounded-lg.px-3.py-2.hover:bg-slate-900(to="/admin/import") CSV取り込み
        NuxtLink.rounded-lg.px-3.py-2.hover:bg-slate-900(to="/admin/admins") 管理者
        NuxtLink.rounded-lg.px-3.py-2.hover:bg-slate-900(to="/admin/members") メンバー
    div.flex-1
      header.border-b.border-slate-200.bg-white
        div.mx-auto.flex.max-w-7xl.items-center.justify-between.px-6.py-4
          p.text-sm.font-medium.text-slate-500 管理画面
          NuxtLink.text-sm.text-slate-600.hover:text-slate-900(to="/souba") 公開画面へ
      main.mx-auto.max-w-7xl.px-6.py-8
        slot
</template>

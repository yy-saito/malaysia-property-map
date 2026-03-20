<template lang="pug">
div
  p.text-xs.font-semibold.uppercase.text-teal-700(style="letter-spacing: 0.24em;") 相場マップ
  h1.mt-3.text-2xl.font-semibold.text-slate-900 マレーシアのコンド相場
  p.mt-3.text-sm.leading-6.text-slate-600 州と郵便番号エリアを切り替えながら、相場帯と取引状況を直感的に確認します。
  div.mt-6.space-y-4
    div
      label.text-xs.font-medium.text-slate-500 表示レベル
      div.mt-2.grid.grid-cols-2.gap-2
        button.rounded-full.bg-slate-900.px-4.py-2.text-sm.font-medium.text-white(type="button") 州
        button.rounded-full.border.border-slate-300.bg-white.px-4.py-2.text-sm.font-medium.text-slate-700(type="button") 郵便番号エリア
    div
      label.text-xs.font-medium.text-slate-500 価格帯
      div.mt-2.flex.flex-wrap.gap-2
        button.rounded-full.bg-teal-700.px-3.py-2.text-xs.font-medium.text-white(type="button") 全価格帯
        button.rounded-full.border.border-slate-300.bg-white.px-3.py-2.text-xs.font-medium.text-slate-700(type="button") 低価格
        button.rounded-full.border.border-slate-300.bg-white.px-3.py-2.text-xs.font-medium.text-slate-700(type="button") 中価格
        button.rounded-full.border.border-slate-300.bg-white.px-3.py-2.text-xs.font-medium.text-slate-700(type="button") 高価格
</template>

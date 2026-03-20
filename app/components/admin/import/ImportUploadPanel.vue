<template lang="pug">
div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
  h2.text-lg.font-semibold.text-slate-900 CSVアップロード
  p.mt-2.text-sm.leading-6.text-slate-600 UTF-16LE / TSV を想定し、Condominium/Apartment のみ取り込みます。
  div.mt-6.rounded-2xl.border-2.border-dashed.border-slate-300.bg-slate-50.p-10.text-center
    p.text-sm.text-slate-600 ファイル選択 UI は次フェーズで実装します。
  div.mt-6.flex.justify-end
    button.rounded-xl.bg-slate-900.px-5.py-3.text-sm.font-medium.text-white(type="button") 取り込み開始
</template>

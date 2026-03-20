<template lang="pug">
div.relative.h-full.w-full.overflow-hidden(style="min-height: 420px; background: radial-gradient(circle at top, rgba(45, 212, 191, 0.28), transparent 32%), linear-gradient(180deg, #0f172a 0%, #111827 100%);")
  div.absolute.inset-0(style="background-image: linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 48px 48px;")
  div.relative.flex.h-full.items-center.justify-center
    div.max-w-md.rounded-3xl.bg-white/10.p-8.text-center.backdrop-blur
      p.text-xs.font-semibold.uppercase.text-teal-300(style="letter-spacing: 0.28em;") Map Placeholder
      h2.mt-3.text-2xl.font-semibold.text-white Leaflet 実装前のプレースホルダ
      p.mt-3.text-sm.leading-6.text-slate-300 州 / 郵便番号エリア単位のヒートマップとポップアップをここへ実装します。
</template>

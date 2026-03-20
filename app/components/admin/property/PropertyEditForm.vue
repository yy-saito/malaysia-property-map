<template lang="pug">
form.space-y-6
  div.grid.gap-6(class="lg:grid-cols-2")
    div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
      h2.text-lg.font-semibold.text-slate-900 基本情報
      div.mt-5.space-y-4
        input.w-full.rounded-xl.border.border-slate-300.px-4.py-3.text-sm(placeholder="Scheme Name")
        input.w-full.rounded-xl.border.border-slate-300.px-4.py-3.text-sm(placeholder="Postal Code")
        input.w-full.rounded-xl.border.border-slate-300.px-4.py-3.text-sm(placeholder="Completed Year")
    div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
      h2.text-lg.font-semibold.text-slate-900 補足情報
      textarea.h-48.w-full.rounded-xl.border.border-slate-300.px-4.py-3.text-sm(placeholder="物件ノート")
  div.flex.justify-end
    button.rounded-xl.bg-slate-900.px-5.py-3.text-sm.font-medium.text-white(type="submit") 保存
</template>

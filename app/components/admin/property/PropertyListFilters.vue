<template lang="pug">
div.rounded-2xl.bg-white.p-5.shadow-sm.ring-1.ring-slate-200
  div.grid.gap-4(class="md:grid-cols-3")
    input.rounded-xl.border.border-slate-300.px-4.py-3.text-sm.outline-none.ring-0(placeholder="物件名で検索")
    select.rounded-xl.border.border-slate-300.px-4.py-3.text-sm.outline-none.ring-0
      option(value="all") すべて
      option(value="incomplete") 不足情報あり
      option(value="complete") 補完済み
    button.rounded-xl.bg-slate-900.px-4.py-3.text-sm.font-medium.text-white(type="button") 検索
</template>

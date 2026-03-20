<template lang="pug">
section.bg-slate-100
  div.mx-auto.flex.max-w-[1600px].flex-col.gap-6.px-4.py-4.lg:h-[calc(100vh-81px)].lg:flex-row.lg:overflow-hidden.lg:px-6
    aside.w-full.rounded-[28px].bg-white.p-4.shadow-sm.ring-1.ring-slate-200.lg:w-[360px].lg:flex-shrink-0.lg:overflow-y-auto
      SoubaMapFilters
      SoubaMapSummary.mt-6
      SoubaAreaList.mt-6
    div.min-h-[420px].flex-1.overflow-hidden.rounded-[32px].bg-slate-900.shadow-[0_24px_60px_rgba(15,23,42,0.18)]
      SoubaMapCanvas
</template>

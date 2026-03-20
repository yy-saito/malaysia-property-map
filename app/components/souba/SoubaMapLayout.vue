<template lang="pug">
section.bg-slate-100
  div.mx-auto.flex.max-w-7xl.flex-col.gap-6.px-4.py-4(
    class="lg:h-screen lg:max-w-none lg:flex-row lg:overflow-hidden lg:px-6"
    style="max-width: 1600px; height: calc(100vh - 81px);"
  )
    aside.w-full.bg-white.p-4.shadow-sm.ring-1.ring-slate-200(
      class="lg:flex-shrink-0 lg:overflow-y-auto"
      style="border-radius: 28px; width: 360px;"
    )
      SoubaMapFilters
      SoubaMapSummary.mt-6
      SoubaAreaList.mt-6
    div.flex-1.overflow-hidden.bg-slate-900(
      class="min-h-[420px]"
      style="border-radius: 32px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);"
    )
      SoubaMapCanvas
</template>

<script setup lang="ts">
import SoubaAreaList from '~/components/souba/SoubaAreaList.vue'
import SoubaMapCanvas from '~/components/souba/SoubaMapCanvas.vue'
import SoubaMapFilters from '~/components/souba/SoubaMapFilters.vue'
import SoubaMapSummary from '~/components/souba/SoubaMapSummary.vue'
</script>

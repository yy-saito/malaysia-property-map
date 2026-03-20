<template>
  <section class="bg-slate-100">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 lg:h-screen lg:max-w-none lg:flex-row lg:overflow-hidden lg:px-6"
      style="max-width: 1600px; height: calc(100vh - 81px);"
    >
      <aside
        class="w-full bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:flex-shrink-0 lg:overflow-y-auto"
        style="border-radius: 28px; width: 360px;"
      >
        <SoubaMapFilters
          :area-level="areaLevel"
          :price-band="priceBand"
          @update:area-level="areaLevel = $event"
          @update:price-band="priceBand = $event"
        />
        <SoubaMapSummary class="mt-6" :summary="summary" />
        <div v-if="errorMessage" class="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {{ errorMessage }}
        </div>
        <SoubaAreaList
          class="mt-6"
          :items="items"
          :selected-area-id="selectedArea?.id ?? null"
          @select="selectArea"
        />
      </aside>
      <div
        class="min-h-[420px] flex-1 overflow-hidden bg-slate-900"
        style="border-radius: 32px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);"
      >
        <SoubaMapCanvas
          :items="items"
          :selected-area="selectedArea"
          :is-loading="isLoading"
          @select="selectArea"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SoubaAreaList from '~/components/souba/SoubaAreaList.vue'
import SoubaMapCanvas from '~/components/souba/SoubaMapCanvas.vue'
import SoubaMapFilters from '~/components/souba/SoubaMapFilters.vue'
import SoubaMapSummary from '~/components/souba/SoubaMapSummary.vue'

const { areaLevel, priceBand, items, summary, selectedArea, isLoading, errorMessage, selectArea } = useSoubaMap()
</script>

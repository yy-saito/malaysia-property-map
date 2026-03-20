<template lang="pug">
div.min-h-screen.bg-slate-50
  header.border-b.border-slate-200.bg-white
    div.mx-auto.flex.max-w-7xl.items-center.justify-between.px-6.py-4
      NuxtLink.text-lg.font-semibold.text-slate-900(to="/") {{ t('app.name') }}
      nav.flex.items-center.gap-6.text-sm.text-slate-600
        NuxtLink(class="hover:text-slate-900" to="/souba") {{ t('nav.publicMap') }}
        NuxtLink(class="hover:text-slate-900" to="/admin") {{ t('nav.admin') }}
  main
    slot
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

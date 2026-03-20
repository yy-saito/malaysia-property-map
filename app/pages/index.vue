<template lang="pug">
section.mx-auto.max-w-5xl.px-6.py-16
  div.rounded-3xl.bg-white.p-10.shadow-sm.ring-1.ring-slate-200
    p.text-sm.font-semibold.uppercase.tracking-[0.2em].text-teal-700 Malaysia Property Map
    h1.mt-4.text-4xl.font-semibold.text-slate-900 {{ t('page.homeTitle') }}
    p.mt-4.max-w-2xl.text-base.leading-7.text-slate-600 {{ t('page.homeLead') }}
    div.mt-8.flex.flex-wrap.gap-4
      NuxtLink.inline-flex.items-center.justify-center.rounded-full.bg-slate-900.px-5.py-3.text-sm.font-medium.text-white(to="/souba")
        | {{ t('nav.publicMap') }}
      NuxtLink.inline-flex.items-center.justify-center.rounded-full.border.border-slate-300.bg-white.px-5.py-3.text-sm.font-medium.text-slate-700(to="/admin")
        | {{ t('nav.admin') }}
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

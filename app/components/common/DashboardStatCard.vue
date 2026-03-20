<template lang="pug">
div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
  p.text-sm.font-medium.text-slate-500 {{ title }}
  p.mt-3.text-3xl.font-semibold.text-slate-900 {{ value }}
  p.mt-2.text-sm.text-slate-500 {{ description }}
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  description: string
}>()
</script>

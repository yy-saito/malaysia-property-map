<template lang="pug">
section
  div.flex.flex-col.gap-2
    h1.text-2xl.font-semibold.text-slate-900 {{ title }}
    p.text-sm.leading-6.text-slate-600 {{ description }}
  div.mt-6
    slot
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

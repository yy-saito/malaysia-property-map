<template>
  <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <p class="text-sm font-medium text-slate-500">{{ title }}</p>
    <p class="mt-3 text-3xl font-semibold text-slate-900">{{ value }}</p>
    <p class="mt-2 text-sm text-slate-500">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  description: string
}>()
</script>

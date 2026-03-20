<template>
  <section>
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold text-slate-900">{{ title }}</h1>
      <p class="text-sm leading-6 text-slate-600">{{ description }}</p>
    </div>
    <div class="mt-6">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

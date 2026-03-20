<template lang="pug">
NuxtLayout(:name="layoutName")
  NuxtPage
</template>

<script setup lang="ts">
const route = useRoute()

const layoutName = computed(() => {
  if (route.path === '/admin/login') {
    return 'default'
  }

  return route.path.startsWith('/admin') ? 'admin' : 'default'
})
</script>

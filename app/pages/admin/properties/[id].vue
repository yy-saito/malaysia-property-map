<template lang="pug">
AdminPageShell(title="物件編集" description="completed_year、postal_code、note を編集します。")
  template(#default)
    PropertyEditForm
</template>

<script setup lang="ts">
import AdminPageShell from '~/components/common/AdminPageShell.vue'
import PropertyEditForm from '~/components/admin/property/PropertyEditForm.vue'
</script>

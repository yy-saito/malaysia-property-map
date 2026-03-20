<template>
  <AdminPageShell title="物件編集" description="completed_year、postal_code、note を編集します。">
    <PropertyEditForm
      :form="form"
      :is-loading="isLoading"
      :is-saving="isSaving"
      :error-message="errorMessage"
      :success-message="successMessage"
      @update:postal-code="form.postalCode = $event"
      @update:completed-year="form.completedYear = $event"
      @update:note="form.note = $event"
      @submit="handleSubmit"
    />
  </AdminPageShell>
</template>

<script setup lang="ts">
import AdminPageShell from '~/components/common/AdminPageShell.vue'
import PropertyEditForm from '~/components/admin/property/PropertyEditForm.vue'

const route = useRoute()
const propertyId = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  return id ?? ''
})

const { form, isLoading, isSaving, errorMessage, successMessage, fetchProperty, saveProperty } =
  useAdminProperty(propertyId.value)

onMounted(async () => {
  if (!propertyId.value) {
    return
  }

  await fetchProperty()
})

const handleSubmit = async () => {
  await saveProperty()
}
</script>

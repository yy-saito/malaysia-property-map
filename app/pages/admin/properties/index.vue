<template lang="pug">
AdminPageShell(title="物件管理" description="物件マスターの検索と不足情報の確認を行います。")
  template(#default)
    PropertyListFilters(
      :keyword="keyword"
      :completion-filter="completionFilter"
      @update:keyword="keyword = $event"
      @update:completion-filter="completionFilter = $event"
      @search="fetchProperties"
    )
    PropertyListTable.mt-6(
      :items="items"
      :is-loading="isLoading"
      :error-message="errorMessage"
    )
</template>

<script setup lang="ts">
import AdminPageShell from '~/components/common/AdminPageShell.vue'
import PropertyListFilters from '~/components/admin/property/PropertyListFilters.vue'
import PropertyListTable from '~/components/admin/property/PropertyListTable.vue'

const { keyword, completionFilter, items, isLoading, errorMessage, fetchProperties } = useAdminProperties()
</script>

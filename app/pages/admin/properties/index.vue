<template>
  <AdminPageShell title="物件管理" description="物件マスターの検索と不足情報の確認を行います。">
    <PropertyListFilters
      :keyword="keyword"
      :completion-filter="completionFilter"
      :page-size="pageSize"
      @update:keyword="keyword = $event"
      @update:completion-filter="completionFilter = $event"
      @update:page-size="setPageSize"
      @search="search"
    />
    <PropertyListTable
      class="mt-6"
      :items="items"
      :page="page"
      :total-count="totalCount"
      :total-pages="totalPages"
      :can-go-prev="canGoPrev"
      :can-go-next="canGoNext"
      :is-loading="isLoading"
      :error-message="errorMessage"
      @prev-page="goToPrevPage"
      @next-page="goToNextPage"
    />
  </AdminPageShell>
</template>

<script setup lang="ts">
import AdminPageShell from '~/components/common/AdminPageShell.vue'
import PropertyListFilters from '~/components/admin/property/PropertyListFilters.vue'
import PropertyListTable from '~/components/admin/property/PropertyListTable.vue'

const {
  keyword,
  completionFilter,
  page,
  pageSize,
  totalCount,
  totalPages,
  canGoPrev,
  canGoNext,
  items,
  isLoading,
  errorMessage,
  search,
  goToPrevPage,
  goToNextPage,
  setPageSize,
} = useAdminProperties()
</script>

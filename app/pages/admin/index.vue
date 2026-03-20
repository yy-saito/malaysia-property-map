<template>
  <div class="space-y-6">
    <div v-if="errorMessage" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
      {{ errorMessage }}
    </div>
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        title="物件マスター"
        :value="isLoading ? '-' : stats.propertyCount"
        description="登録物件数"
      />
      <DashboardStatCard
        title="未補完物件"
        :value="isLoading ? '-' : stats.incompletePropertyCount"
        description="is_data_complete = false"
      />
      <DashboardStatCard
        title="最新取り込み"
        :value="isLoading ? '-' : stats.latestImportLabel"
        description="CSV実行履歴"
      />
      <DashboardStatCard
        title="管理者"
        :value="isLoading ? '-' : stats.adminCount"
        description="users.role = admin"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardStatCard from '~/components/common/DashboardStatCard.vue'

const { stats, isLoading, errorMessage } = useAdminDashboard()
</script>

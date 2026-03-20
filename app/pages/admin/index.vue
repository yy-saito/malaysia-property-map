<template lang="pug">
div.grid.gap-6(class="md:grid-cols-2 xl:grid-cols-4")
  DashboardStatCard(title="物件マスター" value="0" description="登録物件数")
  DashboardStatCard(title="未補完物件" value="0" description="is_data_complete = false")
  DashboardStatCard(title="最新取り込み" value="-" description="CSV実行履歴")
  DashboardStatCard(title="管理者" value="0" description="users.role = admin")
</template>

<script setup lang="ts">
import DashboardStatCard from '~/components/common/DashboardStatCard.vue'
</script>

<template>
  <AdminPageShell title="取り込み結果" description="取り込み件数と不足情報のある物件を確認します。">
    <ImportResultPanel />
  </AdminPageShell>
</template>

<script setup lang="ts">
import AdminPageShell from '~/components/common/AdminPageShell.vue'
import ImportResultPanel from '~/components/admin/import/ImportResultPanel.vue'
</script>

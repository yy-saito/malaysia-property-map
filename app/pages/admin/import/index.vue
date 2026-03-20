<template lang="pug">
AdminPageShell(title="CSV取り込み" description="UTF-16LE / TSV 取り込みの起点画面です。")
  template(#default)
    ImportUploadPanel
</template>

<script setup lang="ts">
import AdminPageShell from '~/components/common/AdminPageShell.vue'
import ImportUploadPanel from '~/components/admin/import/ImportUploadPanel.vue'
</script>

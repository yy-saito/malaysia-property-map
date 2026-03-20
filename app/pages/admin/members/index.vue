<template>
  <AdminPageShell title="メンバー管理" description="member / premium ユーザーの状態確認用画面です。">
    <UserListCard title="メンバー一覧" />
  </AdminPageShell>
</template>

<script setup lang="ts">
import AdminPageShell from '~/components/common/AdminPageShell.vue'
import UserListCard from '~/components/common/UserListCard.vue'
</script>

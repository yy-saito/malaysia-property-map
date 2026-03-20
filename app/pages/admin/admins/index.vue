<template lang="pug">
AdminPageShell(title="管理者管理" description="Supabase Auth と users.role=admin を前提に管理者を扱います。")
  template(#default)
    UserListCard(title="管理者一覧")
</template>

<script setup lang="ts">
import AdminPageShell from '~/components/common/AdminPageShell.vue'
import UserListCard from '~/components/common/UserListCard.vue'
</script>

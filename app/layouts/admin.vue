<template>
  <div class="min-h-screen bg-slate-100">
    <div class="flex min-h-screen">
      <aside class="hidden w-72 border-r border-slate-200 bg-slate-950 text-slate-100 lg:block">
        <div class="px-6 py-6 text-lg font-semibold">Malaysia Property Map</div>
        <nav class="flex flex-col gap-1 px-3 pb-6 text-sm">
          <NuxtLink class="rounded-lg px-3 py-2 hover:bg-slate-900" to="/admin">ダッシュボード</NuxtLink>
          <NuxtLink class="rounded-lg px-3 py-2 hover:bg-slate-900" to="/admin/properties">物件管理</NuxtLink>
          <NuxtLink class="rounded-lg px-3 py-2 hover:bg-slate-900" to="/admin/import">CSV取り込み</NuxtLink>
          <NuxtLink class="rounded-lg px-3 py-2 hover:bg-slate-900" to="/admin/admins">管理者</NuxtLink>
          <NuxtLink class="rounded-lg px-3 py-2 hover:bg-slate-900" to="/admin/members">メンバー</NuxtLink>
        </nav>
      </aside>
      <div class="flex-1">
        <header class="border-b border-slate-200 bg-white">
          <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <p class="text-sm font-medium text-slate-500">管理画面</p>
              <p v-if="user" class="text-sm text-slate-900">{{ user.name }} / {{ user.email }}</p>
            </div>
            <div class="flex items-center gap-4">
              <NuxtLink class="text-sm text-slate-600 hover:text-slate-900" to="/souba">公開画面へ</NuxtLink>
              <button
                class="text-sm text-slate-600 hover:text-slate-900"
                type="button"
                @click="handleSignOut"
              >
                ログアウト
              </button>
            </div>
          </div>
        </header>
        <main class="mx-auto max-w-7xl px-6 py-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { user, signOut } = useAuthUser()

const handleSignOut = async () => {
  await signOut()
  await router.push('/admin/login')
}
</script>

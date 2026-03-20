<template>
  <section class="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
    <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div>
        <p class="text-sm font-medium text-slate-500">管理画面ログイン</p>
        <h1 class="mt-2 text-2xl font-semibold text-slate-900">Malaysia Property Map</h1>
        <p class="mt-3 text-sm leading-6 text-slate-600">管理画面は管理者アカウントのみアクセスできます。</p>
      </div>
      <form class="mt-8 space-y-5" @submit.prevent="submit">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700" for="email">メールアドレス</label>
          <input
            id="email"
            v-model="email"
            class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900"
            type="email"
            autocomplete="email"
            placeholder="yusei.yusry@gmail.com"
          >
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700" for="password">パスワード</label>
          <input
            id="password"
            v-model="password"
            class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900"
            type="password"
            autocomplete="current-password"
            placeholder="Test@12345"
          >
        </div>
        <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
        <button
          class="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          :disabled="isLoading"
        >
          {{ isLoading ? 'ログイン中...' : 'ログイン' }}
        </button>
      </form>
      <div class="mt-6 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-500">
        <p>開発用アカウント</p>
        <p>メール: yusei.yusry@gmail.com</p>
        <p>パスワード: Test@12345</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const router = useRouter()
const { signIn, signOut, isLoading } = useAuthUser()

const email = ref('yusei.yusry@gmail.com')
const password = ref('Test@12345')
const errorMessage = ref('')

const submit = async () => {
  errorMessage.value = ''

  try {
    const profile = await signIn(email.value, password.value)

    if (profile.role !== 'admin') {
      await signOut()
      errorMessage.value = '管理者アカウントのみログインできます。'
      return
    }

    await router.push('/admin')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'ログインに失敗しました。'
  }
}
</script>

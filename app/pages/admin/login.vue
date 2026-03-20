<template lang="pug">
section.flex.min-h-screen.items-center.justify-center.bg-slate-100.px-4.py-12
  div.w-full.max-w-md.rounded-3xl.bg-white.p-8.shadow-sm.ring-1.ring-slate-200
    div
      p.text-sm.font-medium.text-slate-500 管理画面ログイン
      h1.mt-2.text-2xl.font-semibold.text-slate-900 Malaysia Property Map
      p.mt-3.text-sm.leading-6.text-slate-600 管理画面は管理者アカウントのみアクセスできます。
    form.mt-8.space-y-5(@submit.prevent="submit")
      div.space-y-2
        label.text-sm.font-medium.text-slate-700(for="email") メールアドレス
        input#email.w-full.rounded-2xl.border.border-slate-300.px-4.py-3.text-sm.text-slate-900(
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="yusei.yusry@gmail.com"
        )
      div.space-y-2
        label.text-sm.font-medium.text-slate-700(for="password") パスワード
        input#password.w-full.rounded-2xl.border.border-slate-300.px-4.py-3.text-sm.text-slate-900(
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="Test@12345"
        )
      p.text-sm.text-red-600(v-if="errorMessage") {{ errorMessage }}
      button.w-full.rounded-2xl.bg-slate-900.px-5.py-3.text-sm.font-medium.text-white(
        class="disabled:cursor-not-allowed disabled:bg-slate-400"
        type="submit"
        :disabled="isLoading"
      ) {{ isLoading ? 'ログイン中...' : 'ログイン' }}
    div.mt-6.rounded-2xl.bg-slate-50.p-4.text-xs.leading-6.text-slate-500
      p 開発用アカウント
      p メール: yusei.yusry@gmail.com
      p パスワード: Test@12345
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

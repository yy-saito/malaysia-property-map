<template>
  <form class="space-y-6" @submit.prevent="$emit('submit')">
    <div v-if="isLoading" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p class="text-sm text-slate-500">読み込み中です。</p>
    </div>
    <template v-else>
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 class="text-lg font-semibold text-slate-900">基本情報</h2>
          <div class="mt-5 space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Scheme Name</label>
              <input
                :value="form.schemeName"
                class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                disabled
              >
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Resolved Address</label>
              <textarea
                :value="form.resolvedAddress"
                class="h-28 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                disabled
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Postal Code</label>
              <input
                :value="form.postalCode"
                class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900"
                placeholder="50100"
                @input="handlePostalCodeInput"
              >
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Completed Year</label>
              <input
                :value="form.completedYear"
                class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900"
                placeholder="2018"
                @input="handleCompletedYearInput"
              >
            </div>
          </div>
        </div>
        <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 class="text-lg font-semibold text-slate-900">補足情報</h2>
          <div class="mt-5 space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Tenure</label>
              <input
                :value="form.tenure"
                class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                disabled
              >
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">物件ノート</label>
              <textarea
                :value="form.note"
                class="h-48 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900"
                placeholder="物件ノート"
                @input="handleNoteInput"
              />
            </div>
          </div>
        </div>
      </div>
      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-sm text-emerald-700">{{ successMessage }}</p>
      <div class="flex justify-end">
        <button
          class="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          :disabled="isSaving"
        >
          {{ isSaving ? '保存中...' : '保存' }}
        </button>
      </div>
    </template>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  submit: []
  'update:postalCode': [value: string]
  'update:completedYear': [value: string]
  'update:note': [value: string]
}>()

defineProps<{
  form: {
    schemeName: string
    resolvedAddress: string
    postalCode: string
    tenure: string
    completedYear: string
    note: string
  }
  isLoading: boolean
  isSaving: boolean
  errorMessage: string
  successMessage: string
}>()

const handlePostalCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  emit('update:postalCode', target?.value ?? '')
}

const handleCompletedYearInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  emit('update:completedYear', target?.value ?? '')
}

const handleNoteInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement | null
  emit('update:note', target?.value ?? '')
}
</script>

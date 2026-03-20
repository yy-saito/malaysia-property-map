<template lang="pug">
form.space-y-6(@submit.prevent="$emit('submit')")
  div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200(v-if="isLoading")
    p.text-sm.text-slate-500 読み込み中です。
  template(v-else)
    div.grid.gap-6(class="lg:grid-cols-2")
      div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
        h2.text-lg.font-semibold.text-slate-900 基本情報
        div.mt-5.space-y-4
          div.space-y-2
            label.text-sm.font-medium.text-slate-700 Scheme Name
            input.w-full.rounded-xl.border.border-slate-300.bg-slate-50.px-4.py-3.text-sm.text-slate-500(
              :value="form.schemeName"
              disabled
            )
          div.space-y-2
            label.text-sm.font-medium.text-slate-700 Resolved Address
            textarea.h-28.w-full.rounded-xl.border.border-slate-300.bg-slate-50.px-4.py-3.text-sm.text-slate-500(
              :value="form.resolvedAddress"
              disabled
            )
          div.space-y-2
            label.text-sm.font-medium.text-slate-700 Postal Code
            input.w-full.rounded-xl.border.border-slate-300.px-4.py-3.text-sm.text-slate-900(
              :value="form.postalCode"
              @input="$emit('update:postalCode', ($event.target as HTMLInputElement).value)"
              placeholder="50100"
            )
          div.space-y-2
            label.text-sm.font-medium.text-slate-700 Completed Year
            input.w-full.rounded-xl.border.border-slate-300.px-4.py-3.text-sm.text-slate-900(
              :value="form.completedYear"
              @input="$emit('update:completedYear', ($event.target as HTMLInputElement).value)"
              placeholder="2018"
            )
      div.rounded-2xl.bg-white.p-6.shadow-sm.ring-1.ring-slate-200
        h2.text-lg.font-semibold.text-slate-900 補足情報
        div.mt-5.space-y-4
          div.space-y-2
            label.text-sm.font-medium.text-slate-700 Tenure
            input.w-full.rounded-xl.border.border-slate-300.bg-slate-50.px-4.py-3.text-sm.text-slate-500(
              :value="form.tenure"
              disabled
            )
          div.space-y-2
            label.text-sm.font-medium.text-slate-700 物件ノート
            textarea.h-48.w-full.rounded-xl.border.border-slate-300.px-4.py-3.text-sm.text-slate-900(
              :value="form.note"
              @input="$emit('update:note', ($event.target as HTMLTextAreaElement).value)"
              placeholder="物件ノート"
            )
    p.text-sm.text-red-600(v-if="errorMessage") {{ errorMessage }}
    p.text-sm.text-emerald-700(v-if="successMessage") {{ successMessage }}
    div.flex.justify-end
      button.rounded-xl.bg-slate-900.px-5.py-3.text-sm.font-medium.text-white(
        class="disabled:cursor-not-allowed disabled:bg-slate-400"
        type="submit"
        :disabled="isSaving"
      ) {{ isSaving ? '保存中...' : '保存' }}
</template>

<script setup lang="ts">
defineEmits<{
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
</script>

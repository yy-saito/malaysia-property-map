import { propertyRepository } from '~/repositories/propertyRepository'
import type { Property, PropertyUpdatePayload } from '~/types/models'

const normalizeNullableText = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const normalizeCompletedYear = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const parsed = Number(trimmed)
  if (!Number.isInteger(parsed)) {
    throw new Error('completed_year は整数で入力してください。')
  }

  return parsed
}

export const useAdminProperty = (propertyId: string) => {
  const property = ref<Property | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const form = reactive({
    schemeName: '',
    resolvedAddress: '',
    postalCode: '',
    tenure: '',
    completedYear: '',
    note: '',
  })

  const hydrateForm = (value: Property) => {
    form.schemeName = value.scheme_name
    form.resolvedAddress = value.resolved_address ?? ''
    form.postalCode = value.postal_code ?? ''
    form.tenure = value.tenure ?? ''
    form.completedYear = value.completed_year?.toString() ?? ''
    form.note = value.note ?? ''
  }

  const fetchProperty = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const value = await propertyRepository.fetchById(propertyId)
      property.value = value
      hydrateForm(value)
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : '物件情報の取得に失敗しました。'
    } finally {
      isLoading.value = false
    }
  }

  const saveProperty = async () => {
    isSaving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const payload: PropertyUpdatePayload = {
        postal_code: normalizeNullableText(form.postalCode),
        completed_year: normalizeCompletedYear(form.completedYear),
        note: normalizeNullableText(form.note),
      }

      const updated = await propertyRepository.update(propertyId, payload)
      property.value = updated
      hydrateForm(updated)
      successMessage.value = '物件情報を更新しました。'
      return updated
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : '物件情報の保存に失敗しました。'
      throw error
    } finally {
      isSaving.value = false
    }
  }

  return {
    property,
    form,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    fetchProperty,
    saveProperty,
  }
}

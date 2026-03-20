import { propertyRepository } from '~/repositories/propertyRepository'
import type { PropertyListFilter, PropertyListItem } from '~/types/models'

export const useAdminProperties = () => {
  const keyword = ref('')
  const completionFilter = ref<PropertyListFilter>('all')
  const items = ref<PropertyListItem[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const fetchProperties = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      items.value = await propertyRepository.fetchList({
        keyword: keyword.value.trim(),
        completionFilter: completionFilter.value,
      })
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : '物件一覧の取得に失敗しました。'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    await fetchProperties()
  })

  return {
    keyword,
    completionFilter,
    items,
    isLoading,
    errorMessage,
    fetchProperties,
  }
}

import type { PropertyListFilter, PropertyListItem, PropertyListPageSize } from '~/types/models'
import { propertyRepository } from '~/repositories/propertyRepository'

export const useAdminProperties = () => {
  const route = useRoute()
  const keyword = ref('')
  const completionFilter = ref<PropertyListFilter>('all')
  const page = ref(1)
  const pageSize = ref<PropertyListPageSize>(20)
  const totalCount = ref(0)
  const items = ref<PropertyListItem[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const fetchProperties = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const result = await propertyRepository.fetchList({
        keyword: keyword.value.trim(),
        completionFilter: completionFilter.value,
        page: page.value,
        pageSize: pageSize.value,
      })
      items.value = result.items
      totalCount.value = result.totalCount
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : '物件一覧の取得に失敗しました。'
    } finally {
      isLoading.value = false
    }
  }

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(totalCount.value / pageSize.value))
  })

  const canGoPrev = computed(() => page.value > 1)
  const canGoNext = computed(() => page.value < totalPages.value)

  const search = async () => {
    page.value = 1
    await fetchProperties()
  }

  const goToPrevPage = async () => {
    if (!canGoPrev.value) {
      return
    }

    page.value -= 1
    await fetchProperties()
  }

  const goToNextPage = async () => {
    if (!canGoNext.value) {
      return
    }

    page.value += 1
    await fetchProperties()
  }

  const setPageSize = async (value: PropertyListPageSize) => {
    pageSize.value = value
    page.value = 1
    await fetchProperties()
  }

  onMounted(async () => {
    await fetchProperties()
  })

  onActivated(async () => {
    await fetchProperties()
  })

  watch(
    () => route.fullPath,
    async (path) => {
      if (path === '/admin/properties') {
        await fetchProperties()
      }
    },
    { immediate: true },
  )

  return {
    keyword,
    completionFilter,
    page,
    pageSize,
    totalCount,
    totalPages,
    canGoPrev,
    canGoNext,
    items,
    isLoading,
    errorMessage,
    fetchProperties,
    search,
    goToPrevPage,
    goToNextPage,
    setPageSize,
  }
}

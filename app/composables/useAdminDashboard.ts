import type { AdminDashboardStats } from '~/types/models'
import { dashboardRepository } from '~/repositories/dashboardRepository'

const createInitialStats = (): AdminDashboardStats => {
  return {
    propertyCount: 0,
    incompletePropertyCount: 0,
    latestImportLabel: '-',
    adminCount: 0,
  }
}

export const useAdminDashboard = () => {
  const stats = ref<AdminDashboardStats>(createInitialStats())
  const isLoading = ref(false)
  const errorMessage = ref('')

  const fetchStats = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      stats.value = await dashboardRepository.fetchStats()
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'ダッシュボード集計の取得に失敗しました。'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    await fetchStats()
  })

  return {
    stats,
    isLoading,
    errorMessage,
    fetchStats,
  }
}

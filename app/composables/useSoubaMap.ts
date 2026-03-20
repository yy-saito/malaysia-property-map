import type { SoubaAreaStat, SoubaAreaLevel, SoubaPriceBand } from '~/types/models'
import { mapRepository } from '~/repositories/mapRepository'
import { mapAggregationService } from '~/services/mapAggregationService'
import { mapFilterService } from '~/services/mapFilterService'

export const useSoubaMap = () => {
  const areaLevel = useState<SoubaAreaLevel>('souba-area-level', () => 'state')
  const priceBand = useState<SoubaPriceBand>('souba-price-band', () => 'all')
  const items = ref<SoubaAreaStat[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const selectedAreaId = ref<string | null>(null)

  const fetchAreas = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const rows = await mapRepository.fetchTransactions()
      const aggregated = mapAggregationService.aggregateAreas(
        rows,
        mapFilterService.normalizeAreaLevel(areaLevel.value),
      )

      items.value = mapAggregationService.filterByPriceBand(
        aggregated,
        mapFilterService.normalizePriceBand(priceBand.value),
      )

      if (selectedAreaId.value && !items.value.some((item) => item.id === selectedAreaId.value)) {
        selectedAreaId.value = null
      }
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : '相場データの取得に失敗しました。'
    } finally {
      isLoading.value = false
    }
  }

  const summary = computed(() => mapAggregationService.buildSummary(items.value))

  const selectedArea = computed(() => {
    if (!selectedAreaId.value) {
      return items.value[0] ?? null
    }

    return items.value.find((item) => item.id === selectedAreaId.value) ?? null
  })

  const selectArea = (areaId: string) => {
    selectedAreaId.value = areaId
  }

  watch([areaLevel, priceBand], async () => {
    await fetchAreas()
  })

  onMounted(async () => {
    await fetchAreas()
  })

  return {
    areaLevel,
    priceBand,
    items,
    summary,
    selectedArea,
    isLoading,
    errorMessage,
    fetchAreas,
    selectArea,
  }
}

<template>
  <div
    class="relative h-full w-full overflow-hidden"
    style="min-height: 420px; background: radial-gradient(circle at top, rgba(45, 212, 191, 0.28), transparent 32%), linear-gradient(180deg, #0f172a 0%, #111827 100%);"
  >
    <div ref="mapElement" class="absolute inset-0" />
    <div class="pointer-events-none relative grid h-full gap-4 p-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div class="flex items-end">
        <div class="max-w-xl rounded-3xl bg-white/10 p-8 backdrop-blur">
          <p class="text-xs font-semibold uppercase text-teal-300" style="letter-spacing: 0.28em;">Live Summary</p>
          <h2 class="mt-3 text-2xl font-semibold text-white">
            {{ selectedArea ? selectedArea.name : 'エリアを選択してください' }}
          </h2>
          <p class="mt-3 text-sm leading-6 text-slate-300">
            {{ selectedAreaDescription }}
          </p>
        </div>
      </div>
      <div class="grid content-start gap-3">
        <div class="rounded-3xl bg-white/10 p-5 backdrop-blur">
          <p class="text-xs font-medium text-slate-300">取引件数</p>
          <p class="mt-2 text-3xl font-semibold text-white">
            {{ selectedArea ? selectedArea.transactionCount : 0 }}
          </p>
        </div>
        <div class="rounded-3xl bg-white/10 p-5 backdrop-blur">
          <p class="text-xs font-medium text-slate-300">平均価格</p>
          <p class="mt-2 text-3xl font-semibold text-white">
            RM {{ selectedArea ? formatPrice(selectedArea.averagePrice) : '-' }}
          </p>
        </div>
        <div class="rounded-3xl bg-white/10 p-5 backdrop-blur">
          <p class="text-xs font-medium text-slate-300">平均面積</p>
          <p class="mt-2 text-3xl font-semibold text-white">
            {{ selectedArea ? formatFloorArea(selectedArea.averageFloorArea) : '-' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CircleMarker, LatLngExpression, LayerGroup, Map as LeafletMap } from 'leaflet'
import type { SoubaAreaStat } from '~/types/models'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  items: SoubaAreaStat[]
  selectedArea: SoubaAreaStat | null
  isLoading: boolean
}>()

const emit = defineEmits<{
  select: [areaId: string]
}>()

const mapElement = ref<HTMLDivElement | null>(null)
let map: LeafletMap | null = null
let markerLayer: LayerGroup | null = null
const markersByAreaId = new Map<string, CircleMarker>()

const selectedAreaDescription = computed(() => {
  if (props.isLoading) {
    return '相場データを読み込み中です。'
  }

  if (!props.selectedArea) {
    return '州または駅エリアごとの取引データを読み込んだ後、ここに選択エリアの概要を表示します。'
  }

  if (props.selectedArea.areaLevel === 'station_area') {
    return `${props.selectedArea.transactionCount} 件の取引から算出した相場です。${props.selectedArea.stationName ? `${props.selectedArea.stationName} 駅圏として集計しています。` : '駅エリア単位で集計しています。'}`
  }

  return `${props.selectedArea.transactionCount} 件の取引から算出した相場です。州単位で集計しています。`
})

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-MY', {
    maximumFractionDigits: 0,
  }).format(value)
}

const formatFloorArea = (value: number | null) => {
  if (!value) {
    return '-'
  }

  return `${new Intl.NumberFormat('en-MY', { maximumFractionDigits: 0 }).format(value)} sq ft`
}

const formatLandArea = (value: number | null, unit: string | null) => {
  if (!value) {
    return '-'
  }

  const formattedValue = new Intl.NumberFormat('en-MY', { maximumFractionDigits: 0 }).format(value)
  return `${formattedValue} sq.m`
}

const formatTransactionMonth = (value: string) => {
  return value.slice(0, 7)
}

const buildPopupHtml = (item: SoubaAreaStat) => {
  const rows = item.transactions
    .map((transaction) => `
      <tr>
        <td style="padding: 4px 6px; white-space: nowrap;">${formatTransactionMonth(transaction.transactionMonth)}</td>
        <td style="padding: 4px 6px; min-width: 120px;">${transaction.schemeName}</td>
        <td style="padding: 4px 6px; white-space: nowrap;">${formatLandArea(transaction.landArea, transaction.landAreaUnit)}</td>
        <td style="padding: 4px 6px; white-space: nowrap;">${transaction.unitLevel ? `${transaction.unitLevel}階` : '-'}</td>
        <td style="padding: 4px 6px; white-space: nowrap; font-weight: 700;">RM ${formatPrice(transaction.transactionPrice)}</td>
      </tr>
    `)
    .join('')

  return `
    <div style="width: max-content; max-width: 920px;">
      <div style="font-weight: 800; font-size: 16px; margin-bottom: 4px;">${item.name}</div>
      <div style="font-size: 13px; color: #475569; margin-bottom: 2px;">平均価格: RM ${formatPrice(item.averagePrice)}</div>
      <div style="font-size: 13px; color: #475569; margin-bottom: 10px;">取引件数: ${item.transactionCount} 件</div>
      <div style="max-height: 220px; overflow: auto; border-top: 1px solid #e2e8f0; padding-top: 8px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #0f172a;">
          <thead>
            <tr style="text-align: left; color: #64748b;">
              <th style="padding: 4px 6px;">取引年月</th>
              <th style="padding: 4px 6px;">建物名</th>
              <th style="padding: 4px 6px;">面積</th>
              <th style="padding: 4px 6px;">階数</th>
              <th style="padding: 4px 6px;">金額</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `
}

const getMarkerColor = (averagePrice: number) => {
  if (averagePrice >= 1000000) {
    return '#ef4444'
  }

  if (averagePrice >= 700000) {
    return '#f59e0b'
  }

  return '#14b8a6'
}

const buildMarkerRadius = (transactionCount: number) => {
  return Math.min(24, Math.max(10, 8 + Math.log10(transactionCount + 1) * 6))
}

const getMarkerLabel = (item: SoubaAreaStat) => {
  if (item.areaLevel === 'station_area') {
    return item.stationName ?? item.stationAreaName ?? item.name
  }

  return item.name
}

const clearMarkers = () => {
  if (markerLayer) {
    markerLayer.clearLayers()
  }
  markersByAreaId.clear()
}

const updateSelectedMarker = () => {
  markersByAreaId.forEach((marker, areaId) => {
    const isSelected = props.selectedArea?.id === areaId

    marker.setStyle({
      weight: isSelected ? 3 : 1.5,
      fillOpacity: isSelected ? 0.95 : 0.78,
    })

    if (isSelected) {
      marker.openPopup()
    }
  })
}

const renderMarkers = async () => {
  if (!map || !markerLayer) {
    return
  }

  clearMarkers()

  const leaflet = await import('leaflet')
  const bounds: LatLngExpression[] = []

  props.items.forEach((item) => {
    if (item.latitude === null || item.longitude === null) {
      return
    }

    const latlng: LatLngExpression = [item.latitude, item.longitude]
    bounds.push(latlng)

    const marker = leaflet.circleMarker(latlng, {
      radius: buildMarkerRadius(item.transactionCount),
      color: '#ffffff',
      weight: props.selectedArea?.id === item.id ? 3 : 1.5,
      fillColor: getMarkerColor(item.averagePrice),
      fillOpacity: props.selectedArea?.id === item.id ? 0.95 : 0.78,
    }) as CircleMarker

    marker.bindPopup(buildPopupHtml(item), {
      maxWidth: 1000
    })
    marker.bindTooltip(getMarkerLabel(item), {
      permanent: item.areaLevel === 'station_area',
      direction: 'top',
      offset: [0, -10],
      className: 'souba-map-tooltip',
      opacity: item.areaLevel === 'station_area' ? 0.92 : 0.8,
    })
    marker.on('click', () => {
      emit('select', item.id)
    })
    markersByAreaId.set(item.id, marker)
    markerLayer?.addLayer(marker)
  })

  if (bounds.length > 0) {
    map.fitBounds(bounds, {
      padding: [32, 32],
      maxZoom: props.selectedArea ? 13 : 10,
    })
  } else {
    map.setView([3.139, 101.6869], 10)
  }

  updateSelectedMarker()
}

onMounted(async () => {
  if (!mapElement.value) {
    return
  }

  const leaflet = await import('leaflet')
  map = leaflet.map(mapElement.value, {
    zoomControl: false,
    attributionControl: true,
  }).setView([3.139, 101.6869], 10)

  leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  }).addTo(map)

  markerLayer = leaflet.layerGroup().addTo(map)
  await renderMarkers()
})

onUnmounted(() => {
  clearMarkers()
  markerLayer = null
  map?.remove()
  map = null
})

watch(
  () => props.items,
  async () => {
    await renderMarkers()
  },
  { deep: true },
)

watch(
  () => props.selectedArea?.id,
  () => {
    updateSelectedMarker()
  },
)
</script>

<style>
.souba-map-tooltip {
  border: 0;
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.86);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
  color: #f8fafc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 6px 10px;
}

.souba-map-tooltip::before {
  display: none;
}
</style>

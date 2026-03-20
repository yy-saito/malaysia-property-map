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

const selectedAreaDescription = computed(() => {
  if (props.isLoading) {
    return '相場データを読み込み中です。'
  }

  if (!props.selectedArea) {
    return '州または郵便番号エリアごとの取引データを読み込んだ後、ここに選択エリアの概要を表示します。'
  }

  return `${props.selectedArea.transactionCount} 件の取引から算出した相場です。${props.selectedArea.postalCode ? `郵便番号 ${props.selectedArea.postalCode} を中心に集計しています。` : '州単位で集計しています。'}`
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

const clearMarkers = () => {
  if (markerLayer) {
    markerLayer.clearLayers()
  }
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

    marker.bindPopup(`
      <div style="min-width: 180px;">
        <strong>${item.name}</strong><br />
        平均価格: RM ${formatPrice(item.averagePrice)}<br />
        取引件数: ${item.transactionCount} 件
      </div>
    `)
    marker.on('click', () => {
      emit('select', item.id)
    })
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
  () => [props.items, props.selectedArea?.id] as const,
  async () => {
    await renderMarkers()
  },
  { deep: true },
)
</script>

import type {
  SoubaAreaLevel,
  SoubaAreaStat,
  SoubaAreaTransaction,
  SoubaPriceBand,
  SoubaSummary,
} from '~/types/models'
import type { SoubaStationAreaMappingRow, SoubaTransactionRow } from '~/types/api'

type AggregateBucket = {
  id: string
  name: string
  areaLevel: SoubaAreaLevel
  stateName: string | null
  postalCode: string | null
  stationAreaName: string | null
  stationName: string | null
  latitude: number | null
  longitude: number | null
  transactionCount: number
  totalPrice: number
  totalFloorArea: number
  floorAreaCount: number
  latitudeSum: number
  longitudeSum: number
  coordinateCount: number
  transactions: SoubaAreaTransaction[]
}

const sortByAveragePriceDesc = (left: SoubaAreaStat, right: SoubaAreaStat) => {
  if (right.averagePrice !== left.averagePrice) {
    return right.averagePrice - left.averagePrice
  }

  return right.transactionCount - left.transactionCount
}

const createBucket = (
  id: string,
  name: string,
  areaLevel: SoubaAreaLevel,
  stateName: string | null,
  postalCode: string | null,
  stationAreaName: string | null,
  stationName: string | null,
  latitude: number | null,
  longitude: number | null,
): AggregateBucket => {
  return {
    id,
    name,
    areaLevel,
    stateName,
    postalCode,
    stationAreaName,
    stationName,
    latitude,
    longitude,
    transactionCount: 0,
    totalPrice: 0,
    totalFloorArea: 0,
    floorAreaCount: 0,
    latitudeSum: latitude ?? 0,
    longitudeSum: longitude ?? 0,
    coordinateCount: latitude !== null && longitude !== null ? 1 : 0,
    transactions: [],
  }
}

const toAreaStat = (bucket: AggregateBucket): SoubaAreaStat => {
  return {
    id: bucket.id,
    name: bucket.name,
    areaLevel: bucket.areaLevel,
    stateName: bucket.stateName,
    postalCode: bucket.postalCode,
    stationAreaName: bucket.stationAreaName,
    stationName: bucket.stationName,
    latitude: bucket.coordinateCount > 0 ? bucket.latitudeSum / bucket.coordinateCount : bucket.latitude,
    longitude: bucket.coordinateCount > 0 ? bucket.longitudeSum / bucket.coordinateCount : bucket.longitude,
    transactionCount: bucket.transactionCount,
    averagePrice: bucket.transactionCount > 0 ? bucket.totalPrice / bucket.transactionCount : 0,
    averageFloorArea:
      bucket.floorAreaCount > 0 ? bucket.totalFloorArea / bucket.floorAreaCount : null,
    transactions: bucket.transactions
      .slice()
      .sort((left, right) => right.transactionMonth.localeCompare(left.transactionMonth)),
  }
}

const pickBand = (value: number, lowThreshold: number, highThreshold: number): SoubaPriceBand => {
  if (value < lowThreshold) {
    return 'low'
  }

  if (value >= highThreshold) {
    return 'high'
  }

  return 'mid'
}

export const mapAggregationService = {
  aggregateAreas(
    rows: SoubaTransactionRow[],
    areaLevel: SoubaAreaLevel,
    stationAreaMappings: Map<string, SoubaStationAreaMappingRow>,
  ) {
    const bucketMap = new Map<string, AggregateBucket>()

    rows.forEach((row) => {
      if (!row.area) {
        return
      }

      const sourceArea = row.area
      const normalizedStateName = sourceArea.state_name?.trim() || null
      const stationAreaMapping = row.property?.postal_code
        ? stationAreaMappings.get(row.property.postal_code)
        : null
      const normalizedStationAreaName = stationAreaMapping?.station_area_name?.trim() || null
      const normalizedStationName = stationAreaMapping?.station?.name?.trim() || null

      const bucketKey = areaLevel === 'state'
        ? normalizedStateName ?? sourceArea.display_name
        : stationAreaMapping?.id ?? sourceArea.postal_code ?? sourceArea.id

      const bucketName = areaLevel === 'state'
        ? normalizedStateName ?? sourceArea.display_name
        : normalizedStationAreaName
          ?? normalizedStationName
          ?? sourceArea.display_name

      const latitude = areaLevel === 'station_area'
        ? stationAreaMapping?.station?.latitude ?? sourceArea.latitude
        : sourceArea.latitude
      const longitude = areaLevel === 'station_area'
        ? stationAreaMapping?.station?.longitude ?? sourceArea.longitude
        : sourceArea.longitude

      const current = bucketMap.get(bucketKey) ?? createBucket(
        bucketKey,
        bucketName,
        areaLevel,
        normalizedStateName,
        areaLevel === 'station_area' ? null : sourceArea.postal_code,
        normalizedStationAreaName,
        normalizedStationName,
        latitude,
        longitude,
      )

      current.transactionCount += 1
      current.totalPrice += row.transaction_price
      current.transactions.push({
        transactionMonth: row.transaction_month,
        schemeName: row.property?.scheme_name ?? '-',
        landArea: row.land_area,
        landAreaUnit: row.land_area_unit,
        unitLevel: row.unit_level,
        transactionPrice: row.transaction_price,
      })

      if (typeof row.floor_area === 'number') {
        current.totalFloorArea += row.floor_area
        current.floorAreaCount += 1
      }

      if (typeof latitude === 'number' && typeof longitude === 'number') {
        current.latitudeSum += latitude
        current.longitudeSum += longitude
        current.coordinateCount += 1
      }

      bucketMap.set(bucketKey, current)
    })

    return [...bucketMap.values()].map(toAreaStat).sort(sortByAveragePriceDesc)
  },

  filterByPriceBand(areaStats: SoubaAreaStat[], priceBand: SoubaPriceBand) {
    if (priceBand === 'all' || areaStats.length <= 2) {
      return areaStats
    }

    const prices = areaStats
      .map((item) => item.averagePrice)
      .sort((left, right) => left - right)

    const lowThreshold = prices[Math.floor(prices.length / 3)] ?? prices[0] ?? 0
    const highThreshold = prices[Math.floor((prices.length * 2) / 3)] ?? prices[prices.length - 1] ?? 0

    return areaStats.filter((item) => pickBand(item.averagePrice, lowThreshold, highThreshold) === priceBand)
  },

  buildSummary(areaStats: SoubaAreaStat[]): SoubaSummary {
    const transactionCount = areaStats.reduce((sum, item) => sum + item.transactionCount, 0)
    const weightedPriceSum = areaStats.reduce((sum, item) => sum + (item.averagePrice * item.transactionCount), 0)

    return {
      areaCount: areaStats.length,
      transactionCount,
      averagePrice: transactionCount > 0 ? weightedPriceSum / transactionCount : 0,
    }
  },
}

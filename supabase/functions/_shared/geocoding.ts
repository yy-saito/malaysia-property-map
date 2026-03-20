import type { NormalizedTransactionRow } from './import-types.ts'

const DEFAULT_NOMINATIM_URL = 'https://nominatim.openstreetmap.org'
const LOOKUP_LIMIT = 20
const LOOKUP_INTERVAL_MS = 1100

export type GeocodedProperty = {
  schemeName: string
  resolvedAddress: string | null
  postalCode: string | null
  stateName: string | null
  postalAreaName: string | null
  latitude: number | null
  longitude: number | null
}

type NominatimAddress = {
  postcode?: string
  state?: string
  city?: string
  town?: string
  village?: string
  suburb?: string
  neighbourhood?: string
  quarter?: string
  city_district?: string
  municipality?: string
}

type NominatimResult = {
  display_name?: string
  lat?: string
  lon?: string
  address?: NominatimAddress
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const normalizeKey = (value: string) => value.trim().toLowerCase()

const toNumber = (value: string | undefined) => {
  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const extractPostalCode = (value: string | undefined) => {
  if (!value) {
    return null
  }

  const matched = value.match(/\b\d{5}\b/)
  return matched?.[0] ?? null
}

const buildPostalAreaName = (address: NominatimAddress | undefined) => {
  if (!address) {
    return null
  }

  return (
    address.suburb
    || address.neighbourhood
    || address.quarter
    || address.city_district
    || address.city
    || address.town
    || address.village
    || address.municipality
    || null
  )
}

const queryNominatim = async (query: string) => {
  const baseUrl = Deno.env.get('IMPORT_NOMINATIM_URL') ?? DEFAULT_NOMINATIM_URL
  const url = new URL('/search', baseUrl)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '1')

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'malaysia-property-map/0.1 (local development import)',
    },
  })

  if (!response.ok) {
    throw new Error(`nominatim_request_failed:${response.status}`)
  }

  const results = await response.json() as NominatimResult[]
  return results[0] ?? null
}

const geocodeRow = async (row: NormalizedTransactionRow): Promise<GeocodedProperty | null> => {
  const queries = [
    [row.schemeName, row.roadName, row.district, 'Malaysia'].filter(Boolean).join(', '),
    [row.schemeName, row.district, 'Malaysia'].filter(Boolean).join(', '),
    [row.schemeName, 'Malaysia'].filter(Boolean).join(', '),
  ]

  for (const query of queries) {
    if (!query) {
      continue
    }

    let result: NominatimResult | null = null

    try {
      result = await queryNominatim(query)
    } catch (error) {
      console.warn('nominatim lookup failed', {
        query,
        error: error instanceof Error ? error.message : String(error),
      })
      continue
    }

    if (!result) {
      continue
    }

    const postalCode = extractPostalCode(result.address?.postcode)
    const stateName = result.address?.state ?? row.district ?? null

    return {
      schemeName: row.schemeName,
      resolvedAddress: result.display_name ?? null,
      postalCode,
      stateName,
      postalAreaName: buildPostalAreaName(result.address),
      latitude: toNumber(result.lat),
      longitude: toNumber(result.lon),
    }
  }

  return {
    schemeName: row.schemeName,
    resolvedAddress: null,
    postalCode: null,
    stateName: row.district ?? null,
    postalAreaName: null,
    latitude: null,
    longitude: null,
  }
}

export const geocodeProperties = async (
  rows: NormalizedTransactionRow[],
  existingPostalCodes: Map<string, string | null>,
) => {
  const uniqueRows = new Map<string, NormalizedTransactionRow>()

  rows.forEach((row) => {
    const key = normalizeKey(row.schemeName)

    if (existingPostalCodes.get(key)) {
      return
    }

    if (!uniqueRows.has(key)) {
      uniqueRows.set(key, row)
    }
  })

  const targets = [...uniqueRows.values()].slice(0, LOOKUP_LIMIT)
  const geocodedMap = new Map<string, GeocodedProperty>()

  for (const [index, row] of targets.entries()) {
    const geocoded = await geocodeRow(row)
    if (geocoded) {
      geocodedMap.set(normalizeKey(row.schemeName), geocoded)
    }

    if (index < targets.length - 1) {
      await sleep(LOOKUP_INTERVAL_MS)
    }
  }

  return geocodedMap
}

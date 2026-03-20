import { createClient } from 'npm:@supabase/supabase-js@2'
import { buildImportPreview } from './import-parser.ts'
import { geocodeProperties, type GeocodedProperty } from './geocoding.ts'
import type {
  ImportPayload,
  ImportPreview,
  ImportSkippedRow,
  NormalizedTransactionRow,
} from './import-types.ts'

const PROPERTY_TYPE_CODE = 'condominium_apartment'

type SupabaseAdmin = ReturnType<typeof createClient>

type PropertyTypeRow = {
  id: string
  code: string
}

type AreaRow = {
  id: string
  area_level: number
  state_name: string | null
  postal_code?: string | null
  latitude?: number | null
  longitude?: number | null
}

type PropertyRow = {
  id: string
  scheme_name: string
  area_id?: string | null
  resolved_address?: string | null
  postal_code: string | null
  is_data_complete: boolean
}

const normalizeKey = (value: string) => value.trim().toLowerCase()
const toNullableText = (value: string | null | undefined) => {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const createAdminClient = () => {
  const url = Deno.env.get('IMPORT_SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('IMPORT_SUPABASE_SERVICE_ROLE_KEY')

  if (!url || !serviceRoleKey) {
    throw new Error('IMPORT_SUPABASE_URL and IMPORT_SUPABASE_SERVICE_ROLE_KEY are required')
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

const getPropertyType = async (supabase: SupabaseAdmin) => {
  const { data, error } = await supabase
    .from('property_types')
    .select('id, code')
    .eq('code', PROPERTY_TYPE_CODE)
    .single<PropertyTypeRow>()

  if (error || !data) {
    throw new Error(`property_type_not_found:${PROPERTY_TYPE_CODE}`)
  }

  return data
}

const createImportRecord = async (
  supabase: SupabaseAdmin,
  payload: ImportPayload,
) => {
  const { data, error } = await supabase
    .from('imports')
    .insert({
      executed_by_user_id: payload.executedByUserId,
      source_file_name: payload.fileName,
      status: 'processing',
    })
    .select('id')
    .single<{ id: string }>()

  if (error || !data) {
    throw new Error(`import_insert_failed:${error?.message ?? 'unknown_error'}`)
  }

  return data.id
}

const ensureStateAreas = async (
  supabase: SupabaseAdmin,
  rows: NormalizedTransactionRow[],
) => {
  const districtNames = [...new Set(
    rows
      .map((row) => row.district?.trim())
      .filter((value): value is string => Boolean(value)),
  )]

  const { data: existingAreas, error: existingError } = await supabase
    .from('areas')
    .select('id, area_level, state_name')
    .eq('area_level', 1)

  if (existingError) {
    throw new Error(`area_fetch_failed:${existingError.message}`)
  }

  const areaMap = new Map<string, AreaRow>()
  ;(existingAreas ?? []).forEach((area) => {
    if (area.state_name) {
      areaMap.set(normalizeKey(area.state_name), area as AreaRow)
    }
  })

  const missingDistricts = districtNames.filter((name) => !areaMap.has(normalizeKey(name)))

  let newAreasCount = 0

  if (missingDistricts.length > 0) {
    const insertPayload = missingDistricts.map((district) => ({
      area_level: 1,
      state_name: district,
      display_name: district,
      country: 'Malaysia',
    }))

    const { data: insertedAreas, error: insertError } = await supabase
      .from('areas')
      .insert(insertPayload)
      .select('id, area_level, state_name')

    if (insertError) {
      throw new Error(`area_insert_failed:${insertError.message}`)
    }

    ;(insertedAreas ?? []).forEach((area) => {
      if (area.state_name) {
        areaMap.set(normalizeKey(area.state_name), area as AreaRow)
      }
    })

    newAreasCount = insertedAreas?.length ?? 0
  }

  return {
    areaMap,
    newAreasCount,
  }
}

const ensureProperties = async (
  supabase: SupabaseAdmin,
  rows: NormalizedTransactionRow[],
  propertyTypeId: string,
  areaMap: Map<string, AreaRow>,
) => {
  const { data: existingProperties, error: existingError } = await supabase
    .from('properties')
    .select('id, scheme_name, area_id, resolved_address, postal_code, is_data_complete')

  if (existingError) {
    throw new Error(`property_fetch_failed:${existingError.message}`)
  }

  const propertyMap = new Map<string, PropertyRow>()
  ;(existingProperties ?? []).forEach((property) => {
    propertyMap.set(normalizeKey(property.scheme_name), property as PropertyRow)
  })

  const propertySeedMap = new Map<string, NormalizedTransactionRow>()
  rows.forEach((row) => {
    const key = normalizeKey(row.schemeName)
    if (!propertySeedMap.has(key)) {
      propertySeedMap.set(key, row)
    }
  })

  const insertPayload = [...propertySeedMap.entries()]
    .filter(([key]) => !propertyMap.has(key))
    .map(([, row]) => {
      const areaId = row.district ? areaMap.get(normalizeKey(row.district))?.id ?? null : null

      return {
        area_id: areaId,
        property_type_id: propertyTypeId,
        scheme_name: row.schemeName,
        tenure: row.tenure,
      }
    })

  let newPropertiesCount = 0

  if (insertPayload.length > 0) {
    const { data: insertedProperties, error: insertError } = await supabase
      .from('properties')
      .insert(insertPayload)
      .select('id, scheme_name, area_id, resolved_address, postal_code, is_data_complete')

    if (insertError) {
      throw new Error(`property_insert_failed:${insertError.message}`)
    }

    ;(insertedProperties ?? []).forEach((property) => {
      propertyMap.set(normalizeKey(property.scheme_name), property as PropertyRow)
    })

    newPropertiesCount = insertedProperties?.length ?? 0
  }

  return {
    propertyMap,
    newPropertiesCount,
  }
}

const ensurePostalAreas = async (
  supabase: SupabaseAdmin,
  geocodedMap: Map<string, GeocodedProperty>,
) => {
  const postalCodes = [...new Set(
    [...geocodedMap.values()]
      .map((value) => value.postalCode)
      .filter((value): value is string => Boolean(value)),
  )]

  const { data: existingAreas, error: existingError } = await supabase
    .from('areas')
    .select('id, area_level, state_name, postal_code, latitude, longitude')
    .eq('area_level', 2)

  if (existingError) {
    throw new Error(`postal_area_fetch_failed:${existingError.message}`)
  }

  const postalAreaMap = new Map<string, AreaRow>()
  ;(existingAreas ?? []).forEach((area) => {
    if (area.postal_code) {
      postalAreaMap.set(area.postal_code, area as AreaRow)
    }
  })

  const missingPostalCodes = postalCodes.filter((postalCode) => !postalAreaMap.has(postalCode))

  let newPostalAreasCount = 0

  if (missingPostalCodes.length > 0) {
    const insertPayload = missingPostalCodes.map((postalCode) => {
      const geocoded = [...geocodedMap.values()].find((value) => value.postalCode === postalCode)
      const postalAreaName = toNullableText(geocoded?.postalAreaName)
      const stateName = toNullableText(geocoded?.stateName)
      const displayName = postalAreaName
        ? `${postalCode} ${postalAreaName}`
        : stateName
          ? `${postalCode} ${stateName}`
          : postalCode

      return {
        area_level: 2,
        country: 'Malaysia',
        state_name: stateName,
        postal_code: postalCode,
        postal_area_name: postalAreaName,
        display_name: displayName,
        latitude: geocoded?.latitude ?? null,
        longitude: geocoded?.longitude ?? null,
      }
    })

    const { data: insertedAreas, error: insertError } = await supabase
      .from('areas')
      .insert(insertPayload)
      .select('id, area_level, state_name, postal_code, latitude, longitude')

    if (insertError) {
      throw new Error(`postal_area_insert_failed:${insertError.message}`)
    }

    ;(insertedAreas ?? []).forEach((area) => {
      if (area.postal_code) {
        postalAreaMap.set(area.postal_code, area as AreaRow)
      }
    })

    newPostalAreasCount = insertedAreas?.length ?? 0
  }

  return {
    postalAreaMap,
    newPostalAreasCount,
  }
}

const applyPropertyGeocoding = async (
  supabase: SupabaseAdmin,
  propertyMap: Map<string, PropertyRow>,
  geocodedMap: Map<string, GeocodedProperty>,
  postalAreaMap: Map<string, AreaRow>,
  stateAreaMap: Map<string, AreaRow>,
) => {
  const updates = [...propertyMap.entries()]
    .map(([key, property]) => {
      const geocoded = geocodedMap.get(key)
      if (!geocoded) {
        return null
      }

      const postalAreaId = geocoded.postalCode
        ? postalAreaMap.get(geocoded.postalCode)?.id ?? null
        : null
      const stateAreaId = geocoded.stateName
        ? stateAreaMap.get(normalizeKey(geocoded.stateName))?.id ?? null
        : null

      return {
        id: property.id,
        area_id: postalAreaId ?? stateAreaId ?? property.area_id ?? null,
        resolved_address: toNullableText(geocoded.resolvedAddress) ?? property.resolved_address ?? null,
        postal_code: toNullableText(geocoded.postalCode) ?? property.postal_code ?? null,
      }
    })
    .filter((value): value is NonNullable<typeof value> => Boolean(value))

  if (updates.length === 0) {
    return propertyMap
  }

  const nextPropertyMap = new Map(propertyMap)

  for (const update of updates) {
    const { data, error } = await supabase
      .from('properties')
      .update({
        area_id: update.area_id,
        resolved_address: update.resolved_address,
        postal_code: update.postal_code,
      })
      .eq('id', update.id)
      .select('id, scheme_name, area_id, resolved_address, postal_code, is_data_complete')
      .single<PropertyRow>()

    if (error || !data) {
      throw new Error(`property_geocoding_update_failed:${error?.message ?? 'unknown_error'}`)
    }

    nextPropertyMap.set(normalizeKey(data.scheme_name), data)
  }

  return nextPropertyMap
}

const insertTransactions = async (
  supabase: SupabaseAdmin,
  rows: NormalizedTransactionRow[],
  importId: string,
  propertyTypeId: string,
  areaMap: Map<string, AreaRow>,
  propertyMap: Map<string, PropertyRow>,
) => {
  const transactionPayload = rows.map((row) => {
    const property = propertyMap.get(normalizeKey(row.schemeName))
    const area = property?.area_id
      ? { id: property.area_id }
      : row.district
        ? areaMap.get(normalizeKey(row.district))
        : null

    if (!property) {
      throw new Error(`property_missing_for_transaction:${row.schemeName}`)
    }

    if (!area) {
      throw new Error(`area_missing_for_transaction:${row.district ?? 'unknown'}`)
    }

    if (!row.transactionMonth) {
      throw new Error(`transaction_month_missing:${row.schemeName}`)
    }

    return {
      area_id: area.id,
      property_type_id: propertyTypeId,
      property_id: property.id,
      import_id: importId,
      transaction_month: row.transactionMonth,
      land_area: row.landArea,
      land_area_unit: row.landAreaUnit,
      floor_area: row.floorArea,
      floor_area_unit: row.floorAreaUnit,
      unit_level: row.unitLevel,
      transaction_price: row.transactionPrice,
      source_file_name: row.sourceFileName,
    }
  })

  const { error } = await supabase
    .from('property_transactions')
    .insert(transactionPayload)

  if (error) {
    throw new Error(`transaction_insert_failed:${error.message}`)
  }
}

const updateImportStatus = async (
  supabase: SupabaseAdmin,
  importId: string,
  payload: {
    status: 'completed' | 'failed'
    totalRows?: number
    importedRows?: number
    skippedRows?: number
    newAreasCount?: number
    newPropertiesCount?: number
    unresolvedAddressesCount?: number
    unresolvedCoordinatesCount?: number
  },
) => {
  const { error } = await supabase
    .from('imports')
    .update({
      status: payload.status,
      total_rows: payload.totalRows,
      imported_rows: payload.importedRows,
      skipped_rows: payload.skippedRows,
      new_areas_count: payload.newAreasCount,
      new_properties_count: payload.newPropertiesCount,
      unresolved_addresses_count: payload.unresolvedAddressesCount,
      unresolved_coordinates_count: payload.unresolvedCoordinatesCount,
    })
    .eq('id', importId)

  if (error) {
    throw new Error(`import_update_failed:${error.message}`)
  }
}

export const persistImport = async (
  payload: ImportPayload,
  rows: NormalizedTransactionRow[],
  skipped: ImportSkippedRow[],
): Promise<ImportPreview> => {
  const supabase = createAdminClient()
  const importId = await createImportRecord(supabase, payload)

  try {
    const propertyType = await getPropertyType(supabase)
    const { areaMap, newAreasCount: newStateAreasCount } = await ensureStateAreas(supabase, rows)
    const { propertyMap, newPropertiesCount } = await ensureProperties(
      supabase,
      rows,
      propertyType.id,
      areaMap,
    )
    const existingPostalCodes = new Map(
      [...propertyMap.entries()].map(([key, property]) => [key, property.postal_code]),
    )
    const geocodedMap = await geocodeProperties(rows, existingPostalCodes)
    const { postalAreaMap, newPostalAreasCount } = await ensurePostalAreas(supabase, geocodedMap)
    const hydratedPropertyMap = await applyPropertyGeocoding(
      supabase,
      propertyMap,
      geocodedMap,
      postalAreaMap,
      areaMap,
    )

    await insertTransactions(
      supabase,
      rows,
      importId,
      propertyType.id,
      areaMap,
      hydratedPropertyMap,
    )

    const unresolvedAddressesCount = [...hydratedPropertyMap.values()].filter(
      (property) => !property.postal_code,
    ).length
    const unresolvedCoordinatesCount = [...postalAreaMap.values()].filter(
      (area) => area.latitude == null || area.longitude == null,
    ).length
    const newAreasCount = newStateAreasCount + newPostalAreasCount

    await updateImportStatus(supabase, importId, {
      status: 'completed',
      totalRows: rows.length + skipped.length,
      importedRows: rows.length,
      skippedRows: skipped.length,
      newAreasCount,
      newPropertiesCount,
      unresolvedAddressesCount,
      unresolvedCoordinatesCount,
    })

    const preview = buildImportPreview(payload, rows, skipped)
    preview.summary.newAreas = newAreasCount
    preview.summary.newProperties = newPropertiesCount
    preview.summary.unresolvedAddresses = unresolvedAddressesCount
    preview.summary.unresolvedCoordinates = unresolvedCoordinatesCount
    preview.summary.dryRun = false
    preview.properties = preview.properties.map((property) => {
      const persistedProperty = hydratedPropertyMap.get(normalizeKey(property.schemeName))

      return {
        ...property,
        hasPostalCode: Boolean(persistedProperty?.postal_code),
        isDataComplete: Boolean(persistedProperty?.is_data_complete),
      }
    })

    return preview
  } catch (error) {
    await updateImportStatus(supabase, importId, {
      status: 'failed',
      totalRows: rows.length + skipped.length,
      importedRows: 0,
      skippedRows: skipped.length,
      newAreasCount: 0,
      newPropertiesCount: 0,
      unresolvedAddressesCount: 0,
      unresolvedCoordinatesCount: 0,
    })

    throw error
  }
}

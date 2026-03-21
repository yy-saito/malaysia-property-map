export type MapAreaResponse = {
  id: string
  name: string
  area_level: 'state' | 'station_area'
}

export type ImportSkippedRow = {
  rowNumber: number
  reason: string
}

export type ImportPropertyPreview = {
  schemeName: string
  transactionCount: number
  hasPostalCode: boolean
  isDataComplete: boolean
}

export type ImportSummary = {
  sourceFileName: string
  totalRows: number
  importedRows: number
  skippedRows: number
  newAreas: number
  newProperties: number
  unresolvedAddresses: number
  unresolvedCoordinates: number
  dryRun: boolean
}

export type ImportPreviewResponse = {
  status: string
  message: string
  summary: ImportSummary
  properties: ImportPropertyPreview[]
  skipped: ImportSkippedRow[]
}

export type SoubaTransactionRow = {
  transaction_price: number
  transaction_month: string
  land_area: number | null
  land_area_unit: string | null
  floor_area: number | null
  unit_level: number | null
  property: {
    postal_code: string | null
    scheme_name: string | null
  } | null
  area: {
    id: string
    area_level: number
    state_name: string | null
    postal_code: string | null
    display_name: string
    latitude: number | null
    longitude: number | null
  } | null
}

export type SoubaStationAreaMappingRow = {
  id: string
  postal_code: string
  station_area_name: string
  state_name: string | null
  station: {
    id: string
    name: string
    latitude: number | null
    longitude: number | null
    is_major: boolean
  } | null
}

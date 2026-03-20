export type MapAreaResponse = {
  id: string
  name: string
  area_level: 'state' | 'postal_code_area'
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
  floor_area: number | null
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

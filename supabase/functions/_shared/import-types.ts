export type ImportPayload = {
  fileName: string
  contentBase64: string
  executedByUserId: string
  dryRun?: boolean
}

export type RawTransactionRow = Record<string, string>

export type NormalizedTransactionRow = {
  propertyType: string
  schemeName: string
  roadName: string | null
  district: string | null
  mukim: string | null
  tenure: string | null
  landArea: number | null
  landAreaUnit: string | null
  floorArea: number | null
  floorAreaUnit: string | null
  unitLevel: number | null
  transactionPrice: number
  transactionMonth: string | null
  sourceFileName: string
}

export type ImportSkippedRow = {
  rowNumber: number
  reason: string
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

export type ImportPreview = {
  summary: ImportSummary
  properties: Array<{
    schemeName: string
    transactionCount: number
    hasPostalCode: boolean
    isDataComplete: boolean
  }>
  skipped: ImportSkippedRow[]
}

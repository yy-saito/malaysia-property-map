import type {
  ImportPayload,
  ImportPreview,
  ImportSkippedRow,
  NormalizedTransactionRow,
  RawTransactionRow,
} from './import-types.ts'

const PROPERTY_TYPE_HEADER = 'propertytype'
const SCHEME_NAME_HEADER = 'schemenamearea'
const ROAD_NAME_HEADER = 'roadname'
const DISTRICT_HEADER = 'district'
const MUKIM_HEADER = 'mukim'
const TENURE_HEADER = 'tenure'
const LAND_AREA_HEADER = 'landparcelarea'
const MAIN_FLOOR_AREA_HEADER = 'mainfloorarea'
const UNIT_LEVEL_HEADER = 'unitlevel'
const TRANSACTION_PRICE_HEADER = 'transactionprice'
const TRANSACTION_DATE_HEADER = 'transactiondate'

const TARGET_PROPERTY_TYPE = 'Condominium/Apartment'

const normalizeHeader = (value: string) => value.replace(/^\ufeff/, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()

const parseNumber = (value: string | undefined) => {
  if (!value) {
    return null
  }

  const normalized = value.replace(/,/g, '').trim()
  if (!normalized) {
    return null
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

const parseUnitLevel = (value: string | undefined) => {
  const parsed = parseNumber(value)
  return parsed === null ? null : Math.trunc(parsed)
}

const splitAreaValue = (value: string | undefined) => {
  if (!value) {
    return { amount: null, unit: null }
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return { amount: null, unit: null }
  }

  const match = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(.*)$/)
  if (!match) {
    return { amount: null, unit: trimmed }
  }

  return {
    amount: parseNumber(match[1]),
    unit: match[2]?.trim() || null,
  }
}

const parseTransactionMonth = (value: string | undefined) => {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const directDate = new Date(trimmed)
  if (!Number.isNaN(directDate.getTime())) {
    return directDate.toISOString().slice(0, 10)
  }

  const normalized = trimmed.replace(/[./]/g, '-')
  const yearMonth = normalized.match(/^(\d{4})-(\d{1,2})$/)
  if (yearMonth) {
    return `${yearMonth[1]}-${yearMonth[2].padStart(2, '0')}-01`
  }

  const yearMonthDay = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (yearMonthDay) {
    return `${yearMonthDay[1]}-${yearMonthDay[2].padStart(2, '0')}-${yearMonthDay[3].padStart(2, '0')}`
  }

  return null
}

const decodeBase64 = (base64: string) => {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

export const decodeTransactionFile = (contentBase64: string) => {
  const bytes = decodeBase64(contentBase64)
  return new TextDecoder('utf-16le').decode(bytes)
}

export const parseTsv = (input: string): RawTransactionRow[] => {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.replace(/\r$/, ''))
    .filter((line) => line.trim().length > 0)

  if (lines.length === 0) {
    return []
  }

  const headers = lines[0].split('\t').map((header) => normalizeHeader(header))

  return lines.slice(1).map((line) => {
    const values = line.split('\t')
    const row: RawTransactionRow = {}

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? ''
    })

    return row
  })
}

export const normalizeTransactions = (
  rows: RawTransactionRow[],
  sourceFileName: string,
) => {
  const normalizedRows: NormalizedTransactionRow[] = []
  const skipped: ImportSkippedRow[] = []

  rows.forEach((row, index) => {
    const rowNumber = index + 2
    const propertyType = row[PROPERTY_TYPE_HEADER]?.trim()
    if (propertyType !== TARGET_PROPERTY_TYPE) {
      skipped.push({ rowNumber, reason: 'property_type_not_supported' })
      return
    }

    const schemeName = row[SCHEME_NAME_HEADER]?.trim()
    const transactionPrice = parseNumber(row[TRANSACTION_PRICE_HEADER])
    if (!schemeName) {
      skipped.push({ rowNumber, reason: 'scheme_name_missing' })
      return
    }

    if (transactionPrice === null) {
      skipped.push({ rowNumber, reason: 'transaction_price_invalid' })
      return
    }

    const landArea = splitAreaValue(row[LAND_AREA_HEADER])
    const floorArea = splitAreaValue(row[MAIN_FLOOR_AREA_HEADER])

    normalizedRows.push({
      propertyType,
      schemeName,
      roadName: row[ROAD_NAME_HEADER]?.trim() || null,
      district: row[DISTRICT_HEADER]?.trim() || null,
      mukim: row[MUKIM_HEADER]?.trim() || null,
      tenure: row[TENURE_HEADER]?.trim() || null,
      landArea: landArea.amount,
      landAreaUnit: landArea.unit,
      floorArea: floorArea.amount,
      floorAreaUnit: floorArea.unit,
      unitLevel: parseUnitLevel(row[UNIT_LEVEL_HEADER]),
      transactionPrice,
      transactionMonth: parseTransactionMonth(row[TRANSACTION_DATE_HEADER]),
      sourceFileName,
    })
  })

  return { normalizedRows, skipped }
}

export const buildImportPreview = (
  payload: ImportPayload,
  rows: NormalizedTransactionRow[],
  skipped: ImportSkippedRow[],
): ImportPreview => {
  const propertyMap = new Map<string, { transactionCount: number; hasPostalCode: boolean }>()

  rows.forEach((row) => {
    const current = propertyMap.get(row.schemeName) ?? {
      transactionCount: 0,
      hasPostalCode: false,
    }

    current.transactionCount += 1
    propertyMap.set(row.schemeName, current)
  })

  const properties = [...propertyMap.entries()]
    .map(([schemeName, value]) => ({
      schemeName,
      transactionCount: value.transactionCount,
      hasPostalCode: value.hasPostalCode,
      isDataComplete: value.hasPostalCode,
    }))
    .sort((left, right) => right.transactionCount - left.transactionCount)

  return {
    summary: {
      sourceFileName: payload.fileName,
      totalRows: rows.length + skipped.length,
      importedRows: rows.length,
      skippedRows: skipped.length,
      newAreas: 0,
      newProperties: properties.length,
      unresolvedAddresses: properties.length,
      unresolvedCoordinates: 0,
      dryRun: payload.dryRun ?? true,
    },
    properties,
    skipped,
  }
}

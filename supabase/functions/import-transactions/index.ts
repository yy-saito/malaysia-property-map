import { corsHeaders } from '../_shared/cors.ts'
import {
  buildImportPreview,
  decodeTransactionFile,
  normalizeTransactions,
  parseTsv,
} from '../_shared/import-parser.ts'
import type { ImportPayload } from '../_shared/import-types.ts'

const badRequest = (message: string) => {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

const assertPayload = (payload: Partial<ImportPayload>): payload is ImportPayload => {
  return Boolean(payload.fileName && payload.contentBase64 && payload.executedByUserId)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }

  let payload: Partial<ImportPayload>

  try {
    payload = await request.json()
  } catch {
    return badRequest('Invalid JSON body')
  }

  if (!assertPayload(payload)) {
    return badRequest('fileName, contentBase64, executedByUserId are required')
  }

  try {
    const decoded = decodeTransactionFile(payload.contentBase64)
    const rawRows = parseTsv(decoded)
    const { normalizedRows, skipped } = normalizeTransactions(rawRows, payload.fileName)
    const preview = buildImportPreview(payload, normalizedRows, skipped)

    return new Response(
      JSON.stringify({
        status: 'dry_run_completed',
        message: 'Import foundation is ready. Persistence and geocoding will be wired in the next step.',
        ...preview,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to process import payload',
        details: error instanceof Error ? error.message : 'unknown_error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})

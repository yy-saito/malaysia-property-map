import type { ImportPreviewResponse } from '~/types/api'
import { useSupabaseBrowserClient } from '~/lib/supabase/client'

const toBase64 = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
}

const createImportRequest = async (file: File, executedByUserId: string, dryRun: boolean) => {
  return {
    fileName: file.name,
    contentBase64: await toBase64(file),
    executedByUserId,
    dryRun,
  }
}

export const importRepository = {
  async executeImport(payload: {
    fileName: string
    contentBase64: string
    executedByUserId: string
    dryRun: boolean
  }) {
    const config = useRuntimeConfig()
    const supabase = useSupabaseBrowserClient()
    const anonKey = config.public.supabaseAnonKey
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('管理者としてログインしてください。')
    }

    return await $fetch<ImportPreviewResponse>(
      `${config.public.supabaseUrl}/functions/v1/import-transactions`,
      {
        method: 'POST',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          fileName: payload.fileName,
          contentBase64: payload.contentBase64,
          executedByUserId: payload.executedByUserId,
          dryRun: payload.dryRun,
        },
      },
    )
  },

  async startDryRun(file: File, executedByUserId: string) {
    const payload = await createImportRequest(file, executedByUserId, true)
    const response = await this.executeImport(payload)

    return {
      payload,
      response,
    }
  },
}

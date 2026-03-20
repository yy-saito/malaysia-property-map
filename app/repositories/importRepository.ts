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

export const importRepository = {
  async startImport(file: File, executedByUserId: string) {
    const config = useRuntimeConfig()
    const supabase = useSupabaseBrowserClient()
    const contentBase64 = await toBase64(file)
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
          fileName: file.name,
          contentBase64,
          executedByUserId,
          dryRun: true,
        },
      },
    )
  },
}

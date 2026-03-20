import type { ImportPreviewResponse } from '~/types/api'

const DRY_RUN_EXECUTOR_ID = '00000000-0000-0000-0000-000000000000'

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
  async startImport(file: File) {
    const config = useRuntimeConfig()
    const contentBase64 = await toBase64(file)

    return await $fetch<ImportPreviewResponse>(
      `${config.public.supabaseUrl}/functions/v1/import-transactions`,
      {
        method: 'POST',
        body: {
          fileName: file.name,
          contentBase64,
          executedByUserId: DRY_RUN_EXECUTOR_ID,
          dryRun: true,
        },
      },
    )
  },
}

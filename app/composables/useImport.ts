import type { ImportPreviewResponse } from '~/types/api'
import { importRepository } from '~/repositories/importRepository'

type StoredImportPreview = ImportPreviewResponse & {
  id: string
  createdAt: string
}

type ImportRequestPayload = {
  fileName: string
  contentBase64: string
  executedByUserId: string
  dryRun: boolean
}

const STORAGE_KEY = 'admin-import-previews'

export const useImport = () => {
  const { user } = useAuthUser()
  const isUploading = ref(false)
  const isImporting = ref(false)
  const previews = useState<Record<string, StoredImportPreview>>('import-previews', () => ({}))
  const payloads = useState<Record<string, ImportRequestPayload>>('import-payloads', () => ({}))
  const isClient = typeof window !== 'undefined'

  const persist = () => {
    if (!isClient) {
      return
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(previews.value))
  }

  const ensureHydrated = () => {
    if (!isClient || Object.keys(previews.value).length > 0) {
      return
    }

    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }

    try {
      previews.value = JSON.parse(raw) as Record<string, StoredImportPreview>
    } catch {
      previews.value = {}
    }
  }

  const startDryRun = async (file: File) => {
    if (!user.value?.id) {
      throw new Error('管理者としてログインしてください。')
    }

    isUploading.value = true

    try {
      const { payload, response } = await importRepository.startDryRun(file, user.value.id)
      const id = crypto.randomUUID()

      previews.value[id] = {
        ...response,
        id,
        createdAt: new Date().toISOString(),
      }
      payloads.value[id] = payload
      persist()

      return previews.value[id]
    } finally {
      isUploading.value = false
    }
  }

  const getPreview = (id: string) => {
    ensureHydrated()
    return previews.value[id] ?? null
  }

  const canExecuteImport = (id: string) => {
    return Boolean(payloads.value[id])
  }

  const executeImport = async (id: string) => {
    const payload = payloads.value[id]

    if (!payload) {
      throw new Error('再実行に必要な元ファイル情報が見つかりません。取り込み画面からやり直してください。')
    }

    isImporting.value = true

    try {
      const result = await importRepository.executeImport({
        ...payload,
        dryRun: false,
      })

      previews.value[id] = {
        ...result,
        id,
        createdAt: previews.value[id]?.createdAt ?? new Date().toISOString(),
      }
      persist()

      return previews.value[id]
    } finally {
      isImporting.value = false
    }
  }

  return {
    isUploading,
    isImporting,
    startDryRun,
    getPreview,
    canExecuteImport,
    executeImport,
  }
}

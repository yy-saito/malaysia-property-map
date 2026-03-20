import type { Session } from '@supabase/supabase-js'
import type { AppUser } from '~/types/models'
import { useSupabaseBrowserClient } from '~/lib/supabase/client'
import { userRepository } from '~/repositories/userRepository'

let authSubscriptionBound = false

const clearAuthState = () => {
  const user = useState<AppUser | null>('auth-user', () => null)
  const session = useState<Session | null>('auth-session', () => null)

  user.value = null
  session.value = null
}

export const useAuthUser = () => {
  const supabase = useSupabaseBrowserClient()
  const user = useState<AppUser | null>('auth-user', () => null)
  const session = useState<Session | null>('auth-session', () => null)
  const isInitialized = useState<boolean>('auth-initialized', () => false)
  const isLoading = useState<boolean>('auth-loading', () => false)

  const syncSession = async (nextSession: Session | null) => {
    session.value = nextSession

    if (!nextSession?.user?.id) {
      user.value = null
      return null
    }

    try {
      const profile = await userRepository.fetchCurrentUserByAuthId(nextSession.user.id)
      user.value = profile

      return profile
    } catch {
      user.value = null
      return null
    }
  }

  const initialize = async () => {
    if (isInitialized.value) {
      return user.value
    }

    isLoading.value = true

    try {
      if (!authSubscriptionBound) {
        supabase.auth.onAuthStateChange(async (_event, nextSession) => {
          await syncSession(nextSession)
        })
        authSubscriptionBound = true
      }

      const { data: sessionData } = await supabase.auth.getSession()
      await syncSession(sessionData.session)
      isInitialized.value = true

      return user.value
    } finally {
      isLoading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    isLoading.value = true

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      const profile = await syncSession(data.session)

      if (!profile) {
        await supabase.auth.signOut()
        clearAuthState()
        throw new Error('users テーブルに紐づくアカウント情報が見つかりません。')
      }

      return profile
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  const signOut = async () => {
    isLoading.value = true

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }

      clearAuthState()
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  return {
    user,
    session,
    isInitialized,
    isLoading,
    initialize,
    signIn,
    signOut,
  }
}

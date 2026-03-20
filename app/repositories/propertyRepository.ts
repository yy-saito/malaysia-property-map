import type { Property, PropertyListFilter, PropertyListItem, PropertyUpdatePayload } from '~/types/models'
import { useSupabaseBrowserClient } from '~/lib/supabase/client'

export const propertyRepository = {
  async fetchList(params: { keyword?: string; completionFilter?: PropertyListFilter }) {
    const client = useSupabaseBrowserClient()

    let query = client
      .from('properties')
      .select('id, scheme_name, postal_code, completed_year, is_data_complete, updated_at')
      .order('updated_at', { ascending: false })
      .limit(100)

    if (params.keyword) {
      query = query.ilike('scheme_name', `%${params.keyword}%`)
    }

    if (params.completionFilter === 'complete') {
      query = query.eq('is_data_complete', true)
    }

    if (params.completionFilter === 'incomplete') {
      query = query.eq('is_data_complete', false)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return (data ?? []) as PropertyListItem[]
  },

  async fetchById(id: string) {
    const client = useSupabaseBrowserClient()
    const { data, error } = await client
      .from('properties')
      .select('id, scheme_name, resolved_address, postal_code, tenure, completed_year, note, area_id, is_data_complete')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return data as Property
  },

  async update(id: string, payload: PropertyUpdatePayload) {
    const client = useSupabaseBrowserClient()
    const { data, error } = await client
      .from('properties')
      .update(payload)
      .eq('id', id)
      .select('id, scheme_name, resolved_address, postal_code, tenure, completed_year, note, area_id, is_data_complete')
      .single()

    if (error) {
      throw error
    }

    return data as Property
  },
}

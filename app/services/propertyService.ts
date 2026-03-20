export const propertyService = {
  isDataComplete(payload: { scheme_name?: string | null; postal_code?: string | null }) {
    return Boolean(payload.scheme_name && payload.postal_code)
  },
}

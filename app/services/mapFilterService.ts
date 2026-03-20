import type { SoubaAreaLevel, SoubaPriceBand } from '~/types/models'

export const mapFilterService = {
  normalizeAreaLevel(areaLevel: SoubaAreaLevel) {
    return areaLevel
  },

  normalizePriceBand(priceBand: SoubaPriceBand) {
    return priceBand
  },
}

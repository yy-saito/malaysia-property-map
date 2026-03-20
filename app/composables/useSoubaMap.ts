export const useSoubaMap = () => {
  const areaLevel = useState<'state' | 'postal_code_area'>('souba-area-level', () => 'state')

  return {
    areaLevel,
  }
}

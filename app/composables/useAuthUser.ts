export const useAuthUser = () => {
  const user = ref<null | { id: string; role: string }>(null)

  return {
    user,
  }
}

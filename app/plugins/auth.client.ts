export default defineNuxtPlugin(async () => {
  const { initialize } = useAuthUser()

  void initialize()
})

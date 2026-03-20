export default defineNuxtPlugin(async () => {
  const { initialize } = useAuthUser()

  await initialize()
})

export default defineNuxtRouteMiddleware(async (to) => {
  if (typeof window === 'undefined') {
    return
  }

  if (!to.path.startsWith('/admin')) {
    return
  }

  const { initialize, user } = useAuthUser()
  await initialize()

  if (to.path === '/admin/login') {
    if (user.value?.role === 'admin') {
      return navigateTo('/admin')
    }

    return
  }

  if (!user.value || user.value.role !== 'admin') {
    return navigateTo('/admin/login')
  }
})

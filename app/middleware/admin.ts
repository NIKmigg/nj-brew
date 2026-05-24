export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useLocalePath();

  const { isAdmin } = await useAuth();

  if (!isAdmin.value) {
    return navigateTo({
      path: localePath("/login"),
      query: {
        redirect: to.fullPath,
      },
    });
  }
});

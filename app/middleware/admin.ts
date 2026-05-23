export default defineNuxtRouteMiddleware(async () => {
  const localePath = useLocalePath();

  const { isAdmin } = await useAuth();

  if (!isAdmin.value) {
    return navigateTo(localePath("/login"));
  }
});

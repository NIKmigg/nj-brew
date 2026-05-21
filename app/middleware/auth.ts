import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useLocalePath();
  const { data: session } = await authClient.useSession(useFetch);

  if (!session.value?.user) {
    return navigateTo({ path: localePath("/login"), query: { redirect: to.fullPath } });
  }
});

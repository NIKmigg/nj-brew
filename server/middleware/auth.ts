import { auth } from "@server/lib/auth";

const protectedRoutes = [
  "/market",
  "/generator",
  "/user",
  "/cart",
];

const localePrefixes = [
  "/en",
];

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const localePrefix = localePrefixes.find(prefix => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`));
  const path = localePrefix ? url.pathname.slice(localePrefix.length) || "/" : url.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path === route || path.startsWith(`${route}/`));

  if (!isProtectedRoute) {
    return;
  }

  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    const redirect = encodeURIComponent(`${url.pathname}${url.search}`);
    const loginPath = localePrefix ? `${localePrefix}/login` : "/login";

    return sendRedirect(event, `${loginPath}?redirect=${redirect}`, 302);
  }

  event.context.session = session;
});

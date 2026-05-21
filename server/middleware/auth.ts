import { auth } from "../lib/auth";

const protectedRoutes = [
  "/info",
  "/generator",
];

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const path = url.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path === route || path.startsWith(`${route}/`));

  if (!isProtectedRoute) {
    return;
  }

  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    const redirect = encodeURIComponent(`${url.pathname}${url.search}`);

    return sendRedirect(event, `/login?redirect=${redirect}`, 302);
  }

  event.context.session = session;
});

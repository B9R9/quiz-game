import { log } from "../utils/logger.js";

export const auhtMiddleware = async ({ request, response, state }, next) => {
  const authenticated = await state.session.get("authenticated");
  if (
    (request.url.pathname.startsWith("/topics") ||
      request.url.pathname.startsWith("/hello")) &&
    !authenticated
  ) {
    log("User not authenticated", "warning", "authMiddleware.js");
    response.redirect("/auth/login");
    log("Redirected to login", "info", "authMiddleware.js");
  } else {
    await next();
  }
};

import { log } from "./logger.js";

export const getCookies = async (state) => {
  try {
    const authenticated = await state.session.get("authenticated");
    if (!authenticated) {
      return { authenticated: false, user: {} };
    }
    const user = await state.session.get("user");
    return { authenticated, user };
  } catch (error) {
    log(error.message, "error", "cookiesHandler");
    return { authenticated: false, user: {} }; // Valeur par défaut en cas d'erreur
  }
};

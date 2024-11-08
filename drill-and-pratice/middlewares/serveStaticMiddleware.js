import { send } from "../deps.js";

const serveStaticMiddleware = async (context, next) => {
  const filePath = context.request.url.pathname;

  // Vérifiez si le chemin commence par /css ou /js
  if (filePath.startsWith("/css") || filePath.startsWith("/js")) {
    try {
      await send(context, filePath, {
        root: `/assets`,
      });
    } catch (error) {
      console.error("Error serving static file:", error);
      await next();
    }
  } else {
    await next();
  }
};

export { serveStaticMiddleware };

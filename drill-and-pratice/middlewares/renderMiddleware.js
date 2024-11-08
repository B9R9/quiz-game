import { configure, renderFile } from "../deps.js";

configure({
  views: `./src/drill-and-pratice/views/`,
});

const renderMiddleware = async (context, next) => {
  context.render = async (file, data) => {
    context.response.headers.set("Content-Type", "text/html; charset=utf-8");
    context.response.body = await renderFile(file, data);
  };

  await next();
};

export { renderMiddleware };

import { Application } from "./deps.js";
import { Session } from "./deps.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { auhtMiddleware } from "./middlewares/authMiddleware.js";
import { corsMiddleware } from "./middlewares/corsMiddleware.js";

import { router } from "./routes/routes.js";

const app = new Application();

app.use(Session.initMiddleware());

app.use(corsMiddleware);
app.use(serveStaticMiddleware);
app.use(errorMiddleware);
app.use(renderMiddleware);
app.use(auhtMiddleware);
app.use(router.routes());

export { app };

import { app } from "./app.js";
import { log } from "./utils/logger.js";

const port = 7777;
app.listen({ port });
log(`Server is running on port ${port}`, "success", "run-locally.js");

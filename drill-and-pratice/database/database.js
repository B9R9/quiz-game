import { neon } from "@neon/serverless";
import { log } from "../utils/logger.js";

const mode = Deno.env.get("MODE");
log(`Mode: ${mode}`, "info", "database.js");

let sql;

async function initializeSQL() {
  if (mode === "PROD") {
    const databaseUrl = Deno.env.get("DATABASE_PROD_URL");
    log(`Database URL: PROD DB`, "info", "database.js");
    sql = neon(databaseUrl);
  } else if (mode === "DEV") {
    const databaseUrl = Deno.env.get("DATABASE_DEV_URL");
    console.log(databaseUrl);
    log(`Database URL: DEV DB`, "info", "database.js");
    sql = neon(databaseUrl);
  }

  // Test the connection
  if (sql) {
    const result =
      await sql`SELECT ${"Database"} || ' is connected' as message`;
    log(result[0].message, "info", "database.js");
  } else {
    log("Failed to initialize SQL client.", "error", "database.js");
  }
}

await initializeSQL();

export { sql };

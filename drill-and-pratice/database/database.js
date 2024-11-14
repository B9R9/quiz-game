import { neon } from "@neon/serverless";
import { log } from "../utils/logger.js";
import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";

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
  } else if (mode === "SQL") {
    log(`Database URL: SQL`, "info", "database.js");
    sql = postgres({
      user: Deno.env.get("PG_DEV_USER"),
      database: Deno.env.get("PG_DEV_DB"),
      hostname: Deno.env.get("PG_DEV_HOST"),
      password: Deno.env.get("PG_DEV_PASSWORD"),
      port: parseInt(Deno.env.get("PG_DEV_PORT")),
    });
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

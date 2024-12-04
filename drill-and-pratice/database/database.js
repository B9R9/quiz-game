import { log } from "../utils/logger.js";
import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";

/**
 * Get configuration based on the mode.
 */
function getConfig(mode, env) {
  log(`Initializing database for mode: ${mode}`, "info", "database.js");
  log(`Environment: ${JSON.stringify(env)}`, "info", "database.js");
  if (mode === "PROD") {
    return { client: "neon", databaseUrl: env.DATABASE_PROD_URL };
  } else if (mode === "DEV") {
    return { client: "neon", databaseUrl: env.DATABASE_DEV_URL };
  } else if (mode === "LOCAL" || !mode) {
    return {
      client: "postgres",
      config: {
        user: env.PG_DEV_USER || "testuser",
        database: env.PG_DEV_DB || "testdb",
        hostname: env.PG_DEV_HOST || "localhost",
        password: env.PG_DEV_PASSWORD || "testpassword",
        port: parseInt(env.PG_DEV_PORT) || 5432,
      },
    };
  } else if (mode === "TEST" || !mode) {
    return {
      client: "postgres",
      config: {
        user: env.PG_DEV_USER || "admin",
        database: env.PG_DEV_DB || "db-prod",
        hostname: "localhost",
        password: env.PG_DEV_PASSWORD || "xyz",
        port: parseInt(env.PG_DEV_PORT) || 5432,
      },
    };
  } else {
    throw new Error(`Invalid mode: ${mode}`);
  }
}

/**
 * Initialize SQL client based on configuration.
 */
async function initializeSQL(config) {
  let sql;

  if (config.client === "neon") {
    const { neon } = await import("../deps.js");
    sql = neon(config.databaseUrl);
  } else if (config.client === "postgres") {
    sql = postgres(config.config);
  }

  // Test the connection  by running a simple query
  log("Testing database connection", "info", "database.js");
  if (sql) {
    const result =
      await sql`SELECT ${"Database"} || ' is connected' as message`;
    log(result[0].message, "info", "database.js");
    return sql;
  } else {
    log("Failed to initialize SQL client.", "error", "database.js");
    throw new Error("SQL client initialization failed");
  }
}

const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
const sql = await initializeSQL(config);

export { sql };

export { getConfig, initializeSQL };

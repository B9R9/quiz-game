import { neon } from "../deps.js";
import { log } from "../utils/logger.js";
import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";

/**
 * Get configuration based on the mode.
 */
function getConfig(mode, env) {
  if (mode === "PROD") {
    return { client: "neon", databaseUrl: env.DATABASE_PROD_URL };
  } else if (mode === "DEV") {
    return { client: "neon", databaseUrl: env.DATABASE_DEV_URL };
  } else if (mode === "LOCAL") {
    return {
      client: "postgres",
      config: {
        user: env.PG_DEV_USER,
        database: env.PG_DEV_DB,
        hostname: env.PG_DEV_HOST,
        password: env.PG_DEV_PASSWORD,
        port: parseInt(env.PG_DEV_PORT),
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
    log(
      `Initializing Neon client for: ${config.databaseUrl}`,
      "info",
      "database.js"
    );
    sql = neon(config.databaseUrl);
  } else if (config.client === "postgres") {
    log(`Initializing Postgres client`, "info", "database.js");
    sql = postgres(config.config);
  }

  // Test the connection
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

import { neon } from "@neon/serverless";
import { log } from "../utils/logger.js";

const mode = Deno.env.get("MODE");

let sql;

// async function executeQuery(query, params) {
//   let result;
//   log(`Executing query: ${query}`, "info", "database.js");
//   if (mode === "DEV") {
//     result = await client.query(query, params);
//   } else if (mode === "PROD") {
//     result = await client.sql(query);
//   }
//   console.log(result);
//   return result;
// }

if (mode === "PROD") {
  const databaseUrl = Deno.env.get("DATABASE_PROD_URL");
  log(`Database URL: PROD DB`, "info", "database.js");
  sql = neon(databaseUrl);
  log("Checking database connection...", "info", "database.js");
  const result = await sql`SELECT ${"Database"} || ' is connected' as message`;
  log(result[0].message, "info", "database.js");
}
if (mode === "DEV") {
  const databaseUrl = Deno.env.get("DATABASE_DEV_URL");
  log(`Database URL: DEV DB`, "info", "database.js");
  sql = neon(databaseUrl);
  log("Checking database connection...", "info", "database.js");
  const result = await sql`SELECT ${"Database"} || ' is connected' as message`;
  log(result[0].message, "info", "database.js");
}

export { sql };

import postgres from "https://deno.land/x/postgresjs@v3.4.2/mod.js";

let connection;

const db = Deno.env.get("MODE");
console.log("MODE: ", db);

if (Deno.env.get("DATABASE_URL")) {
  console.log("Using DATABASE_URL");
  connection = postgres(Deno.env.get("DATABASE_URL"));
} else {
  console.log("Using local database");
  connection = postgres({
    database: "db-prod",
    host: "postgres",
    port: 5432,
    user: "admin",
    password: "xyz",
  });
}

export { connection };

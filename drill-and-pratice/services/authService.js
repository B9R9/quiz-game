import { sql } from "../database/database.js";

export const createUser = async (hash, data) => {
  try {
    await sql`INSERT INTO users (email, username, password) VALUES (${data.email}, ${data.username}, ${hash})`;
  } catch (e) {
    console.log(e);
  }
};

export const getUserByEmail = async (email) => {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result;
  } catch (e) {
    console.log(e);
  }
};

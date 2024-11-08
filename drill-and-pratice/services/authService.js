import { connection } from "../database/database.js";

export const createUser = async (hash, data) => {
  try {
    await connection`INSERT INTO users (email, username, password) VALUES (${data.email}, ${data.username}, ${hash})`;
  } catch (e) {
    console.log(e);
  }
};

export const getUserByEmail = async (email) => {
  try {
    const result = await connection`SELECT * FROM users WHERE email = ${email}`;
    return result;
  } catch (e) {
    console.log(e);
  }
};

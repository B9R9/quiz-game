export const createUser = async (sql, hash, data) => {
  try {
    await sql`INSERT INTO users (email, username, password) VALUES (${data.email}, ${data.username}, ${hash})`;
    return { success: true };
  } catch (e) {
    console.error("Error in createUser:", e);
    return { success: false, error: e.message };
  }
};

export const getUserByEmail = async (sql, email) => {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (result.length === 0) {
      return { success: false, data: null, error: "User not found" };
    }
    return { success: true, data: result };
  } catch (e) {
    console.error("Error in getUserByEmail:", e);
    return { success: false, error: e.message };
  }
};

import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.203.0/assert/mod.ts";
import { createUser, getUserByEmail } from "../../services/authService.js";

// Mock de la fonction sql
const sql = {
  query: async (query, ...params) => {
    console.log("Mock SQL Query:", query, params);
    if (query.includes("INSERT INTO users")) {
      return { rowCount: 1 };
    }
    if (query.includes("SELECT * FROM users WHERE email")) {
      return [
        {
          id: 1,
          email: params[0],
          username: "testuser",
          password: "hashedpassword",
        },
      ];
    }
    return [];
  },
};

// Remplacez la fonction sql par le mock
const originalSql = sql.query;
sql.query = mockSql.query;

Deno.test("createUser - should insert a new user", async () => {
  const hash = "hashedpassword";
  const data = { email: "test@example.com", username: "testuser" };

  await createUser(hash, data);

  // Vérifiez que la fonction sql a été appelée avec les bons paramètres
  assertEquals(
    mockSql.query.calls[0].args[0],
    "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)"
  );
  assertEquals(mockSql.query.calls[0].args[1], data.email);
  assertEquals(mockSql.query.calls[0].args[2], data.username);
  assertEquals(mockSql.query.calls[0].args[3], hash);
});

Deno.test("getUserByEmail - should return user data", async () => {
  const email = "test@example.com";

  const result = await getUserByEmail(email);

  const expectedUser = {
    id: 1,
    email: "test@example.com",
    username: "testuser",
    password: "hashedpassword",
  };

  assertObjectMatch(result[0], expectedUser);
});

// Restaurer la fonction sql originale après les tests
sql.query = originalSql;

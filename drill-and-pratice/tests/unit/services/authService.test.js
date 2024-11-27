import * as authService from "../../../services/authService.js";
import { assertEquals } from "jsr:@std/assert";

// Mock SQL client
const sql = (strings, ...values) => {
  const query = strings.join("?"); // Remplace les variables par des ?
  if (
    query === "INSERT INTO users (email, username, password) VALUES (?, ?, ?)"
  ) {
    const [email, username, password] = values;
    if (
      email === "test@example.com" &&
      username === "testuser" &&
      password === "hashedPassword"
    ) {
      return true;
    }
  } else if (query === "SELECT * FROM users WHERE email = ?") {
    const [email] = values;
    if (email === "test@example.com") {
      return [
        {
          email: "test@example.com",
          username: "testuser",
          password: "hashedPassword",
        },
      ];
    } else if (email === "nonexistent@example.com") {
      return [];
    }
  }

  console.error("Query not recognized:", query, "Values:", values);
  throw new Error("Query not recognized");
};

Deno.test({
  name: "createUser should insert a new user and return success",
  async fn() {
    // Arrange
    const userData = {
      email: "test@example.com",
      username: "testuser",
      password: "password",
    };
    const hash = "hashedPassword";

    // Act
    const result = await authService.createUser(sql, hash, userData);

    // Assert
    assertEquals(result.success, true);
  },
});

Deno.test({
  name: "getUserByEmail should return user data if email exists",
  async fn() {
    // Arrange
    const email = "test@example.com";

    // Act
    const result = await authService.getUserByEmail(sql, email);

    // Assert
    assertEquals(result.success, true);
    assertEquals(result.data.email, email);
  },
});

Deno.test({
  name: "getUserByEmail should return an error if email does not exist",
  async fn() {
    // Arrange
    const email = "nonexistent@example.com";

    // Act
    const result = await authService.getUserByEmail(sql, email);
    console.log("Result:", result);

    // Assert
    assertEquals(result.success, false);
    assertEquals(result.error, "User not found");
  },
});

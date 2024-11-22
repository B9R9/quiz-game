import {
  showRegistrationForm,
  showLoginForm,
  register,
  login,
  logout,
} from "../../routes/controllers/authController.js";
import { sql, initializeSQL, getConfig } from "../../database/database.js";
import { assertEquals } from "jsr:@std/assert";

// Mock render function
const mockRender = (template, data) => {
  mockRender.lastTemplate = template;
  mockRender.lastData = data;
};

Deno.test({
  name: "showRegistrationForm - should render registration form",
  async fn() {
    const context = { render: mockRender };

    showRegistrationForm({ render: mockRender });

    assertEquals(mockRender.lastTemplate, "register.eta");
  },
});

Deno.test({
  name: "showLogin - should render Loginform",
  async fn() {
    const context = { render: mockRender };

    showLoginForm({ render: mockRender });

    assertEquals(mockRender.lastTemplate, "login.eta");
  },
});

Deno.test({
  name: "register - should register user",
  async fn() {
    try {
      const config = getConfig("LOCAL", Deno.env.toObject());
      const sql = await initializeSQL(config);

      const mockRequest = {
        body: () => ({
          value: Promise.resolve({
            get: (key) => {
              switch (key) {
                case "email":
                  return "test@testregister.test";
                case "username":
                  return "test_register";
                case "password":
                  return "Test@1234";
                case "confirmPW":
                  return "Test@1234";
                default:
                  return "";
              }
            },
            has: (key) =>
              ["email", "username", "password", "confirmPW"].includes(key),
          }),
        }),
      };

      const mockResponse = {
        redirect: (url) => (mockResponse.lastRedirect = url),
        lastRedirect: null,
      };

      await register({ request: mockRequest, response: mockResponse });

      const user =
        await sql`SELECT * FROM users WHERE username = 'test_register';`;
      assertEquals(user.length, 1);
      assertEquals(user[0].email, "test@testregister.test");
      assertEquals(user[0].username, "test_register");

      await sql`DELETE FROM users WHERE username = 'test_register';`;
    } finally {
      await sql.end();
    }
  },
});

Deno.test({
  name: "login - should login user",
  async fn() {
    const mockRegisterRequest = {
      body: () => ({
        value: Promise.resolve({
          get: (key) => {
            switch (key) {
              case "email":
                return "testLogUser@test.test";
              case "username":
                return "testLogUser";
              case "password":
                return "Test@1234";
              case "confirmPW":
                return "Test@1234";
              default:
                return "";
            }
          },
          has: (key) =>
            ["email", "username", "password", "confirmPW"].includes(key),
        }),
      }),
    };

    const mockRegisterResponse = {
      redirect: (url) => (mockRegisterResponse.lastRedirect = url),
      lastRedirect: null,
    };

    await register({
      request: mockRegisterRequest,
      response: mockRegisterResponse,
    });

    const mockLoginRequest = {
      body: () => ({
        value: Promise.resolve({
          get: (key) => {
            switch (key) {
              case "email":
                return "testLogUser@test.test";
              case "password":
                return "Test@1234";
              default:
                return "";
            }
          },
        }),
      }),
    };

    const mockLoginResponse = {
      redirect: (url) => (mockLoginResponse.lastRedirect = url),
      lastRedirect: null,
    };

    const mockState = {
      session: {
        set: async (key, value) => {
          if (key === "authenticated") {
            mockState.authenticated = value;
          }
          if (key === "user") {
            mockState.user = value;
          }
        },
      },
    };

    await login({
      request: mockLoginRequest,
      response: mockLoginResponse,
      state: mockState,
    });
    console.log("MockLoginResponse:", mockLoginResponse.lastRedirect);
    assertEquals(mockLoginResponse.lastRedirect, "/topics");

    const config = getConfig("LOCAL", Deno.env.toObject());
    const sql = await initializeSQL(config);

    const user = await sql`SELECT * FROM users WHERE username = 'testLogUser';`;
    assertEquals(user.length, 1);
    assertEquals(mockState.authenticated, true);
    assertEquals(mockState.user.id, user[0].id);

    await sql`DELETE FROM users WHERE username = 'testLogUser';`;
    await sql.end();
  },
});

Deno.test({
  name: "Login - should redirect to login if user does not exist",
  async fn() {
    const mockLoginRequest = {
      body: () => ({
        value: Promise.resolve({
          get: (key) => {
            switch (key) {
              case "email":
                return "testLogUser@test.test";
              case "password":
                return "Test@1234";
              default:
                return "";
            }
          },
        }),
      }),
    };

    const mockLoginResponse = {
      redirect: (url) => (mockLoginResponse.lastRedirect = url),
      lastRedirect: null,
    };

    const mockState = {
      session: {
        set: async (key, value) => {
          if (key === "authenticated") {
            mockState.authenticated = value;
          }
          if (key === "user") {
            mockState.user = value;
          }
        },
      },
    };

    await login({
      request: mockLoginRequest,
      response: mockLoginResponse,
      state: mockState,
    });

    assertEquals(mockLoginResponse.lastRedirect, "/auth/login");

    const config = getConfig("LOCAL", Deno.env.toObject());
    const sql = await initializeSQL(config);

    const user = await sql`SELECT * FROM users WHERE username = 'testLogUser';`;
    assertEquals(user.length, 0);
    assertEquals(mockState.authenticated, undefined);
    await sql.end();
  },
});

Deno.test({
  name: "Login - should redirect to login if password is incorrect",
  async fn() {
    const mockRegisterRequest = {
      body: () => ({
        value: Promise.resolve({
          get: (key) => {
            switch (key) {
              case "email":
                return "testLogUser-WrongPassword@test.test";
              case "username":
                return "testLogUser-WrongPassword";
              case "password":
                return "Test@1234";
              case "confirmPW":
                return "Test@1234";
              default:
                return "";
            }
          },
          has: (key) =>
            ["email", "username", "password", "confirmPW"].includes(key),
        }),
      }),
    };

    const mockRegisterResponse = {
      redirect: (url) => (mockRegisterResponse.lastRedirect = url),
      lastRedirect: null,
    };

    await register({
      request: mockRegisterRequest,
      response: mockRegisterResponse,
    });

    const mockLoginRequest = {
      body: () => ({
        value: Promise.resolve({
          get: (key) => {
            switch (key) {
              case "email":
                return "testLogUser-WrongPassword@test.test";
              case "password":
                return "WrongPassword";
              default:
                return "";
            }
          },
        }),
      }),
    };

    const mockLoginResponse = {
      redirect: (url) => (mockLoginResponse.lastRedirect = url),
      lastRedirect: null,
    };

    const mockState = {
      session: {
        set: async (key, value) => {
          if (key === "authenticated") {
            mockState.authenticated = value;
          }
          if (key === "user") {
            mockState.user = value;
          }
        },
      },
    };

    await login({
      request: mockLoginRequest,
      response: mockLoginResponse,
      state: mockState,
    });

    assertEquals(mockLoginResponse.lastRedirect, "/auth/login", "Redirect");

    assertEquals(mockState.authenticated, undefined, "Authenticated");

    assertEquals(mockRender.lastTemplate, "login.eta", "Template");
    // assertEquals(
    //   mockRender.lastData.errors[0],
    //   "Invalid email or password",
    //   "Error message"
    // );
    const config = getConfig("LOCAL", Deno.env.toObject());
    const sql = await initializeSQL(config);

    await sql`DELETE FROM users WHERE username = 'testLogUser-WrongPassword';`;

    await sql.end();
  },
});

Deno.test({
  name: "Logout - should logout user",
  async fn() {
    const mockState = {
      session: {
        set: async (key, value) => {
          if (key === "authenticated") {
            mockState.authenticated = value;
          }
          if (key === "user") {
            mockState.user = value;
          }
        },
      },
    };

    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };

    await logout({ response: mockResponse, state: mockState });

    assertEquals(mockState.authenticated, false);
    assertEquals(mockState.user, null);
  },
});

Deno.test({
  name: "Logout - should redirect to root",
  async fn() {
    const mockState = {
      session: {
        set: async (key, value) => {
          if (key === "authenticated") {
            mockState.authenticated = value;
          }
          if (key === "user") {
            mockState.user = value;
          }
        },
      },
    };

    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };

    await logout({ response: mockResponse, state: mockState });

    assertEquals(mockResponse.lastRedirect, "/");
  },
});

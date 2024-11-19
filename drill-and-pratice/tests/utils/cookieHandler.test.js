import { assertObjectMatch } from "https://deno.land/std@0.203.0/testing/asserts.ts";
import { getCookies } from "../../utils/cookiesHandler.js";

Deno.test(
  "should return authenticated false and empty user if session is not authenticated",
  async () => {
    const state = {
      session: {
        get: async (key) => {
          if (key === "authenticated") return false;
          return null;
        },
      },
    };

    const result = await getCookies(state);
    assertObjectMatch(result, { authenticated: false, user: {} });
  }
);

Deno.test(
  "should return authenticated true and user details if session is authenticated",
  async () => {
    const state = {
      session: {
        get: async (key) => {
          if (key === "authenticated") return true;
          if (key === "user") return { id: 1, name: "John Doe" };
          return null;
        },
      },
    };

    const result = await getCookies(state);
    assertObjectMatch(result, {
      authenticated: true,
      user: { id: 1, name: "John Doe" },
    });
  }
);

Deno.test("should handle exceptions gracefully", async () => {
  const state = {
    session: {
      get: async () => {
        throw new Error("Session error");
      },
    },
  };

  try {
    await getCookies(state);
  } catch (error) {
    assertObjectMatch(error.message, "Session error");
  }
});

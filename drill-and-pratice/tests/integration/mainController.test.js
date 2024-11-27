import { assertEquals } from "jsr:@std/assert";
import * as mainController from "../../routes/controllers/mainController.js";

// Mock render function
const mockRender = (template, data) => {
  mockRender.lastTemplate = template;
  mockRender.lastData = data;
};

Deno.test({
  name: "showMain should render main.eta with data",
  async fn() {
    const context = { render: mockRender };
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
        get: async (key) => {
          if (key === "authenticated") return true;
          if (key === "user") return { id: 1001, username: "test_user" };
        },
      },
    };

    await mainController.showMain({ render: mockRender, state: mockState });

    assertEquals(mockRender.lastTemplate, "main.eta");
    assertEquals(mockRender.lastData.user.username, "test_user");
  },
});

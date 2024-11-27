import {
  showTopics,
  showTopic,
  addTopic,
  deleteTopic,
} from "../../routes/controllers/topicsController.js";
import { getConfig, initializeSQL } from "../../database/database.js";
import { assertEquals } from "jsr:@std/assert";
import {
  mockValidState,
  mockValidUserState,
  mockUnvalidState,
  validQId,
  validUser,
  validTId,
  unValidQId,
  questionIdWithNoOptions,
  tidWithNoquestions,
} from "../utils/mock.js";

const mockRender = (template, data) => {
  mockRender.lastTemplate = template;
  mockRender.lastData = data;
};

Deno.test(
  "showTopics should redirect to login if user is not authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    await showTopics({ response, state: mockUnvalidState, render: mockRender });
  }
);

Deno.test(
  "showTopics should render topics.eta if user is authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    await showTopics({ response, state: mockValidState, render: mockRender });
    assertEquals(mockRender.lastTemplate, "topics.eta");
  }
);

Deno.test(
  "showTopic should redirect to login if user is not authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    await showTopic({ response, state: mockUnvalidState, render: mockRender });
  }
);

Deno.test(
  "showTopic should render topic.eta if user is authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    const params = { id: validTId };

    await showTopic({
      params,
      render: mockRender,
      state: mockValidState,
      response,
    });
    assertEquals(mockRender.lastTemplate, "topic.eta");
  }
);

Deno.test("ShowTopic should render 404.eta if topic not found", async () => {
  const response = {
    redirect: (path) => {
      assertEquals(path, "/auth/login");
    },
  };
  const params = { id: 999 };

  await showTopic({
    params,
    render: mockRender,
    state: mockValidState,
    response,
  });
  assertEquals(mockRender.lastTemplate, "404.eta");
});

Deno.test(
  "addTopic should redirect to login if user is not authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    await addTopic({
      request: {},
      response,
      state: mockUnvalidState,
      render: mockRender,
    });
  }
);

// Deno.test(
//   "addTopic should redirect to /topics if user is authenticated",
//   async () => {
//     const response = {
//       redirect: (path) => {
//         assertEquals(path, "/topics");
//       },
//     };
//     const mockRequest = {
//       body: () => ({
//         value: Promise.resolve({
//           get: (key) => {
//             switch (key) {
//               case "name":
//                 return "AddTopic - should redirect to /topics if user is authenticated";
//               default:
//                 return "";
//             }
//           },
//           has: (key) => ["name"].includes(key),
//         }),
//       }),
//     };

//     await addTopic({
//       request: mockRequest,
//       response,
//       state: mockValidState,
//       render: mockRender,
//     });

//     const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
//     const sql = await initializeSQL(config);
//     try {
//       const result =
//         await sql`SELECT * FROM topics WHERE name = 'AddTopic - should redirect to /topics if user is authenticated'`;
//       assertEquals(result.length, 1);
//       await sql`DELETE FROM topics WHERE name = 'AddTopic - should redirect to /topics if user is authenticated'`;
//     } finally {
//       await sql.end();
//     }
//   }
// );

Deno.test(
  "deleteTopic should redirect to login if user is not authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    await deleteTopic({ params: {}, response, state: mockUnvalidState });
  }
);

Deno.test(
  "deleteTopic should redirect to /topics if user is authenticated and not admin",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/topics");
      },
    };
    await deleteTopic({ params: {}, response, state: mockValidUserState });
  }
);

// Deno.test(
//   "deleteTopic should delete topic if user is authenticated and admin",
//   async () => {
//     const response = {
//       redirect: (path) => {
//         assertEquals(path, "/topics");
//       },
//     };
//     const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
//     const sql = await initializeSQL(config);

//     await sql`INSERT INTO topics (name, user_id) VALUES ('Topics to delete for test', 6)`;
//     const ret =
//       await sql`SELECT * FROM topics WHERE name = 'Topics to delete for test'`;
//     const params = { id: ret[0].id };

//     await deleteTopic({
//       params,
//       response,
//       state: mockValidState,
//     });

//     try {
//       const result = await sql`SELECT * FROM topics WHERE id = ${params.id}`;
//       assertEquals(result.length, 0);
//     } finally {
//       await sql.end();
//     }
//   }
// );

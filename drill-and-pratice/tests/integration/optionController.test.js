import {
  addOptions,
  showOptions,
  deleteOptions,
} from "../../routes/controllers/optionsController.js";
import { sql, getConfig, initializeSQL } from "../../database/database.js";
import { assertEquals } from "jsr:@std/assert";

Deno.test(
  "addOptions - should add options to the database and redirect",
  async () => {
    const config = getConfig("LOCAL", Deno.env.toObject());
    const sql = await initializeSQL(config);
    // Préparer la base de données pour le test
    await sql`INSERT INTO users (id, username) VALUES (1000, 'test_user_addOptions');`;
    await sql`INSERT INTO topics (id, user_id, name) VALUES (1000, 1000, 'Sample topic');`;
    await sql`INSERT INTO questions (id, topic_id, question_text, user_id) VALUES (1000, 1000, 'Sample question', 1000);`;

    const mockRequest = {
      body: () => ({
        value: Promise.resolve({
          getAll: (key) =>
            key === "option_text[]" ? ["Option 1", "Option 2"] : [],
          has: (key) => key === "is_correct[0]",
        }),
      }),
    };

    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };

    const mockParams = { qid: "1000", tid: "1000" };

    // Appeler la fonction
    await addOptions({
      request: mockRequest,
      response: mockResponse,
      params: mockParams,
    });

    // Vérifier les options ajoutées dans la base
    const options =
      await sql`SELECT * FROM question_answer_options WHERE question_id = 1000;`;
    assertEquals(options.length, 2);
    assertEquals(options[0].option_text, "Option 1");
    assertEquals(options[0].is_correct, true);

    // Vérifier la redirection
    assertEquals(mockResponse.lastRedirect, "/topics/1000/questions/1000");

    // Supprimer les données de test
    await sql`DELETE FROM question_answer_options WHERE question_id = 1000;`;
    await sql`DELETE FROM questions WHERE id = 1000;`;
    await sql`DELETE FROM topics WHERE id = 1000;`;
    await sql`DELETE FROM users WHERE id = 1000;`;

    await sql.end();
  }
);

Deno.test("showOptions - should render options page", async () => {
  const config = getConfig("LOCAL", Deno.env.toObject());
  const sql = await initializeSQL(config);
  // Préparer les données de test
  await sql`INSERT INTO users (id, username) VALUES (1001, 'test_user_ShowOptions');`;
  await sql`INSERT INTO topics (id, user_id, name) VALUES (1001, 1001, 'Sample topic');`;
  await sql`INSERT INTO questions (id, topic_id, question_text, user_id) VALUES (1001, 1001, 'Sample question', 1001);`;
  await sql`INSERT INTO question_answer_options (id, question_id, option_text, is_correct) VALUES (1001, 1001, 'Option 1', true);`;

  const mockRender = (template, data) => {
    mockRender.lastTemplate = template;
    mockRender.lastData = data;
  };

  const mockResponse = {
    redirect: (url) => (mockResponse.lastRedirect = url),
    lastRedirect: null,
  };

  const mockState = {
    session: {
      get: async (key) => {
        if (key === "authenticated") return true;
        if (key === "user")
          return { id: 1001, username: "test_user_ShowOptions" };
      },
    },
  };

  const mockParams = { tid: "1001", qid: "1001" };

  // Appeler la fonction
  await showOptions({
    render: mockRender,
    response: mockResponse,
    state: mockState,
    params: mockParams,
  });

  // Vérifier que les données ont été passées correctement au moteur de rendu
  assertEquals(mockRender.lastTemplate, "options.eta");
  assertEquals(mockRender.lastData.options[0].option_text, "Option 1");
  assertEquals(mockRender.lastData.question.question_text, "Sample question");

  // Vérifier qu'aucune redirection n'a eu lieu
  assertEquals(mockResponse.lastRedirect, null);
  // Supprimer les données de test
  await sql`DELETE FROM question_answer_options WHERE question_id = 1001;`;
  await sql`DELETE FROM questions WHERE user_id = 1001;`;
  await sql`DELETE FROM topics WHERE user_id = 1001;`;
  await sql`DELETE FROM users WHERE id = 1001;`;

  await sql.end();
});

Deno.test(
  "showOptions - should redirect to login if not authenticated",
  async () => {
    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };

    const mockState = {
      session: {
        get: async (key) => {
          if (key === "authenticated") return false;
        },
      },
    };

    const mockParams = { tid: "1001", qid: "1001" };

    // Appeler la fonction
    await showOptions({
      response: mockResponse,
      state: mockState,
      params: mockParams,
    });

    // Vérifier la redirection
    assertEquals(mockResponse.lastRedirect, "/auth/login");
  }
);

Deno.test(
  "showOptions - should redirect if question does not exist",
  async () => {
    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };

    const mockState = {
      session: {
        get: async (key) => {
          if (key === "authenticated") return true;
          if (key === "user") return { id: 1001, username: "test_user" };
        },
      },
    };

    const mockParams = { tid: "1001", qid: "1001" };

    // Appeler la fonction
    await showOptions({
      response: mockResponse,
      state: mockState,
      params: mockParams,
    });

    // Vérifier la redirection
    assertEquals(mockResponse.lastRedirect, "/topics/1001");
  }
);

Deno.test(
  "showOptions - should redirect if question does not belong to user",
  async () => {
    const config = getConfig("LOCAL", Deno.env.toObject());
    const sql = await initializeSQL(config);
    // Préparer les données de test
    await sql`INSERT INTO users (id, username) VALUES (1002, 'test_user_ShowOptions Not belong to user');`;
    await sql`INSERT INTO users (id, username) VALUES (1003, 'another_user');`;
    await sql`INSERT INTO topics (id, user_id, name) VALUES (1002, 1002, 'Sample topic');`;
    await sql`INSERT INTO questions (id, topic_id, question_text, user_id) VALUES (1002, 1002, 'Sample question', 1002);`;

    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };

    const mockState = {
      session: {
        get: async (key) => {
          if (key === "authenticated") return true;
          if (key === "user") return { id: 1003, username: "another_user" };
        },
      },
    };

    const mockParams = { tid: "1002", qid: "1002" };

    // Appeler la fonction
    await showOptions({
      response: mockResponse,
      state: mockState,
      params: mockParams,
    });

    // Vérifier la redirection
    assertEquals(mockResponse.lastRedirect, "/topics/1002");

    // Supprimer les données de test
    await sql`DELETE FROM questions WHERE user_id = 1002;`;
    await sql`DELETE FROM topics WHERE user_id = 1002;`;
    await sql`DELETE FROM users WHERE id = 1002;`;
    await sql`DELETE FROM users WHERE id = 1003;`;

    await sql.end();
  }
);

Deno.test(
  "showOptions - should redirect if question does not exist",
  async () => {
    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };

    const mockState = {
      session: {
        get: async (key) => {
          if (key === "authenticated") return true;
          if (key === "user") return { id: 1001, username: "test_user" };
        },
      },
    };

    const mockParams = { tid: "1001", qid: "1001" };

    // Appeler la fonction
    await showOptions({
      response: mockResponse,
      state: mockState,
      params: mockParams,
    });

    // Vérifier la redirection
    assertEquals(mockResponse.lastRedirect, "/topics/1001");
  }
);

Deno.test("DeleteOptions - should delete options", async () => {
  const config = getConfig("LOCAL", Deno.env.toObject());
  const sql = await initializeSQL(config);
  // Préparer les données de test
  await sql`INSERT INTO users (id, username) VALUES (1004, 'test_user_DeleteOptions');`;
  await sql`INSERT INTO topics (id, user_id, name) VALUES (1004, 1004, 'Sample topic');`;
  await sql`INSERT INTO questions (id, topic_id, question_text, user_id) VALUES (1004, 1004, 'Sample question', 1004);`;
  await sql`INSERT INTO question_answer_options (id, question_id, option_text, is_correct) VALUES (1004, 1004, 'Option 1', true);`;

  const mockResponse = {
    redirect: (url) => (mockResponse.lastRedirect = url),
    lastRedirect: null,
  };

  const mockParams = { tid: "1004", qid: "1004", oid: "1004" };

  // Appeler la fonction
  await deleteOptions({
    response: mockResponse,
    params: mockParams,
  });

  // Vérifier que les options ont été supprimées
  const options =
    await sql`SELECT * FROM question_answer_options WHERE question_id = 1004;`;
  assertEquals(options.length, 0);

  // Supprimer les données de test
  await sql`DELETE FROM questions WHERE user_id = 1004;`;
  await sql`DELETE FROM topics WHERE user_id = 1004;`;
  await sql`DELETE FROM users WHERE id = 1004;`;

  await sql.end();
});

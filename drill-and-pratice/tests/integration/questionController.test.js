import {
  addQuestion,
  showQuestions,
  deleteQuestion,
} from "../../routes/controllers/questionController.js";
import { getConfig, initializeSQL } from "../../database/database.js";
import { assertEquals } from "jsr:@std/assert";
import {
  mockValidState,
  mockUnvalidState,
  validQId,
  validUser,
  validTId,
  unValidQId,
} from "../utils/mock.js";

const mockRender = (template, data) => {
  mockRender.lastTemplate = template;
  mockRender.lastData = data;
};

Deno.test(
  "addQuestion - redirige vers /auth/login si l'utilisateur n'est pas authentifié",
  async () => {
    const mockRequest = {
      body: async () => ({
        value: {
          get: (key) => {
            if (key === "question_text")
              return "addQuestion - redirige vers /auth/login si l'utilisateur n'est pas authentifié";
          },
        },
      }),
    };
    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };
    const mockState = {
      session: {
        get: async (key) => (key === "authenticated" ? false : null),
      },
    };

    await addQuestion({
      request: mockRequest,
      response: mockResponse,
      state: mockState,
    });

    assertEquals(mockResponse.lastRedirect, "/auth/login");
  }
);

Deno.test("addQuestion - ajoute une question", async () => {
  const mockRequest = {
    body: async () => ({
      value: {
        get: (key) => {
          if (key === "question_text")
            return "addQuestion - ajoute une question";
        },
        has: () => true,
      },
    }),
  };

  const mockResponse = {
    redirect: (url) => (mockResponse.lastRedirect = url),
    lastRedirect: null,
  };

  const mockState = mockValidState;

  const mockParams = { id: validTId };

  await addQuestion({
    request: mockRequest,
    response: mockResponse,
    state: mockState,
    params: mockParams,
  });

  assertEquals(mockResponse.lastRedirect, `/topics/${validTId}`);

  // Vérifier que la question a été ajoutée

  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);

  try {
    const question =
      await sql`SELECT * FROM questions WHERE question_text = 'addQuestion - ajoute une question'`;
    console.log("question", question);
    assertEquals(question.length, 1);
    await sql`DELETE FROM questions WHERE question_text = 'addQuestion - ajoute une question'`;
  } finally {
    await sql.end();
  }
});

Deno.test(
  "ShowQuestions - redirige vers /auth/login si l'utilisateur n'est pas authentifié",
  async () => {
    const mockRender = () => {};
    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };
    const mockParams = { tid: validTId, qid: validQId };
    const mockState = mockUnvalidState;

    await showQuestions({
      render: mockRender,
      response: mockResponse,
      params: mockParams,
      state: mockState,
    });

    assertEquals(mockResponse.lastRedirect, "/auth/login");
  }
);

Deno.test(
  "ShowQuestions - redirige vers /topics/:tid si la question n'existe pas",
  async () => {
    const mockRender = () => {};
    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };
    const mockParams = { tid: validTId, qid: unValidQId };
    const mockState = mockValidState;

    await showQuestions({
      render: mockRender,
      response: mockResponse,
      params: mockParams,
      state: mockState,
    });

    assertEquals(mockResponse.lastRedirect, `/topics/${validTId}`);
  }
);

Deno.test("ShowQuestions - affiche la question", async () => {
  const mockResponse = {
    redirect: (url) => (mockResponse.lastRedirect = url),
    lastRedirect: null,
  };
  const mockParams = { tid: validTId, qid: validQId };
  const mockState = mockValidState;

  await showQuestions({
    render: mockRender,
    response: mockResponse,
    params: mockParams,
    state: mockState,
  });

  assertEquals(mockRender.lastTemplate, "options.eta");
});

Deno.test("deleteQuestion - supprime une question", async () => {
  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);

  try {
    //Ajout de la question a supprimer
    await sql`
      INSERT INTO questions (question_text, user_id, topic_id)
      VALUES ('text question to delete', ${validUser}, ${validTId})
    `;

    const questionID =
      await sql`SELECT id FROM questions WHERE question_text = 'text question to delete'`;
    console.log("ID", questionID[0].id);
    const mockResponse = {
      redirect: (url) => (mockResponse.lastRedirect = url),
      lastRedirect: null,
    };
    const mockParams = { tid: validTId, qid: questionID[0].id };

    await deleteQuestion({
      response: mockResponse,
      params: mockParams,
    });

    const question =
      await sql`SELECT * FROM questions WHERE id = ${questionID[0].id}`;
    assertEquals(question.length, 0);
  } finally {
    await sql.end();
  }
});

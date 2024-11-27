import {
  showQuiz,
  findQuiz,
  showQuestion,
  checkAnswer,
  showIncorrect,
  showCorrect,
} from "../../routes/controllers/quizController.js";
import { getConfig, initializeSQL } from "../../database/database.js";
import { assertEquals } from "jsr:@std/assert";
import {
  mockValidState,
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
  "showQuiz should redirect to login if user is not authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    await showQuiz({ response, state: mockUnvalidState, render: mockRender });
  }
);

Deno.test(
  "showQuiz should render quiz.eta if user is authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    await showQuiz({ response, state: mockValidState, render: mockRender });
    assertEquals(mockRender.lastTemplate, "quiz.eta");
  }
);

Deno.test(
  "findQuiz should redirect to login if user is not authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    await findQuiz({
      response,
      state: mockUnvalidState,
      render: mockRender,
      params: { tid: validTId },
    });
  }
);

Deno.test(
  "findQuiz should redirect to /quiz/:tid/ if options lenght  < 2",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, `/quiz/802`);
      },
    };
    await findQuiz({
      response,
      state: mockValidState,
      render: mockRender,
      params: { tid: 802 },
    });
  }
);

Deno.test("findQuiz should redirect to /quiz if no questions", async () => {
  const response = {
    redirect: (path) => {
      assertEquals(path, `/quiz`);
    },
  };
  await findQuiz({
    response,
    state: mockValidState,
    render: mockRender,
    params: { tid: tidWithNoquestions },
  });
});

Deno.test("findQuiz should redirect to /quiz/:tid/questions/:qid", async () => {
  const response = {
    redirect: (path) => {
      assertEquals(path, `/quiz/800/questions/801`);
    },
  };
  await findQuiz({
    response,
    state: mockValidState,
    render: mockRender,
    params: { tid: 800 },
  });
});

Deno.test(
  "showQuestion should redirect to login if user is not authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    await showQuestion({
      response,
      state: mockUnvalidState,
      render: mockRender,
      params: { tid: validTId, qid: validQId },
    });
  }
);

Deno.test(
  "showQuestion should render question.eta if user is authenticated",
  async () => {
    await showQuestion({
      response: {},
      state: mockValidState,
      render: mockRender,
      params: { tid: validTId, qid: validQId },
    });
    assertEquals(mockRender.lastTemplate, "question.eta");
  }
);

Deno.test(
  "checkAnswer should redirect to login if user is not authenticated",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, "/auth/login");
      },
    };
    await checkAnswer({
      response,
      state: mockUnvalidState,
      params: { tid: validTId, qid: validQId },
    });
  }
);

Deno.test(
  "checkAnswer should redirect to /quiz/:tid/questions/:qid/correct if answer is correct",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, `/quiz/${validTId}/questions/${validQId}/correct`);
      },
    };
    await checkAnswer({
      response,
      state: mockValidState,
      params: { tid: validTId, qid: validQId, oid: 800 },
    });
  }
);

Deno.test(
  "checkAnswer should redirect to /quiz/:tid/questions/:qid/incorrect if answer is incorrect",
  async () => {
    const response = {
      redirect: (path) => {
        assertEquals(path, `/quiz/${validTId}/questions/${validQId}/incorrect`);
      },
    };
    await checkAnswer({
      response,
      state: mockValidState,
      params: { tid: validTId, qid: validQId, oid: 801 },
    });
  }
);

Deno.test("showCorrect should render result.eta", async () => {
  await showCorrect({ render: mockRender, state: mockValidState });
  assertEquals(mockRender.lastTemplate, "result.eta");
});

Deno.test("showIncorrect should render result.eta", async () => {
  await showIncorrect({ render: mockRender, state: mockValidState });
  assertEquals(mockRender.lastTemplate, "result.eta");
});

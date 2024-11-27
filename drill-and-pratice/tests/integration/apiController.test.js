import {
  addQuestion,
  answerQuestion,
  getRandomQuestion,
} from "../../routes/apis/apiController.js";
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

Deno.test(
  "getRandomQuestion should return a question with options",
  async () => {
    const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
    const sql = await initializeSQL(config);
    try {
      const response = {
        body: {},
      };
      await getRandomQuestion({ response });
      const qId =
        await sql`SELECT id FROM questions WHERE id = ${response.body.questionId}`;
      assertEquals(qId.length, 1);
    } finally {
      await sql.end();
    }
  }
);

// Deno.test("addQuestion should add a question to the database", async () => {
//   const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
//   const sql = await initializeSQL(config);
//   try {
//     const mockRequest = {
//       headers: {
//         get: (key) => {
//           if (key === "userId") {
//             return "6";
//           }
//         },
//       },
//       body: () => ({
//         value: Promise.resolve({
//           topic: "sample topic",
//           question: "What is the capital of France?",
//           answer: [
//             { answerText: "Paris", solution: true },
//             { answerText: "London", solution: false },
//           ],
//         }),
//       }),
//     };

//     const mockResponse = {
//       body: {},
//     };

//     await addQuestion({
//       request: mockRequest,
//       response: mockResponse,
//       state: mockValidState,
//     });

//     const question =
//       await sql`SELECT * FROM questions WHERE question_text = 'What is the capital of France?'`;
//     assertEquals(question.length, 1);
//   } finally {
//     await sql`DELETE FROM questions WHERE question_text = 'What is the capital of France?'`;
//     await sql.end();
//   }
// });

Deno.test(
  "answerQuestion should return true if the answer is correct",
  async () => {
    const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
    const sql = await initializeSQL(config);
    try {
      const response = {
        body: {},
      };
      const request = {
        body: () => ({
          value: Promise.resolve({
            questionId: validQId,
            optionId: 800,
          }),
        }),
      };
      await answerQuestion(request, response);
      assertEquals(response.body, { correct: true });
    } finally {
      await sql.end();
    }
  }
);

// Deno.test(
//   "answerQuestion should return false if the answer is correct",
//   async () => {
//     const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
//     const sql = await initializeSQL(config);
//     try {
//       const response = {
//         body: null,
//       };

//       const request = {
//         body: ({ type }) => {
//           if (type !== "json") {
//             throw new Error("Unsupported body type");
//           }
//           return {
//             value: Promise.resolve({
//               questionId: validQId,
//               optionId: 801,
//             }),
//           };
//         },
//       };

//       await answerQuestion(request, response);
//       assertEquals(response.body, { correct: true });
//     } finally {
//       await sql.end();
//     }
//   }
// );

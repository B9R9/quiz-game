import { assertEquals } from "jsr:@std/assert";
import * as mainService from "../../../services/mainService.js";

// Mock SQL client
const sql = (strings, ...values) => {
  const query = strings.join("?"); // Remplace les variables par des ?

  if (query === "SELECT COUNT(*) FROM topics") {
    return [{ count: 42 }];
  } else if (query === "SELECT COUNT(*) FROM questions") {
    return [{ count: 123 }];
  } else if (query === "SELECT COUNT(*) FROM question_answers") {
    return [{ count: 456 }];
  } else {
    throw new Error("Invalid query");
  }
};

Deno.test("getTotalTopics test", async () => {
  const result = await mainService.getTotalTopics(sql);
  assertEquals(result, 42);
});

Deno.test("getTotalQuestions test", async () => {
  const result = await mainService.getTotalQuestions(sql);
  assertEquals(result, 123);
});

Deno.test("getTotalAnswers test", async () => {
  const result = await mainService.getTotalAnswers(sql);
  assertEquals(result, 456);
});

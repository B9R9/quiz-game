import { assertEquals, assertThrows } from "jsr:@std/assert";
import * as questionService from "../../../services/questionService.js";

// Mock SQL client
const sql = async (strings, ...values) => {
  const query = strings.join("?"); // Remplace les variables par des ?

  if (
    query ===
    "INSERT INTO questions (question_text, topic_id, user_id) VALUES (?, ?, ?)"
  ) {
    return true;
  } else if (
    query === "DELETE FROM question_answer_options WHERE question_id = ?"
  ) {
    return true;
  } else if (query === "DELETE FROM questions WHERE id = ?") {
    return true;
  } else if (
    query === "SELECT * FROM questions WHERE topic_id = ? AND id = ?"
  ) {
    const [topicId, questionId] = values;
    if (topicId === 1 && questionId === 1) {
      return [
        { id: 1, question_text: "Sample Question", topic_id: 1, user_id: 1 },
      ];
    } else {
      return [];
    }
  } else if (
    query === "SELECT * FROM questions WHERE topic_id = ? AND question_text = ?"
  ) {
    const [topicId, question_text] = values;
    if (topicId === 1 && question_text === "Sample Question") {
      return [
        { id: 1, question_text: "Sample Question", topic_id: 1, user_id: 1 },
      ];
    } else {
      return [];
    }
  } else if (query === "SELECT * FROM questions WHERE topic_id = ?") {
    const [topicId] = values;
    if (topicId === 1) {
      return [
        { id: 1, question_text: "Sample Question 1", topic_id: 1, user_id: 1 },
        { id: 2, question_text: "Sample Question 2", topic_id: 1, user_id: 2 },
      ];
    } else {
      return [];
    }
  } else if (
    query === "SELECT * FROM questions WHERE topic_id = ? AND user_id = ?"
  ) {
    const [topicId, userId] = values;
    if (topicId === 1 && userId === 1) {
      return [
        { id: 1, question_text: "Sample Question", topic_id: 1, user_id: 1 },
      ];
    } else {
      return [];
    }
  } else if (query === "SELECT * FROM questions ORDER BY RANDOM() LIMIT 1") {
    return [
      { id: 1, question_text: "Random Question", topic_id: 1, user_id: 1 },
    ];
  }

  throw new Error("Invalid query");
};

Deno.test({
  name: "addQuestion should insert a question correctly",
  async fn() {
    // Arrange
    const question = "Sample Question";
    const topicId = 1;
    const userId = 1;

    // Act
    await questionService.addQuestion(sql, question, topicId, userId);

    // Assert
    // No assertion needed as we are just checking if the function runs without errors
  },
});

Deno.test({
  name: "deleteQuestion should delete a question and its options by id",
  async fn() {
    // Arrange
    const questionId = 1;

    // Act
    await questionService.deleteQuestion(sql, questionId);

    // Assert
    // No assertion needed as we are just checking if the function runs without errors
  },
});

Deno.test({
  name: "getQuestion should return a question by topicId and questionId",
  async fn() {
    // Arrange
    const topicId = 1;
    const questionId = 1;

    // Act
    const result = await questionService.getQuestion(sql, topicId, questionId);

    // Assert
    assertEquals(result.length, 1);
    assertEquals(result[0].question_text, "Sample Question");
  },
});

Deno.test({
  name: "getQuestionByQuestion_text should return a question by topicId and question_text",
  async fn() {
    // Arrange
    const topicId = 1;
    const question_text = "Sample Question";

    // Act
    const result = await questionService.getQuestionByQuestion_text(
      sql,
      topicId,
      question_text
    );

    // Assert
    assertEquals(result.length, 1);
    assertEquals(result[0].question_text, question_text);
  },
});

Deno.test({
  name: "getAllQuestions should return all questions for a given topicId",
  async fn() {
    // Arrange
    const topicId = 1;

    // Act
    const result = await questionService.getAllQuestions(sql, topicId);

    // Assert
    assertEquals(result.length, 2);
    assertEquals(result[0].question_text, "Sample Question 1");
    assertEquals(result[1].question_text, "Sample Question 2");
  },
});

Deno.test({
  name: "getYourQuestions should return all questions for a given topicId and userId",
  async fn() {
    // Arrange
    const topicId = 1;
    const userId = 1;

    // Act
    const result = await questionService.getYourQuestions(sql, topicId, userId);

    // Assert
    assertEquals(result.length, 1);
    assertEquals(result[0].question_text, "Sample Question");
  },
});

Deno.test({
  name: "getRandomQuestion should return a random question",
  async fn() {
    // Act
    const result = await questionService.getRandomQuestion(sql);

    // Assert
    assertEquals(result.length, 1);
    assertEquals(result[0].question_text, "Random Question");
  },
});

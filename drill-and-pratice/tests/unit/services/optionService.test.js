import { assertEquals } from "jsr:@std/assert";
import * as optionsService from "../../../services/optionsService.js";

// Mock SQL client
const sql = (strings, ...values) => {
  const query = strings.join("?"); // Remplace les variables par des ?

  if (
    query ===
    "INSERT INTO question_answer_options (option_text, question_id, is_correct) VALUES (?, ?, ?)"
  ) {
    return true;
  } else if (
    query === "SELECT * FROM question_answer_options WHERE question_id = ?"
  ) {
    const [questionId] = values;
    if (questionId === 1) {
      return [
        { id: 1, option_text: "Option 1", question_id: 1, is_correct: true },
        { id: 2, option_text: "Option 2", question_id: 1, is_correct: false },
      ];
    } else {
      return [];
    }
  } else if (query === "DELETE FROM question_answer_options WHERE id = ?") {
    return true;
  } else if (query === "SELECT * FROM question_answer_options WHERE id = ?") {
    const [optionId] = values;
    if (optionId === 1) {
      return [
        { id: 1, option_text: "Option 1", question_id: 1, is_correct: true },
      ];
    } else {
      return [];
    }
  } else if (
    query ===
    "SELECT is_correct FROM question_answer_options WHERE id = ? AND question_id = ?"
  ) {
    const [optionId, questionId] = values;
    if (optionId === 1 && questionId === 1) {
      return [{ is_correct: true }];
    } else {
      return [{ is_correct: false }];
    }
  } else if (
    query ===
    "SELECT * FROM question_answer_options WHERE question_id = ? AND is_correct = true"
  ) {
    const [questionId] = values;
    if (questionId === 1) {
      return [
        { id: 1, option_text: "Option 1", question_id: 1, is_correct: true },
      ];
    } else {
      return [];
    }
  }

  throw new Error("Invalid query");
};

Deno.test({
  name: "addOptions should insert options correctly",
  async fn() {
    // Arrange
    const options = ["Option 1", "Option 2"];
    const isCorrects = [true, false];
    const questionId = 1;

    // Act
    await optionsService.addOptions(sql, options, isCorrects, questionId);

    // Assert
    // No assertion needed as we are just checking if the function runs without errors
  },
});

Deno.test({
  name: "getOptions should return options for a given questionId",
  async fn() {
    // Arrange
    const questionId = 1;

    // Act
    const result = await optionsService.getOptions(sql, questionId);

    // Assert
    assertEquals(result.length, 2);
    assertEquals(result[0].option_text, "Option 1");
    assertEquals(result[1].option_text, "Option 2");
  },
});

Deno.test({
  name: "deleteOptions should delete an option by id",
  async fn() {
    // Arrange
    const optionId = 1;

    // Act
    await optionsService.deleteOptions(sql, optionId);

    // Assert
    // No assertion needed as we are just checking if the function runs without errors
  },
});

Deno.test({
  name: "checkOption should return option data for a given optionId",
  async fn() {
    // Arrange
    const optionId = 1;

    // Act
    const result = await optionsService.checkOption(sql, optionId);

    // Assert
    assertEquals(result.length, 1);
    assertEquals(result[0].option_text, "Option 1");
  },
});

Deno.test({
  name: "checkAnswer should return true if the option is correct for the given questionId",
  async fn() {
    // Arrange
    const optionId = 1;
    const questionId = 1;

    // Act
    const result = await optionsService.checkAnswer(sql, optionId, questionId);

    // Assert
    assertEquals(result, true);
  },
});

Deno.test({
  name: "getCorrectOption should return the correct option for a given questionId",
  async fn() {
    // Arrange
    const questionId = 1;

    // Act
    const result = await optionsService.getCorrectOption(sql, questionId);

    // Assert
    assertEquals(result.length, 1);
    assertEquals(result[0].option_text, "Option 1");
  },
});

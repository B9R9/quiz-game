import { sql } from "../database/database.js";

export const addOptions = async (options, isCorrects, questionId) => {
  for (let i = 0; i < options.length; i++) {
    await insertOption(options[i], questionId, isCorrects[i]);
  }
};

export const insertOption = async (option, questionId, isCorrect) => {
  try {
    await sql`INSERT INTO question_answer_options (option_text, question_id, is_correct) VALUES (${option}, ${questionId}, ${isCorrect})`;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getOptions = async (questionId) => {
  try {
    const result =
      await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const deleteOptions = async (optionId) => {
  try {
    await sql`DELETE FROM question_answer_options WHERE id = ${optionId}`;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const checkOption = async (optionId) => {
  try {
    const result =
      await sql`SELECT * FROM question_answer_options WHERE id = ${optionId}`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const checkAnswer = async (optionId, questionId) => {
  try {
    const result =
      await sql`SELECT is_correct FROM question_answer_options WHERE id = ${optionId} AND question_id = ${questionId}`;
    return result[0].is_correct;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getCorrectOption = async (questionId) => {
  try {
    const result =
      await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId} AND is_correct = true`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

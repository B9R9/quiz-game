import { sql } from "../database/database.js";

export const addQuestion = async (question, topicId, userId) => {
  try {
    await sql`INSERT INTO questions (question_text, topic_id, user_id)
    VALUES (${question}, ${topicId}, ${userId})`;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    await sql`DELETE FROM question_answer_options WHERE question_id = ${questionId}`;
    await sql`DELETE FROM questions WHERE id = ${questionId}`;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getQuestion = async (topicId, questionId) => {
  try {
    const result =
      await sql`SELECT * FROM questions WHERE topic_id = ${topicId} AND id = ${questionId}`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getQuestionByQuestion_text = async (topicId, question_text) => {
  try {
    const result =
      await sql`SELECT * FROM questions WHERE topic_id = ${topicId} AND question_text = ${question_text}`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getAllQuestions = async (topicId) => {
  try {
    const result =
      await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getYourQuestions = async (topicId, userId) => {
  try {
    const result =
      await sql`SELECT * FROM questions WHERE topic_id = ${topicId} AND user_id = ${userId}`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getRandomQuestion = async () => {
  try {
    const result = await sql`SELECT * FROM questions ORDER BY RANDOM() LIMIT 1`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

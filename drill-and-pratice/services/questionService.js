import { connection } from "../database/database.js";

export const addQuestion = async (question, topicId, userId) => {
  try {
    await connection`INSERT INTO questions (question_text, topic_id, user_id)
  VALUES (${question}, ${topicId}, ${userId})`;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    await connection`DELETE FROM question_answer_options WHERE question_id = ${questionId}`;

    await connection`DELETE FROM questions WHERE id = ${questionId}`;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getQuestion = async (topicId, questionId) => {
  try {
    const res =
      await connection`SELECT * FROM questions WHERE topic_id = ${topicId} AND id = ${questionId}`;
    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getQuestionByQuestion_text = async (topicId, question_text) => {
  try {
    const res =
      await connection`SELECT * FROM questions WHERE topic_id = ${topicId} AND question_text = ${question_text}`;
    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getAllQuestions = async (topicId) => {
  try {
    const res =
      await connection`SELECT * FROM questions WHERE topic_id = ${topicId}`;
    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getYourQuestions = async (topicId, userId) => {
  try {
    const res =
      await connection`SELECT * FROM questions WHERE topic_id = ${topicId} AND user_id = ${userId}`;
    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getRandomQuestion = async () => {
  try {
    const res =
      await connection`SELECT * FROM questions ORDER BY RANDOM() LIMIT 1`;
    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};

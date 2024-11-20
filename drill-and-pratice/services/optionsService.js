export const addOptions = async (sql, options, isCorrects, questionId) => {
  for (let i = 0; i < options.length; i++) {
    await insertOption(sql, options[i], questionId, isCorrects[i]);
  }
};

export const insertOption = async (sql, option, questionId, isCorrect) => {
  try {
    await sql`INSERT INTO question_answer_options (option_text, question_id, is_correct) VALUES (${option}, ${questionId}, ${isCorrect})`;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getOptions = async (sql, questionId) => {
  try {
    const result =
      await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const deleteOptions = async (sql, optionId) => {
  try {
    await sql`DELETE FROM question_answer_options WHERE id = ${optionId}`;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const checkOption = async (sql, optionId) => {
  try {
    const result =
      await sql`SELECT * FROM question_answer_options WHERE id = ${optionId}`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const checkAnswer = async (sql, optionId, questionId) => {
  try {
    const result =
      await sql`SELECT is_correct FROM question_answer_options WHERE id = ${optionId} AND question_id = ${questionId}`;
    return result[0].is_correct;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getCorrectOption = async (sql, questionId) => {
  try {
    const result =
      await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId} AND is_correct = true`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

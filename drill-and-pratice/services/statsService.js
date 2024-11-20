export const addStat = async (sql, userId, qId, answerId) => {
  try {
    await sql`INSERT INTO question_answers (user_id, question_id, question_answer_option_id)
        VALUES (${userId}, ${qId}, ${answerId})`;
  } catch (e) {
    console.log("Error: ", e);
  }
};

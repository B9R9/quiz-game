export const getTotalTopics = async (sql) => {
  try {
    const result = await sql`SELECT COUNT(*) FROM topics`;
    return result[0].count;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getTotalQuestions = async (sql) => {
  try {
    const result = await sql`SELECT COUNT(*) FROM questions`;
    return result[0].count;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getTotalAnswers = async (sql) => {
  try {
    const result = await sql`SELECT COUNT(*) FROM question_answers`;
    return result[0].count;
  } catch (e) {
    console.log("Error: ", e);
  }
};

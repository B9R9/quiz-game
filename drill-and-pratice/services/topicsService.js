export const createTopic = async (sql, topicName, userID) => {
  try {
    const ret =
      await sql`INSERT INTO topics (name, user_id) VALUES (${topicName}, ${userID})`;
    return ret;
  } catch (e) {
    throw new Error("Error in createTopic: " + e.message);
  }
};

export const getTopics = async (sql) => {
  try {
    const result = await sql`SELECT * FROM topics`;
    return result;
  } catch (e) {
    throw new Error("Error in getTopics: " + e.message);
  }
};

export const getTopic = async (sql, id) => {
  try {
    const result = await sql`SELECT * FROM topics WHERE id = ${id}`;
    return result;
  } catch (e) {
    console.log("Error in getTopic: " + e.message);
    throw new Error("Error in getTopic: " + e.message);
  }
};

export const getTopicByName = async (sql, name) => {
  try {
    const result = await sql`SELECT * FROM topics WHERE name = ${name}`;
    return result;
  } catch (e) {
    throw new Error("Error in getTopicByName: " + e.message);
  }
};

export const deleteTopic = async (sql, id) => {
  try {
    await sql`DELETE FROM topics WHERE id = ${id}`;
  } catch (e) {
    throw new Error("Error in deleteTopic: " + e.message);
  }
};

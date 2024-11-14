import { sql } from "../database/database.js";

export const createTopic = async (topicName, userID) => {
  try {
    console.log("Creating topic: ", topicName, userID);
    const ret =
      await sql`INSERT INTO topics (name, user_id) VALUES (${topicName}, ${userID})`;
    console.log("Topic created: ", ret);
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getTopics = async () => {
  try {
    const result = await sql`SELECT * FROM topics`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getTopic = async (id) => {
  try {
    const result = await sql`SELECT * FROM topics WHERE id = ${id}`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};
export const getTopicByName = async (name) => {
  try {
    const result = await sql`SELECT * FROM topics WHERE name = ${name}`;
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const deleteTopic = async (id) => {
  try {
    await sql`DELETE FROM topics WHERE id = ${id}`;
  } catch (e) {
    console.log("Error: ", e);
  }
};

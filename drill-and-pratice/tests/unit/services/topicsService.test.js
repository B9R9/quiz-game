import { assertEquals, assertThrows } from "jsr:@std/assert";
import * as topicsService from "../../../services/topicsService.js";

const sql = async (strings, ...values) => {
  const query = strings.join("?"); // Remplace les variables par des ?

  if (query === "INSERT INTO topics (name, user_id) VALUES (?, ?)") {
    return { id: 1, name: values[0], user_id: values[1] };
  } else if (query === "SELECT * FROM topics") {
    return [
      { id: 1, name: "Topic 1", user_id: 1 },
      { id: 2, name: "Topic 2", user_id: 2 },
    ];
  } else if (query === "SELECT * FROM topics WHERE id = ?") {
    const [id] = values;
    if (id === 1) {
      return [{ id: 1, name: "Topic 1", user_id: 1 }];
    } else {
      return [];
    }
  } else if (query === "SELECT * FROM topics WHERE name = ?") {
    const [name] = values;
    if (name === "Topic 1") {
      return [{ id: 1, name: "Topic 1", user_id: 1 }];
    } else {
      return [];
    }
  } else if (query === "DELETE FROM topics WHERE id = ?") {
    return true;
  }

  throw new Error("Invalid query");
};

Deno.test({
  name: "createTopic should insert a new topic and return the topic",
  async fn() {
    // Arrange
    const topicName = "New Topic";
    const userID = 1;

    // Act
    const result = await topicsService.createTopic(sql, topicName, userID);

    // Assert
    assertEquals(result.name, topicName);
    assertEquals(result.user_id, userID);
  },
});

Deno.test({
  name: "getTopics should return all topics",
  async fn() {
    // Act
    const result = await topicsService.getTopics(sql);

    // Assert
    assertEquals(result.length, 2);
    assertEquals(result[0].name, "Topic 1");
    assertEquals(result[1].name, "Topic 2");
  },
});

Deno.test({
  name: "getTopic should return a topic by id",
  async fn() {
    // Arrange
    const id = 1;

    // Act
    const result = await topicsService.getTopic(sql, id);

    // Assert
    assertEquals(result.length, 1);
    assertEquals(result[0].id, id);
    assertEquals(result[0].name, "Topic 1");
  },
});

Deno.test({
  name: "getTopicByName should return a topic by name",
  async fn() {
    // Arrange
    const name = "Topic 1";

    // Act
    const result = await topicsService.getTopicByName(sql, name);

    // Assert
    assertEquals(result.length, 1);
    assertEquals(result[0].name, name);
  },
});

Deno.test({
  name: "deleteTopic should delete a topic by id",
  async fn() {
    // Arrange
    const id = 1;

    // Act
    await topicsService.deleteTopic(sql, id);

    // Assert
    // No assertion needed as we are just checking if the function runs without errors
  },
});

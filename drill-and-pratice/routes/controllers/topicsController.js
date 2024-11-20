import * as topicsService from "../../services/topicsService.js";
import * as questionService from "../../services/questionService.js";
import * as optionsService from "../../services/optionsService.js";
import { getCookies } from "../../utils/cookiesHandler.js";
import { log } from "../../utils/logger.js";
import { sql } from "../../database/database.js";

let data = {
  topic: [],
  topics: [],
  questions: [],
  errors: [],
  value: "Enter a New Topic",
};

// const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
// const sql = await initializeSQL(config);

export const showTopics = async ({ render, state, response }) => {
  data = await getCookies(state);
  if (!data.authenticated) {
    log("User not authenticated", "warning", "topicsController.js-showTopics");
    response.redirect("/auth/login");
    return;
  }
  log("User authenticated", "success", "topicsController.js-showTopics");
  const topics = await topicsService.getTopics(sql);

  data.topics = topics;
  data.value = "";
  render("topics.eta", data);
};

export const showTopic = async ({ params, render, state, response }) => {
  const user = await getCookies(state);
  if (!user.authenticated) {
    response.redirect("/auth/login");
    return;
  }

  const topicId = Number(params.id);
  const topic = await topicsService.getTopic(sql, topicId);
  let questions = [];
  if (user.user.admin) {
    questions = await questionService.getAllQuestions(sql, topicId);
  } else {
    questions = await questionService.getYourQuestions(
      sql,
      topicId,
      user.user.id
    );
  }

  if (!topic || topic.length === 0) {
    console.log("ShowTopic: Topic not found");
    render("404.eta", data);
    return;
  }

  data.topic = topic[0];
  data.questions = questions;
  data.value = "";

  render("topic.eta", data);
};

export const addTopic = async ({ request, response, render, state }) => {
  const body = request.body();
  const params = await body.value;
  const topicName = params.get("name").trim();

  log(`Adding topic: ${topicName}`, "info", "topicsController.js-addTopic");
  const user = await getCookies(state);

  const isTopics = await topicsService.getTopicByName(sql, topicName);

  if (topicName.lenght < 1 || !topicName || topicName === "" || isTopics[0]) {
    if (isTopics[0]) {
      data.errors = ["Topic name already exists."];
    }
    if (topicName === "" || !topicName || topicName.lenght < 1) {
      data.errors = ["Topic name must be at least 1 character long."];
    }
    data.value = topicName;
    render("topics.eta", data);
  } else {
    await topicsService.createTopic(sql, topicName, user.user.id);

    response.redirect("/topics");
  }
  data.errors = [];
};

export const deleteTopic = async ({ params, response, state }) => {
  const user = await getCookies(state);
  log("Deleting topic", "info", "topicsController.js-deleteTopic");
  console.log(user);
  if (!user.authenticated) {
    response.redirect("/auth/login");
    return;
  }

  if (!user.user.admin) {
    response.redirect("/topics");
    return;
  }

  const topicId = Number(params.id);
  const questionsid = await questionService.getAllQuestions(sql, topicId);
  let optionsid = [];
  if (questionsid[0]) {
    optionsid = await optionsService.getOptions(sql, questionsid[0].id);
  }

  if (optionsid[0]) {
    for (let i = 0; i < optionsid.length; i++) {
      await optionsService.deleteOptions(sql, optionsid[i].id);
    }
  }

  if (questionsid[0]) {
    for (let i = 0; i < questionsid.length; i++) {
      await questionService.deleteQuestion(sql, questionsid[i].id);
    }
  }

  await topicsService.deleteTopic(sql, topicId);
  log(
    `Deleting topic: ${params.id}`,
    "info",
    "topicsController.js-deleteTopic"
  );
  response.redirect("/topics");
};

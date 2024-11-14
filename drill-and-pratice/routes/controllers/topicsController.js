import * as topicsService from "../../services/topicsService.js";
import * as questionService from "../../services/questionService.js";
import * as optionsService from "../../services/optionsService.js";
import { getCookies } from "../../utils/cookiesHandler.js";
import { log } from "../../utils/logger.js";

let data = {
  topic: [],
  topics: [],
  questions: [],
  errors: [],
  value: "Enter a New Topic",
};

export const showTopics = async ({ render, state, response }) => {
  data = await getCookies(state);
  if (!data.authenticated) {
    log("User not authenticated", "warning", "topicsController.js-showTopics");
    response.redirect("/auth/login");
    return;
  }
  log("User authenticated", "success", "topicsController.js-showTopics");
  const topics = await topicsService.getTopics();

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

  const topicId = params.id;
  const topic = await topicsService.getTopic(topicId);
  let questions = [];
  if (user.user.authorisation === "admin") {
    questions = await questionService.getAllQuestions(topicId);
  } else {
    questions = await questionService.getYourQuestions(topicId, user.user.id);
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

  if (topicName.lenght < 1 || !topicName || topicName === "") {
    data.errors = ["Topic name must be at least 1 character long."];
    data.value = topicName;
    render("topics.eta", data);
  } else {
    await topicsService.createTopic(topicName, user.user.id);

    response.redirect("/topics");
  }
  data.errors = [];
};

export const deleteTopic = async ({ params, response, state }) => {
  const user = await getCookies(state);

  if (!user.authenticated) {
    response.redirect("/auth/login");
    return;
  }

  if (user.user.authorisation !== "admin") {
    response.redirect("/topics");
    return;
  }

  const topicId = Number(params.id);
  const questionsid = await questionService.getAllQuestions(topicId);
  let optionsid = [];
  if (questionsid[0]) {
    optionsid = await optionsService.getOptions(questionsid[0].id);
  }

  if (optionsid[0]) {
    for (let i = 0; i < optionsid.length; i++) {
      await optionsService.deleteOptions(optionsid[i].id);
    }
  }

  if (questionsid[0]) {
    for (let i = 0; i < questionsid.length; i++) {
      await questionService.deleteQuestion(questionsid[i].id);
    }
  }

  await topicsService.deleteTopic(topicId);
  log(
    `Deleting topic: ${params.id}`,
    "info",
    "topicsController.js-deleteTopic"
  );
  response.redirect("/topics");
};
